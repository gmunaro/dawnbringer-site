// HTML of every page, as plain template strings. Every text comes from a locale's JSON and is
// escaped with esc(); every link starts with BASE so the site works under /dawnbringer-site/.
import { BASE, BETA, CONTACT, LISTEN, LOCALES, NEWS, SHOTS, SITE, SOCIALS, STORES, STUDIO, type Locale, type PixelFont } from "./config.ts";
import type en from "../src/locales/en.json";

/** The shape of a locale file (en.json is the reference; tools/check.ts checks the others). */
export type Strings = typeof en;

/** One built page: where it goes, relative to the site root ("" + "index.html" is the home). */
export interface Page {
  /** Path under the site root, e.g. "pt-br/presskit/". "" is the English home. */
  path: string;
  html: string;
}

/** What a page in one language needs besides its strings. */
export interface Ctx {
  loc: Locale;
  t: Strings;
  /** Press kit zip size, already formatted for the locale ("1.4 MB"). */
  zipSize: string;
  /** A size in bytes formatted for the locale ("139.5 MB"). */
  mb: (bytes: number) => string;
  /** True when src/releases.json lists a release: the changelog page exists and the footer links it. */
  changelog?: boolean;
  /** The demo downloads (the newest release in src/releases.json that has them); null drops the demo section. */
  demo?: Demo | null;
}

/** One release in src/releases.json, newest first (written by the game repo's tools/publish). */
export interface ReleaseEntry {
  version: string;
  /** YYYY-MM-DD */
  date: string;
  min_supported: string;
  /** Short notes per game language code (pt_BR, zh_CN...): the site code with "_" for "-". */
  notes: Record<string, string>;
  /** Per platform key (android, windows-demo...): the store or download page and, for the files
   * this site hosts, the GitHub Release asset and its size in bytes. */
  platforms: Record<string, { url: string; market?: string; file?: string; bytes?: number }>;
  /** The release's SHA256SUMS.txt asset, when it has desktop files. */
  checksums?: string;
}

type DemoOs = "windows" | "macos" | "linux";

/** The desktop demo of one release: a file per system with its size, and the checksums file. */
export interface Demo {
  version: string;
  files: Record<DemoOs, { url: string; bytes: number }>;
  checksums?: string;
}

/** The demo downloads of the newest release that has all three systems, or null when none has. */
export function demoOf(releases: ReleaseEntry[]): Demo | null {
  const file = (r: ReleaseEntry, os: DemoOs) => {
    const p = r.platforms[`${os}-demo`];
    return p?.file && p.bytes ? { url: p.file, bytes: p.bytes } : null;
  };
  for (const r of releases) {
    const windows = file(r, "windows"), macos = file(r, "macos"), linux = file(r, "linux");
    if (windows && macos && linux) return { version: r.version, files: { windows, macos, linux }, checksums: r.checksums };
  }
  return null;
}

/** A localized page of the site: the home, the press kit or the changelog. */
type PageId = "" | "presskit/" | "changelog/";

export function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

const asset = (p: string) => `${BASE}assets/${p}`;
const pathOf = (loc: Locale, page: PageId) => `${loc.dir}${page}`;

/** The heading font file of each pixel font family (tools/build.ts writes them). */
const FONT_FILE: Record<PixelFont, string> = {
  latin: "kenney-pixel.woff2", ja: "fusion-ja.woff2", ko: "fusion-ko.woff2", zh_hans: "fusion-zh_hans.woff2", zh_tw: "fusion-zh_tw.woff2",
};

/** <head> shared by every page. `alternates` lists the same page in every language (hreflang). */
function head(o: { lang: string; title: string; description: string; path: string; ogLocale: string; font?: PixelFont; alternates?: { loc: Locale; path: string }[]; noindex?: boolean }): string {
  const url = SITE + o.path;
  const alt = (o.alternates ?? [])
    .map((a) => `<link rel="alternate" hreflang="${a.loc.code}" href="${SITE + a.path}">`)
    .join("\n");
  const xDefault = o.alternates?.[0] ? `\n<link rel="alternate" hreflang="x-default" href="${SITE + o.alternates[0].path}">` : "";
  return `<!doctype html>
<html lang="${o.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(o.title)}</title>
<meta name="description" content="${esc(o.description)}">
${o.noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${url}">`}
${alt}${xDefault}
<meta name="theme-color" content="#0B0710">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Dawnbringer">
<meta property="og:title" content="${esc(o.title)}">
<meta property="og:description" content="${esc(o.description)}">
<meta property="og:url" content="${url}">
<meta property="og:locale" content="${o.ogLocale}">
<meta property="og:image" content="${SITE}assets/img/og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="${asset("icons/favicon.ico")}" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="${asset("icons/icon-32.png")}">
<link rel="apple-touch-icon" href="${asset("icons/apple-touch-icon.png")}">
<link rel="manifest" href="${BASE}site.webmanifest">
<link rel="preload" href="${asset(`fonts/${FONT_FILE[o.font ?? "latin"]}`)}" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="${asset("fonts/jacquarda-logo.woff2")}" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="${asset("site.css")}">
<script src="${asset("site.js")}" defer></script>
</head>`;
}

/** The og:image:alt is per language, so it goes after head() in each page. */
const ogAlt = (t: Strings) => `<meta property="og:image:alt" content="${esc(t.meta.ogAlt)}">`;

/** Top bar: logo link, section links (home only), press kit, language switcher. */
function topBar(c: Ctx, page: PageId): string {
  const { t, loc } = c;
  const home = BASE + pathOf(loc, "");
  const sections = page === ""
    ? [...(c.demo ? [["download", t.nav.demo]] : []), ...(BETA ? [["beta", t.nav.beta]] : []), ["game", t.nav.game], ["story", t.nav.story], ["screens", t.nav.screens], ["features", t.nav.features], ["platforms", t.nav.platforms]]
        .map(([id, label]) => `<li><a href="#${id}">${esc(label!)}</a></li>`).join("")
    : `<li><a href="${home}">${esc(t.nav.home)}</a></li>`;
  const press = `<li><a href="${BASE + pathOf(loc, "presskit/")}"${page === "presskit/" ? ' aria-current="page"' : ""}>${esc(t.nav.press)}</a></li>`;
  const langs = LOCALES.map((l) => {
    const cur = l.code === loc.code ? ' aria-current="true"' : "";
    return `<li><a href="${BASE + pathOf(l, page)}" hreflang="${l.code}" lang="${l.code}" data-lang="${l.code}"${cur}>${esc(l.name)}</a></li>`;
  }).join("");
  return `<a class="skip" href="#main">${esc(t.nav.skip)}</a>
<header class="top">
<a class="brand" href="${home}">Dawnbringer</a>
<nav class="sections"><ul>${sections}${press}</ul></nav>
<details class="lang">
<summary><span class="sr">${esc(t.nav.language)}: </span>${esc(loc.name)}</summary>
<ul>${langs}</ul>
</details>
</header>
<div class="suggest" id="suggest" hidden></div>`;
}

function footer(c: Ctx): string {
  const { t, loc } = c;
  return `<footer class="foot">
<ul>
<li><a href="${BASE}privacy.html">${esc(t.footer.privacy)}</a></li>
<li><a href="${BASE + pathOf(loc, "presskit/")}">${esc(t.nav.press)}</a></li>
${c.changelog ? `<li><a href="${BASE + pathOf(loc, "changelog/")}">${esc(t.footer.changelog)}</a></li>\n` : ""}<li>${esc(t.footer.contact)}: <a href="mailto:${CONTACT}">${CONTACT}</a></li>
</ul>
<p>${esc(t.footer.bugs)} <a href="mailto:${CONTACT}">${CONTACT}</a></p>
${socialList()}
<p>${esc(t.footer.madeBy)} © 2026 gmunaro.</p>
<p>${esc(t.footer.studio)} <a href="${STUDIO.url}" rel="me noopener">${STUDIO.name}</a></p>
</footer>`;
}

/** The game's social accounts (config SOCIALS) as a list of links; "" while there is none. */
function socialList(): string {
  if (!SOCIALS.length) return "";
  return `<ul class="socials">\n${SOCIALS.map((s) => `<li><a href="${s.url}" rel="me noopener">${esc(s.name)}</a></li>`).join("\n")}\n</ul>`;
}

/** A store button: a link when the store page is live, a greyed-out label otherwise. */
function store(t: Strings, s: (typeof STORES)[number]): string {
  const name = esc(t.stores[s.id]);
  if (s.url) return `<a class="btn store" href="${esc(s.url)}" rel="noopener">${name}</a>`;
  const soon = esc(s.id === "steam" ? t.stores.wishlistSoon : t.stores.comingSoon);
  return `<span class="btn store soon">${name}<small>${soon}</small></span>`;
}

/** The closed beta: group membership, test opt-in, then the Play Store installation. */
function betaSection(t: Strings, beta: NonNullable<typeof BETA>): string {
  const step = (n: number, text: string, label: string, url: string) =>
    `<li class="card"><h3>${n}</h3><p>${esc(text)}</p><a class="btn" href="${esc(url)}" rel="noopener">${esc(label)}</a></li>`;
  return `<section id="beta" class="wrap" aria-labelledby="beta-title">
<h2 id="beta-title">${esc(t.beta.title)}</h2>
<p class="lead">${esc(t.beta.intro)}</p>
<aside class="panel beta-payment" aria-label="${esc(t.beta.paymentTitle)}">
<p><strong>${esc(t.beta.paymentNoticeTitle)}</strong></p>
<p>${esc(t.beta.paymentNoticeText)}</p>
</aside>
<ol class="cards steps">
${step(1, t.beta.step1, t.beta.step1Link, beta.group)}
${step(2, t.beta.step2, t.beta.step2Link, beta.test)}
${step(3, t.beta.step3, t.beta.step3Link, beta.install)}
</ol>
<p>${esc(t.beta.note)}</p>
<figure class="beta-proof">
<a href="${asset("img/beta-test-card.png")}"><img src="${asset("img/beta-test-card.png")}" width="1080" height="1408" loading="lazy" alt="${esc(t.beta.testCardCaption)}"></a>
<figcaption>${esc(t.beta.testCardCaption)}</figcaption>
</figure>
<div class="beta-help">
<h3>${esc(t.beta.helpTitle)}</h3>
<p>${esc(t.beta.accountHelp)}</p>
<details>
<summary>${esc(t.beta.priceTitle)}</summary>
<p>${esc(t.beta.priceHelp)}</p>
<div class="beta-shots">
<figure><img src="${asset("img/beta-store.png?v=2")}" width="1129" height="753" loading="lazy" alt="${esc(t.beta.storeCaption)}"><figcaption>${esc(t.beta.storeCaption)}</figcaption></figure>
<figure><img src="${asset("img/beta-install.png?v=2")}" width="1035" height="1037" loading="lazy" alt="${esc(t.beta.installCaption)}"><figcaption>${esc(t.beta.installCaption)}</figcaption></figure>
</div>
</details>
<details><summary>${esc(t.beta.paymentTitle)}</summary><p>${esc(t.beta.paymentHelp)}</p></details>
<details><summary>${esc(t.beta.unavailableTitle)}</summary><p>${esc(t.beta.unavailableHelp)} <a href="mailto:${CONTACT}">${CONTACT}</a></p></details>
</div>
</section>`;
}

/** The desktop demo: what it holds, a download per system (with its size) and how to open each. */
function demoSection(c: Ctx, demo: Demo): string {
  const { t } = c;
  const card = (os: DemoOs, name: string, notes: string[], type: string) => {
    const f = demo.files[os];
    return `<li class="card"><h3>${esc(name)}</h3>${notes.map((n) => `<p>${esc(n)}</p>`).join("")}<a class="btn" href="${esc(f.url)}" download>${esc(t.demo.download.replace("{size}", c.mb(f.bytes)))}<small>${type}</small></a></li>`;
  };
  const androidLink = BETA ? ` <a href="#beta">${esc(t.demo.androidLink)}</a>` : "";
  return `<section id="download" class="wrap" aria-labelledby="demo-title">
<h2 id="demo-title">${esc(t.demo.title)}</h2>
<p class="lead">${esc(t.demo.intro)} ${esc(t.demo.version.replace("{version}", demo.version))}</p>
<h3>${esc(t.demo.includesTitle)}</h3>
<ul class="features panel demo-includes">
${t.demo.includes.map((x) => `<li>${esc(x)}</li>`).join("\n")}
</ul>
<ul class="cards platforms demo-downloads">
${card("windows", t.demo.windows, [t.demo.windowsNote], ".exe")}
${card("macos", t.demo.macos, [t.demo.macosNote, t.demo.macosOpen], ".zip")}
${card("linux", t.demo.linux, [t.demo.linuxNote], ".tar.gz")}
</ul>
${demo.checksums ? `<p class="demo-sums"><a href="${esc(demo.checksums)}">${esc(t.demo.checksums)}</a></p>\n` : ""}<p>${esc(t.demo.android)}${androidLink}</p>
<p>${esc(t.demo.ios)}</p>
</section>`;
}

const alternates = (page: PageId) => LOCALES.map((l) => ({ loc: l, path: pathOf(l, page) }));

/** The three audio samples of "Listen": a player per LISTEN id, each in ogg and mp3. */
function listenBar(t: Strings): string {
  const row = (k: (typeof LISTEN)[number]) => `<li><span>${esc(t.listen[k])}</span>
<audio controls preload="none" aria-label="${esc(t.listen[k])}">
<source src="${asset(`audio/${k}.ogg`)}" type="audio/ogg">
<source src="${asset(`audio/${k}.mp3`)}" type="audio/mpeg">
${esc(t.listen.fallback)}
</audio></li>`;
  return `<ul class="listen" aria-label="${esc(t.listen.title)}">
${LISTEN.map(row).join("\n")}
</ul>`;
}

/** "New in 0.5": a picture and text per system; the voices item also carries the Listen samples. */
function newsSection(t: Strings): string {
  const items = NEWS.map((id) => {
    const s = t.news.items[id];
    const listen = id === "voices" ? listenBar(t) : "";
    return `<li class="news-item"><img src="${asset(`news/${id}.webp`)}" width="640" height="360" loading="lazy" decoding="async" alt="${esc(s.alt)}"><div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p>${listen}</div></li>`;
  }).join("\n");
  return `<section id="new" class="wrap news" aria-labelledby="new-title">
<h2 id="new-title">${esc(t.news.title)}</h2>
<p class="lead">${esc(t.news.intro)}</p>
<ul class="news-list">
${items}
</ul>
</section>`;
}

export function homePage(c: Ctx): Page {
  const { t, loc } = c;
  const path = pathOf(loc, "");
  const points = t.about.points
    .map((p) => `<li class="card"><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p></li>`).join("\n");
  const shots = SHOTS.map((id, i) => {
    const s = t.screens.items[id];
    const full = `${BASE}presskit/files/screenshots/${String(i + 1).padStart(2, "0")}_${id}.png`;
    return `<figure class="shot"><a href="${full}" title="${esc(t.screens.open)}"><img src="${asset(`shots/${id}.webp`)}" width="640" height="360" loading="lazy" decoding="async" alt="${esc(s.alt)}"></a><figcaption>${esc(s.caption)}</figcaption></figure>`;
  }).join("\n");
  const plat = (name: string, note: string, id: (typeof STORES)[number]["id"]) =>
    `<li class="card"><h3>${esc(name)}</h3><p>${esc(note)}</p>${store(t, STORES.find((s) => s.id === id)!)}</li>`;
  const html = `${head({ lang: loc.code, title: t.meta.title, description: t.meta.description, path, ogLocale: loc.og, font: loc.font, alternates: alternates("") })}
${ogAlt(t)}
<body data-page="">
${topBar(c, "")}
<main id="main">
<section class="hero">
<picture class="hero-art">
<source media="(min-width: 1280px)" srcset="${asset("img/hero-3x.webp")}" width="1920" height="1080">
<source media="(min-width: 720px)" srcset="${asset("img/hero-2x.webp")}" width="1280" height="720">
<img src="${asset("img/hero-narrow.webp")}" width="432" height="320" alt="${esc(t.hero.artAlt)}" fetchpriority="high">
</picture>
<div class="hero-text">
<h1 class="logo">Dawnbringer</h1>
<p class="tagline">${esc(t.hero.tagline)}</p>
<p class="pitch">${esc(t.hero.pitch)}</p>
<h2 class="sr">${esc(t.stores.title)}</h2>
<ul class="stores">${c.demo ? `<li><a class="btn store" href="#download">${esc(t.demo.title)}<small>Windows · macOS · Linux</small></a></li>` : ""}${BETA ? `<li><a class="btn store" href="#beta">${esc(t.beta.title)}<small>Android</small></a></li>` : ""}${STORES.map((s) => `<li>${store(t, s)}</li>`).join("")}</ul>
</div>
</section>
<section class="clip wrap" aria-labelledby="clip-title">
<h2 id="clip-title" class="sr">${esc(t.hero.clipTitle)}</h2>
<div class="panel video">
<video controls muted loop playsinline preload="none" width="1280" height="720" poster="${asset("video/clip-poster.webp")}" aria-label="${esc(t.hero.clipAlt)}">
<source src="${asset("video/clip.webm")}" type="video/webm">
<source src="${asset("video/clip.mp4")}" type="video/mp4">
${esc(t.hero.clipFallback)}
</video>
</div>
</section>
${newsSection(t)}
${c.demo ? demoSection(c, c.demo) : ""}
${BETA ? betaSection(t, BETA) : ""}
<section id="game" class="wrap">
<h2>${esc(t.about.title)}</h2>
<p class="lead">${esc(t.about.intro)}</p>
<ul class="cards">
${points}
</ul>
</section>
<section id="story" class="wrap story">
<h2>${esc(t.story.title)}</h2>
${t.story.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("\n")}
<p class="question">${esc(t.story.question)}</p>
</section>
<section id="screens" class="wrap">
<h2>${esc(t.screens.title)}</h2>
<div class="gallery">
${shots}
</div>
</section>
<section id="features" class="wrap">
<h2>${esc(t.features.title)}</h2>
<ul class="features panel">
${t.features.items.map((f) => `<li>${esc(f)}</li>`).join("\n")}
</ul>
</section>
<section id="platforms" class="wrap">
<h2>${esc(t.platforms.title)}</h2>
<p class="lead">${esc(t.platforms.intro)}</p>
<ul class="cards platforms">
${plat(t.platforms.pc, t.platforms.pcNote, "steam")}
${plat(t.platforms.android, t.platforms.androidNote, "googlePlay")}
${plat(t.platforms.ios, t.platforms.iosNote, "appStore")}
</ul>
</section>
</main>
${footer(c)}
</body>
</html>
`;
  return { path, html };
}

/** Files of the press kit, in src/presskit and served from presskit/files/. */
export const PRESS_FILES = {
  logo: "dawnbringer-logo.png",
  icon: "dawnbringer-icon-512.png",
  keyart: "dawnbringer-keyart-1920x1080.png",
  keyartNoLogo: "dawnbringer-keyart-1920x1080-nologo.png",
} as const;
export const ZIP_NAME = "dawnbringer-presskit.zip";

export function pressPage(c: Ctx): Page {
  const { t, loc } = c;
  const path = pathOf(loc, "presskit/");
  const files = `${BASE}presskit/files/`;
  const row = (k: string, v: string) => `<tr><th scope="row">${esc(k)}</th><td>${v}</td></tr>`;
  const facts = [
    row(t.press.developer, esc(t.press.developerValue)),
    row(t.press.release, esc(t.press.releaseValue)),
    row(t.press.platforms, esc(t.press.platformsValue)),
    row(t.press.price, esc(t.press.priceValue)),
    row(t.press.languages, esc(t.press.languagesValue)),
    row(t.press.engine, "Godot 4.5"),
    row(t.press.website, `<a href="${SITE + path.replace("presskit/", "")}">${SITE.replace("https://", "")}</a>`),
    row(t.press.contact, `<a href="mailto:${CONTACT}">${CONTACT}</a>`),
    ...(SOCIALS.length ? [row(t.press.social, SOCIALS.map((s) => `<a href="${s.url}" rel="me noopener">${esc(s.name)}</a>`).join(" · "))] : []),
  ].join("\n");
  const dl = (key: keyof typeof PRESS_FILES, label: string) => `<li><a href="${files}${PRESS_FILES[key]}" download>${esc(label)}</a></li>`;
  const thumbs = SHOTS.map((id, i) => {
    const s = t.screens.items[id];
    return `<li><a href="${files}screenshots/${String(i + 1).padStart(2, "0")}_${id}.png" download><img src="${asset(`shots/${id}.webp`)}" width="320" height="180" loading="lazy" decoding="async" alt="${esc(s.alt)}"></a></li>`;
  }).join("\n");
  const html = `${head({ lang: loc.code, title: t.meta.pressTitle, description: t.meta.pressDescription, path, ogLocale: loc.og, font: loc.font, alternates: alternates("presskit/") })}
${ogAlt(t)}
<body data-page="presskit/">
${topBar(c, "presskit/")}
<main id="main" class="press">
<div class="wrap">
<h1>${esc(t.press.title)}</h1>
<p class="lead">${esc(t.press.intro)}</p>
<p><a class="btn" href="${BASE}presskit/${ZIP_NAME}" download>${esc(t.press.zip.replace("{size}", c.zipSize))}</a></p>
</div>
<section class="wrap" aria-labelledby="facts">
<h2 id="facts">${esc(t.press.factsTitle)}</h2>
<table class="facts panel"><tbody>
${facts}
</tbody></table>
</section>
<section class="wrap" aria-labelledby="desc">
<h2 id="desc">${esc(t.press.descriptionTitle)}</h2>
<p>${esc(t.press.description)}</p>
<h3>${esc(t.features.title)}</h3>
<ul class="features panel">
${t.features.items.map((f) => `<li>${esc(f)}</li>`).join("\n")}
</ul>
</section>
<section class="wrap" aria-labelledby="media">
<h2 id="media">${esc(t.press.mediaTitle)}</h2>
<ul class="downloads">
${dl("logo", t.press.logo)}
${dl("icon", t.press.icon)}
${dl("keyart", t.press.keyart)}
${dl("keyartNoLogo", t.press.keyartNoLogo)}
</ul>
<p>${esc(t.press.screensNote)}</p>
<ul class="thumbs">
${thumbs}
</ul>
</section>
<section class="wrap" aria-labelledby="credits">
<h2 id="credits">${esc(t.press.creditsTitle)}</h2>
<ul>
${t.press.credits.map((x) => `<li>${esc(x)}</li>`).join("\n")}
</ul>
</section>
<section class="wrap" aria-labelledby="contact">
<h2 id="contact">${esc(t.press.contactTitle)}</h2>
<p>${esc(t.press.contactText)} <a href="mailto:${CONTACT}">${CONTACT}</a></p>
</section>
</main>
${footer(c)}
</body>
</html>
`;
  return { path, html };
}

/** System names of the platform keys in releases.json ("-demo" stripped first). */
const SYSTEM: Record<string, string> = { android: "Android", ios: "iOS", windows: "Windows", macos: "macOS", linux: "Linux" };

/** Every release with its notes in the page's language (English when a language has none). */
export function changelogPage(c: Ctx, releases: ReleaseEntry[]): Page {
  const { t, loc } = c;
  const path = pathOf(loc, "changelog/");
  const date = new Intl.DateTimeFormat(loc.code, { dateStyle: "long", timeZone: "UTC" });
  const items = releases.map((r) => {
    const text = r.notes[loc.code.replace("-", "_")] ?? r.notes.en ?? "";
    const lines = text.split("\n").map((l) => l.replace(/^\s*[-*]\s*/, "").trim()).filter(Boolean);
    // Where this version came out (a demo-only release is not on Android): system names, deduped.
    const systems = [...new Set(Object.keys(r.platforms).map((k) => SYSTEM[k.replace(/-demo$/, "")] ?? k))].join(" · ");
    return `<article class="panel release" id="v${esc(r.version)}">
<h2>Dawnbringer ${esc(r.version)}</h2>
<p><time datetime="${esc(r.date)}">${esc(date.format(new Date(`${r.date}T00:00:00Z`)))}</time> · ${esc(systems)}</p>
<ul>
${lines.map((l) => `<li>${esc(l)}</li>`).join("\n")}
</ul>
</article>`;
  }).join("\n");
  const html = `${head({ lang: loc.code, title: `${t.changelog.title} · Dawnbringer`, description: t.changelog.description, path, ogLocale: loc.og, font: loc.font, alternates: alternates("changelog/") })}
${ogAlt(t)}
<body data-page="changelog/">
${topBar(c, "changelog/")}
<main id="main" class="wrap prose changelog">
<h1>${esc(t.changelog.title)}</h1>
<p class="lead">${esc(t.changelog.description)}</p>
${items}
</main>
${footer(c)}
</body>
</html>
`;
  return { path, html };
}

/**
 * The privacy policy (src/privacy.md, English then Portuguese, split at the first "---"), at the
 * URL the Google Play listing points to: privacy.html.
 */
export function privacyPage(c: Ctx, enHtml: string, ptHtml: string): Page {
  const { t } = c;
  const html = `${head({ lang: "en", title: "Dawnbringer · Privacy Policy / Política de Privacidade", description: "Privacy policy of the game Dawnbringer. Política de privacidade do jogo Dawnbringer.", path: "privacy.html", ogLocale: "en_US" })}
<body data-page="privacy">
<a class="skip" href="#main">${esc(t.nav.skip)}</a>
<header class="top"><a class="brand" href="${BASE}">Dawnbringer</a></header>
<main id="main" class="wrap prose">
<article>
${enHtml}
</article>
<hr>
<article lang="pt-BR">
${ptHtml}
</article>
</main>
${footer(c)}
</body>
</html>
`;
  return { path: "privacy.html", html };
}

/** GitHub Pages serves 404.html for any missing path; links are absolute, so it works at any depth. */
export function notFoundPage(c: Ctx): Page {
  const { t } = c;
  const html = `${head({ lang: "en", title: `${t.meta.notFoundTitle} · Dawnbringer`, description: t.notFound.text, path: "404.html", ogLocale: "en_US", noindex: true })}
<body data-page="404">
<a class="skip" href="#main">${esc(t.nav.skip)}</a>
<header class="top"><a class="brand" href="${BASE}">Dawnbringer</a></header>
<main id="main" class="wrap prose">
<h1>${esc(t.meta.notFoundTitle)}</h1>
<p>${esc(t.notFound.text)}</p>
<p><a class="btn" href="${BASE}">${esc(t.notFound.back)}</a></p>
<ul class="langs">${LOCALES.map((l) => `<li><a href="${BASE + l.dir}" hreflang="${l.code}" lang="${l.code}">${esc(l.name)}</a></li>`).join("")}</ul>
</main>
${footer(c)}
</body>
</html>
`;
  return { path: "404.html", html };
}
