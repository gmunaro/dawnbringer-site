# Dawnbringer website

Static site for the game Dawnbringer, published by GitHub Pages from the root of `main` at
https://dawnbringergame.com/ (custom domain in `CNAME`; the old gmunaro.github.io/dawnbringer-site/ address redirects there). The HTML at the root is generated: edit `src/` and
`tools/`, then rebuild and commit both.

## Rebuild

```bash
bun install
bun run build      # writes index.html, <lang>/, beta/, download/, presskit/, changelog/, privacy.html, 404.html, assets/...; fails if a language page shows English (tools/i18n_check.ts)
bun run serve      # http://localhost:4173/ (prints its pid)
bun run check      # in another shell: locale keys, page metadata, every internal link answers 200
bun run typecheck
```

`.nojekyll` turns Jekyll off, so Pages serves the files as they are.

## Where things are

| Path | What |
|---|---|
| `src/locales/<lang>.json` | All page text, one file per language (`en.json` is the reference). Game terms follow the game's catalogs (`game/i18n` in the game repo). |
| `src/privacy.md` | Privacy policy (English, `---`, Portuguese), published as `privacy.html` (the Google Play listing links to it). |
| `src/site.css`, `src/site.js` | Style and the small script (language suggestion, language menu, clip playback). |
| `src/assets/` | Pictures, video, icons and the game's 9-slice frames, copied as they are. |
| `src/fonts/` | Source pixel fonts and their licences; the build cuts them down to the glyphs each page uses. |
| `src/presskit/` | Press kit files (logo, icon, key art, 1920x1080 screenshots), zipped by the build. |
| `src/releases.json`, `latest.json` | Every release and the game's update feed, written by the game repo's release tool (see below). |
| `tools/config.ts` | Base URL, contact e-mail, social links, languages, the home page's three pictures (`WHY`), the press kit screenshots (`SHOTS`). |
| `tools/i18n_check.ts`, `tools/i18n_allow.json` | The translation check the build runs: a language page fails if it shows a text segment identical to the English page, unless the segment is a proper name (`allow`) or a word that language spells the same (`same`, per language). |
| `tools/pages.ts`, `tools/build.ts` | Page templates and the build. |
| `tools/media.sh` | Key art and icons into the site's pictures (see below). |

## Home page

Five blocks, about 260 words in English: what the game is (one line, the clip, the Android alpha and desktop
demo buttons), what makes it different (three pictures, `WHY`), what the version adds (`whatsnew`, linked to
the changelog), press and community, the footer. The alpha's steps and the demo downloads have their own
pages (`beta/`, `download/`). Keep new text short and in every language: `bun run build` fails otherwise.

## Social links

Add a line to `SOCIALS` in `tools/config.ts` (the home page, the footer and the press kit read it). Only an
account marked `ok` with a link in the brand's `contas.md` goes there.

## Releases, changelog and demo downloads

`src/releases.json` lists every release, newest first, and `latest.json` at the root is the feed
the game reads to tell players a new version is out. Both are written by the game repo's release
tool (`bash tools/publish/release.sh <version>`, see `docs/RELEASE.md` there), which also creates
the GitHub Release `demo-v<version>` of this repository with the demo files (Pages cannot hold
files over 100 MB), rebuilds and pushes. Do not edit them by hand.

The build turns `src/releases.json` into:

- the changelog page in every language (`changelog/`, linked from the footer), each release with
  its notes in the page's language, or English when a language has none;
- the demo page (`download/`): its buttons point to the files of the newest
  release that has the Windows, macOS and Linux demos (`platforms.<os>-demo.file`, with the size
  from `bytes`) and to its `checksums` file. No such release, no section.

## Pictures and video

Only needed when the game's look changes. The pictures come from the game repo:

1. Screenshots, the gallery, the press kit's screenshots and the gameplay clip:
   `python tools/github/media/make_media.py <lab run out dir> --site <this checkout> --only site` on a lab
   capture (`game/tools/capture/promo05/lab_media.sh`, `ART=svg`; `tools/github/LAUNCH.md` there).
2. Key art: `$G --path game res://tools/capture/promo05/site_key_art.tscn -- --out=<art dir>` draws it
   with the game's SVG characters (needs a window), then here `tools/media.sh <art dir> <game repo>`
   writes `src/assets/img`, the icons and the press kit's key art (needs ffmpeg).
