import { createHmac, timingSafeEqual } from "node:crypto";
import { parseIntake } from "../../../packages/intake/index.js";

export async function receiveWebhook(
  request: Request,
  env: Record<string, string | undefined> = process.env,
  fetcher: (url: string, options: RequestInit) => Promise<Response> = fetch,
) {
  const respond = (status: number, message: string) =>
    Response.json(
      { message },
      { status, headers: { "Cache-Control": "no-store" } },
    );
  if (request.method !== "POST") return respond(405, "Method not allowed");
  const {
    FORMSPREE_WEBHOOK_SECRET: secret,
    FORMSPREE_FORM_ID: form,
    SUPABASE_URL: url,
    SUPABASE_SERVICE_ROLE_KEY: key,
  } = env;
  if (!secret || !form || !url || !key)
    return respond(503, "Intake sync is not configured");
  if (Number(request.headers.get("content-length")) > 65536)
    return respond(413, "Payload too large");
  const body = await request.text();
  if (Buffer.byteLength(body) > 65536) return respond(413, "Payload too large");
  const signature = request.headers.get("formspree-signature") || "";
  const timestamp = signature.match(/(?:^|,)\s*t=(\d+)/)?.[1];
  const digest = signature.match(/(?:^|,)\s*v1=([a-f0-9]{64})(?:,|$)/)?.[1];
  if (
    !timestamp ||
    !digest ||
    Math.abs(Date.now() / 1000 - Number(timestamp)) > 300
  )
    return respond(401, "Invalid signature");
  const expected = createHmac("sha256", secret)
    .update(`${timestamp}.${body}`)
    .digest();
  if (!timingSafeEqual(expected, Buffer.from(digest, "hex")))
    return respond(401, "Invalid signature");
  let payload;
  try {
    const event = JSON.parse(body);
    if (event.form !== form) return respond(400, "Wrong form");
    const date = event.submission?._date;
    if (typeof date !== "string")
      return respond(400, "Missing submission date");
    const at = new Date(/Z$|[+-]\d{2}:\d{2}$/.test(date) ? date : `${date}Z`);
    if (!Number.isFinite(at.getTime()) || at.getTime() > Date.now() + 60000)
      return respond(400, "Invalid date");
    const details = parseIntake(event.submission);
    // Stable across delivery retries, independent of the signing timestamp.
    const id = createHmac("sha256", secret).update(body).digest("hex");
    payload = {
      event_id: id,
      submitted_at: at.toISOString(),
      payload: details,
    };
  } catch {
    return respond(400, "Invalid inquiry");
  }
  try {
    const response = await fetcher(
      `${url.replace(/\/$/, "")}/rest/v1/rpc/receive_inquiry`,
      {
        method: "POST",
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(10000),
      },
    );
    if (!response.ok)
      return respond(503, "Intake sync temporarily unavailable");
    return respond(200, "Received");
  } catch {
    return respond(503, "Intake sync temporarily unavailable");
  }
}
