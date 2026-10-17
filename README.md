# Dawnbringer website

Static site for the game Dawnbringer, published by GitHub Pages from the root of `main` at
https://gmunaro.github.io/dawnbringer-site/. The HTML at the root is generated: edit `src/` and
`tools/`, then rebuild and commit both.

## Rebuild

```bash
bun install
bun run build      # writes index.html, <lang>/, presskit/, privacy.html, 404.html, assets/, sitemap.xml...
bun run serve      # http://localhost:4173/dawnbringer-site/ (prints its pid)
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
| `tools/config.ts` | Base URL, languages, store links, gallery order. |
| `tools/pages.ts`, `tools/build.ts` | Page templates and the build. |
| `tools/capture.sh`, `tools/media.sh`, `tools/godot/` | How the pictures were made (see below). |

## Store links

Edit `STORES` in `tools/config.ts`: a `url` turns the greyed-out "coming soon" button into a link.
Steam needs the store page URL once the app id exists; Google Play's listing URL is in a comment
there.

## Releases, changelog and demo downloads

`src/releases.json` lists every release, newest first, and `latest.json` at the root is the feed
the game reads to tell players a new version is out. Both are written by the game repo's release
tool (`bash tools/publish/release.sh <version>`, see `docs/RELEASE.md` there), which also creates
the GitHub Release `demo-v<version>` of this repository with the demo files (Pages cannot hold
files over 100 MB), rebuilds and pushes. Do not edit them by hand.

The build turns `src/releases.json` into:

- the changelog page in every language (`changelog/`, linked from the footer), each release with
  its notes in the page's language, or English when a language has none;
- the "Download the demo" section (`#download`): its buttons point to the files of the newest
  release that has the Windows, macOS and Linux demos (`platforms.<os>-demo.file`, with the size
  from `bytes`) and to its `checksums` file. No such release, no section.

## Pictures and video

Only needed when the game's look changes. On a throwaway copy of the game (never the working
checkout):

1. `tools/capture.sh <copy>/game <captures dir>` records the screens with the game's capture scenes.
2. Copy `tools/godot/*.gd` into the copy (e.g. `res://tools/site/`) and run
   `$G --path <copy>/game -s res://tools/site/render_site_art.gd -- --out=<art dir>` for the key art
   (the game's store art painter with a blood moon).
3. `tools/media.sh <captures dir> <art dir> <game repo>` writes `src/assets` and `src/presskit`
   (needs ffmpeg).
