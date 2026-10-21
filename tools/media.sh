#!/bin/bash
# Turns game captures and the rendered key art into the site's media (src/assets) and the press
# kit files (src/presskit). Run it only when the pictures change; `bun run build` uses the results.
#   bash tools/media.sh <captures dir> <art dir> <game repo>
# <captures dir>: one folder per shot with Godot --write-movie frames (see tools/capture.sh).
# <art dir>: the PNGs written by tools/godot/render_site_art.gd.
# <game repo>: the Dawnbringer repo (for the app icon).
set -euo pipefail
CAP=${1:?captures dir}; ART=${2:?art dir}; GAME=${3:?game repo}
FF=${FFMPEG:-/c/ffmpeg/bin/ffmpeg.exe}
ROOT=$(cd "$(dirname "$0")/.." && pwd)
A="$ROOT/src/assets"; P="$ROOT/src/presskit"
mkdir -p "$A/img" "$A/shots" "$A/video" "$A/icons" "$P/screenshots"
ff() { "$FF" -y -hide_banner -loglevel error "$@"; }
last() { ls "$CAP/$1"/f*.png | tail -1; }

# Screenshots: the last frame of each shot. 640x360 lossless WebP for the page, 1920x1080 PNG
# (3x nearest) for the press kit. The order here is the gallery's order (tools/config.ts SHOTS).
i=0
for s in night:night_hollow landlord:landlord battle:clip_landlord@270 stone:stone risen:zmap \
         legend:landlord_legend shop:shop camp:camp group:group cashout:cashout build:build event:event; do
  name=${s%%:*}; src=${s#*:}
  if [[ $src == *@* ]]; then frame=$(printf "%s/%s/f%08d.png" "$CAP" "${src%@*}" "${src#*@}"); else frame=$(last "$src"); fi
  i=$((i + 1))
  ff -i "$frame" -c:v libwebp -lossless 1 -compression_level 6 "$A/shots/$name.webp"
  ff -i "$frame" -vf scale=1920:1080:flags=neighbor "$P/screenshots/$(printf %02d $i)_$name.png"
done

# Key art: the hero pre-scaled by whole pixels (the page shows it 1:1, cropped), the OG card, the press kit.
for k in 2 3; do
  ff -i "$ART/hero.png" -vf scale=$((640 * k)):$((360 * k)):flags=neighbor -c:v libwebp -lossless 1 -compression_level 6 "$A/img/hero-${k}x.webp"
done
ff -i "$ART/hero_narrow.png" -c:v libwebp -lossless 1 -compression_level 6 "$A/img/hero-narrow.webp"
cp "$ART/og.png" "$A/img/og.png"
cp "$ART/keyart_1920.png" "$P/dawnbringer-keyart-1920x1080.png"
cp "$ART/keyart_1920_nologo.png" "$P/dawnbringer-keyart-1920x1080-nologo.png"
cp "$ART/logo.png" "$P/dawnbringer-logo.png"

# Icons from the game's 256 px app icon (32 art pixels at 8x).
ICON="$GAME/game/assets/ui/app_icon.png"
cp "$GAME/game/assets/ui/app_icon.ico" "$A/icons/favicon.ico"
ff -i "$ICON" -vf scale=32:32:flags=neighbor "$A/icons/icon-32.png"
ff -i "$ICON" -vf scale=192:192:flags=neighbor "$A/icons/icon-192.png"
ff -i "$ICON" -vf scale=512:512:flags=neighbor "$A/icons/icon-512.png"
ff -i "$ICON" -vf "scale=160:160:flags=neighbor,pad=180:180:10:10:color=0x0B0710" "$A/icons/apple-touch-icon.png"
cp "$A/icons/icon-512.png" "$P/dawnbringer-icon-512.png"

# The gameplay clip: the Landlord's night (2.5 s), the Landlord's screen (2.5 s), then 9 s of the
# fight, at 1280x720 (2x nearest) so it stays crisp in every browser. WebM (VP9) first, MP4 fallback.
T=$(mktemp -d)
ff -loop 1 -framerate 30 -t 2.5 -i "$(last night_hollow)" -loop 1 -framerate 30 -t 2.5 -i "$(last landlord)" \
   -framerate 30 -start_number 20 -i "$CAP/clip_landlord/f%08d.png" \
   -filter_complex "[2]trim=end_frame=270,setpts=PTS-STARTPTS[f];[0][1][f]concat=n=3:v=1:a=0,scale=1280:720:flags=neighbor,format=yuv420p[v]" \
   -map "[v]" -c:v libx264rgb -crf 0 -preset ultrafast "$T/master.mkv"
ff -i "$T/master.mkv" -c:v libvpx-vp9 -b:v 0 -crf 46 -row-mt 1 -deadline good -cpu-used 2 -pix_fmt yuv420p -an "$A/video/clip.webm"
ff -i "$T/master.mkv" -c:v libx264 -crf 26 -preset slow -tune animation -pix_fmt yuv420p -movflags +faststart -an "$A/video/clip.mp4"
ff -i "$(last night_hollow)" -vf scale=1280:720:flags=neighbor -c:v libwebp -quality 82 "$A/video/clip-poster.webp"
rm -r "$T"
ls -la "$A"/*/ "$P" | awk '{print $5, $9}'
