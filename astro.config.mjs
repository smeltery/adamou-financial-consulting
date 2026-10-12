import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import { validateEndpoint } from "./src/client/intake";

import { siteUrl } from "./src/site/metadata";

export default defineConfig({
  site: siteUrl,
  output: "static",
  // Preserve word boundaries around inline links and emphasized text.
  compressHTML: true,
  trailingSlash: "always",
  integrations: [
    react(),
    {
      name: "isolated-vite-cache",
      hooks: {
        "astro:config:setup": ({ command, updateConfig }) => {
          // Checks and builds must not replace a running dev server's React cache.
          updateConfig({ vite: { cacheDir: `node_modules/.vite-${command}` } });
        },
      },
    },
  ],
  server: { host: "127.0.0.1", port: 3000 },
  devToolbar: { enabled: false },
  vite: {
    define: {
      FORMSPREE_ENDPOINT: JSON.stringify(
        validateEndpoint(process.env.FORMSPREE_ENDPOINT || ""),
      ),
    },
  },
});
