// HTML of every page, as plain template strings. Every text comes from a locale's JSON and is
// escaped with esc(); every link starts with BASE so the site works under /dawnbringer-site/.
import { BASE, CONTACT, LOCALES, SHOTS, SITE, STORES, type Locale, type PixelFont } from "./config.ts";
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
}

export function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

const asset = (p: string) => `${BASE}assets/${p}`;
const pathOf = (loc: Locale, page: "" | "presskit/") => `${loc.dir}${page}`;

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
function topBar(c: Ctx, page: "" | "presskit/"): string {
  const { t, loc } = c;
  const home = BASE + pathOf(loc, "");
  const sections = page === ""
    ? [["game", t.nav.game], ["story", t.nav.story], ["screens", t.nav.screens], ["features", t.nav.features], ["platforms", t.nav.platforms]]
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
<li>${esc(t.footer.contact)}: <a href="mailto:${CONTACT}">${CONTACT}</a></li>
</ul>
<p>${esc(t.footer.bugs)} <a href="mailto:${CONTACT}">${CONTACT}</a></p>
<p>${esc(t.footer.madeBy)} © 2026 gmunaro.</p>
</footer>`;
}

/** A store button: a link when the store page is live, a greyed-out label otherwise. */
function store(t: Strings, s: (typeof STORES)[number]): string {
  const name = esc(t.stores[s.id]);
  if (s.url) return `<a class="btn store" href="${esc(s.url)}" rel="noopener">${name}</a>`;
  const soon = esc(s.id === "steam" ? t.stores.wishlistSoon : t.stores.comingSoon);
  return `<span class="btn store soon">${name}<small>${soon}</small></span>`;
}

const alternates = (page: "" | "presskit/") => LOCALES.map((l) => ({ loc: l, path: pathOf(l, page) }));

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
<ul class="stores">${STORES.map((s) => `<li>${store(t, s)}</li>`).join("")}</ul>
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

/**
 * The privacy policy (src/privacy.md, English then Portuguese, split at the first "---"), at the
 * URL the Google Play listing points to: privacy.html.
 */
export function privacyPage(c: Ctx, enHtml: string, ptHtml: string): Page {
  const { t } = c;
  const html = `${head({ lang: "en", title: "Dawnbringer — Privacy Policy / Política de Privacidade", description: "Privacy policy of the game Dawnbringer. Política de privacidade do jogo Dawnbringer.", path: "privacy.html", ogLocale: "en_US" })}
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
