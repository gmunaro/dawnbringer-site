// Checks the built site through a running server (bun run serve in another shell):
//   bun run check            (CHECK_URL=http://localhost:4173 by default)
// - every locale file has the same keys as en.json, no empty strings, and keeps {size};
// - every page has lang, title, description, canonical, Open Graph image and, for the home and
//   press pages, hreflang links to all 14 languages plus x-default;
// - every <img> has an alt attribute, every #anchor exists on its page;
// - every internal link, image, video, font and CSS url answers 200 under the base path.
// Exits 1 on any problem.
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { BASE, LOCALES, SITE } from "./config.ts";

const ROOT = join(import.meta.dir, "..");
const SERVER = process.env.CHECK_URL ?? "http://localhost:4173";
const problems: string[] = [];
const bad = (m: string): void => { problems.push(m); };

// 1. Locale files against en.json.
const en: unknown = await Bun.file(join(ROOT, "src/locales/en.json")).json();
function compare(a: unknown, b: unknown, path: string, code: string): void {
  if (typeof a === "string") {
    if (typeof b !== "string" || !b.trim()) bad(`${code}: ${path} missing or empty`);
    else if (a.includes("{size}") !== b.includes("{size}")) bad(`${code}: ${path} {size} placeholder differs`);
    return;
  }
  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) return bad(`${code}: ${path} array length differs`);
    a.forEach((x, i) => compare(x, b[i], `${path}[${i}]`, code));
    return;
  }
  const ao = a as Record<string, unknown>;
  const bo = (b && typeof b === "object" ? b : {}) as Record<string, unknown>;
  for (const k of Object.keys(ao)) compare(ao[k], bo[k], path ? `${path}.${k}` : k, code);
  for (const k of Object.keys(bo)) if (!(k in ao)) bad(`${code}: extra key ${path}.${k}`);
}
for (const l of LOCALES.slice(1)) compare(en, await Bun.file(join(ROOT, `src/locales/${l.code}.json`)).json(), "", l.code);

// 2. The built pages.
const skip = new Set(["node_modules", "src", "tools", ".git", "assets"]);
function htmlFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) return skip.has(f) ? [] : htmlFiles(p);
    return f.endsWith(".html") ? [p] : [];
  });
}
const pages = htmlFiles(ROOT).map((p) => p.slice(ROOT.length + 1).replace(/\\/g, "/"));
const urls = new Map<string, string>(); // url -> first page that uses it
const attr = (html: string, re: RegExp) => [...html.matchAll(re)].map((m) => m[1]!);

for (const rel of pages) {
  const html = await Bun.file(join(ROOT, rel)).text();
  const pageUrl = BASE + rel.replace(/index\.html$/, "");
  const where = rel;
  if (!/<html lang="[^"]+"/.test(html)) bad(`${where}: no html lang`);
  if (!/<title>[^<]+<\/title>/.test(html)) bad(`${where}: no title`);
  if (!/<meta name="description" content="[^"]+"/.test(html)) bad(`${where}: no description`);
  if (!html.includes('property="og:image"')) bad(`${where}: no og:image`);
  if (rel !== "404.html" && !html.includes('rel="canonical"')) bad(`${where}: no canonical`);
  const isLocalized = rel === "index.html" || /^([a-z-]+\/)?(presskit\/)?index\.html$/.test(rel);
  if (isLocalized) {
    const langs = attr(html, /<link rel="alternate" hreflang="([^"]+)"/g);
    for (const l of [...LOCALES.map((x) => x.code), "x-default"]) if (!langs.includes(l)) bad(`${where}: hreflang ${l} missing`);
  }
  for (const img of html.match(/<img\b[^>]*>/g) ?? []) if (!/\balt="/.test(img)) bad(`${where}: img without alt: ${img.slice(0, 80)}`);
  const ids = new Set(attr(html, /\bid="([^"]+)"/g));
  for (const ref of [...attr(html, /\b(?:href|src|poster)="([^"]+)"/g), ...attr(html, /\bsrcset="([^"]+)"/g).flatMap((s) => s.split(",").map((x) => x.trim().split(" ")[0]!))]) {
    if (ref.startsWith("#")) { if (!ids.has(ref.slice(1))) bad(`${where}: anchor ${ref} not found`); continue; }
    if (/^(mailto:|https?:\/\/(?!gmunaro\.github\.io))/.test(ref)) continue;
    const abs = ref.startsWith(SITE) ? BASE + ref.slice(SITE.length) : new URL(ref, "http://x" + pageUrl).pathname;
    if (!abs.startsWith(BASE)) bad(`${where}: link outside the base path: ${ref}`);
    if (!urls.has(abs)) urls.set(abs, where);
  }
}
// CSS urls (fonts, frames).
const css = await Bun.file(join(ROOT, "assets/site.css")).text();
for (const u of attr(css, /url\(([^)]+)\)/g)) urls.set(BASE + "assets/" + u.replace(/["']/g, ""), "assets/site.css");
urls.set(BASE + "sitemap.xml", "-"); urls.set(BASE + "robots.txt", "-"); urls.set(BASE + "privacy.html", "-");

// 3. Fetch everything.
let fetched = 0;
await Promise.all([...urls].map(async ([u, from]) => {
  const res = await fetch(SERVER + u, { redirect: "manual" });
  fetched++;
  if (res.status !== 200) bad(`${from}: ${u} -> ${res.status}`);
  await res.arrayBuffer();
}));
const privacy = await (await fetch(SERVER + BASE + "privacy.html")).text();
if (!privacy.includes("Privacy Policy") || !privacy.includes("Política de Privacidade")) bad("privacy.html lost its English or Portuguese text");
const missing = await fetch(SERVER + BASE + "no-such-page");
if (missing.status !== 404) bad(`missing page answered ${missing.status}, not 404`);

console.log(`${pages.length} pages, ${fetched} urls fetched, ${problems.length} problem(s)`);
for (const p of problems) console.log("  " + p);
process.exit(problems.length ? 1 : 0);
