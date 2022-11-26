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

export function SumArray<T>(array: T[], valueGetter: (element: T) => number): number{
    let result: number = 0;
    for(let element of array){
        result += valueGetter(element);
    }
    return result;
}

export function SumTable<K extends AnyNotNil, V>(table: LuaTable<K, V>, valueGetter: (key: K, value: V) => number): number{
    let result: number = 0;
    for(let [key, value] of table){
        result += valueGetter(key, value);
    }
    return result;
}