import { StatType, StatBonusType, StatTitles, PctStats } from "../Configs/Stats";
import { MWObject } from "../GameObjects/MWObject";
import { Skill } from "./Skill";

export class SkillPassiveStatBonus extends Skill {
    constructor(public Stat: StatType, public BonusType: StatBonusType,
        public ValuePerLevel: (level: number) => number, public PriceFormula?: (level: number) => number, public MaxLevel: number = -1) {
        super(PriceFormula, MaxLevel);
    }

    override UpdateLevelBonuses(): void {
        super.UpdateLevelBonuses();
        this.Owner.AddStatBonus(this.Stat, this.BonusType, this.Value, this.Id);
    }

    get Description(): string {
        let value = this.Value;
        let statTitle = StatTitles[this.Stat];
        if (this.BonusType == StatBonusType.Flat) {
            return `${statTitle} ${value > 0 ? "+" : ""}${value}${PctStats.includes(this.Stat) ? "%" : ""}`;
        }
        else if (this.BonusType == StatBonusType.Pct) {
            return `${statTitle} ${value > 0 ? "+" : ""}${value}%`;
        }
        return `${statTitle} x${value}`;
    }

    get Value(): number { return this.ValuePerLevel(this.Level); }
}
