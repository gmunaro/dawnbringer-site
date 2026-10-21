// Checks the built pages for text a language page shows in English: every visible text segment (text
// between tags, alt, title, aria-label) of a language's page that is identical to a segment of the
// English page fails, unless it is a proper name or carries no words (tools/i18n_allow.json).
// Also prints the word count of each English page's <main>, the number the home page is kept under.
//   bun tools/i18n_check.ts            exit 1 on any untranslated segment (bun run build runs it)
//   bun tools/i18n_check.ts --report   the same, but never fails (before/after measurements)
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { LOCALES } from "./config.ts";

const ROOT = join(import.meta.dir, "..");
/** Pages built once per language, by their path under a language folder. */
const PAGES = ["index.html", "presskit/index.html", "changelog/index.html", "beta/index.html", "download/index.html"];
const LISTS: { allow: string[]; same: Record<string, string[]> } = JSON.parse(readFileSync(join(import.meta.dir, "i18n_allow.json"), "utf-8"));

function decode(s: string): string {
  return s.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)));
}

/** Visible text segments of a page: text between tags and alt/title/aria-label values, scripts and styles left out. */
export function segments(html: string): string[] {
  const body = html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<head[\s\S]*?<\/head>/i, "");
  const out: string[] = [];
  for (const m of body.matchAll(/\s(?:alt|title|aria-label)="([^"]*)"/g)) out.push(m[1] ?? "");
  for (const t of body.replace(/<[^>]+>/g, "\n").split("\n")) out.push(t);
  return out.map((s) => decode(s).replace(/\s+/g, " ").trim()).filter((s) => /\p{L}/u.test(s));
}

/** True when a segment needs no translation: a listed proper name, only names, digits and signs, or a
 * word that language spells as English does (the per-language "same" list, e.g. "Contact" in French). */
function allowed(seg: string, code: string): boolean {
  // A "same" entry may hold {placeholders} (e.g. "Version {version}."): they match any text.
  const sameAs = (entry: string) => {
    const parts = entry.split(/\{\w+\}/).map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const re = new RegExp(`^${parts.join(".+")}$`);
    // Trailing punctuation the template adds ("Contact:") does not count.
    return re.test(seg) || re.test(seg.replace(/[\s:;,.!?]+$/u, ""));
  };
  if ((LISTS.same[code] ?? []).some(sameAs)) return true;
  let rest = seg;
  for (const name of [...LISTS.allow].sort((a, b) => b.length - a.length)) rest = rest.split(name).join(" ");
  return !/\p{L}{2,}/u.test(rest);
}

function words(html: string): number {
  const main = html.match(/<main[\s\S]*?<\/main>/i)?.[0] ?? "";
  return segments(main).join(" ").split(/\s+/).filter((w) => /\p{L}/u.test(w)).length;
}

const report = process.argv.includes("--report");
let bad = 0;
for (const page of PAGES) {
  const enPath = join(ROOT, page);
  if (!existsSync(enPath)) continue;
  const enHtml = readFileSync(enPath, "utf-8");
  const en = new Set(segments(enHtml));
  console.log(`${page}: ${words(enHtml)} words in <main> (en)`);
  for (const loc of LOCALES.slice(1)) {
    const p = join(ROOT, loc.dir, page);
    if (!existsSync(p)) continue;
    const same = [...new Set(segments(readFileSync(p, "utf-8")).filter((s) => en.has(s) && !allowed(s, loc.code)))];
    if (same.length) {
      bad += same.length;
      console.log(`  ${loc.code}: ${same.length} segment(s) still in English: ${same.slice(0, 3).map((s) => JSON.stringify(s.slice(0, 60))).join(", ")}${same.length > 3 ? ", ..." : ""}`);
    }
  }
}
console.log(bad ? `i18n: ${bad} untranslated segment(s)` : "i18n: every language page is translated");
if (bad && !report) process.exit(1);
