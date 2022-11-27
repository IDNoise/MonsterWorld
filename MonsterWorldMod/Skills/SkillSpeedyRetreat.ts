import { MWMonster } from '../GameObjects/MWMonster';
import { Skill } from './Skill';
import { StatBonusType, StatType } from '../Configs/Stats';



export class SkillSpeedyRetreat extends Skill {
    constructor(public CriticalHpPct: number, public CDPerLevel: (level: number) => number, public DurationPerLevel: (level: number) => number, public SpeedBonusPct: (level: number) => number,
        public PriceFormula?: (level: number) => number, public MaxLevel: number = -1) {
        super(PriceFormula, MaxLevel);
    }

    get Description(): string { return `When HP drops to critical level (${this.CriticalHpPct}%) speed is increased by ${this.SpeedPct}% for ${this.Duration} seconds. CD: ${this.CD} seconds`; }

    get CD(): number { return this.CDPerLevel(this.Level); }
    get SpeedPct(): number { return this.SpeedBonusPct(this.Level); }
    get Duration(): number { return this.DurationPerLevel(this.Level); }

    get TimeSinceLastActivation(): number { return this.Load("TimeSinceLastActivation", 0); }
    set TimeSinceLastActivation(time: number) { this.Save("TimeSinceLastActivation", time); }

    override Update(deltaTime: number): void {
        super.Update(deltaTime);
        this.TimeSinceLastActivation -= deltaTime;
    }

    override OnPlayerHit(monster: MWMonster, damage: number): void {
        if (this.TimeSinceLastActivation > 0)
            return;

        let player = MonsterWorld.Player;
        if (player.IsDead)
            return;

        if (player.HP / player.MaxHP > this.CriticalHpPct / 100)
            return;

        player.AddStatBonus(StatType.RunSpeedMult, StatBonusType.Pct, this.SpeedPct, this.Id, this.Duration);
        this.TimeSinceLastActivation = this.CD;
    }
}


