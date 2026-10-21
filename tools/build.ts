// Builds the static site into the repo root, which GitHub Pages publishes as-is (.nojekyll):
//   bun run build
// Reads src/locales/*.json, src/privacy.md, src/assets, src/fonts and src/presskit. Writes the
// pages (index.html, <lang>/index.html, presskit/, privacy.html, 404.html), assets/, the press kit
// zip, sitemap.xml, robots.txt and site.webmanifest. Same inputs give the same files.
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { zipSync, type Zippable } from "fflate";
import { marked } from "marked";
import subsetFont from "subset-font";
import { BASE, BETA, LOCALES, SITE, type Locale, type PixelFont } from "./config.ts";
import { betaPage, changelogPage, demoOf, downloadPage, homePage, notFoundPage, pressPage, privacyPage, PRESS_FILES, ZIP_NAME, type Ctx, type Page, type ReleaseEntry, type Strings } from "./pages.ts";

const ROOT = join(import.meta.dir, "..");
const SRC = join(ROOT, "src");
const out = (p: string) => join(ROOT, p);

/** Everything the build writes at the root, removed first so deleted pages do not linger. */
function clean(): void {
  // latest.json is not here: the game repo's tools/publish writes it and the build leaves it alone.
  const fixed = ["index.html", "404.html", "privacy.html", "sitemap.xml", "robots.txt", "site.webmanifest", ".nojekyll", "assets", "presskit", "changelog", "beta", "download"];
  const dirs = LOCALES.map((l) => l.dir).filter((d) => /^[a-z]{2}(-[a-z]{2})?\/$/.test(d));
  for (const p of [...fixed, ...dirs]) rmSync(out(p), { recursive: true, force: true });
}

function write(p: string, data: string | Uint8Array): void {
  mkdirSync(dirname(out(p)), { recursive: true });
  writeFileSync(out(p), data);
}

/** src/releases.json (newest first), written by the game repo's tools/publish; [] before the first release. */
async function loadReleases(): Promise<ReleaseEntry[]> {
  const f = Bun.file(join(SRC, "releases.json"));
  return (await f.exists()) ? ((await f.json()) as ReleaseEntry[]) : [];
}

async function loadStrings(loc: Locale): Promise<Strings> {
  return (await Bun.file(join(SRC, "locales", `${loc.code}.json`)).json()) as Strings;
}

/** Every string of a locale file, joined: the glyphs its pages can show. */
function allText(v: unknown): string {
  if (typeof v === "string") return v;
  if (Array.isArray(v)) return v.map(allText).join("");
  if (v && typeof v === "object") return Object.values(v).map(allText).join("");
  return "";
}

const PRINTABLE_ASCII = Array.from({ length: 95 }, (_, i) => String.fromCharCode(32 + i)).join("");

/**
 * Pixel fonts cut down to the glyphs the site uses, as WOFF2: Kenney Pixel for every Latin and
 * Cyrillic text, Jacquarda Bastarda for the logo, one Fusion Pixel variant per CJK language.
 * Language names (the switcher) are added to every font so they render in all pages, and the
 * privacy policy's text to the Latin one.
 */
async function buildFonts(strings: Map<string, Strings>, privacy: string, notes: Map<string, string>): Promise<void> {
  const names = LOCALES.map((l) => l.name).join("");
  const sub = async (src: string, text: string, dest: string) => {
    const buf = Buffer.from(await Bun.file(join(SRC, "fonts", src)).arrayBuffer());
    write(`assets/fonts/${dest}`, await subsetFont(buf, text, { targetFormat: "woff2" }));
  };
  const latinText = LOCALES.filter((l) => l.font === "latin").map((l) => allText(strings.get(l.code)) + (notes.get(l.code) ?? "")).join("");
  await sub("kenney_pixel.ttf", PRINTABLE_ASCII + latinText + privacy + names + "©·…“”„«»", "kenney-pixel.woff2");
  await sub("jacquarda_bastarda_9.ttf", "Dawnbringer", "jacquarda-logo.woff2");
  const fusion: Record<Exclude<PixelFont, "latin">, string> = {
    ja: "fusion-pixel-12px-proportional-ja.otf",
    ko: "fusion-pixel-12px-proportional-ko.otf",
    zh_hans: "fusion-pixel-12px-proportional-zh_hans.otf",
    zh_tw: "fusion-pixel-12px-proportional-zh_tw.otf",
  };
  for (const l of LOCALES) {
    if (l.font === "latin") continue;
    await sub(fusion[l.font], PRINTABLE_ASCII + allText(strings.get(l.code)) + (notes.get(l.code) ?? "") + names, `fusion-${l.font}.woff2`);
  }
  for (const f of readdirSync(join(SRC, "fonts")).filter((f) => f.startsWith("LICENSE") || f.startsWith("CREDITS"))) {
    // Text copied with LF line ends whatever the checkout holds, so every clone builds the same bytes.
    write(`assets/fonts/${f}`, readFileSync(join(SRC, "fonts", f), "utf-8").replace(/\r\n/g, "\n"));
  }
}

/** The press kit zip: logo, icon, key art and screenshots, stored (PNGs do not compress) with a fixed date. */
function buildZip(): number {
  const files: Zippable = {};
  const mtime = new Date("2026-10-15T12:00:00Z");
  const add = (rel: string) => {
    files[`dawnbringer-presskit/${rel}`] = [new Uint8Array(readFileSync(join(SRC, "presskit", rel))), { level: 0, mtime }];
  };
  for (const f of Object.values(PRESS_FILES)) add(f);
  for (const f of readdirSync(join(SRC, "presskit", "screenshots")).sort()) add(`screenshots/${f}`);
  const zip = zipSync(files);
  write(`presskit/${ZIP_NAME}`, zip);
  return zip.length;
}

function sitemap(pages: Page[]): string {
  const groups = ["", "presskit/", "changelog/"].map((p) => LOCALES.map((l) => l.dir + p));
  const urls = pages.filter((p) => p.path !== "404.html").map((p) => {
    const group = groups.find((g) => g.includes(p.path));
    const alts = group
      ? group.map((g, i) => `<xhtml:link rel="alternate" hreflang="${LOCALES[i]!.code}" href="${SITE + g}"/>`).join("") +
        `<xhtml:link rel="alternate" hreflang="x-default" href="${SITE + group[0]}"/>`
      : "";
    return `<url><loc>${SITE + p.path}</loc>${alts}</url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join("\n")}\n</urlset>\n`;
}

/** site.js with the language-suggestion strings of every locale baked in. */
async function buildScript(strings: Map<string, Strings>): Promise<string> {
  const langs = LOCALES.map((l) => {
    const s = strings.get(l.code)!.suggest;
    return { code: l.code, dir: l.dir, text: s.text, go: s.go, dismiss: s.dismiss };
  });
  const js = await Bun.file(join(SRC, "site.js")).text();
  return js.replace("/*LANGS*/[]", JSON.stringify(langs)).replace("/*BASE*/\"/\"", JSON.stringify(BASE));
}

async function main(): Promise<void> {
  const t0 = performance.now();
  clean();
  const strings = new Map<string, Strings>();
  for (const l of LOCALES) strings.set(l.code, await loadStrings(l));
  const releases = await loadReleases();
  // The changelog's text per locale (its own language, or English), so the fonts carry its glyphs.
  const notes = new Map(LOCALES.map((l) => [l.code, releases.map((r) => r.notes[l.code.replace("-", "_")] ?? r.notes.en ?? "").join("")]));
  const demo = demoOf(releases);

  cpSync(join(SRC, "assets"), out("assets"), { recursive: true });
  cpSync(join(SRC, "site.css"), out("assets/site.css"));
  write("assets/site.js", await buildScript(strings));
  const privacyMd = await Bun.file(join(SRC, "privacy.md")).text();
  await buildFonts(strings, privacyMd, notes);
  cpSync(join(SRC, "presskit"), out("presskit/files"), { recursive: true });
  const zipBytes = buildZip();

  const pages: Page[] = [];
  for (const loc of LOCALES) {
    const t = strings.get(loc.code)!;
    const mb = (bytes: number) => new Intl.NumberFormat(loc.code, { maximumFractionDigits: 1, minimumFractionDigits: 1 }).format(bytes / 1e6) + " MB";
    const c: Ctx = { loc, t, zipSize: mb(zipBytes), mb, changelog: releases.length > 0, demo };
    pages.push(homePage(c), pressPage(c));
    if (releases.length) pages.push(changelogPage(c, releases));
    if (BETA) pages.push(betaPage(c));
    if (demo) pages.push(downloadPage(c));
  }
  const en: Ctx = { loc: LOCALES[0]!, t: strings.get("en")!, zipSize: "", mb: String };
  // A Windows checkout may hold the file with CRLF line ends.
  const md = privacyMd.replace(/\r\n/g, "\n");
  // English, then Portuguese, then (optional) short parts in the other languages, split at "---" lines.
  const [enMd, ptMd, ...otherMd] = md.split(/\n---\n/);
  if (!enMd || !ptMd) throw new Error("src/privacy.md must hold the English and Portuguese texts separated by a --- line");
  pages.push(privacyPage(en, await marked.parse(enMd), await marked.parse(ptMd), await marked.parse(otherMd.join("\n"))), notFoundPage(en));

  for (const p of pages) write(p.path.endsWith(".html") ? p.path : `${p.path}index.html`, p.html);
  write("sitemap.xml", sitemap(pages));
  write("robots.txt", `User-agent: *\nAllow: /\nSitemap: ${SITE}sitemap.xml\n`);
  write("site.webmanifest", JSON.stringify({
    name: "Dawnbringer", short_name: "Dawnbringer", start_url: BASE, scope: BASE, display: "browser",
    background_color: "#0B0710", theme_color: "#0B0710",
    icons: [192, 512].map((s) => ({ src: `${BASE}assets/icons/icon-${s}.png`, sizes: `${s}x${s}`, type: "image/png" })),
  }, null, 2) + "\n");
  write(".nojekyll", "");

  const size = (p: string): number => statSync(p).isDirectory() ? readdirSync(p).reduce((n, f) => n + size(join(p, f)), 0) : statSync(p).size;
  console.log(`built ${pages.length} pages, assets ${(size(out("assets")) / 1e6).toFixed(2)} MB, press kit zip ${(zipBytes / 1e6).toFixed(2)} MB in ${Math.round(performance.now() - t0)} ms`);
  if (!existsSync(out("index.html"))) throw new Error("no index.html written");
  // Every language page translated (tools/i18n_check.ts): the build fails on English left in one.
  const check = Bun.spawnSync(["bun", join(import.meta.dir, "i18n_check.ts")], { stdout: "inherit", stderr: "inherit" });
  if (check.exitCode !== 0) throw new Error("i18n check failed: a language page shows English text (tools/i18n_check.ts)");
}

await main();
