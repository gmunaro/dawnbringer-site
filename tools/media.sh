#!/bin/bash
# Turns the rendered key art and the game's app icon into the site's pictures (src/assets/img,
# src/assets/icons) and the press kit's key art and icon. Run it only when they change; `bun run build`
# uses the results. The screenshots, the gallery and the gameplay clip come from the game repo's
# tools/github/media/make_media.py (README, "Pictures and video").
#   bash tools/media.sh <art dir> <game repo>
# <art dir>: the PNGs written by the game's res://tools/capture/promo05/site_key_art.tscn.
# <game repo>: the Dawnbringer repo (for the app icon).
set -euo pipefail
ART=${1:?art dir}; GAME=${2:?game repo}
FF=${FFMPEG:-/c/ffmpeg/bin/ffmpeg.exe}
ROOT=$(cd "$(dirname "$0")/.." && pwd)
A="$ROOT/src/assets"; P="$ROOT/src/presskit"
mkdir -p "$A/img" "$A/icons"
ff() { "$FF" -y -hide_banner -loglevel error "$@"; }

# Key art: each picture is rendered at the size the page shows it (the SVG art, no scaling here).
ff -i "$ART/hero_3x.png" -c:v libwebp -lossless 1 -compression_level 6 "$A/img/hero-3x.webp"
ff -i "$ART/hero_2x.png" -c:v libwebp -lossless 1 -compression_level 6 "$A/img/hero-2x.webp"
ff -i "$ART/hero_narrow.png" -c:v libwebp -lossless 1 -compression_level 6 "$A/img/hero-narrow.webp"
cp "$ART/og.png" "$A/img/og.png"
cp "$ART/keyart_1920.png" "$P/dawnbringer-keyart-1920x1080.png"
cp "$ART/keyart_1920_nologo.png" "$P/dawnbringer-keyart-1920x1080-nologo.png"
# The transparent logo changes only with the logo font; keep the press kit's when the render has none.
[ -f "$ART/logo.png" ] && cp "$ART/logo.png" "$P/dawnbringer-logo.png"

# Icons from the game's 256 px app icon (32 art pixels at 8x).
ICON="$GAME/game/assets/ui/app_icon.png"
cp "$GAME/game/assets/ui/app_icon.ico" "$A/icons/favicon.ico"
ff -i "$ICON" -vf scale=32:32:flags=neighbor "$A/icons/icon-32.png"
ff -i "$ICON" -vf scale=192:192:flags=neighbor "$A/icons/icon-192.png"
ff -i "$ICON" -vf scale=512:512:flags=neighbor "$A/icons/icon-512.png"
ff -i "$ICON" -vf "scale=160:160:flags=neighbor,pad=180:180:10:10:color=0x0B0710" "$A/icons/apple-touch-icon.png"
cp "$A/icons/icon-512.png" "$P/dawnbringer-icon-512.png"

ls -la "$A"/img/ "$A"/icons/ "$P" | awk '{print $5, $9}'
