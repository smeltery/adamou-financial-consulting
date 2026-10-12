import { test, expect } from "bun:test";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

test("the console API runs on Node and fails closed without credentials", () => {
  const output = mkdtempSync(join(tmpdir(), "afin-api-"));
  const node = process.env.FLOX_ENV
    ? `${process.env.FLOX_ENV}/bin/node`
    : "node";
  try {
    const compile = Bun.spawnSync([
      node,
      "../../node_modules/typescript/bin/tsc",
      "api/intake.ts",
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
    const entry = pathToFileURL(
      join(output, "apps/console/api/intake.js"),
    ).href;
    const run = Bun.spawnSync(
      [
        node,
        "--input-type=module",
        "--eval",
        `
      import handler from ${JSON.stringify(entry)};
      const response = await handler.fetch(new Request("https://afin.test/api/intake", {method: "POST", body: "{}"}));
      if (response.status !== 503) throw new Error("Expected unconfigured webhook rejection");
    `,
      ],
      {
        env: {
          ...process.env,
          FORMSPREE_WEBHOOK_SECRET: "",
          FORMSPREE_FORM_ID: "",
          SUPABASE_URL: "",
          SUPABASE_SERVICE_ROLE_KEY: "",
        },
      },
    );
    expect(run.exitCode, run.stderr.toString()).toBe(0);
  } finally {
    rmSync(output, { recursive: true, force: true });
  }
}, 15000);
