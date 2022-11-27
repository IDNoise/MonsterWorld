import { GetBonusDescription, StatTitles, StatType } from "../Configs/Stats";
import { MWItem } from './MWItem';
import { ObjectType } from "./MWObject";

export class MWStimpack extends MWItem {

    get Type(): ObjectType { return ObjectType.Stimpack }

    get Description(): string{
        let result = "";

        result += `Heals for ${this.GetStat(StatType.HealPct)}% of ${StatTitles[StatType.MaxHP]}`

        return result;
    }

    override GenerateStats(): void {
        super.GenerateStats();

        this.SetStatBase(StatType.HealPct, ini_sys.r_float_ex(this.Section, "mw_heal_pct"))
    }
}

