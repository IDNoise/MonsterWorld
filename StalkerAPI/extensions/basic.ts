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

export function IsPctRolled(value: number): boolean {
    return math.random(1, 100) <= value;
}

export function MapToTable<K extends AnyNotNil, V>(map: Map<K, V>) : LuaTable<K, V>{
    let result = new LuaTable<K, V>();
    map.forEach((v, k, _map) => result.set(k, v));
    return result;
}


export function TableToMap<K extends AnyNotNil, V>(tbl: LuaTable<K, V>) : Map<K, V>{
    
    let result = new Map<K, V>();
    for(const [key, value] of tbl)
        result.set(key, value);
    return result;
}

export function RandomFromArray<T>(array: T[]): T{
    const index = math.random(0, array.length - 1);
    return array[index];
}

export function TakeRandomElementFromArray<T>(array: T[]): T {
    const index = math.random(0, array.length - 1);
    const element = array[index];
    array.splice(index, 1);
    return element;
}

export function TakeRandomUniqueElementsFromArray<T>(array: T[], count: number): T[] {
    let result: T[] = [];
    count = math.min(count, array.length)
    for(let i = 0; i < count; i++){
        result.push(TakeRandomElementFromArray(array))
    }
    return result;
}


export function NumberToCondList(value: number) : Condlist{
    return xr_logic.parse_condlist(null, null, null, `${value}`)
}

export function GetByWeightFromArray<T>(array: T[], weightGetter: (element:T) => number) : T {
    let totalWeight = 0;
    for(let element of array){
        totalWeight += weightGetter(element);
    }

    let randValue = math.random(1, totalWeight);
    let weightStartCheck = 0;
    for(let element of array){
        weightStartCheck += weightGetter(element);

        if (randValue <= weightStartCheck){
            return element;
        }
    }
    return array[0];
}

export function GetByWeightFromTable<TK extends AnyNotNil, TV>(tbl: LuaTable<TK, TV>, weightGetter: (value: TV) => number) : TK {
    let totalWeight = 0;
    let keys: TK[] = []
    for(const [k, v] of tbl) {
        keys.push(k)
        totalWeight += weightGetter(v);
    }

    let randValue = math.random(1, totalWeight);
    let weightStartCheck = 0;
    let first: TK | undefined = undefined;
    for(let [k, v] of tbl){
        weightStartCheck += weightGetter(v);

        if (randValue <= weightStartCheck){
            return k;
        }
    }

    return keys[0];
}