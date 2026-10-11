import { cp, mkdir, rm } from "node:fs/promises";
import { layout } from "../src/layout";
import { servicesPage, aboutPage, approachPage } from "../src/pages";
import { writeCrawlFiles } from "./crawl";
import { home } from "../src/home";
import { contact } from "../src/contact";
import { brand, privacy } from "../src/brand";
import { validateEndpoint } from "../src/intake";
const endpoint = validateEndpoint(process.env.FORMSPREE_ENDPOINT || "");
await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });
await cp("public", "dist", { recursive: true });
const pages = [
  ["", "Financial coaching for a clearer path forward", home],
  ["services", "Financial coaching services", servicesPage],
  ["about", "Meet Matt Adamou", aboutPage],
  ["approach", "Our approach to financial coaching", approachPage],
  ["contact", "Start a conversation", contact],
  ["brand", "Brand resources", brand],
  ["privacy", "Privacy", privacy],
];
for (const [path, title, content] of pages) {
  await mkdir(`dist/${path}`, { recursive: true });
  await Bun.write(`dist/${path}/index.html`, layout(title, content, path));
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
      ["base", "home", "forms", "responsive", "chrome"].map((name) =>
        Bun.file(`src/${name}.css`).text(),
      ),
    )
  ).join("\n"),
);
const result = await Bun.build({
  entrypoints: ["src/app.ts"],
  outdir: "dist",
  minify: true,
  define: { FORMSPREE_ENDPOINT: JSON.stringify(endpoint) },
});
if (!result.success)
  throw new AggregateError(result.logs, "Browser build failed");
console.log(
  `Built Afin. Inquiry delivery: ${endpoint ? "Formspree" : "email draft"}.`,
);
