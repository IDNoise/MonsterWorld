export function Save<T>(object: Obj, varname: string, val: T): void {
    se_save_var(object.id(), object.name(), varname, val);
};

export function Load<T>(object: Obj, varname: string, def?: T): T {
    let result = se_load_var<T>(object.id(), object.name(), varname);
    if (!result && def) {
        return def;
    }
    return result;
};

export function CreateWorldPosition(object: Obj) : WorldPosition{
    return [object.position(), object.level_vertex_id(), object.game_vertex_id()];
}