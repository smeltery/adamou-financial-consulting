import { test, expect } from "bun:test";
import { PGlite } from "@electric-sql/pglite";
const owner = "00000000-0000-4000-8000-000000000001";
const stranger = "00000000-0000-4000-8000-000000000002";
const client = "00000000-0000-4000-8000-000000000003";
const object = `${client}/00000000-0000-4000-8000-000000000004_signed-contract.pdf`;
test("only the owner can store and retrieve client documents; cleanup precedes client deletion", async () => {
  const db = new PGlite();
  try {
    await db.exec(`create role anon; create role authenticated; create role service_role bypassrls;
      create schema auth; create table auth.users(id uuid primary key);
      create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
      grant usage on schema public, auth to anon, authenticated, service_role;
      grant execute on function auth.uid() to authenticated;
      insert into auth.users values ('${owner}'), ('${stranger}');
      create schema storage;
      create table storage.buckets(id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
      create table storage.objects(id uuid primary key default gen_random_uuid(), bucket_id text, name text, unique(bucket_id,name));
      alter table storage.objects enable row level security;
      grant usage on schema storage to anon, authenticated;
      grant select, insert, update, delete on storage.objects to anon, authenticated;`);
    await db.exec(
      await Bun.file("../../supabase/migrations/001_workspace.sql").text(),
    );
    await db.exec(
      await Bun.file("../../supabase/migrations/002_documents.sql").text(),
    );
    await db.exec(
      `insert into workspace_owner(user_id) values('${owner}'); insert into clients(id,name,email) values('${client}','Test','test@example.com');`,
    );
    expect(
      (
        await db.query<{ public: boolean }>(
          "select public from storage.buckets",
        )
      ).rows[0].public,
    ).toBe(false);
    await db.exec(
      `set role authenticated; set request.jwt.claim.sub='${owner}';`,
    );
    await db.query(
      "insert into storage.objects(bucket_id,name) values($1,$2)",
      ["client-documents", object],
    );
    expect((await db.query("select * from storage.objects")).rows).toHaveLength(
      1,
    );
    await expect(
      db.query("insert into storage.objects(bucket_id,name) values($1,$2)", [
        "client-documents",
        `${stranger}/00000000-0000-4000-8000-000000000004_other.pdf`,
      ]),
    ).rejects.toThrow();
    await expect(
      db.query("insert into storage.objects(bucket_id,name) values($1,$2)", [
        "other-bucket",
        object,
      ]),
    ).rejects.toThrow();
    expect(
      (await db.query(`update storage.objects set name='changed' returning id`))
        .rows,
    ).toHaveLength(0);
    await expect(
      db.query(`delete from clients where id='${client}'`),
    ).rejects.toThrow("Remove client documents");
    await db.exec(`set request.jwt.claim.sub='${stranger}';`);
    expect((await db.query("select * from storage.objects")).rows).toHaveLength(
      0,
    );
    expect(
      (await db.query("delete from storage.objects returning id")).rows,
    ).toHaveLength(0);
    await expect(
      db.query("insert into storage.objects(bucket_id,name) values($1,$2)", [
        "client-documents",
        object,
      ]),
    ).rejects.toThrow();
    await db.exec("reset role; set role anon;");
    expect((await db.query("select * from storage.objects")).rows).toHaveLength(
      0,
    );
    await expect(
      db.query("insert into storage.objects(bucket_id,name) values($1,$2)", [
        "client-documents",
        object,
      ]),
    ).rejects.toThrow();
    await db.exec(
      `reset role; set role authenticated; set request.jwt.claim.sub='${owner}';`,
    );
    expect(
      (await db.query("delete from storage.objects returning id")).rows,
    ).toHaveLength(1);
    expect(
      (await db.query(`delete from clients returning id`)).rows,
    ).toHaveLength(1);
  } finally {
    await db.close();
  }
}, 30000);
