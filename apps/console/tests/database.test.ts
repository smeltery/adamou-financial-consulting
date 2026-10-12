import { test, expect } from "bun:test";
import { PGlite } from "@electric-sql/pglite";
const owner = "00000000-0000-4000-8000-000000000001";
const stranger = "00000000-0000-4000-8000-000000000002";
test("database denies anonymous and non-owner access, preserves edits and deduplicates intake", async () => {
  const db = new PGlite();
  try {
    await db.exec(`create role anon; create role authenticated; create role service_role bypassrls;
      create schema auth; create table auth.users(id uuid primary key);
      create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
      grant usage on schema public, auth to anon, authenticated, service_role;
      grant execute on function auth.uid() to authenticated;
      insert into auth.users values ('${owner}'), ('${stranger}');`);
    await db.exec(
      await Bun.file("../../supabase/migrations/001_workspace.sql").text(),
    );
    await db.exec(
      `insert into public.workspace_owner(user_id) values ('${owner}');`,
    );
    const payload = JSON.stringify({
      name: "Example Client",
      email: "person@example.com",
      priority: "Budget",
    });
    await db.query("select receive_inquiry($1, now(), $2::jsonb)", [
      "event-1",
      payload,
    ]);
    await db.query("select receive_inquiry($1, now(), $2::jsonb)", [
      "event-1",
      payload,
    ]);
    expect((await db.query("select * from inquiries")).rows).toHaveLength(1);
    await db.exec(`set role anon;`);
    await expect(db.query("select * from clients")).rejects.toThrow();
    await expect(
      db.query(
        `insert into clients(name,email) values('Intruder','x@example.com')`,
      ),
    ).rejects.toThrow();
    await db.exec(
      `reset role; set role authenticated; set request.jwt.claim.sub = '${stranger}';`,
    );
    expect((await db.query("select * from clients")).rows).toHaveLength(0);
    expect((await db.query("select * from inquiries")).rows).toHaveLength(0);
    expect((await db.query("select * from client_events")).rows).toHaveLength(
      0,
    );
    await expect(
      db.query(
        `insert into clients(name,email) values('Intruder','x@example.com')`,
      ),
    ).rejects.toThrow();
    expect(
      (await db.query(`update clients set name='Intruder' returning id`)).rows,
    ).toHaveLength(0);
    expect(
      (await db.query(`delete from clients returning id`)).rows,
    ).toHaveLength(0);
    await expect(
      db.query("select receive_inquiry($1, now(), $2::jsonb)", [
        "event-x",
        payload,
      ]),
    ).rejects.toThrow();
    await expect(
      db.query(`update workspace_owner set user_id='${stranger}'`),
    ).rejects.toThrow();
    await db.exec(`set request.jwt.claim.sub = '${owner}';`);
    expect((await db.query("select * from clients")).rows).toHaveLength(1);
    await db.exec(
      `update clients set priority='Matt edited this', status='active';`,
    );
    expect(
      (await db.query<{ started_at: string }>("select started_at from clients"))
        .rows[0].started_at,
    ).not.toBeNull();
    await db.exec("reset role");
    await db.query("select receive_inquiry($1, now(), $2::jsonb)", [
      "event-2",
      payload,
    ]);
    expect((await db.query("select * from inquiries")).rows).toHaveLength(2);
    expect(
      (await db.query<{ priority: string }>("select priority from clients"))
        .rows[0].priority,
    ).toBe("Matt edited this");
    await db.exec(
      `set role authenticated; set request.jwt.claim.sub = '${owner}';`,
    );
    expect(
      (await db.query("select * from client_events")).rows.length,
    ).toBeGreaterThan(2);
    await db.exec(
      `insert into clients(name,email) values('Manual Client','manual@example.com');`,
    );
    expect(
      (await db.query("delete from clients returning id")).rows,
    ).toHaveLength(2);
    expect((await db.query("select * from inquiries")).rows).toHaveLength(0);
  } finally {
    await db.close();
  }
}, 30000);
