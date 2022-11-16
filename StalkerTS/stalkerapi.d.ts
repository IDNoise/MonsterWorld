declare function log(this: void, data: string): void
declare function time_global(): number

type ScriptCallback = (...args: any[]) => void;
declare function RegisterScriptCallback(this: void, callbackName: string, callback : ScriptCallback) : Obj;

declare const enum HitType {
  burn = 0,
  chemical_burn = 2,
  dummy = 12,
  explosion = 7,
  fire_wound = 8,
  light_burn = 11,
  radiation = 3,
  shock = 1,
  strike = 5,
  telepatic = 4,
  wound = 6,
}

declare interface Hit {
  direction: Vector;
  draftsman: Obj;
  impulse: number;
  power: number;
  type : HitType;
  weapon_id : number;

  bone(boneName: string): void;
}

declare interface CallbackReturnFlags {
  ret_value: boolean;
}

declare interface Obj {
  bleeding : number;
  health : number;
  morale : number;
  power : number;
  psy_health : number;
  radiation : number;

  // All types
  id(): number;
  position(): Vector;
  level_vertex_id(): number;
  game_vertex_id(): number;
  section(): string;
  name(): string;
  clsid(): ClsId;
	parent(): Obj;
  has_info(info: string): boolean;
  dont_has_info(info: string): boolean;
  give_info_portion(info: string): void;
  disable_info_portion(info: string): void;
  
 //  Testing
	is_entity_alive(): boolean;
	is_inventory_item(): boolean;
	is_inventory_owner(): boolean;
	is_actor(): boolean;
	is_custom_monster(): boolean;
	is_weapon(): boolean;
	is_outfit(): boolean;
	is_scope(): boolean;
	is_silencer(): boolean;
	is_grenade_launcher(): boolean;
	is_weapon_magazined(): boolean;
	is_space_restrictor(): boolean;
	is_stalker(): boolean;
	is_anomaly(): boolean;
	is_monster(): boolean;
	is_trader(): boolean;
	is_hud_item(): boolean;
	is_artefact(): boolean;
	is_ammo(): boolean;
	is_weapon_gl(): boolean;
	is_inventory_box(): boolean;

  // Player
	get_actor_max_weight(): number;
	set_actor_max_weight(weight: number): void;
	get_actor_max_walk_weight(): number;
	set_actor_max_walk_weight(weight: number): void;
	get_actor_jump_speed(): number;
	set_actor_jump_speed(speed: number): void;
	get_actor_sprint_koef(): number;
	set_actor_sprint_koef(coef: number): void;
	get_actor_run_coef(): number;
	set_actor_run_coef(coef: number): void;
	get_actor_runback_coef(): number;
	set_actor_runback_coef(coef: number): void;
}

declare function vector(): Vector;

declare interface Vector {
  x: number;
  y: number;
  z: number;

  set_length(length: number): Vector;
  // function sub(number)
  // function sub(const vector&)
  // function sub(const vector&, const vector&)
  // function sub(const vector&, number)
  // function reflect(const vector&, const vector&)
  // function slide(const vector&, const vector&)
  // function average(const vector&)
  // function average(const vector&, const vector&)
  // function normalize_safe()
  // function normalize_safe(const vector&)
  // function normalize()
  // function normalize(const vector&)
  // function align()
  // function magnitude() const
  getP(): number;
  // function max(const vector&)
  // function max(const vector&, const vector&)
  // function distance_to_xz(const vector&) const
  // function invert()
  // function invert(const vector&)
  // function mad(const vector&, number)
  // function mad(const vector&, const vector&, number)
  // function mad(const vector&, const vector&)
  // function mad(const vector&, const vector&, const vector&)
  // function clamp(const vector&)
  // function clamp(const vector&, vector)
  // function inertion(const vector&, number)
  // function crossproduct(const vector&, const vector&)
  set(x: number, y: number, z: number): Vector;
  // function set(const vector&)
  // function abs(const vector&)
  // function div(number)
  // function div(const vector&)
  // function div(const vector&, const vector&)
  // function div(const vector&, number)
  // function dotproduct(const vector&) const
  getH(): number;
  // function min(const vector&)
  // function min(const vector&, const vector&)
  // function similar(const vector&, number) const
  // function distance_to(const vector&) const
  // function lerp(const vector&, const vector&, number)
  // function distance_to_sqr(const vector&) const
  // function mul(number)
  // function mul(const vector&)
  // function mul(const vector&, const vector&)
  // function mul(const vector&, number)
  setHP(h: number, p: number): Vector;
  // function add(number)
  // function add(const vector&)
  // function add(const vector&, const vector&)
  // function add(const vector&, number)
}

declare namespace level {
  //   function add_complex_effector(string, number)
  //   function enable_input()
  //   function check_object(game_object*)
  //   function map_change_spot_hint(number, string, string)
  //   function game_id()
  //   function vertex_id(vector)
  //   function vertex_in_direction(number, vector, number)
  //   function change_game_time(number, number, number)
  //   function remove_complex_effector(number)
  //   function get_time_days()
  //   function set_pp_effector_factor(number, number, number)
  //   function set_pp_effector_factor(number, number)
  //   function rain_factor()
	//   function get_rain_volume() -- Searge
  //   function remove_pp_effector(number)
  //   function add_pp_effector(string, number, boolean)
  //   function get_bounding_volume()
  //   function set_snd_volume(number)
  //   function add_cam_effector(string, number, boolean, string, number, boolean, number)
  //   function add_call(const function<boolean>&, const function<void>&)
  //   function add_call(object, const function<boolean>&, const function<void>&)
  //   function add_call(object, string, string)
  //   function set_weather_fx(string)
  //   function get_snd_volume()
  //   function remove_calls_for_object(object)
  //   function prefetch_sound(string)
  //   function iterate_sounds(string, number, function<void>)
  //   function iterate_sounds(string, number, object, function<void>)
  function name() : string;
  //   function environment()
  //   function remove_cam_effector(number)
  //   function high_cover_in_direction(number, const vector&)
  //   function spawn_phantom(const vector&)
  function object_by_id(id: number): Obj;
  //   function debug_object(string)
  //   function get_weather()
  //   function present()
  //   function hide_indicators()
  //   function physics_world()
  //   function get_time_hours()
  //   function remove_call(const function<boolean>&, const function<void>&)
  //   function remove_call(object, const function<boolean>&, const function<void>&)
  //   function remove_call(object, string, string)
  //   function set_weather(string, boolean)
  //   function show_indicators()
  //   function get_game_difficulty()
  //   function map_remove_object_spot(number, string)
  //   function remove_dialog_to_render(CUIDialogWnd*)
  //   function stop_weather_fx()
  //   function patrol_path_exists(string)
  //   function vertex_position(number)
  //   function show_weapon(boolean)
  //   function get_wfx_time()
  //   function disable_input()
  //   function map_add_object_spot(number, string, string)
  //   function get_time_minutes()
  //   function get_time_factor()
  //   function map_add_object_spot_ser(number, string, string)
  //   function set_game_difficulty(enum ESingleGameDifficulty)
  //   function low_cover_in_direction(number, const vector&)
  //   function is_wfx_playing()
  //   function set_time_factor(number)
  //   function client_spawn_manager()
  //   function map_has_object_spot(number, string)
  //   function add_dialog_to_render(CUIDialogWnd*)
  //   function start_weather_fx_from_time(string, number)
  //   function hide_indicators_safe()
  //   function debug_actor()
	//   function get_target_obj() -- Alundaio: returns target game_object at cursor
	//   function get_target_dist() -- Alundaio: returns distance of target at cursor 
	//   function get_target_element() -- Alundaio: return number (bone id)
	//   function send(net_packet&,boolean bReliable = 0, boolean bSequential = 1, boolean bHighPriority = 0, boolean bSendImmediately = 0) -- Alundaio: update level packet
	//   function actor_moving_state() -- REZY: returns movement state of actor
	//   function press_action(cmd)    -- REZY: init a key press event
	//   function release_action(cmd)  -- REZY: init a key press event 
	//   function hold_action(cmd)     -- REZY: init a key press event
	//   function get_env_rads() -- returns a float, HUD sensor value
	//   function iterate_nearest(const vector&, number, function<bool>) --(pos, radius, functor) -- functor passes game objects, returning true breaks the functor
}

declare const enum ClsId{
  art_bast_artefact = 0,
	art_black_drops = 1,
	art_gravi_black = 2,
	art_cta = 3,
	art_dummy = 4,
	art_electric_ball = 5,
	art_faded_ball = 6,
	art_galantine = 7,
	art_gravi = 8,
	art_mercury_ball = 9,
	art_needles = 10,
	art_rusty_hair = 11,
	art_thorn = 12,
	art_zuda = 13,
	bloodsucker = 14,
	boar = 15,
	burer = 16,
	cat = 17,
	controller = 18,
	crow = 19,
	dog_black = 20,
	psy_dog_phantom = 21,
	psy_dog = 22,
	dog_red = 23,
	flesh = 24,
	flesh_group = 25,
	fracture = 26,
	pseudo_gigant = 27,
	graph_point = 28,
	chimera = 29,
	phantom = 30,
	poltergeist = 31,
	rat = 32,
	snork = 33,
	stalker = 34,
	script_stalker = 35,
	trader = 36,
	script_trader = 37,
	tushkano = 38,
	zombie = 39,
	wpn_ammo = 40,
	wpn_ammo_s = 41,
	artefact = 42,
	wpn_ammo_m209 = 43,
	wpn_ammo_og7b = 44,
	wpn_ammo_vog25 = 45,
	game_cl_artefact_hunt = 46,
	game_cl_capture_the_artefact = 47,
	game_cl_deathmatch = 48,
	game_cl_single = 49,
	game_cl_team_deathmatch = 50,
	helicopter = 51,
	script_heli = 52,
	car = 53,
	detector_advanced_s = 54,
	detector_elite_s = 55,
	detector_scientific_s = 56,
	detector_simple_s = 57,
	device_detector_advanced = 58,
	device_custom = 59,
	device_dosimeter = 60,
	device_detector_elite = 61,
	device_flashlight = 62,
	device_flare = 63,
	device_pda = 64,
	device_detector_scientific = 65,
	device_detector_simple = 66,
	device_torch = 67,
	equ_exo = 68,
	equ_military = 69,
	equ_scientific = 70,
	equ_stalker = 71,
	equ_backpack = 72,
	helmet = 73,
	equ_helmet_s = 74,
	equ_stalker_s = 75,
	wpn_grenade_f1 = 76,
	wpn_grenade_f1_s = 77,
	wpn_grenade_fake = 78,
	level = 79,
	game = 80,
	wpn_grenade_rgd5 = 81,
	wpn_grenade_rgd5_s = 82,
	wpn_grenade_rpg7 = 83,
	hud_manager = 84,
	obj_antirad = 85,
	obj_attachable = 86,
	obj_bandage = 87,
	obj_bolt = 88,
	obj_bottle = 89,
	obj_document = 90,
	obj_explosive = 91,
	obj_food = 92,
	obj_medkit = 93,
	level_changer = 94,
	level_changer_s = 95,
	main_menu = 96,
	mp_players_bag = 97,
	online_offline_group = 98,
	online_offline_group_s = 99,
	actor = 100,
	obj_breakable = 101,
	obj_climable = 102,
	destrphys_s = 103,
	hanging_lamp = 104,
	obj_holder_ent = 105,
	inventory_box = 106,
	obj_physic = 107,
	script_phys = 108,
	projector = 109,
	obj_phys_destroyable = 110,
	obj_phskeleton = 111,
	script_zone = 112,
	artefact_s = 113,
	car_s = 114,
	script_object = 115,
	smart_cover = 116,
	smart_terrain = 117,
	smart_zone = 118,
	smartcover_s = 119,
	bloodsucker_s = 120,
	boar_s = 121,
	burer_s = 122,
	cat_s = 123,
	chimera_s = 124,
	controller_s = 125,
	psy_dog_phantom_s = 126,
	psy_dog_s = 127,
	dog_s = 128,
	flesh_s = 129,
	gigant_s = 130,
	fracture_s = 131,
	poltergeist_s = 132,
	pseudodog_s = 133,
	rat_s = 134,
	snork_s = 135,
	tushkano_s = 136,
	zombie_s = 137,
	hlamp_s = 138,
	space_restrictor = 139,
	script_restr = 140,
	spectator = 141,
	game_sv_artefact_hunt = 142,
	game_sv_capture_the_artefact = 143,
	game_sv_deathmatch = 144,
	game_sv_single = 145,
	game_sv_team_deathmatch = 146,
	script_actor = 147,
	obj_explosive_s = 148,
	obj_food_s = 149,
	inventory_box_s = 150,
	wpn_ammo_m209_s = 151,
	wpn_ammo_og7b_s = 152,
	obj_pda_s = 153,
	wpn_ammo_vog25_s = 154,
	device_torch_s = 155,
	game_ui_artefact_hunt = 156,
	game_ui_capture_the_artefact = 157,
	game_ui_deathmatch = 158,
	game_ui_single = 159,
	game_ui_team_deathmatch = 160,
	wpn_ak74_s = 161,
	wpn_auto_shotgun_s = 162,
	wpn_binocular_s = 163,
	wpn_bm16_s = 164,
	wpn_grenade_launcher_s = 165,
	wpn_groza_s = 166,
	wpn_hpsa_s = 167,
	wpn_knife_s = 168,
	wpn_lr300_s = 169,
	wpn_pm_s = 170,
	wpn_rg6_s = 171,
	wpn_rpg7_s = 172,
	wpn_scope_s = 173,
	wpn_shotgun_s = 174,
	wpn_silencer_s = 175,
	wpn_svd_s = 176,
	wpn_svu_s = 177,
	wpn_usp45_s = 178,
	wpn_val_s = 179,
	wpn_vintorez_s = 180,
	wpn_walther_s = 181,
	wpn_ak74 = 182,
	wpn_binocular = 183,
	wpn_bm16 = 184,
	wpn_fn2000 = 185,
	wpn_fort = 186,
	wpn_grenade_launcher = 187,
	wpn_groza = 188,
	wpn_hpsa = 189,
	wpn_knife = 190,
	wpn_lr300 = 191,
	wpn_pm = 192,
	wpn_rg6 = 193,
	wpn_rpg7 = 194,
	wpn_scope = 195,
	wpn_shotgun = 196,
	wpn_silencer = 197,
	wpn_stat_mgun = 198,
	wpn_svd = 199,
	wpn_svu = 200,
	wpn_usp45 = 201,
	wpn_val = 202,
	wpn_vintorez = 203,
	wpn_walther = 204,
	wpn_wmagaz = 205,
	wpn_wmaggl = 206,
	zone_ameba_s = 207,
	zone_bfuzz_s = 208,
	zone_galant_s = 209,
	zone_mbald_s = 210,
	zone_mincer_s = 211,
	zone_nograv_s = 212,
	zone_radio_s = 213,
	zone_torrid_s = 214,
	zone_acid_fog = 215,
	ameba_zone = 216,
	zone_bfuzz = 217,
	zone_campfire = 218,
	zone_dead = 219,
	zone_galantine = 220,
	zone_mosquito_bald = 221,
	zone_mincer = 222,
	nogravity_zone = 223,
	zone_radioactive = 224,
	zone_rusty_hair = 225,
	team_base_zone = 226,
	torrid_zone = 227,
	zone = 228,
}