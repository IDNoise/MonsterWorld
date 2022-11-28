import { Log } from '../../StalkerModBase';
import { StatBonusType, StatType } from '../Configs/Stats';
import { GetProgressionValue } from '../Managers/MCM';
import { PriceFormulaConstant, Skill } from '../Skills/Skill';
import { SkillPassiveStatBonus } from '../Skills/SkillPassiveStatBonus';
import { MWArmor } from './MWArmor';
import { MWObject, ObjectType } from './MWObject';
import { MWWeapon } from './MWWeapon';

export class MWPlayer extends MWObject {
    get Type(): ObjectType { return ObjectType.Player }

    override OnFirstTimeInitialize(): void {
        super.OnFirstTimeInitialize()
        this.Level = 0;
        this.CurrentXP = 0;
        this.SetStatBase(StatType.MaxHP, GetProgressionValue("PlayerHPBase"))
        this.SetStatBase(StatType.HPRegen, GetProgressionValue("PlayerHPRegenBase"))
        this.AddStatBonus(StatType.CritDamagePct, StatBonusType.Flat, GetProgressionValue("PlayerDefaultCritDamagePct"), "initial")
    }

    get RequeiredXP(): number {
        let expMult = math.pow(GetProgressionValue("PlayerXPExp"), this.Level);
        let pctMult = (1 + GetProgressionValue("PlayerXPPct")* this.Level / 100)
        let xp = GetProgressionValue("PlayerXPForFirstLevel")* expMult * pctMult;
        return math.max(1, math.floor(xp))
    }

    get CurrentXP(): number { return this.Load("CurrentXP", 0); }
    set CurrentXP(exp: number) { 
        exp *= this.GetStat(StatType.XPGainMult);
        while (exp >= this.RequeiredXP){
            exp -= this.RequeiredXP;
            this.LevelUp();
        }
        this.Save("CurrentXP", exp); 
    }

    get ActiveWeapon(): MWWeapon | undefined { return MonsterWorld.GetWeapon(this.GO.active_item())}
    get Weapon1(): MWWeapon | undefined { return MonsterWorld.GetWeapon(this.GO.item_in_slot(EquipmentSlotId.Weapon1))}
    get Weapon2(): MWWeapon | undefined { return MonsterWorld.GetWeapon(this.GO.item_in_slot(EquipmentSlotId.Weapon2))}
    get Armor(): MWArmor | undefined { return MonsterWorld.GetArmor(this.GO.item_in_slot(EquipmentSlotId.Outfit))}

    private LevelUp(): void{
        this.Level++;
        this.SkillPoints += GetProgressionValue("SkillPointsPerLevelUp");
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
        this.AddStatBonus(StatType.MaxHP, StatBonusType.Pct, GetProgressionValue("PlayerHPPerLevel") * this.Level, "level_bonus");
        this.AddStatBonus(StatType.HPRegen, StatBonusType.Pct, GetProgressionValue("PlayerHPRegenPctPerLevel") * this.Level, "level_bonus");
        this.AddStatBonus(StatType.RunSpeedMult, StatBonusType.Pct, GetProgressionValue("PlayerRunSpeedPctPerLevel") * this.Level, "level_bonus");
    }

    get SkillPoints(): number { return this.Load("SkillPoints", 0); }
    set SkillPoints(points: number) { this.Save("SkillPoints", points); }

    protected override OnStatChanged(stat: StatType, prev: number, current: number): void {
        super.OnStatChanged(stat, prev, current);
        if (stat == StatType.RunSpeedMult){
            db.actor.set_actor_run_coef(MonsterWorld.MCM.GetProgressionValue("PlayerRunSpeedCoeff") * current)
            db.actor.set_actor_runback_coef(MonsterWorld.MCM.GetProgressionValue("PlayerRunBackSpeedCoeff") * current)
        }
        else if (stat == StatType.SprintSpeedMult){
            db.actor.set_actor_sprint_koef(MonsterWorld.MCM.GetProgressionValue("PlayerSprintSpeedCoeff") * current)
        }
    }

    override SetupSkills() {
        super.SetupSkills();
        this.AddSkill("PassiveMaxHP", new SkillPassiveStatBonus(StatType.MaxHP, StatBonusType.Pct, (level: number) => 5 * level, PriceFormulaConstant(1), 50))
        this.AddSkill("PassiveHPRegen", new SkillPassiveStatBonus(StatType.HPRegen, StatBonusType.Pct, (level: number) => 20 * level, PriceFormulaConstant(1), 50))
        this.AddSkill("PassiveRunSpeed", new SkillPassiveStatBonus(StatType.RunSpeedMult, StatBonusType.Pct, (level: number) => 2 * level, PriceFormulaConstant(1), 25))
        this.AddSkill("PassiveSprintSpeed", new SkillPassiveStatBonus(StatType.SprintSpeedMult, StatBonusType.Pct, (level: number) => 1 * level, PriceFormulaConstant(1), 25))
        this.AddSkill("PassiveReloadSpeed", new SkillPassiveStatBonus(StatType.ReloadSpeedBonusPct, StatBonusType.Flat, (level: number) => 2 * level, PriceFormulaConstant(1), 25))
        this.AddSkill("PassiveCritDamage", new SkillPassiveStatBonus(StatType.CritDamagePct, StatBonusType.Flat, (level: number) => 5 * level, PriceFormulaConstant(1), 50))
        this.AddSkill("PassiveXpGain", new SkillPassiveStatBonus(StatType.XPGainMult, StatBonusType.Pct, (level: number) => 5 * level, PriceFormulaConstant(1), 25))
        this.AddSkill("PassiveXpGain", new SkillPassiveStatBonus(StatType.FreeShotOnCritChancePct, StatBonusType.Pct, (level: number) => 5 * level, PriceFormulaConstant(1), 25))
    }

    override IterateSkills(iterator: (s: Skill) => void, onlyWithLevel?: boolean): void {
        super.IterateSkills(iterator, onlyWithLevel)
        this.GO.iterate_belt((itemGO: game_object) => {
            let item = MonsterWorld.GetItem(itemGO)
            item?.IterateSkills(iterator, onlyWithLevel)
        }, this.GO)
        this.Armor?.IterateSkills(iterator, onlyWithLevel)
        this.Weapon1?.IterateSkills(iterator, onlyWithLevel)
        this.Weapon2?.IterateSkills(iterator, onlyWithLevel)
    }
}
