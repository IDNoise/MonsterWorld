declare interface Hit {
  direction: Vector;
  draftsman: GameObject;
  impulse: number;
  power: number;
  type : HitType;
  weapon_id : number;

  bone(boneName: string): void;
}

declare interface CallbackReturnFlags {
  ret_value: boolean;
}

declare namespace db{
  const actor: GameObject;
}

declare namespace sim_squad_scripted{
  namespace sim_squad_scripted{
    function create_npc(this: void, spawn_smart : any, pos: Vector, lvid:LevelVertexId, gvid:GameVertexId): void;
  }
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
  function object_by_id(id: number): GameObject;
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

declare namespace item_knife{
  function is_equipped(): boolean;
  function get_condition(): number;
  function can_loot(monster: GameObject): boolean;
  function degradate(): void;
  function is_axe(): boolean;
}