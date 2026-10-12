import { siteUrl, descriptions } from "../src/site/metadata";
import { resolve, sep } from "node:path";
const root = resolve("dist");
Bun.serve({
  port: Number(process.env.PORT || 3000),
  hostname: "127.0.0.1",
  async fetch(request) {
    let pathname = decodeURIComponent(new URL(request.url).pathname);
    const buildPage = pathname.match(
      /^\/pages\/(home|services|about|approach|contact|brand|privacy|tools)\.html$/,
    );
    if (buildPage)
      return new Response(null, {
        status: 308,
        headers: {
          Location: buildPage[1] === "home" ? "/" : `/${buildPage[1]}/`,
        },
      });
    const page = pathname.replace(/^\/|\/$/g, "");
    const knownPage = Object.hasOwn(descriptions, page);
    if (knownPage && pathname !== "/" && !pathname.endsWith("/"))
      return new Response(null, {
        status: 308,
        headers: { Location: `${pathname}/` },
      });
    const markdown = request.headers.get("accept")?.includes("text/markdown");
    if (knownPage)
      pathname = markdown
        ? `/content/${page || "home"}.md`
        : `${pathname}index.html`;
    const match = pathname.match(/^\/content\/(.+)\.md$/)?.[1];
    const documentName =
      match && Object.hasOwn(descriptions, match === "home" ? "" : match)
        ? match
        : null;
    const canonical = documentName
      ? `${siteUrl}/${documentName === "home" ? "" : `${documentName}/`}`
      : null;
    const path = resolve(
      root,
      `.${pathname.endsWith("/") ? `${pathname}index.html` : pathname}`,
    );
    if (!path.startsWith(root + sep))
      return new Response("Forbidden", { status: 403 });
    const file = Bun.file(path);
    if (await file.exists())
      return new Response(file, {
        headers: {
          Vary: "Accept",
          ...(canonical ? { Link: `<${canonical}>; rel="canonical"` } : {}),
          ...(pathname.endsWith(".md")
            ? { "Content-Type": "text/markdown; charset=utf-8" }
            : {}),
        },
      });
    return new Response(
      Bun.file(`${root}/${markdown ? "content/not-found.md" : "404.html"}`),
      {
        status: 404,
        headers: {
          "Content-Type": markdown
            ? "text/markdown; charset=utf-8"
            : "text/html",
          Vary: "Accept",
        },
      },
    );
  },
});
console.log("Afin preview: http://localhost:3000");
