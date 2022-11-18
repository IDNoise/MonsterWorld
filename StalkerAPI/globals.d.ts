//data
declare const SIMBOARD : simulation_board;
declare const is_squad_monster : LuaMap<string, boolean>;

//funs
declare function callstack(): void;
declare function reload_ini_sys(): void;
declare function log(this: void, data: string): void
declare function time_global(): number
declare function se_save_var<T>(id: number, name: string, varname: string, val: T): void;
declare function se_load_var<T>(id: number, name: string, varname: string): T;

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
// declare function get_hud()
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
// declare function reload_system_ini()        -- Alundaio: Reloads system_ini. Can be done in-game
// declare function alife()
// declare function flush()
// declare function editor()
// declare function bit_or(number, number)
// declare function prefetch(string)
// declare function time_global()
// declare function time_continual() -- like time_global but not stopped when the game is paused (used for some UI screens)
// declare function verify_if_thread_is_running()
// declare function script_server_object_version()
// declare function bit_not(number)
// declare function ef_storage()
// declare function user_name()
// declare function bit_xor(number, number)

// declare function GetARGB(number, number, number, number)
// declare function GetFontSmall()
// declare function GetFontMedium()
// declare function GetFontDI()
// declare function GetFontLetterica16Russian()
// declare function GetFontLetterica18Russian()
// declare function GetFontLetterica25()
// declare function GetFontGraffiti19Russian()
// declare function GetFontGraffiti22Russian()
// declare function GetFontGraffiti32Russian()
// declare function GetFontGraffiti50Russian()

//alife
type WorldPosition = [vector, LevelVertexId, GameVertexId];
type CreateItemParams = LuaTable | AmmoParams;
type AmmoParams = {ammo: number};
declare function alife_create_item(section: string, place: game_object | WorldPosition, params: CreateItemParams): void;
declare function alife_create(section: string, place: vector | smart_terrain.se_smart_terrain, lvid?: LevelVertexId, gvid?: GameVertexId): any; //TODO

//script callbacks
declare interface CallbackReturnFlags {
    ret_value: boolean;
    disabled: boolean;
}
type ScriptCallback = (...args: any[]) => void;
declare function RegisterScriptCallback(this: void, callbackName: string, callback : ScriptCallback) : game_object;