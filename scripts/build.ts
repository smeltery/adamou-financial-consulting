import { cp, mkdir, rm } from "node:fs/promises";
import { layout } from "../src/components/layout";
import { servicesPage, aboutPage, approachPage } from "../src/pages/company";
import { writeCrawlFiles } from "./crawl";
import { toolsPage } from "../src/tools/catalog";
import { home } from "../src/pages/home";
import { contact } from "../src/pages/contact";
import { brand, privacy } from "../src/pages/brand";
import { validateEndpoint } from "../src/client/intake";
const endpoint = validateEndpoint(process.env.FORMSPREE_ENDPOINT || "");
await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });
await cp("public", "dist", { recursive: true });
const pages = [
  ["", "Financial Coaching | Adamou Financial Consulting", home],
  ["services", "Financial coaching services", servicesPage],
  ["about", "Meet Matt Adamou", aboutPage],
  ["approach", "Our approach to financial coaching", approachPage],
  ["tools", "Free Financial Calculators: Budget, Debt & Savings", toolsPage],
  ["contact", "Start a conversation", contact],
  ["brand", "Brand resources", brand],
  ["privacy", "Privacy", privacy],
];
for (const [path, title, content] of pages) {
  await Bun.write(
    `dist/pages/${path || "home"}.html`,
    layout(title, content, path),
  );
}
await writeCrawlFiles(pages);
await Bun.write(
  "dist/404.html",
  layout(
    "Page not found",
    '<section class="wrap section"><h1>A different path.</h1><p>This page doesn’t exist. <a href="/">Return home</a> or <a href="/contact/">contact Matt</a>.</p></section>',
    "404",
  ),
);
await Bun.write(
  "dist/styles.css",
  (
    await Promise.all(
      [
        "styles/base",
        "styles/home",
        "styles/forms",
        "styles/responsive",
        "styles/chrome",
        "styles/search",
        "styles/editorial",
        "tools/styles",
      ].map((name) => Bun.file(`src/${name}.css`).text()),
    )
  ).join("\n"),
);
const result = await Bun.build({
  entrypoints: ["src/client/app.ts"],
  outdir: "dist",
  minify: true,
  define: { FORMSPREE_ENDPOINT: JSON.stringify(endpoint) },
});
if (!result.success)
  throw new AggregateError(result.logs, "Browser build failed");
console.log(
  `Built Afin. Inquiry delivery: ${endpoint ? "Formspree" : "email draft"}.`,
);
