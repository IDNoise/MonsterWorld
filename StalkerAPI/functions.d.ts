declare function log(this: void, data: string): void
declare function time_global(): number
declare function se_save_var<T>(id: number, name: string, varname: string, val: T): void;
declare function se_load_var<T>(id: number, name: string, varname: string): T;

type LevelVertexId = number;
type GameVertexId = number;

type WorldPosition = [vector, LevelVertexId, GameVertexId];
type CreateItemParams = LuaTable | AmmoParams;
type AmmoParams = {ammo: number};
declare function alife_create_item(section: string, place: game_object | WorldPosition, params: CreateItemParams): void;

type ScriptCallback = (...args: any[]) => void;
declare function RegisterScriptCallback(this: void, callbackName: string, callback : ScriptCallback) : game_object;
