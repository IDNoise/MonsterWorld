import { MinQuality, MaxQuality } from "../Configs/Loot";
import { StatBonusType, StatType } from "../Configs/Stats";
import { MWObject } from "./MWObject";

export abstract class MWItem extends MWObject {
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

    public GetPlayerStatBonusesOnEquip(): StatType[] {
        return [
            StatType.MaxHP,
            StatType.DamageResistancePct,
        ];
    }

    public OnItemEquipped(){
        let source = `${this.id}`;
        for(let stat of this.GetPlayerStatBonusesOnEquip()){
            MonsterWorld.Player.AddStatBonus(stat, StatBonusType.Flat, this.GetTotalFlatBonus(stat), source)
            MonsterWorld.Player.AddStatBonus(stat, StatBonusType.Pct, this.GetTotalPctBonus(stat), source)
            MonsterWorld.Player.AddStatBonus(stat, StatBonusType.Mult, this.GetTotalMultBonus(stat), source)
        }
    }

    public OnItemUnequipped(){
        let source = `${this.id}`;
        for(let stat of this.GetPlayerStatBonusesOnEquip()){
            MonsterWorld.Player.RemoveStatBonuses(stat, source)
        }
    }

    GeneateStats(){

    }
}

export type ItemSpawnParams = {
    level: number;
    quality: number;
}