import { test, expect } from "bun:test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

test("the emitted API runs on Node without a bundler resolving imports", () => {
  const output = mkdtempSync(join(tmpdir(), "afin-api-"));
  const node = process.env.FLOX_ENV
    ? `${process.env.FLOX_ENV}/bin/node`
    : "node";
  try {
    const compile = Bun.spawnSync([
      node,
      "../../node_modules/typescript/bin/tsc",
      "../../api/activity.ts",
      "--module",
      "NodeNext",
      "--moduleResolution",
      "NodeNext",
      "--target",
      "ES2022",
      "--skipLibCheck",
      "--rootDir",
      "../..",
      "--outDir",
      output,
    ]);
    expect(
      compile.exitCode,
      compile.stdout.toString() + compile.stderr.toString(),
    ).toBe(0);
    writeFileSync(join(output, "package.json"), '{"type":"module"}');
    const entry = pathToFileURL(join(output, "api/activity.js")).href;
    const run = Bun.spawnSync(
      [
        node,
        "--input-type=module",
        "--eval",
        `
      import handler from ${JSON.stringify(entry)};
      const response = await handler.fetch(new Request("https://afin.test/api/activity"));
      if (response.status !== 200 || JSON.stringify(await response.json()) !== '{"events":[]}') throw new Error("Expected an empty unconfigured feed");
    `,
      ],
      {
        env: {
          ...process.env,
          FORMSPREE_WEBHOOK_SECRET: "",
          FORMSPREE_FORM_ID: "",
          UPSTASH_REDIS_REST_URL: "",
          UPSTASH_REDIS_REST_TOKEN: "",
        },
      },
    );
    expect(run.exitCode, run.stderr.toString()).toBe(0);
  } finally {
    rmSync(output, { recursive: true, force: true });
  }
}, 15000);
