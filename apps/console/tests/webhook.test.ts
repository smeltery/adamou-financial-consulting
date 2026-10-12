import { test, expect } from "bun:test";
import { createHmac } from "node:crypto";
import { receiveWebhook } from "../server/webhook";
const env = {
  FORMSPREE_WEBHOOK_SECRET: "test-only-secret",
  FORMSPREE_FORM_ID: "test-form",
  SUPABASE_URL: "https://example.supabase.co",
  SUPABASE_SERVICE_ROLE_KEY: "test-only-key",
};
function request(payload: unknown, seconds = Math.floor(Date.now() / 1000)) {
  const body = JSON.stringify(payload);
  const digest = createHmac("sha256", env.FORMSPREE_WEBHOOK_SECRET)
    .update(`${seconds}.${body}`)
    .digest("hex");
  return new Request("https://console.test/api/intake", {
    method: "POST",
    body,
    headers: { "formspree-signature": `t=${seconds},v1=${digest}` },
  });
}
const payload = {
  form: "test-form",
  submission: {
    _date: new Date().toISOString(),
    name: "Test",
    email: "test@example.com",
    priority: "Budget",
    unexpected: "do not store",
  },
};
test("signed delivery validates, minimizes data, and keeps retries idempotent", async () => {
  const calls: string[] = [];
  const fetcher = async (_url: unknown, options: RequestInit) => {
    calls.push(options.body as string);
    return new Response(null, { status: 204 });
  };
  expect((await receiveWebhook(request(payload), env, fetcher)).status).toBe(
    200,
  );
  expect((await receiveWebhook(request(payload), env, fetcher)).status).toBe(
    200,
  );
  expect(calls[0]).toBe(calls[1]);
  expect(calls[0]).not.toContain("unexpected");
  expect(
    (
      await receiveWebhook(
        request(payload, Math.floor(Date.now() / 1000) - 301),
        env,
        fetcher,
      )
    ).status,
  ).toBe(401);
  expect(
    (await receiveWebhook(request({ ...payload, form: "wrong" }), env, fetcher))
      .status,
  ).toBe(400);
  expect(calls).toHaveLength(2);
});
test("unconfigured, unsigned and failed storage requests fail closed", async () => {
  expect((await receiveWebhook(request(payload), {})).status).toBe(503);
  expect(
    (
      await receiveWebhook(
        new Request("https://console.test/api/intake", {
          method: "POST",
          body: "{}",
        }),
        env,
      )
    ).status,
  ).toBe(401);
  const fail = async () => new Response(null, { status: 500 });
  expect((await receiveWebhook(request(payload), env, fail)).status).toBe(503);
});
