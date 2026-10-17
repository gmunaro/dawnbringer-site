// Site-wide settings: where the site lives, its languages, its store links and its gallery.
// Edit STORES when a store page goes live; everything else follows.

/** Public URL of the site (GitHub Pages project site) and the path every link starts with. */
export const SITE = "https://gmunaro.github.io/dawnbringer-site/";
export const BASE = "/dawnbringer-site/";
export const CONTACT = "midiamunaro@gmail.com";

/** Which pixel font sets the headings: Kenney Pixel (Latin and Cyrillic) or a Fusion Pixel variant. */
export type PixelFont = "latin" | "ja" | "ko" | "zh_hans" | "zh_tw";

export interface Locale {
  /** File name in src/locales and the html lang / hreflang value. */
  code: string;
  /** Output folder ("" is the site root). */
  dir: string;
  /** The language's own name, for the switcher. */
  name: string;
  /** Open Graph locale. */
  og: string;
  font: PixelFont;
}

/** The game's 14 UI languages, in the game's order. English is the default (site root, x-default). */
export const LOCALES: Locale[] = [
  { code: "en", dir: "", name: "English", og: "en_US", font: "latin" },
  { code: "pt-BR", dir: "pt-br/", name: "Português (Brasil)", og: "pt_BR", font: "latin" },
  { code: "es", dir: "es/", name: "Español", og: "es_ES", font: "latin" },
  { code: "fr", dir: "fr/", name: "Français", og: "fr_FR", font: "latin" },
  { code: "de", dir: "de/", name: "Deutsch", og: "de_DE", font: "latin" },
  { code: "it", dir: "it/", name: "Italiano", og: "it_IT", font: "latin" },
  { code: "ru", dir: "ru/", name: "Русский", og: "ru_RU", font: "latin" },
  { code: "uk", dir: "uk/", name: "Українська", og: "uk_UA", font: "latin" },
  { code: "pl", dir: "pl/", name: "Polski", og: "pl_PL", font: "latin" },
  { code: "tr", dir: "tr/", name: "Türkçe", og: "tr_TR", font: "latin" },
  { code: "ja", dir: "ja/", name: "日本語", og: "ja_JP", font: "ja" },
  { code: "ko", dir: "ko/", name: "한국어", og: "ko_KR", font: "ko" },
  { code: "zh-CN", dir: "zh-cn/", name: "简体中文", og: "zh_CN", font: "zh_hans" },
  { code: "zh-TW", dir: "zh-tw/", name: "繁體中文", og: "zh_TW", font: "zh_tw" },
];

/**
 * Store buttons. `url: null` shows the button greyed out with "coming soon" (Steam: "wishlist
 * soon"); a url makes it a real link. Steam: set the store page URL once the app id exists.
 */
export const STORES: { id: "steam" | "googlePlay" | "appStore"; url: string | null }[] = [
  { id: "steam", url: null },
  // The listing is not public yet: https://play.google.com/store/apps/details?id=com.gmunaro.dawnbringer
  { id: "googlePlay", url: null },
  { id: "appStore", url: null },
];

/**
 * Closed beta on Google Play: testers join the Google Group, then opt in on the test page. Set to
 * null when the beta closes and the home page drops its beta section and button.
 */
export const BETA: { group: string; test: string; install: string } | null = {
  group: "https://groups.google.com/g/dawnbringer-testers",
  test: "https://play.google.com/apps/testing/com.gmunaro.dawnbringer",
  install: "https://play.google.com/store/apps/details?id=com.gmunaro.dawnbringer",
};

/**
 * The desktop demo, downloaded from the GitHub Release `demo-v<version>` of this repository (Pages
 * cannot hold files over 100 MB). `bytes` is each asset's exact size, shown on its button; update
 * both when a new demo is released (the game repo's tools/release/package_demo.sh writes the files).
 * Set to null to drop the demo section.
 */
export const DEMO: { version: string; files: Record<"windows" | "macos" | "linux", { name: string; bytes: number }> } | null = {
  version: "0.3.0",
  files: {
    windows: { name: "DawnbringerDemo-0.3.0-windows.exe", bytes: 151483104 },
    macos: { name: "DawnbringerDemo-0.3.0-macos.zip", bytes: 108912131 },
    linux: { name: "DawnbringerDemo-0.3.0-linux-x86_64.tar.gz", bytes: 72503752 },
  },
};
/** Where a demo file is downloaded from. */
export const demoUrl = (version: string, file: string) =>
  `https://github.com/gmunaro/dawnbringer-site/releases/download/demo-v${version}/${file}`;

/**
 * Gallery, in order. `id` names src/assets/shots/<id>.webp (640x360) and the locale's
 * screens.items.<id> caption and alt text; the press kit holds the same picture at 1920x1080 as
 * src/presskit/screenshots/<NN>_<id>.png (NN = position, from 01). tools/media.sh writes both.
 */
export const SHOTS = ["night", "landlord", "battle", "forecast", "risen", "legend", "shop", "camp", "group", "cashout", "build", "event"] as const;
export type ShotId = (typeof SHOTS)[number];
