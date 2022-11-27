import { Log } from "../../StalkerModBase";
import { MinQuality, MaxQuality } from "../Configs/Loot";
import { StatBonusType, StatType } from "../Configs/Stats";
import { MWObject } from "./MWObject";

export abstract class MWItem extends MWObject {
    get Quality(): number { return this.Load("Quality"); }
    set Quality(quality: number) { this.Save("Quality", quality); }

    override OnFirstTimeInitialize(): void {
        super.OnFirstTimeInitialize()
        let spawnCfg = this.Load<ItemSpawnParams>("SpawnParams", {Level: 1, Quality: 1})

        this.Level = spawnCfg.Level;
        this.Quality = math.max(MinQuality, math.min(MaxQuality, spawnCfg.Quality));

        this.GenerateStats();
    }

    get Description(): string{ return "" }

    public OnItemPickedUp(){
        Log(`OnItemPickedUp ${this.SectionId}`)
        this.GO.set_condition(100)
    }

    public GetPlayerStatBonusesOnEquip(): StatType[] { return [] }

    public OnItemEquipped(){
        Log(`OnItemEquipped ${this.SectionId}`)
        let source = `${this.id}`;
        for(let stat of this.GetPlayerStatBonusesOnEquip()){
            MonsterWorld.Player.AddStatBonus(stat, StatBonusType.Flat, this.GetTotalFlatBonus(stat), source)
            MonsterWorld.Player.AddStatBonus(stat, StatBonusType.Pct, this.GetTotalPctBonus(stat), source)
            MonsterWorld.Player.AddStatBonus(stat, StatBonusType.Mult, this.GetTotalMultBonus(stat), source)
        }
    }

    public OnItemUnequipped(){
        Log(`OnItemUnequipped ${this.SectionId}`)
        let source = `${this.id}`;
        for(let stat of this.GetPlayerStatBonusesOnEquip()){
            MonsterWorld.Player.RemoveStatBonuses(stat, source)
        }
    }

    GenerateStats(){
        Log(`GenerateStats ${this.SectionId}`)
    }
}

export type ItemSpawnParams = {
    Level: number;
    Quality: number;
}