declare function log(this: void, data: string): void
declare function time_global(): number
declare function se_save_var<T>(id: number, name: string, varname: string, val: T): void;
declare function se_load_var<T>(id: number, name: string, varname: string): T;

type LevelVertexId = number;
type GameVertexId = number;

type ALifePosition = [Vector, LevelVertexId, GameVertexId];
declare function alife_create_item(section: string, place: Object | ALifePosition, params: LuaTable): void;

type ScriptCallback = (...args: any[]) => void;
declare function RegisterScriptCallback(this: void, callbackName: string, callback : ScriptCallback) : Object;
