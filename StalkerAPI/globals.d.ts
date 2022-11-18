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

/** @customConstructor ini_file */
declare class ini_file{
    constructor(fname: string);
    //r_string_ex(ini,s,k,def)
    //r_bool_ex(ini,s,k,def)
    //r_float_ex(ini,s,k,def)
    //r_sec_ex(ini,s,k,def)
    //r_line_ex(ini,s,k)
    //r_string_to_condlist(ini,s,k,def)
    //r_list(ini,s,k,def)
    //r_mult(ini,s,k,...)
}

/** @customConstructor ini_file_ex */
declare class ini_file_ex{
    fname: string;
    ini: ini_file;

    constructor(fname: string, advanced_mode: boolean);

    save(): void;
    //r_value(s,k,typ,def)
    //w_value(s,k,val,comment)
    //collect_section(section)
    //get_sections(keytable)
    //remove_line(section,key)
    //section_exist(section)
    //line_exist(section,key)
    //r_string_ex(s,k)
    //r_bool_ex(s,k,def)
    //r_string(s,k)
    //r_float_ex(s,k)
    //r_string_to_condlist(s,k,def)
    //r_list(s,k,def)
    //r_mult(s,k,...)
}