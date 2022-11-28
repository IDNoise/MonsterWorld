import { Log } from "../../StalkerModBase";
import { MinQuality, MaxQuality } from "../Configs/Loot";
import { StatBonusType, StatType, PctStats } from '../Configs/Stats';
import { MWObject } from "./MWObject";

export abstract class MWItem extends MWObject {
    public IsEquipped: boolean = false;

    get Quality(): number { return this.Load("Quality"); }
    set Quality(quality: number) { this.Save("Quality", quality); }

    override OnFirstTimeInitialize(): void {
        super.OnFirstTimeInitialize()
        let spawnCfg = this.Load<ItemSpawnParams>("SpawnParams", {Level: 1, Quality: 1})

        this.Level = spawnCfg.Level;
        this.Quality = math.max(MinQuality, math.min(MaxQuality, spawnCfg.Quality));
        this.GO.set_condition(100)

        this.GenerateStats();
    }

    get Description(): string{ return "" }

    public OnItemPickedUp(){
        //Log(`OnItemPickedUp ${this.SectionId}`)
        this.IterateSkills((s) => s.OnOwnerPickUp())
    }

    public GetPlayerStatBonusesOnEquip(): StatType[] { return [] }

    public OnItemEquipped(){
        this.IsEquipped = true;
        //Log(`OnItemEquipped ${this.SectionId}`)
        for(let stat of this.GetPlayerStatBonusesOnEquip()){
            MonsterWorld.Player.AddStatBonus(stat, StatBonusType.Flat, this.GetTotalFlatBonus(stat), this.SectionId)
            if (!PctStats.includes(stat)){
                MonsterWorld.Player.AddStatBonus(stat, StatBonusType.Pct, this.GetTotalPctBonus(stat), this.SectionId)
            }
        }
        this.IterateSkills((s) => s.OnOwnerEquip())
    }

    public OnItemUnequipped(){
        this.IsEquipped = false;
        //Log(`OnItemUnequipped ${this.SectionId}`)
        for(let stat of this.GetPlayerStatBonusesOnEquip()){
            MonsterWorld.Player.RemoveStatBonus(stat, StatBonusType.Flat, this.SectionId)
            if (!PctStats.includes(stat)){
                MonsterWorld.Player.RemoveStatBonus(stat, StatBonusType.Pct, this.SectionId)
            }
        }
        this.IterateSkills((s) => s.OnOwnerUnequip())
    }

    GenerateStats(){
        //Log(`GenerateStats ${this.SectionId}`)
    }
}

export type ItemSpawnParams = {
    Level: number;
    Quality: number;
}