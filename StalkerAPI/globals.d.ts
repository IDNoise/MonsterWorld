//data
declare const SIMBOARD : simulation_board;
declare const is_squad_monster : LuaMap<string, boolean>;

//funs
declare function callstack(): void;
declare function log(this: void, data: string): void
declare function time_global(): number
declare function se_save_var<T>(id: number, name: string, varname: string, val: T): void;
declare function se_load_var<T>(id: number, name: string, varname: string): T;

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
