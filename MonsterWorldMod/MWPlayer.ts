import { BaseMWObject, StatType } from './BaseMWObject';
import { MonsterWorld } from './MonsterWorld';
import * as cfg from './MonsterWorldConfig';

export class MWPlayer extends BaseMWObject {
    constructor(public mw: MonsterWorld, public id: Id) {
        super(mw, id);
    }

    override Initialize(): void {
        this.Level = 0;
        this.CurrentXP = 0;
        this.SetStatBase(StatType.MaxHP, cfg.PlayerHPBase)
        this.SetStatBase(StatType.RunSpeed, 1)
        this.SetStatBase(StatType.SprintSpeed, 1)
        this.SetStatBase(StatType.HPRegen, cfg.PlayerHPRegenBase)
    }

    get RequeiredXP(): number {
        let expMult = math.pow(cfg.PlayerXPExp, this.Level);
        let pctMult = (1 + cfg.PlayerXPPct * this.Level / 100)
        let xp = cfg.PlayerXPForFirstLevel * expMult * pctMult;
        return math.max(1, math.floor(xp))
    }

    get CurrentXP(): number { return this.Load("CurrentXP", 0); }
    set CurrentXP(exp: number) { 
        while (exp >= this.RequeiredXP){
            exp -= this.RequeiredXP;
            this.LevelUp();
        }
        this.Save("CurrentXP", exp); 
    }

    private LevelUp(): void{
        this.Level++;
        this.StatPoints += cfg.PlayerPointsPerLevelUp;
        this.UpdateLevelBonuses();
        this.mw.UIManager?.ShowLevelUpMessage(this.Level);
    }

    protected override Reinit(): void {
        super.Reinit();
        this.UpdateLevelBonuses();
    }

    UpdateLevelBonuses(): void{
        this.AddStatPctBonus(StatType.MaxHP, cfg.PlayerHPPerLevel * this.Level, "level_bonus");
        this.AddStatPctBonus(StatType.HPRegen, cfg.PlayerHPRegenPctPerLevel * this.Level, "level_bonus");
        this.AddStatPctBonus(StatType.RunSpeed, cfg.PlayerRunSpeedPctPerLevel * this.Level, "level_bonus");
    }

    get StatPoints(): number { return this.Load("StatPoints", 0); }
    set StatPoints(points: number) { this.Save("StatPoints", points); }

    protected override OnStatChanged(stat: StatType, total: number): void {
        super.OnStatChanged(stat, total);
        if (stat == StatType.RunSpeed){
            db.actor.set_actor_run_coef(cfg.PlayerRunSpeedCoeff * total)
            db.actor.set_actor_runback_coef(cfg.PlayerRunBackSpeedCoeff * total)
        }
        else if (stat == StatType.SprintSpeed){
            db.actor.set_actor_sprint_koef(cfg.PlayerSprintSpeedCoeff * total)
        }
    }
}