export function Save<T>(object: GameObject, varname: string, val: T): void {
    se_save_var(object.id(), object.name(), varname, val);
};

export function Load<T>(object: GameObject, varname: string, def?: T): T {
    let result = se_load_var<T>(object.id(), object.name(), varname);
    if (!result && def) {
        return def;
    }
    return result;
};

export function CreateWorldPositionAtGO(object: GameObject) : WorldPosition{
    return [object.position(), object.level_vertex_id(), object.game_vertex_id()];
}

export function CreateWorldPositionAtPosWithGO(pos: Vector, object: GameObject) : WorldPosition{
    return [pos, object.level_vertex_id(), object.game_vertex_id()];
}

export function CreateVector(x : number, y: number, z: number): Vector {
    return new Vector().set(x, y, z);
}