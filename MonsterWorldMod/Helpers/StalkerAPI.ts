export function Save<T>(id: Id, varname: string, val: T): void {
    se_save_var(id, "", varname, val);
};

export function Load<T>(id: Id, varname: string, def?: T): T {
    let result = se_load_var<T>(id, "", varname);
    if (!result && def) {
        return def;
    }
    return result;
};

export function CreateWorldPositionAtGO(object: game_object) : WorldPosition {
    return [object.position(), object.level_vertex_id(), object.game_vertex_id()];
}

export function CreateWorldPositionAtPosWithGO(offset: vector, object: game_object) : WorldPosition{
    return [object.position().add(offset), object.level_vertex_id(), object.game_vertex_id()];
}

export function CreateVector(x : number, y: number = 0, z: number = 0): vector {
    return new vector().set(x, y, z);
}

export function EnableMutantLootingWithoutKnife(): void {
    item_knife.is_equipped = () => true;
    item_knife.get_condition = () => 1;
    item_knife.degradate = () => { };
    item_knife.can_loot = (monster) => true;
    item_knife.is_axe = () => false;
}

export function NumberToCondList(value: number) : Condlist{
    return xr_logic.parse_condlist(null, null, null, `${value}`)
}

export type ObjectOrId = Id | game_object | cse_alife_object

export function GetId(objOrId: ObjectOrId): Id {
    if (typeof(objOrId) == "number"){
        return objOrId;
    }

    if (objOrId == undefined){
        return -1;
    }

    if (typeof(objOrId.id) == "number"){
        return objOrId.id
    }

    if (typeof(objOrId.id) == "function"){
        return objOrId.id();
    }

    return -1;
}