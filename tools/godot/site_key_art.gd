## The website's key art: a copy of the game's PromoKeyArt (game/tools/promo/art/key_art.gd) with
## the dead sun swapped for the blood moon of the Landlord's night, a red seal of wax with the
## Landlord's crown pressed into it, and the Landlord lit red by it. Everything else (sky, spires,
## crag, hero, embers, logo) is the game's painter unchanged. Rendered by render_site_art.gd.
class_name SiteKeyArt
extends Node2D

const SKY: Array[Color] = [
	Color("#0B0710"), Color("#110A18"), Color("#180D1F"), Color("#221022"),
	Color("#2E1325"), Color("#3E1726"), Color("#561D27"), Color("#6E2A2A"),
]
const LOGO_FONT: FontFile = preload("res://assets/fonts/jacquarda_bastarda_9.ttf")
const HERO_SPRITE := "res://assets/chars/ch_ashglass_zealot.png"
const BOSS_SPRITE := "res://assets/chars/boss_the_hollow_king.png"

## Size of the canvas in art pixels.
var view := Vector2(460, 215)
## Fractions of view (x, y) and sizes in art pixels.
var sun := Vector2(0.62, 0.62)
var sun_radius := 40.0
var horizon := 0.74
var crag := Vector2(0.2, 0.84)
var hero_scale := 2
var boss_scale := 3
## Where the Landlord's feet sit, as fractions of view; it rises from behind the far hills.
var boss := Vector2(0.62, 0.8)
var boss_alpha := 0.9
var show_hero := true
var show_boss := true
var show_crag := true
## Logo text ("" hides it), its font size (a multiple of 9 keeps the pixel font crisp) and its
## centre as fractions of view.
var logo := "Dawnbringer"
var logo_size := 45
var logo_at := Vector2(0.5, 0.2)
var tagline := ""
## Small "DEMO" plate under the logo.
var demo := false
## Only the logo on a transparent background (the library logo).
var logo_only := false
## Darkens the whole picture (page background).
var dim := 0.0
var seed_value := 7


func build() -> void:
	if not logo_only:
		var paint := _Paint.new()
		paint.art = self
		add_child(paint)
	if logo != "":
		_add_logo()


func _add_logo() -> void:
	var l := _label(logo, LOGO_FONT, logo_size, UIPalette.GOLD, maxi(2, logo_size / 18))
	l.label_settings.shadow_offset = Vector2(1, 2) if logo_size < 40 else Vector2(2, 3)
	var tag: Label = null
	if tagline != "":
		tag = _label(tagline, UIPalette.FONT_SMALL, 8, UIPalette.PARCHMENT, 1)
	var plate: Label = null
	if demo:
		plate = _label("DEMO", UIPalette.FONT_BODY, 16, UIPalette.INK, 0)
		plate.label_settings.shadow_size = 0
		plate.label_settings.shadow_color = Color(0, 0, 0, 0)
	var at := Vector2(view.x * logo_at.x, view.y * logo_at.y)
	var ls := l.get_minimum_size()
	l.position = (at - ls * 0.5).round()
	add_child(l)
	var y := l.position.y + ls.y - roundf(logo_size * 0.12)
	if tag != null:
		var ts := tag.get_minimum_size()
		tag.position = Vector2(roundf(at.x - ts.x * 0.5), y)
		add_child(tag)
		y += ts.y + 2
	if plate != null:
		var ps := plate.get_minimum_size()
		var box := ColorRect.new()
		box.color = UIPalette.GOLD
		box.size = Vector2(ps.x + 8, ps.y - 2)
		box.position = Vector2(roundf(at.x - box.size.x * 0.5), y + 1)
		add_child(box)
		plate.position = box.position + Vector2(4, -2)
		add_child(plate)


func _label(text: String, font: Font, size: int, color: Color, outline: int) -> Label:
	var l := Label.new()
	l.text = text
	var ls := LabelSettings.new()
	ls.font = font
	ls.font_size = size
	ls.font_color = color
	ls.outline_size = outline
	ls.outline_color = UIPalette.INK
	ls.shadow_color = Color(UIPalette.INK, 0.85)
	ls.shadow_offset = Vector2(1, 1)
	l.label_settings = ls
	return l


## Everything under the logo, painted back to front.
class _Paint extends Node2D:
	var art: SiteKeyArt
	## Silhouette textures made while drawing; kept alive until the frame is rendered.
	var _keep: Array[ImageTexture] = []

	func _draw() -> void:
		var v := art.view
		var rng := RandomNumberGenerator.new()
		rng.seed = art.seed_value
		_sky(v)
		var sc := Vector2(v.x * art.sun.x, v.y * art.sun.y)
		_corona(sc, art.sun_radius)
		_sun_disk(sc, art.sun_radius)
		var hy := v.y * art.horizon
		_haze(v, hy - 22.0, [0.03, 0.06, 0.09, 0.12, 0.09, 0.05], UIPalette.EMBER)
		_ridge(v, hy - 4.0, Color("#2A1121"), [[2, 7.0, 0.3], [5, 3.0, 1.7], [11, 1.5, 0.4]], true, rng)
		if art.show_boss:
			_boss(v)
		_ridge(v, hy + 22.0, Color("#1E0E1C"), [[3, 9.0, 2.1], [7, 4.0, 0.9], [13, 2.0, 2.6]], false, rng)
		_haze(v, hy + 30.0, [0.02, 0.04, 0.06, 0.04], UIPalette.BLOOD_LIGHT)
		_fog(v, hy + 52.0, rng)
		if art.show_crag:
			_crag(v)
		if art.show_hero and art.show_crag:
			_hero(v)
		_embers(v, rng)
		_vignette(v)
		if art.dim > 0.0:
			draw_rect(Rect2(Vector2.ZERO, v), Color(UIPalette.INK, art.dim))

	## Banded sky with a checker dither between bands, the warmest band at the horizon.
	func _sky(v: Vector2) -> void:
		var bottom := v.y * art.horizon + 20.0
		var band_h := ceilf(bottom / float(SKY.size()))
		draw_rect(Rect2(Vector2.ZERO, v), SKY[SKY.size() - 1])
		for i in SKY.size():
			var y := i * band_h
			draw_rect(Rect2(0, y, v.x, band_h + 1), SKY[i])
			if i > 0:
				for row in 2:
					for x in range(row, int(v.x), 2):
						draw_rect(Rect2(x, y - 2 + row * 2, 1, 1), SKY[i] if row == 0 else SKY[i - 1])

	func _corona(c: Vector2, r: float) -> void:
		var glow: Array[Color] = [
			Color(0.7, 0.16, 0.18, 0.06), Color(0.7, 0.16, 0.18, 0.08),
			Color(0.78, 0.22, 0.2, 0.1), Color(0.84, 0.42, 0.32, 0.12)]
		for i in glow.size():
			draw_circle(c, r * 1.6 - i * r * 0.15, glow[i])

	## The blood moon: a disc of red wax, lit from the upper left, with the Landlord's crown (the
	## game's app icon crown) pressed into it like a seal.
	func _sun_disk(c: Vector2, r: float) -> void:
		draw_circle(c, r + 1, UIPalette.BLOOD_DARK)
		draw_circle(c, r, UIPalette.BLOOD)
		draw_circle(c + Vector2(-r * 0.12, -r * 0.12), r * 0.86, UIPalette.BLOOD_LIGHT)
		draw_circle(c + Vector2(r * 0.06, r * 0.06), r * 0.8, UIPalette.BLOOD)
		draw_circle(c, r * 0.62, UIPalette.BLOOD_DARK)
		draw_circle(c + Vector2(-1, -1), r * 0.6, Color("#962F35"))
		# The crown stamp: a band and three points, in whole pixels.
		var u := maxf(1.0, roundf(r / 14.0))
		var w := 9.0 * u
		var o := (c - Vector2(w * 0.5, 3.0 * u)).round()
		draw_rect(Rect2(o + Vector2(0, 3 * u), Vector2(w, 3 * u)), UIPalette.BLOOD_DARK)
		for i in 3:
			draw_rect(Rect2(o + Vector2(i * 4 * u, 0), Vector2(u, 3 * u)), UIPalette.BLOOD_DARK)
		draw_rect(Rect2(o + Vector2(0, 6 * u), Vector2(w, u)), Color(UIPalette.BLOOD_LIGHT, 0.6))

	## The Landlord, huge and dark behind the sun, with an ember rim where the corona lights it.
	func _boss(v: Vector2) -> void:
		var tex: Texture2D = load(BOSS_SPRITE)
		if tex == null:
			return
		var frame := Rect2(0, 0, 64, 64)
		var s := float(art.boss_scale)
		var feet := Vector2(v.x * art.boss.x, v.y * art.boss.y)
		# Pivot of the boss strips is about (30, 59); mirrored, x becomes 64 - 30.
		var pos := (feet - Vector2(34, 59) * s).round()
		var size := Vector2(64, 64) * s
		# Faces left, toward the hero; the moon behind its crown lights a thin blood rim.
		var rim := _flat(tex, frame, Color(UIPalette.BLOOD_LIGHT, 0.8 * art.boss_alpha), true)
		for d: Vector2 in [Vector2(-1, 0), Vector2(1, 0), Vector2(0, -1)]:
			draw_texture_rect(rim, Rect2(pos + d, size), false)
		draw_texture_rect(_flat(tex, frame, Color(1, 1, 1, 1), true, Color(0.62, 0.36, 0.38, art.boss_alpha)), Rect2(pos, size), false)

	func _haze(v: Vector2, top: float, steps: Array, color: Color) -> void:
		for i in steps.size():
			draw_rect(Rect2(0, top + i * 6, v.x, 6), Color(color, float(steps[i])))

	func _ridge(v: Vector2, base_y: float, color: Color, waves: Array, spires: bool, rng: RandomNumberGenerator) -> void:
		base_y = minf(base_y, v.y - 12.0)
		var poly := PackedVector2Array([Vector2(0, v.y)])
		var x := 0.0
		var period := maxf(v.x, 400.0)
		while x <= v.x + 4.0:
			poly.append(Vector2(x, roundf(_h(x, base_y, waves, period))))
			x += 3.0
		poly.append(Vector2(v.x + 4.0, v.y))
		draw_colored_polygon(poly, color)
		if not spires:
			return
		var sx := 10.0 + rng.randf_range(0, 30)
		while sx < v.x:
			var h := rng.randf_range(12, 36)
			var w := roundf(h / 5.0)
			var ground := roundf(_h(sx, base_y, waves, period)) + 2.0
			draw_rect(Rect2(roundf(sx), ground - h, w, h), color)
			draw_colored_polygon(PackedVector2Array([Vector2(roundf(sx) - 1, ground - h),
					Vector2(roundf(sx) + w * 0.5, ground - h - w * 1.6), Vector2(roundf(sx) + w + 1, ground - h)]), color)
			if rng.randf() < 0.45:
				draw_rect(Rect2(floorf(sx + w * 0.5), ground - h * 0.6, 1, 2), Color(UIPalette.EMBER, 0.8))
			sx += rng.randf_range(40, 120)

	func _h(x: float, base_y: float, waves: Array, period: float) -> float:
		var h := base_y
		for wv: Array in waves:
			h -= float(wv[1]) * sin(x * TAU * float(wv[0]) / (period * 2.0) + float(wv[2]))
		return h

	func _fog(v: Vector2, y: float, rng: RandomNumberGenerator) -> void:
		var c := Color(UIPalette.MUTED, 0.07)
		var x := rng.randf_range(-60, 0)
		while x < v.x:
			var w := rng.randf_range(80, 160)
			draw_rect(Rect2(roundf(x), y, w, 2), c)
			draw_rect(Rect2(roundf(x) + 14, y - 2, w - 34, 2), Color(c, 0.05))
			x += w + rng.randf_range(30, 90)

	## The foreground ground and the crag under the hero, with a blood rim facing the sun.
	func _crag(v: Vector2) -> void:
		var ink := UIPalette.INK
		var top := Vector2(v.x * art.crag.x, v.y * art.crag.y)
		var ground_y := minf(top.y + 18.0, v.y - 4.0)
		var pts := PackedVector2Array([Vector2(0, v.y), Vector2(0, ground_y + 2), Vector2(top.x - 70, ground_y),
				Vector2(top.x - 34, top.y + 8), Vector2(top.x - 26, top.y), Vector2(top.x + 26, top.y),
				Vector2(top.x + 40, top.y + 14), Vector2(top.x + 90, ground_y + 4), Vector2(v.x * 0.7, ground_y + 10),
				Vector2(v.x, ground_y + 6), Vector2(v.x, v.y)])
		draw_colored_polygon(pts, ink)
		draw_line(Vector2(top.x - 26, top.y), Vector2(top.x + 26, top.y), Color(UIPalette.BLOOD_LIGHT, 0.55), 1.0)
		draw_line(Vector2(top.x + 27, top.y + 1), Vector2(top.x + 40, top.y + 14), Color(UIPalette.BLOOD, 0.45), 1.0)
		for m: Array in [[0.08, 5], [0.55, 6], [0.8, 4], [0.93, 5]]:
			var mx := roundf(v.x * float(m[0]))
			if absf(mx - top.x) < 50:
				continue
			var mh := float(m[1])
			var my := ground_y + 6
			draw_rect(Rect2(mx, my - mh - 4, 1, mh + 4), ink)
			draw_rect(Rect2(mx - 2, my - mh - 2, 5, 1), ink)

	## The hero on the crag: a dark silhouette with a blood-red rim, facing the sun.
	func _hero(v: Vector2) -> void:
		var tex: Texture2D = load(HERO_SPRITE)
		if tex == null:
			return
		var s := float(art.hero_scale)
		var top := Vector2(v.x * art.crag.x, v.y * art.crag.y)
		var size := Vector2(32, 32) * s
		var pos := (Vector2(top.x - 14 * s + 4, top.y - 30 * s)).round()
		var frame := Rect2(0, 0, 32, 32)
		var rim := _flat(tex, frame, Color(UIPalette.BLOOD_LIGHT, 0.9))
		for d: Vector2 in [Vector2(1, 0), Vector2(0, -1)]:
			draw_texture_rect(rim, Rect2(pos + d, size), false)
		draw_texture_rect(_flat(tex, frame, Color(1, 1, 1, 1), false, Color(0.62, 0.5, 0.56, 1.0)), Rect2(pos, size), false)

	## The frame of a strip as one flat colour (a silhouette), keeping its alpha; with `shade` set
	## the sprite keeps its own colours multiplied by shade instead. `flip` mirrors it.
	func _flat(tex: Texture2D, frame: Rect2, color: Color, flip: bool = false, shade: Color = Color(0, 0, 0, 0)) -> ImageTexture:
		var src := tex.get_image()
		if src.is_compressed():
			src.decompress()
		src.convert(Image.FORMAT_RGBA8)
		var img := src.get_region(Rect2i(frame))
		if flip:
			img.flip_x()
		for y in img.get_height():
			for x in img.get_width():
				var px := img.get_pixel(x, y)
				if shade.a > 0.0:
					img.set_pixel(x, y, Color(px.r * shade.r, px.g * shade.g, px.b * shade.b, shade.a if px.a > 0.5 else 0.0))
				else:
					img.set_pixel(x, y, Color(color, color.a if px.a > 0.5 else 0.0))
		var t := ImageTexture.create_from_image(img)
		_keep.append(t)
		return t

	func _embers(v: Vector2, rng: RandomNumberGenerator) -> void:
		var n := int(v.x * v.y / 900.0)
		for i in n:
			var p := Vector2(rng.randi_range(0, int(v.x)), rng.randi_range(int(v.y * 0.25), int(v.y)))
			var c := UIPalette.EMBER if rng.randf() < 0.6 else UIPalette.GOLD
			var a := rng.randf_range(0.35, 0.95)
			var sz := 2 if rng.randf() < 0.15 else 1
			draw_rect(Rect2(p, Vector2(sz, sz)), Color(c, a))

	func _vignette(v: Vector2) -> void:
		for i in 6:
			var a := 0.07
			var inset := float(i) * minf(v.x, v.y) * 0.025
			var r := Rect2(Vector2(inset, inset), v - Vector2(inset, inset) * 2.0)
			draw_rect(Rect2(0, 0, v.x, r.position.y), Color(UIPalette.INK, a))
			draw_rect(Rect2(0, r.end.y, v.x, v.y - r.end.y), Color(UIPalette.INK, a))
			draw_rect(Rect2(0, r.position.y, r.position.x, r.size.y), Color(UIPalette.INK, a))
			draw_rect(Rect2(r.end.x, r.position.y, v.x - r.end.x, r.size.y), Color(UIPalette.INK, a))
