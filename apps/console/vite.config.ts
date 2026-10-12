import { defineConfig } from "vite";
import { createRequire } from "node:module";
import { cpSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

// PDF.js loads font maps and image decoders on demand, from our own origin.
const pdfRoot = dirname(
  createRequire(import.meta.url).resolve("pdfjs-dist/package.json"),
);
export default defineConfig({
  plugins: [
    {
      name: "local-pdf-assets",
      configResolved(config) {
        const destination = join(config.publicDir, "pdfjs");
        mkdirSync(destination, { recursive: true });
        for (const folder of ["cmaps", "standard_fonts", "wasm"]) {
          cpSync(join(pdfRoot, folder), join(destination, folder), {
            recursive: true,
          });
        }
      },
    },
  ],
});
