import { resolve, sep } from "node:path";
const root = resolve("dist");
Bun.serve({
  port: Number(process.env.PORT || 3000),
  hostname: "127.0.0.1",
  async fetch(request) {
    const pathname = decodeURIComponent(new URL(request.url).pathname);
    const path = resolve(
      root,
      `.${pathname.endsWith("/") ? `${pathname}index.html` : pathname}`,
    );
    if (!path.startsWith(root + sep))
      return new Response("Forbidden", { status: 403 });
    const file = Bun.file(path);
    if (await file.exists()) return new Response(file);
    return new Response(Bun.file(`${root}/404.html`), {
      status: 404,
      headers: { "Content-Type": "text/html" },
    });
  },
});
console.log("Afin preview: http://localhost:3000");
