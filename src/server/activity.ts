import { createHmac, timingSafeEqual } from "node:crypto";
import { activityLifetime, recentEvents } from "../activity/events";

type Settings = Record<string, string | undefined>;
const key = "afin:anonymous-inquiries:v1";

export function validSignature(
  raw: string,
  header: string,
  secret: string,
  now: number,
) {
  const parts = Object.fromEntries(
    header.split(",").map((part) => part.trim().split("=")),
  );
  if (!/^\d+$/.test(parts.t || "") || !/^[a-f0-9]{64}$/i.test(parts.v1 || ""))
    return false;
  if (Math.abs(now / 1000 - Number(parts.t)) > 300) return false;
  const expected = createHmac("sha256", secret)
    .update(`${parts.t}.${raw}`)
    .digest();
  return timingSafeEqual(expected, Buffer.from(parts.v1, "hex"));
}

export async function handleActivity(
  request: Request,
  settings: Settings = process.env,
  send: typeof fetch = fetch,
  now = Date.now(),
) {
  const reply = (body: unknown, status = 200) =>
    Response.json(body, {
      status,
      headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" },
    });
  if (!["GET", "POST"].includes(request.method))
    return new Response(null, { status: 405, headers: { Allow: "GET, POST" } });
  const {
    FORMSPREE_WEBHOOK_SECRET: secret,
    FORMSPREE_FORM_ID: formId,
    UPSTASH_REDIS_REST_URL: url,
    UPSTASH_REDIS_REST_TOKEN: token,
  } = settings;
  if (!secret || !formId || !url || !token)
    return reply(
      request.method === "GET"
        ? { events: [] }
        : { error: "Activity is not configured." },
      request.method === "GET" ? 200 : 503,
    );

  const redis = async (commands: (string | number)[][]) => {
    if (!/^https:\/\/[a-zA-Z0-9.-]+\.upstash\.io\/?$/.test(url))
      throw new Error("Invalid storage URL");
    const response = await send(`${url.replace(/\/$/, "")}/multi-exec`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commands),
      signal: AbortSignal.timeout(5000),
    });
    const data = await response.json();
    if (!response.ok || !Array.isArray(data) || data.some((item) => item.error))
      throw new Error("Activity storage unavailable");
    return data;
  };

  try {
    if (request.method === "GET") {
      const [data] = await redis([
        [
          "ZREVRANGEBYSCORE",
          key,
          now,
          now - activityLifetime,
          "WITHSCORES",
          "LIMIT",
          0,
          3,
        ],
      ]);
      if (!Array.isArray(data.result))
        throw new Error("Invalid activity response");
      const events = [];
      for (let index = 0; index < data.result.length; index += 2)
        events.push({
          id: data.result[index],
          at: Number(data.result[index + 1]),
        });
      return reply({ events: recentEvents(events, now) });
    }
    if (Number(request.headers.get("content-length")) > 65536)
      return reply({ error: "Payload too large." }, 413);
    // Preserve the original bytes until signature verification has finished.
    const raw = await request.text();
    if (Buffer.byteLength(raw) > 65536)
      return reply({ error: "Payload too large." }, 413);
    if (
      !validSignature(
        raw,
        request.headers.get("formspree-signature") || "",
        secret,
        now,
      )
    )
      return reply({ error: "Invalid signature." }, 401);
    let payload;
    try {
      payload = JSON.parse(raw);
    } catch {
      return reply({ error: "Invalid JSON." }, 400);
    }
    if (
      !payload ||
      payload.form !== formId ||
      !payload.submission ||
      typeof payload.submission._date !== "string"
    )
      return reply({ error: "Unexpected form payload." }, 400);
    const date = payload.submission._date;
    const submittedAt = Date.parse(
      /(?:Z|[+-]\d\d:\d\d)$/.test(date) ? date : `${date}Z`,
    );
    if (!Number.isFinite(submittedAt) || submittedAt > now + 60000)
      return reply({ error: "Invalid submission date." }, 400);
    if (submittedAt <= now - activityLifetime) return reply({ accepted: true });
    // Only a secret-derived opaque ID and a minute-rounded timestamp are stored.
    // Identical delivery retries reuse the ID; no form field is persisted or logged.
    const id = createHmac("sha256", secret).update(raw).digest("hex");
    const at = Math.floor(Math.min(submittedAt, now) / 60000) * 60000;
    await redis([
      ["ZADD", key, "NX", at, id],
      ["ZREMRANGEBYSCORE", key, "-inf", now - activityLifetime],
      ["ZREMRANGEBYRANK", key, 0, -101],
      ["EXPIRE", key, 86400],
    ]);
    return reply({ accepted: true });
  } catch {
    // Do not log provider payloads, secrets, or storage response details.
    console.error("Anonymous inquiry activity is temporarily unavailable.");
    return reply({ error: "Activity temporarily unavailable." }, 503);
  }
}
