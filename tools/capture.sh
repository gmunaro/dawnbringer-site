#!/bin/bash
# Captures the game screens the site uses, with the game's own capture scenes (windowed Godot,
# --write-movie). Run it on a throwaway copy of the game, never on the working checkout:
#   git -C <game repo> archive HEAD game ':!game/android' | tar -x -C <copy dir>
#   G=<godot exe> bash tools/capture.sh <copy dir>/game <captures dir>
#   ($G --headless --path <copy dir>/game --import once first.)
# Each shot lands in <captures dir>/<name>/f*.png; tools/media.sh picks the frames.
set -u
G=${G:-/d/Godot_v4.5-stable_win64/Godot_v4.5-stable_win64_console.exe}
GAME=${1:?game copy (folder with project.godot)}; OUT=${2:?captures dir}
OUTW=$(cygpath -m "$OUT" 2>/dev/null || echo "$OUT")
cd "$GAME"
shot() { # name fps frames scene args...
  local name=$1 fps=$2 frames=$3 scene=$4; shift 4
  mkdir -p "$OUT/$name"; rm -f "$OUT/$name"/f*.png
  timeout 300 "$G" --path . "$scene" --write-movie "$OUTW/$name/f.png" --fixed-fps $fps --quit-after $frames -- "$@" > "$OUT/$name.log" 2>&1
  echo "$name exit=$? frames=$(ls "$OUT/$name" | wc -l)"
}
N=res://tests/ui/capture/landlord_night_capture.tscn
L=res://tests/run_ui/capture/landlord_capture.tscn
S=res://tests/run_ui/capture/sungold_capture.tscn
O=res://tests/run_ui/capture/overlay_capture.tscn
A=res://tests/afterlife/capture/afterlife_capture.tscn
M=res://tests/meta_ui/capture/capture.tscn
B=res://tests/ui/capture/battle_group_capture.tscn
shot night_hollow 10 30 $N --shot=end --boss=the_hollow_king
shot landlord 10 20 $L --shot=landlord
shot landlord_legend 10 20 $L --shot=landlord --legend
shot cashout 10 20 $L --shot=cashout
shot forecast 10 24 $S --shot=encounter --grade=close
shot shop 10 30 $O --shot=shop
shot build 10 30 $O --shot=build
shot event 10 30 $O --shot=event --event=hangmans_wager
shot zmap 10 20 $A --shot=zmap
shot camp 10 30 $M --shot=camp
shot group 10 40 $B --kind=group
shot clip_landlord 30 420 $B --kind=landlord:the_hollow_king
