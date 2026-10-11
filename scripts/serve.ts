import { resolve, sep } from "node:path";
const root = resolve("dist");
Bun.serve({
  port: Number(process.env.PORT || 3000),
  hostname: "127.0.0.1",
  async fetch(request) {
    let pathname = decodeURIComponent(new URL(request.url).pathname);
    const markdown = request.headers.get("accept")?.includes("text/markdown");
    if (
      /^\/(services|about|approach|contact|brand|privacy|tools)?\/?$/.test(
        pathname,
      )
    )
      pathname = markdown
        ? `/content/${pathname.replaceAll("/", "") || "home"}.md`
        : `/pages/${pathname.replaceAll("/", "") || "home"}.html`;
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
