import { test, expect } from "bun:test";
import { PGlite } from "@electric-sql/pglite";
test("meetings are owner-only, validate time ranges, and detect stale edits", async () => {
  const db = new PGlite();
  const owner = "00000000-0000-4000-8000-000000000001";
  const stranger = "00000000-0000-4000-8000-000000000002";
  const client = "00000000-0000-4000-8000-000000000003";
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
      await Bun.file("../../supabase/migrations/003_calendar.sql").text(),
    );
    await db.exec(
      `insert into workspace_owner(user_id) values('${owner}'); insert into clients(id,name,email) values('${client}','Test','test@example.com'); set role authenticated; set request.jwt.claim.sub='${owner}';`,
    );
    const inserted = await db.query<{ id: string; updated_at: Date }>(
      `insert into meetings(client_id,title,starts_at,ends_at) values('${client}','Introduction','2026-10-12T10:00:00Z','2026-10-12T11:00:00Z') returning id,updated_at`,
    );
    const record = inserted.rows[0];
    await expect(
      db.exec("update meetings set ends_at=starts_at"),
    ).rejects.toThrow();
    await expect(
      db.exec("update meetings set status='invalid'"),
    ).rejects.toThrow();
    await expect(db.exec("update meetings set title=' '")).rejects.toThrow();
    await db.exec("update meetings set status='confirmed'");
    const stale = await db.query(
      "update meetings set title='stale' where id=$1 and updated_at=$2 returning id",
      [record.id, record.updated_at],
    );
    expect(stale.rows).toHaveLength(0);
    await db.exec(`set request.jwt.claim.sub='${stranger}'`);
    expect((await db.query("select * from meetings")).rows).toHaveLength(0);
    expect(
      (await db.query("delete from meetings returning id")).rows,
    ).toHaveLength(0);
    expect(
      (await db.query("update meetings set title='Intrusion' returning id"))
        .rows,
    ).toHaveLength(0);
    await expect(
      db.exec(
        `insert into meetings(client_id,title,starts_at,ends_at) values('${client}','Intrusion',now(),now()+interval '1 hour')`,
      ),
    ).rejects.toThrow();
    await db.exec("reset role; set role anon;");
    await expect(db.query("select * from meetings")).rejects.toThrow();
    await db.exec(
      `reset role; set role authenticated; set request.jwt.claim.sub='${owner}'`,
    );
    expect(
      (await db.query("delete from meetings returning id")).rows,
    ).toHaveLength(1);
  } finally {
    await db.close();
  }
}, 30000);
