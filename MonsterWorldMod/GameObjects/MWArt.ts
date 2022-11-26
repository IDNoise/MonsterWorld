import { StatType } from "../Configs/Stats";
import { BaseMWObject } from "./BaseMWObject";

export class MWWeapon extends BaseMWObject {
    constructor(public id: Id) {
        super(id);
    }

    // override OnFirstTimeInitialize(): void {
    //     let spawnCfg = this.Load<ArtSpawnParams>("SpawnParams", {level: 1, quality: 1})

    //     this.Level = spawnCfg.level;
    //     this.Quality = math.max(MinQuality, math.min(MaxQuality, spawnCfg.quality));
    //     this.DescriptionBonuses = new LuaTable();

    //     this.GenerateArtStats();
    // }

    // get Quality(): number { return this.Load("Quality"); }
    // set Quality(quality: number) { this.Save("Quality", quality); }

    // get DescriptionBonuses(): LuaTable<WeaponBonusParamType, number> { return this.Load("GeneratedBonuses"); }
    // set DescriptionBonuses(bonuses: LuaTable<WeaponBonusParamType, number>) { this.Save("GeneratedBonuses", bonuses); }

    // public GetBonusDescription(): string{
    //     let result = "";

    //     for(const type of WeaponStatsForGeneration){
    //         const value = this.DescriptionBonuses.get(type) || 0;
    //         if (value != 0)
    //             result += GetBonusDescription(type, value) + " \\n";
    //     }

    //     return result;
    // }

    // public OnArtPickedUp(){
    //     //Log(`OnWeaponPickedUp`)
    //     this.GO.set_condition(100)
    // }
}

export type ArtSpawnParams = {
    level: number;
    quality: number;
}