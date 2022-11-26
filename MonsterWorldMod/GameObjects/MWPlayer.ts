import { BaseMWObject } from './BaseMWObject';
import { MWWeapon } from './MWWeapon';
import * as cfg from '../Configs/Constants';
import { PriceFormulaConstant, PriceFormulaLevel, Skill } from "../Skills/Skill";
import { SkillPassiveStatBonus } from "../Skills/SkillPassiveStatBonus";
import { SkillAuraOfDeath } from "../Skills/SkillAuraOfDeath";
import { SkillHealPlayerOnKill } from "../Skills/SkillHealPlayerOnKill";
import { SkillCriticalDeath } from '../Skills/SkillCriticalDeath';
import { StatType, StatBonusType } from '../Configs/Stats';

export class MWPlayer extends BaseMWObject {
    override OnFirstTimeInitialize(): void {
        this.Level = 0;
        this.CurrentXP = 0;
        this.SetStatBase(StatType.MaxHP, cfg.PlayerHPBase)
        this.SetStatBase(StatType.RunSpeed, 1)
        this.SetStatBase(StatType.SprintSpeed, 1)
        this.SetStatBase(StatType.HPRegen, cfg.PlayerHPRegenBase)

        this.SetStatBase(StatType.CritDamagePct, 0)
        this.AddStatBonus(StatType.CritDamagePct, StatBonusType.Flat, cfg.PlayerDefaultCritDamagePct, "initial")
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

    get Weapon(): MWWeapon | undefined { return MonsterWorld.GetWeapon(this.GO.active_item())}

    private LevelUp(): void{
        this.Level++;
        this.SkillPoints += cfg.SkillPointsPerLevelUp;
        this.UpdateLevelBonuses();
        MonsterWorld.UIManager?.ShowLevelUpMessage(this.Level);
    }

    protected override OnInitialize(): void {
        super.OnInitialize();
        this.UpdateLevelBonuses();
        this.GO.set_actor_max_weight(100000);
        this.GO.set_actor_max_walk_weight(100000);
    }

    override Update(deltaTime: number): void {
        super.Update(deltaTime);
        this.IterateSkills((s) => s.Update(deltaTime));
    }

    UpdateLevelBonuses(): void{
        this.AddStatBonus(StatType.MaxHP, StatBonusType.Pct, cfg.PlayerHPPerLevel * this.Level, "level_bonus");
        this.AddStatBonus(StatType.HPRegen, StatBonusType.Pct, cfg.PlayerHPRegenPctPerLevel * this.Level, "level_bonus");
        this.AddStatBonus(StatType.RunSpeed, StatBonusType.Pct, cfg.PlayerRunSpeedPctPerLevel * this.Level, "level_bonus");
    }

    get SkillPoints(): number { return this.Load("SkillPoints", 0); }
    set SkillPoints(points: number) { this.Save("SkillPoints", points); }

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

    override SetupSkills() {
        super.SetupSkills();
        this.AddSkill(new SkillPassiveStatBonus(`max_hp`, this, StatType.MaxHP, StatBonusType.Pct, (level: number) => 5 * level, PriceFormulaConstant(1), 50))
        this.AddSkill(new SkillPassiveStatBonus(`hp_regen`, this, StatType.HPRegen, StatBonusType.Pct, (level: number) => 10 * level, PriceFormulaConstant(1), 50))
        this.AddSkill(new SkillPassiveStatBonus(`run_speed`, this, StatType.RunSpeed, StatBonusType.Pct, (level: number) => 1 * level, PriceFormulaConstant(1), 50))
        this.AddSkill(new SkillPassiveStatBonus(`reload_speed`, this, StatType.ReloadSpeedBonusPct, StatBonusType.Flat, (level: number) => 1 * level, PriceFormulaConstant(1), 50))
        this.AddSkill(new SkillPassiveStatBonus(`crit_damage`, this, StatType.CritDamagePct, StatBonusType.Flat, (level: number) => 5 * level, PriceFormulaConstant(1), 50))
    }

// this.AddSkill(new SkillHealPlayerOnKill(`heal_on_kill`, this, (level) => 0.5 * level, PriceFormulaConstant(1), 10))
// this.AddSkill(new SkillPassiveStatBonus(`run_speed`, this, StatType.RunSpeed, StatBonusType.Pct, (level: number) => 5 * level, PriceFormulaConstant(1), 10))
// this.AddSkill(new SkillPassiveStatBonus(`sprint_speed`, this, StatType.SprintSpeed, StatBonusType.Pct, (level: number) => 5 * level, PriceFormulaConstant(1), 10))
// this.AddSkill(new SkillPassiveStatBonus(`reload_speed`, this, StatType.ReloadSpeedBonusPct, StatBonusType.Flat, (level: number) => 5 * level, PriceFormulaConstant(1), 10))
// this.AddSkill(new SkillPassiveStatBonus(`crit_damage`, this, StatType.CritDamagePct, StatBonusType.Flat, (level: number) => 10 * level, PriceFormulaConstant(1), 10))
// this.AddSkill(new SkillAuraOfDeath(`aura_of_death`, this, 3, (level: number) => 1 * level, (level: number) => 5 + 1 * level, PriceFormulaConstant(1), 10))
// this.AddSkill(new SkillCriticalDeath(`crit_explosion`, this, (level: number) => 10 * level, (level: number) => 2.5 * level, (level: number) => 5 + 1 * level, PriceFormulaConstant(1), 5))
}