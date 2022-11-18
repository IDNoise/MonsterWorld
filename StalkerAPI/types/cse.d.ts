declare interface cse_abstract {
  angle: number;
  id: any; //TODO - WTF?
  parent_id: number;
  position: vector;
  script_version: any; //TODO - WTF?

  name(): string;
  clsid(): ClsId;
  section_name(): Section;
  spawn_ini(): string; //TODO - WTF?
  init(): void;
}

declare interface cse_alife_object extends cse_abstract {
  m_game_vertex_id: GameVertexId;
  m_level_vertex_id: LevelVertexId;
  m_story_id: any; //TODO - WTF?
  online: boolean;

  can_save(): boolean;
  interactive(): boolean; //TODO - WTF?

  can_switch_online(): boolean;
  can_switch_online(value: boolean): void;

  can_switch_offline(): boolean;
  can_switch_offline(value: boolean): void;

  move_offline(): boolean;
  move_offline(value: boolean): void;

  visible_for_map(): boolean;
  visible_for_map(value: boolean): void;

  used_ai_locations(): boolean;
  use_ai_locations(value: boolean): void;
}

declare interface cse_visual {}

declare interface cse_alife_dynamic_object extends cse_alife_object {

  switch_offline(): void;
  switch_online(): void;
  keep_saved_data_anyway(): void;
  move_offline(): boolean;
  move_offline(value: boolean): void;
  on_register(): void;
  on_before_register(): void;
  on_spawn(): void;
  on_unregister(): void;
}

declare interface cse_alife_dynamic_object_visual extends cse_alife_dynamic_object, cse_visual {}

declare interface cse_alife_creature_abstract extends cse_alife_dynamic_object_visual {
  group: any; //TODO - WTF?
  squad: any; //TODO - WTF?
  team: any; //TODO - WTF?

  on_death(): void;
  alive(): boolean;
  g_team(): any;//TODO - WTF?
  g_group(): any;//TODO - WTF?
  g_squad(): any;//TODO - WTF?
  health(): number;
  o_torso(): void;//TODO - WTF?
}

declare interface cse_alife_schedulable {}

declare interface cse_alife_monster_abstract extends cse_alife_creature_abstract, cse_alife_schedulable {
  group_id: any;//TODO - WTF?
  m_smart_terrain_id: any;//TODO - WTF?

  kill():void;
  update():void;
  //force_set_goodwill(number, number):void;
  clear_smart_terrain():void;
  travel_speed(): number;
  travel_speed(speed: number):void;
  smart_terrain_task_deactivate():void;
  smart_terrain_task_activate():void;
  current_level_travel_speed(): number;
  current_level_travel_speed(speed: number):void;
  brain(): any;//TODO - WTF?
  has_detector(): boolean;
  smart_terrain_id(): any;//TODO - WTF?
  rank(): any;//TODO - WTF?
}

declare interface cse_motion{} 
declare interface cse_shape{} 
declare interface cse_ph_skeleton{}
declare interface cse_alife_monster_base extends cse_alife_monster_abstract, cse_ph_skeleton {
}