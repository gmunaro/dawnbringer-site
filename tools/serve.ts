// Serves the built site the way GitHub Pages does, under /dawnbringer-site/, for local checks:
//   bun run serve            (port 4173; PORT=xxxx to change)
// Folders serve their index.html (a folder without the trailing slash redirects to it), missing
// paths get 404.html with status 404, and paths outside the repo are refused.
import { existsSync, statSync } from "node:fs";
import { join, normalize } from "node:path";
import { BASE } from "./config.ts";

const ROOT = join(import.meta.dir, "..");
const port = Number(process.env.PORT ?? 4173);

const server = Bun.serve({
  port,
  fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === "/") return Response.redirect(BASE, 302);
    if (!url.pathname.startsWith(BASE)) return new Response("not under " + BASE, { status: 404 });
    const rel = decodeURIComponent(url.pathname.slice(BASE.length));
    const file = normalize(join(ROOT, rel));
    if (!file.startsWith(ROOT) || rel.split("/").some((s) => s.startsWith(".") && s !== ".nojekyll") || rel.startsWith("node_modules")) {
      return new Response("forbidden", { status: 403 });
    }
    if (existsSync(file) && statSync(file).isDirectory()) {
      if (!url.pathname.endsWith("/")) return Response.redirect(url.pathname + "/", 301);
      const index = join(file, "index.html");
      if (existsSync(index)) return new Response(Bun.file(index));
    } else if (existsSync(file)) {
      return new Response(Bun.file(file));
    }
    return new Response(Bun.file(join(ROOT, "404.html")), { status: 404, headers: { "content-type": "text/html; charset=utf-8" } });
  },
});
console.log(`serving ${ROOT} at http://localhost:${server.port}${BASE} (pid ${process.pid})`);
