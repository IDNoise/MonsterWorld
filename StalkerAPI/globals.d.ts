//data
declare const SIMBOARD : simulation_board;
declare const is_squad_monster : {[behaviour: string]: true};
declare const squad_community_by_behaviour : {[behaviour: string]: string};
declare const BoneID : {[key: string]: number};
declare const HitTypeID : {[key: string]: number};
declare const BoosterID : {[key: string]: number};
declare const SCANNED_SLOTS : {[key: number]: true};
declare const time_infinite : number;
declare const actor_move_states : {[key: string]: number};
declare const ini_sys: ini_file;

//funs
declare function callstack(): void;
declare function reload_ini_sys(): void;
declare function log(this: void, data: string): void;
declare function time_global(): number;
declare function time_continual(): number; //like time_global but not stopped when the game is paused (used for some UI screens)
declare function round(value: number): number;
declare function round_idp(value: number, idp?: number): number;
declare function round_100(value: number): number;
declare function odd(value: number): boolean;
declare function clamp(value: number, min: number, max: number): number;
declare function normalize(value: number, min: number, max: number): number;
declare function normalize_100(value: number, min: number, max: number): number;
declare function random_choice(...args: any[]): any;

declare function save_var<T>(obj: game_object, varname: string, val: T): void;
declare function load_var<T>(obj: game_object, varname: string, def: T): T;
declare function random_number(min?: number, max?: number): number;
declare function random_float(min: number, max: number): number;
declare function yaw(v1: vector, v2 : vector): number;
declare function yaw_degree(v1: vector, v2 : vector): number;
declare function yaw_degree3d(v1: vector, v2 : vector): number;
declare function vector_cross(v1: vector, v2 : vector): vector;
declare function vec_to_str(v: vector): string;
declare function vector_rotate_y(v: vector, angle: number): vector;
declare function distance_2d(v1: vector, v2: vector): number;
declare function distance_2d_sqr(v1: vector, v2: vector): number;

declare function trim(str: string): string;

declare function alife_on_limit(): boolean;
declare function alife_character_community(se_obj: cse_alife_object): Community;

declare function SetSwitchDistance(dist: number): void;
declare function get_actor_true_community() : Community;

declare function give_object_to_actor(section: Section, num: number): void;
declare function IsMoveState(state: string, compare_state?: string): boolean;

declare function se_save_var<T>(id: number, name: string, varname: string, val: T): void;
declare function se_load_var<T>(id: number, name: string, varname: string): T;

type LTable = LuaTable | {[key: string]: any};
type LArray = LuaTable | {[key: number]: any} | any[];

declare function iempty_table(table: LArray): void;
declare function empty_table(table: LTable): void;
declare function is_empty(table: LTable): boolean;
declare function is_not_empty(table: LTable): boolean;
declare function size_table(table: LTable): number;
declare function random_key_table(table: LTable): string;
declare function dup_table(table: LTable): LuaTable | {[key: string]: any};
declare function copy_table(source: LTable, target: LTable): void;

// declare function game_ini()
// declare function bit_and(number, number)
// declare function device()
// declare function cast_planner(action_base*)
// declare function IsGameTypeSingle()
// declare function game_graph()
// declare function dik_to_bind(number)
// declare function render_get_dx_level()
// declare function sell_condition(ini_file*, string)
// declare function sell_condition(number, number)
// declare function buy_condition(ini_file*, string)
// declare function buy_condition(number, number)
// declare function create_ini_file(string)
declare function get_hud(): CUIGameCustom
// declare function error_log(string)
// declare function command_line()
// declare function getFS()
// declare function valid_saved_game(string)
// declare function get_console()
// declare function app_ready()
// declare function IsDynamicMusic()
// declare function show_condition(ini_file*, string)
// declare function IsImportantSave()
// declare function system_ini()
declare function reload_system_ini(): void; //Alundaio: Reloads system_ini. Can be done in-game
declare function alife(): alife_simulator;
// declare function flush()
// declare function editor()
declare function bit_or(a: number, b: number): number;
// declare function prefetch(string)
// declare function verify_if_thread_is_running()
// declare function script_server_object_version()
declare function bit_not(a: number): number;
// declare function ef_storage()
// declare function user_name()
declare function bit_xor(a: number, b: number): number;

type ARGBColor = any;//TODO
declare function GetARGB(a: number, r: number, g: number, b: number): ARGBColor;
type CGameFont = any;//TODO
declare function GetFontSmall(): CGameFont;
declare function GetFontMedium(): CGameFont;
declare function GetFontDI(): CGameFont;
declare function GetFontLetterica16Russian(): CGameFont;
declare function GetFontLetterica18Russian(): CGameFont;
declare function GetFontLetterica25(): CGameFont;
declare function GetFontGraffiti19Russian(): CGameFont;
declare function GetFontGraffiti22Russian(): CGameFont;
declare function GetFontGraffiti32Russian(): CGameFont;
declare function GetFontGraffiti50Russian(): CGameFont;

declare const VEC_ZERO: vector;
declare const VEC_X: vector;
declare const VEC_Y: vector;
declare const VEC_Z: vector;

declare function vec_sub(a: vector, b: vector): vector;
declare function vec_add(a: vector, b: vector): vector;
declare function vec_set(a: vector): vector;

declare function IsStalker(obj: game_object, clsid?: ClsId): boolean;
declare function IsMonster(obj: game_object, clsid?: ClsId): boolean;
declare function IsAnomaly(obj: game_object, clsid?: ClsId): boolean;
declare function IsTrader(obj: game_object, clsid?: ClsId): boolean;
declare function IsCar(obj: game_object, clsid?: ClsId): boolean;
declare function IsHelicopter(obj: game_object, clsid?: ClsId): boolean;
declare function IsInvbox(obj: game_object, clsid?: ClsId): boolean;
declare function isLc(obj: game_object): boolean;
declare function IsWounded(obj: game_object): boolean;

declare function IsOutfit(obj: game_object, clsid?: ClsId): boolean;
declare function IsHeadgear(obj: game_object, clsid?: ClsId): boolean;
declare function IsExplosive(obj: game_object, clsid?: ClsId): boolean;
declare function IsPistol(obj: game_object, clsid?: ClsId): boolean;
declare function IsMelee(obj: game_object, clsid?: ClsId): boolean;
declare function IsSniper(obj: game_object, clsid?: ClsId): boolean;
declare function IsLauncher(obj: game_object, clsid?: ClsId): boolean;
declare function IsShotgun(obj: game_object, clsid?: ClsId): boolean;
declare function IsRifle(obj: game_object, clsid?: ClsId): boolean;
declare function IsWeapon(obj: game_object, clsid?: ClsId): boolean;
declare function IsAmmo(obj: game_object, clsid?: ClsId): boolean;
declare function IsGrenade(obj: game_object, clsid?: ClsId): boolean;
declare function IsBolt(obj: game_object, clsid?: ClsId): boolean;
declare function IsArtefact(obj: game_object, clsid?: ClsId): boolean;

declare function IsItem(typ: string, sec: Section, obj?: game_object): boolean;

declare function get_player_level_id(): LevelId;

declare function IsAzazelMode(): boolean;
declare function IsHardcoreMode(): boolean;
declare function IsStoryMode(): boolean;
declare function IsSurvivalMode(): boolean;
declare function IsAgonyMode(): boolean;
declare function IsTimerMode(): boolean;
declare function IsCampfireMode(): boolean;
declare function IsWarfare(): boolean;
declare function IsTestMode(): boolean;
declare function IsStoryPlayer(): boolean;


declare function get_story_se_object(story_id: StoryId) : cse_alife_object;
declare function get_story_se_item(story_id: StoryId) : cse_alife_item;
declare function get_story_object(story_id: StoryId) : game_object;
declare function get_object_story_id(obj_id: Id): StoryId;
declare function get_story_object_id(story_id: StoryId) : Id;
declare function get_story_squad(story_id: StoryId): cse_alife_online_offline_group; // ????
declare function unregister_story_object_by_id(obj_id: Id): void;
declare function level_object_by_sid( story_id: StoryId): game_object; // get game object by story id
declare function id_by_sid( story_id : StoryId): Id; //get object ID by story id

declare function pstor_is_registered_type(tv: string): boolean;
declare function save_ctime<T>(obj: game_object, varname: string, val: T): BoneId;
declare function load_ctime<T>(obj: game_object, varname: string): T;

declare function distance_between(obj1: game_object, obj2: game_object): number;
declare function distance_between_safe(obj1: game_object, obj2: game_object): number;

declare function get_object_by_id(id: Id): game_object;
declare function character_community(obj: game_object): Community;

//alife
type WorldPosition = [vector, LevelVertexId, GameVertexId];
type CreateItemParams = LuaTable | AmmoParams;
type AmmoParams = {ammo: number};
declare function alife_create_item(section: string, place: game_object | WorldPosition, params?: CreateItemParams): cse_alife_object;
declare function alife_create(section: string, place: vector | smart_terrain.se_smart_terrain, 
    lvid?: LevelVertexId, gvid?: GameVertexId): cse_alife_object; //TODO - more arguments?
declare function alife_object(id: Id): cse_alife_object;
declare function create_ammo(section: string, place: WorldPosition, lvid: LevelVertexId, gvid: GameVertexId, ownerId: Id, num: number): cse_alife_item_ammo[];
declare function alife_release(se_obj: cse_alife_object, msg?: string): void;

//script callbacks
declare interface CallbackReturnFlags {
    ret_value: boolean;
    disabled: boolean;
}
type ScriptCallback = (...args: any[]) => void;
declare function RegisterScriptCallback(callbackName: string, callback : ScriptCallback) : void;
declare function UnregisterScriptCallback(callbackName: string) : void;
declare function SendScriptCallback(callbackName: string, ...args: any[]) : void;
declare function AddScriptCallback(callbackName: string) : void;

//declare function  CreateTimeEvent(ev_id: string, act_id: string,timerSeconds: number, callback: (...args:any[]) => void, ...args: any[]): void;
declare function  CreateTimeEvent<T1, T2, T3, T4, T5, T6>(ev_id: string | number, act_id: string | number, timerSeconds: number, 
    callback: (arg1?: T1, arg2?: T2, arg3?: T3, arg4?: T4, arg5?: T5, arg6?: T6) => boolean, arg1?: T1, arg2?: T2, arg3?: T3, arg4?: T4, arg5?: T5, arg6?: T6): void;
declare function  RemoveTimeEvent(ev_id: string | number, act_id: string | number): void;
declare function  ResetTimeEvent(ev_id: string | number, act_id: string | number, timerSeconds: number): void;