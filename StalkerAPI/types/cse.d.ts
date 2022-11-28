type ServerObjectTypeActor = "se_actor";
type ServerObjectTypeArtefact = "se_artefact";
type ServerObjectTypeCar = "se_car";
type ServerObjectTypeHeli = "se_heli";
type ServerObjectTypeItem = "se_outfit" | "se_helmet" 
| "se_weapon" 
| "se_weapon_shotgun"  | "se_weapon_automatic_shotgun" 
| "se_weapon_magazined" | "se_weapon_magazined_w_gl" 
| "se_item" | "se_item_torch"  
| "se_ammo" | "se_grenade" | "se_explosive" 
| "se_eatable" | "se_pda" | "se_detector" 
| "se_physic" | "se_lamp"| "se_mgun" | "se_invbox";

type ServerObjectTypeLevelChanger = "se_level_changer";
type ServerObjectTypeMonster = "se_monster";
type ServerObjectTypeSmartCover = "se_smart_cover";
type ServerObjectTypeStalker = "se_stalker" | "se_trader";
type ServerObjectTypeZones = "se_zone_anom" | "se_zone_torrid" | "se_zone_visual" | "se_restrictor";
type ServerObjectTypeSimSquadScripted = "sim_squad_scripted";
type ServerObjectTypeSmartTerrain = "se_smart_terrain";

type ServerObjectType = ServerObjectTypeActor | ServerObjectTypeArtefact | ServerObjectTypeCar 
| ServerObjectTypeHeli | ServerObjectTypeItem | ServerObjectTypeLevelChanger 
| ServerObjectTypeMonster | ServerObjectTypeSmartCover | ServerObjectTypeStalker 
| ServerObjectTypeZones | ServerObjectTypeSimSquadScripted | ServerObjectTypeSmartTerrain; 

type Reputation = number;
type Rank = number;
type Community = string;
type ProfileName = string;
type ScriptVersion = number;
type StoryId = number;
type StartupAnimation = any;//TODO
type Group = number;
type Squad = number;
type Team = number;
type GroupId = number;
type SmartTerrainId = number;

declare interface cpure_server_object {}
declare interface cse_alife_group_abstract {}
declare interface cse_visual {}
declare interface cse_motion {}
declare interface cse_ph_skeleton {}
declare interface cse_shape {}
declare interface cse_alife_inventory_item {}
declare interface ipure_schedulable_object {}
declare interface cse_alife_schedulable extends ipure_schedulable_object {
    update(): void;
}
declare interface cse_alife_object_climable extends cse_shape,cse_abstract {}

declare interface cse_alife_trader_abstract {
  profile_name(): ProfileName;
  reputation(): Reputation;
  rank(): Rank;
  community(): Community;
}

declare interface cse_abstract extends cpure_server_object {
  angle: vector;
  id: Id;
  parent_id: number;
  position: vector;
  script_version: ScriptVersion;

  name(): string;
  clsid(): ClsId;
  section_name(): Section;
  spawn_ini(): string; //TODO - WTF?
  init(): void;
  // function UPDATE_Read(net_packet&)
  // function STATE_Read(net_packet&, number)
  // function UPDATE_Write(net_packet&)
  // function STATE_Write(net_packet&)
}

declare interface cse_spectator extends cse_abstract {}
declare interface cse_temporary extends cse_abstract {}
declare interface cse_alife_graph_point extends cse_abstract {}

declare interface cse_alife_object extends cse_abstract {
  m_game_vertex_id: GameVertexId;
  m_level_vertex_id: LevelVertexId;
  m_story_id: StoryId;
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

declare interface CSE_AbstractVisual extends cse_visual,cse_abstract {
  getStartupAnimation(): StartupAnimation;
}

declare interface cse_alife_dynamic_object extends cse_alife_object {
  switch_offline(): void;
  switch_online(): void;
  keep_saved_data_anyway(): void;
  on_register(): void;
  on_before_register(): void;
  on_spawn(): void;
  on_unregister(): void;
}

declare interface cse_alife_space_restrictor extends cse_alife_dynamic_object,cse_shape {}
declare interface cse_alife_team_base_zone extends cse_alife_space_restrictor {}
declare interface cse_alife_level_changer extends cse_alife_space_restrictor {}
declare interface cse_alife_smart_zone extends cse_alife_space_restrictor,cse_alife_schedulable {
  // function detect_probability()
  // function smart_touch(cse_alife_monster_abstract*)
  // function unregister_npc(cse_alife_monster_abstract*)
  // function register_npc(cse_alife_monster_abstract*)
  // function suitable(cse_alife_monster_abstract*) const
  // function task(cse_alife_monster_abstract*)
  enabled(): boolean;
}

declare interface cse_custom_zone extends cse_alife_dynamic_object,cse_shape {}
declare interface cse_anomalous_zone extends cse_custom_zone {}
declare interface cse_zone_visual extends cse_anomalous_zone,cse_visual {}
declare interface cse_torrid_zone extends cse_custom_zone,cse_motion {}

declare interface cse_smart_cover extends cse_alife_dynamic_object {
  // function description() const
  // function set_available_loopholes(object)  
}

declare interface cse_alife_online_offline_group extends cse_alife_dynamic_object,cse_alife_schedulable {
  // function register_member(number)
  // function clear_location_types()
  // function get_current_task()
  // function commander()
  // function unregister_member(number)
  squad_members(): {id: Id}[]
  // function force_change_position(vector)
  // function add_location_type(string)
  npc_count(): number;
}

declare interface cse_alife_dynamic_object_visual extends cse_alife_dynamic_object,cse_visual {}

declare interface cse_alife_car extends cse_alife_dynamic_object_visual,cse_ph_skeleton {}
declare interface cse_alife_helicopter extends cse_alife_dynamic_object_visual,cse_motion,cse_ph_skeleton {}
declare interface cse_alife_inventory_box extends cse_alife_dynamic_object_visual {}
declare interface cse_alife_trader extends cse_alife_dynamic_object_visual,cse_alife_trader_abstract {}
declare interface cse_alife_ph_skeleton_object extends cse_alife_dynamic_object_visual,cse_ph_skeleton {}
declare interface cse_alife_mounted_weapon extends cse_alife_dynamic_object_visual {}
declare interface cse_alife_object_breakable extends cse_alife_dynamic_object_visual {}
declare interface cse_alife_object_hanging_lamp extends cse_alife_dynamic_object_visual,cse_ph_skeleton {}
declare interface cse_alife_object_physic extends cse_alife_dynamic_object_visual,cse_ph_skeleton {}
declare interface cse_alife_object_projector extends cse_alife_dynamic_object_visual {}

declare interface cse_alife_creature_abstract extends cse_alife_dynamic_object_visual {
  group: Group; 
  squad: Squad; 
  team: Team;

  on_death(): void;
  alive(): boolean;
  g_team(): Team;
  g_group(): Group;
  g_squad(): Squad;
  health(): number;
  o_torso(): void;//TODO - WTF?
}

declare interface cse_alife_creature_actor extends cse_alife_creature_abstract,cse_alife_trader_abstract,cse_ph_skeleton {}
declare interface cse_alife_creature_crow extends cse_alife_creature_abstract {}
declare interface cse_alife_creature_phantom extends cse_alife_creature_abstract {}

declare interface cse_alife_monster_abstract extends cse_alife_creature_abstract, cse_alife_schedulable {
  group_id: GroupId;
  m_smart_terrain_id: SmartTerrainId;

  kill():void;
  update():void;
  force_set_goodwill(val1: number, val2: number):void;//TODO - WTF?
  clear_smart_terrain():void;
  travel_speed(): number;
  travel_speed(speed: number):void;
  smart_terrain_task_deactivate():void;
  smart_terrain_task_activate():void;
  current_level_travel_speed(): number;
  current_level_travel_speed(speed: number):void;
  brain(): CALifeMonsterBrain;
  has_detector(): boolean;
  smart_terrain_id(): SmartTerrainId;
  rank(): Rank;
}

declare interface cse_alife_monster_base extends cse_alife_monster_abstract,cse_ph_skeleton {}
declare interface cse_alife_psydog_phantom extends cse_alife_monster_base {}
declare interface cse_alife_monster_rat extends cse_alife_monster_abstract,cse_alife_inventory_item {}
declare interface cse_alife_monster_zombie extends cse_alife_monster_abstract {}
declare interface cse_alife_human_abstract extends cse_alife_trader_abstract,cse_alife_monster_abstract {
    set_rank(rank: Rank): void;
    brain(): CALifeHumanBrain;
}
declare interface cse_alife_human_stalker extends cse_alife_human_abstract,cse_ph_skeleton {}

declare interface cse_alife_item extends cse_alife_dynamic_object_visual,cse_alife_inventory_item {
    bfUseful() : boolean;
}
declare interface cse_alife_item_ammo extends cse_alife_item {}
declare interface cse_alife_item_artefact extends cse_alife_item {}
declare interface cse_alife_item_bolt extends cse_alife_item {}
declare interface cse_alife_item_custom_outfit extends cse_alife_item {}
declare interface cse_alife_item_detector extends cse_alife_item {}
declare interface cse_alife_item_document extends cse_alife_item {}
declare interface cse_alife_item_explosive extends cse_alife_item {}
declare interface cse_alife_item_grenade extends cse_alife_item {}
declare interface cse_alife_item_pda extends cse_alife_item {}
declare interface cse_alife_item_torch extends cse_alife_item {}
declare interface cse_alife_item_weapon extends cse_alife_item {
    clone_addons(): any;//TODO - WTF?
}
declare interface cse_alife_item_weapon_auto_shotgun extends cse_alife_item_weapon {}
declare interface cse_alife_item_weapon_magazined extends cse_alife_item_weapon {}
declare interface cse_alife_item_weapon_magazined_w_gl extends cse_alife_item_weapon_magazined {}
declare interface cse_alife_item_weapon_shotgun extends cse_alife_item_weapon {}