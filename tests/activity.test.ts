import { test, expect } from "bun:test";
import { createHmac } from "node:crypto";
import { handleActivity, validSignature } from "../src/server/activity";
import { recentEvents, activityLifetime } from "../src/activity/events";

const now = Date.parse("2026-10-12T12:00:00Z");
const settings = {
  FORMSPREE_WEBHOOK_SECRET: "test-secret",
  FORMSPREE_FORM_ID: "test-form",
  UPSTASH_REDIS_REST_URL: "https://test.upstash.io",
  UPSTASH_REDIS_REST_TOKEN: "test-token",
};
const raw = JSON.stringify({
  form: "test-form",
  submission: {
    _date: "2026-10-12T11:59:32",
    name: "Private Name",
    email: "private@example.com",
    notes: "Private financial context",
  },
});
const signature = (body = raw, timestamp = now / 1000) =>
  `t=${timestamp},v1=${createHmac("sha256", settings.FORMSPREE_WEBHOOK_SECRET).update(`${timestamp}.${body}`).digest("hex")}`;
const request = (body = raw, header = signature(body)) =>
  new Request("https://afin.test/api/activity", {
    method: "POST",
    headers: { "formspree-signature": header },
    body,
  });
test("webhook verification rejects altered bodies, malformed signatures, and replay", () => {
  expect(validSignature(raw, signature(), "test-secret", now)).toBe(true);
  for (const header of [
    "",
    "t=NaN,v1=aa",
    signature(raw, now / 1000 - 301),
    signature(raw, now / 1000 + 301),
  ])
    expect(validSignature(raw, header, "test-secret", now)).toBe(false);
  expect(validSignature(raw + " ", signature(), "test-secret", now)).toBe(
    false,
  );
});
test("unconfigured activity is empty and never accepts browser claims", async () => {
  expect(
    await (
      await handleActivity(new Request("https://afin.test/api/activity"), {})
    ).json(),
  ).toEqual({ events: [] });
  expect((await handleActivity(request(), {})).status).toBe(503);
  expect(
    (await handleActivity(request(raw, "invalid"), settings, fetch, now))
      .status,
  ).toBe(401);
});
test("verified inquiries persist no personal fields and deduplicate retries", async () => {
  const writes: string[] = [];
  const send = (async (_url: unknown, init: RequestInit) => {
    writes.push(String(init.body));
    return Response.json([
      { result: 1 },
      { result: 0 },
      { result: 0 },
      { result: 1 },
    ]);
  }) as typeof fetch;
  expect((await handleActivity(request(), settings, send, now)).status).toBe(
    200,
  );
  expect((await handleActivity(request(), settings, send, now)).status).toBe(
    200,
  );
  expect(writes[0]).toBe(writes[1]);
  expect(writes[0]).not.toMatch(/Private|email|notes|example.com/);
  const commands = JSON.parse(writes[0]);
  expect(commands[0].slice(0, 3)).toEqual([
    "ZADD",
    "afin:anonymous-inquiries:v1",
    "NX",
  ]);
  expect(commands[0][3]).toBe(Date.parse("2026-10-12T11:59:00Z"));
  expect(commands.at(-1)).toEqual([
    "EXPIRE",
    "afin:anonymous-inquiries:v1",
    86400,
  ]);
});
test("wrong forms and old events cannot populate the feed", async () => {
  const send = (() => {
    throw new Error("Storage must not be called");
  }) as unknown as typeof fetch;
  expect(
    (
      await handleActivity(
        request(raw.replace("test-form", "wrong")),
        settings,
        send,
        now,
      )
    ).status,
  ).toBe(400);
  expect(
    (
      await handleActivity(
        request(raw.replace("2026-10-12", "2026-10-01")),
        settings,
        send,
        now,
      )
    ).status,
  ).toBe(200);
});
test("the public feed strips extra fields, stale events, and duplicates", async () => {
  const id = "a".repeat(64);
  expect(
    recentEvents(
      [
        { id, at: now, name: "private" },
        { id, at: now },
        { id: "b".repeat(64), at: now - activityLifetime },
        { id: "c".repeat(64), at: now + 1 },
      ],
      now,
    ),
  ).toEqual([{ id, at: now }]);
  const send = (async () =>
    Response.json([{ result: [id, String(now)] }])) as unknown as typeof fetch;
  expect(
    await (
      await handleActivity(
        new Request("https://afin.test/api/activity"),
        settings,
        send,
        now,
      )
    ).json(),
  ).toEqual({ events: [{ id, at: now }] });
});
