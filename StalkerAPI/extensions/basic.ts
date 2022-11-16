export function Save<T>(object: game_object, varname: string, val: T): void {
    se_save_var(object.id(), object.name(), varname, val);
};

export function Load<T>(object: game_object, varname: string, def?: T): T {
    let result = se_load_var<T>(object.id(), object.name(), varname);
    if (!result && def) {
        return def;
    }
    return result;
};

export function CreateWorldPositionAtGO(object: game_object) : WorldPosition {
    return [object.position(), object.level_vertex_id(), object.game_vertex_id()];
}

export function CreateWorldPositionAtPosWithGO(pos: vector, object: game_object) : WorldPosition{
    return [pos, object.level_vertex_id(), object.game_vertex_id()];
}

export function CreateVector(x : number, y: number = 0, z: number = 0): vector {
    return new vector().set(x, y, z);
}