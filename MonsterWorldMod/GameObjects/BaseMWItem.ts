import { MinQuality, MaxQuality } from "../Configs/Loot";
import { StatType } from "../Configs/Stats";
import { BaseMWObject } from "./BaseMWObject";

export class BaseMWItem extends BaseMWObject {
    constructor(public id: Id) {
        super(id);
    }

    get Quality(): number { return this.Load("Quality"); }
    set Quality(quality: number) { this.Save("Quality", quality); }

    override OnFirstTimeInitialize(): void {
        let spawnCfg = this.Load<ItemSpawnParams>("SpawnParams", {level: 1, quality: 1})

        this.Level = spawnCfg.level;
        this.Quality = math.max(MinQuality, math.min(MaxQuality, spawnCfg.quality));

        this.GeneateStats();
    }

    get Description(): string{ return "" }

    public OnItemPickedUp(){
        //Log(`OnItemPickedUp`)
        this.GO.set_condition(100)
    }

    GeneateStats(){

    }
}

export type ItemSpawnParams = {
    level: number;
    quality: number;
}