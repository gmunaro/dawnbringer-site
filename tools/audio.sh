#!/usr/bin/env bash
# Cuts the home page's audio samples (src/assets/audio/<name>.ogg and .mp3) from a game checkout.
#   tools/audio.sh <game repo>          needs ffmpeg on PATH (or FFMPEG=<path>)
# voice: Mother Hesper's lore line K03; monster: the Tithe Taker's encounter line; ambience: the
# first 20 s of Drowned Vigil at night, faded in and out.
set -euo pipefail
GAME="${1:?usage: tools/audio.sh <game repo>}/game/assets"
FF="${FFMPEG:-ffmpeg}"
OUT="$(cd "$(dirname "$0")/.." && pwd)/src/assets/audio"
mkdir -p "$OUT"
cut() {  # name source [ffmpeg filter args...]
  local name="$1" src="$2"; shift 2
  "$FF" -v error -y -i "$src" "$@" -c:a libvorbis -q:a 4 "$OUT/$name.ogg"
  "$FF" -v error -y -i "$src" "$@" -c:a libmp3lame -b:a 128k "$OUT/$name.mp3"
  echo "$OUT/$name.ogg, .mp3"
}
cut voice "$GAME/vo/keeper/K03.ogg"
cut monster "$GAME/vo/tithe_taker/tithe_taker_encounter.ogg"
cut ambience "$GAME/audio/ambience/drowned_vigil_night.ogg" -t 20 -af "afade=t=in:d=1.5,afade=t=out:st=18:d=2"
