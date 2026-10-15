## Renders the website's key art (SiteKeyArt, a blood-moon copy of the game's store art painter).
## Not run from this repo: copy this file and site_key_art.gd into a throwaway copy of the game
## (any folder under res://, e.g. res://tools/site/) and run, with a window (not --headless):
##   $G --path game -s res://tools/site/render_site_art.gd -- --out=C:/tmp/site/art
## Each asset is drawn at its size divided by `scale` and scaled up by whole pixels (nearest).
extends SceneTree

const SiteKeyArt := preload("site_key_art.gd")

## name, final size, scale, SiteKeyArt fields.
var SPECS: Array = [
	# The home page hero (no logo: the page sets the title in HTML). 640x360 art pixels, shown at 1x-3x.
	["hero", Vector2i(640, 360), 1, {"sun": Vector2(0.73, 0.36), "sun_radius": 42.0, "boss": Vector2(0.73, 0.9),
		"boss_scale": 3, "horizon": 0.74, "crag": Vector2(0.4, 0.86), "hero_scale": 2, "logo": ""}],
	# Narrow screens: the moon and the Landlord centred, 432x320 (shown at 1x, cropped on small phones).
	["hero_narrow", Vector2i(432, 320), 1, {"sun": Vector2(0.6, 0.3), "sun_radius": 34.0, "boss": Vector2(0.62, 0.97),
		"boss_scale": 3, "horizon": 0.76, "crag": Vector2(0.2, 0.92), "hero_scale": 2, "logo": ""}],
	# Open Graph / Twitter card.
	["og", Vector2i(1200, 630), 2, {"sun": Vector2(0.72, 0.42), "sun_radius": 40.0, "boss": Vector2(0.72, 0.93),
		"boss_scale": 3, "crag": Vector2(0.2, 0.88), "hero_scale": 2, "logo_size": 54, "logo_at": Vector2(0.32, 0.22),
		"tagline": "THE SUN IS DEAD. CARRY ITS LAST LIGHT."}],
	# Press kit key art, with and without the logo.
	["keyart_1920", Vector2i(1920, 1080), 3, {"sun": Vector2(0.72, 0.4), "sun_radius": 42.0, "boss": Vector2(0.72, 0.92),
		"boss_scale": 3, "crag": Vector2(0.24, 0.87), "hero_scale": 2, "logo_size": 54, "logo_at": Vector2(0.32, 0.2),
		"tagline": "THE SUN IS DEAD. CARRY ITS LAST LIGHT."}],
	["keyart_1920_nologo", Vector2i(1920, 1080), 3, {"sun": Vector2(0.72, 0.4), "sun_radius": 42.0, "boss": Vector2(0.72, 0.92),
		"boss_scale": 3, "crag": Vector2(0.24, 0.87), "hero_scale": 2, "logo": ""}],
	# Transparent logo.
	["logo", Vector2i(1280, 360), 4, {"logo_only": true, "logo_size": 45, "logo_at": Vector2(0.5, 0.5)}],
]


func _initialize() -> void:
	_render_all.call_deferred()


func _render_all() -> void:
	var out := "C:/tmp/site/art"
	for a in OS.get_cmdline_user_args():
		if a.begins_with("--out="):
			out = a.trim_prefix("--out=")
	DirAccess.make_dir_recursive_absolute(out)
	for spec: Array in SPECS:
		var img := await _render(spec[1], spec[2], spec[3])
		var path := out.path_join(String(spec[0]) + ".png")
		img.save_png(path)
		print("wrote ", path, " ", img.get_size())
	quit()


func _render(final_size: Vector2i, scale: int, fields: Dictionary) -> Image:
	var base := final_size / scale
	var vp := SubViewport.new()
	vp.size = base
	vp.transparent_bg = bool(fields.get("logo_only", false))
	vp.canvas_item_default_texture_filter = Viewport.DEFAULT_CANVAS_ITEM_TEXTURE_FILTER_NEAREST
	vp.render_target_update_mode = SubViewport.UPDATE_ALWAYS
	root.add_child(vp)
	var art: Node2D = SiteKeyArt.new()
	art.set("view", Vector2(base))
	for k: String in fields:
		art.set(k, fields[k])
	art.call("build")
	vp.add_child(art)
	for i in 3:
		await process_frame
	await RenderingServer.frame_post_draw
	var img := vp.get_texture().get_image()
	vp.queue_free()
	img.resize(base.x * scale, base.y * scale, Image.INTERPOLATE_NEAREST)
	return img
