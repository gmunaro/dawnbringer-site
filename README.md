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
| `tools/config.ts` | Base URL, languages, store links, gallery order. |
| `tools/pages.ts`, `tools/build.ts` | Page templates and the build. |
| `tools/capture.sh`, `tools/media.sh`, `tools/godot/` | How the pictures were made (see below). |

## Store links

Edit `STORES` in `tools/config.ts`: a `url` turns the greyed-out "coming soon" button into a link.
Steam needs the store page URL once the app id exists; Google Play's listing URL is in a comment
there.

## Demo downloads

The "Download the demo" section (`#download`) links to the assets of the GitHub Release
`demo-v<version>` of this repository; Pages cannot hold files over 100 MB. For a new demo: run
`tools/release/package_demo.sh` in the game repo, create the release with its four files
(`gh release create demo-v<version> --repo gmunaro/dawnbringer-site ...`), then set `DEMO` in
`tools/config.ts` (version, file names and exact sizes in bytes) and rebuild.

## Pictures and video

Only needed when the game's look changes. On a throwaway copy of the game (never the working
checkout):

1. `tools/capture.sh <copy>/game <captures dir>` records the screens with the game's capture scenes.
2. Copy `tools/godot/*.gd` into the copy (e.g. `res://tools/site/`) and run
   `$G --path <copy>/game -s res://tools/site/render_site_art.gd -- --out=<art dir>` for the key art
   (the game's store art painter with a blood moon).
3. `tools/media.sh <captures dir> <art dir> <game repo>` writes `src/assets` and `src/presskit`
   (needs ffmpeg).
