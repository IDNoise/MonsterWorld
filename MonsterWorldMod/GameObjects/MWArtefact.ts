import { GetBonusDescription, GetStatBonusForObject, IsStatGenerationSupported, StatBonusType, StatType, WeaponDamageBonusesByType, PctStats, DamageBonusesByEnemyType, GetBonusDescriptionByType } from '../Configs/Stats';
import { MWItem } from './MWItem';
import { ObjectType, MWObject } from './MWObject';
import { SkillAuraOfDeath } from '../Skills/SkillAuraOfDeath';
import { SkillCriticalDeath } from '../Skills/SkillCriticalDeath';
import { ArtefactStatsForGeneration } from "../Configs/Loot";
import { GetRandomFromArray, GetRandomUniqueElementsFromArray, GetRandomUniqueKeysFromTable } from "../Helpers/Collections";
import { Skill } from "../Skills/Skill";
import { SkillThorns } from '../Skills/SkillThorns';
import { SkillSpeedyRetreat } from '../Skills/SkillSpeedyRetreat';
import { SkillSuperCrit } from '../Skills/SkillSuperCrit';
import { SkillHealPlayerOnKill } from '../Skills/SkillHealPlayerOnKill';
import { SkillFreeShot } from '../Skills/SkillFreeShot';

export class MWArtefact extends MWItem {

    get Type(): ObjectType { return ObjectType.Artefact }

    get Description(): string{
        let result = "";

        let hasSkills = false;
        for(let [_, skill] of this.Skills){
            result += `> ${skill.Description} \\n\\n`
            hasSkills = true;
        }

        if (hasSkills) result += "\\n\\n"

        for(let stat of this.GetPlayerStatBonusesOnEquip()){
            result += GetBonusDescriptionByType(this, stat);
        }

        return result;
    }

    public override GetPlayerStatBonusesOnEquip(): StatType[] {
        let result: StatType[] = [];
        for(let stat of ArtefactStatsForGeneration){
            if(IsStatGenerationSupported(stat)){
                result.push(stat);  
            }
        }

        for(let stat of WeaponDamageBonusesByType){
            if(IsStatGenerationSupported(stat)){
                result.push(stat);  
            }
        }

        for(let stat of DamageBonusesByEnemyType){
            if(IsStatGenerationSupported(stat)){
                result.push(stat);  
            }
        }

        return result;
    }

    override GenerateStats(): void {
        super.GenerateStats();

        let availableStats: StatType[] = [];
        for(let stat of ArtefactStatsForGeneration){
            if(IsStatGenerationSupported(stat)){
                availableStats.push(stat);  
            }
        }

        availableStats.push(GetRandomFromArray(WeaponDamageBonusesByType));
        availableStats.push(GetRandomFromArray(DamageBonusesByEnemyType));
            
        let statsToSelect = math.min(availableStats.length, math.min(6, this.Quality + this.Level / 15));
        let selectedStats = GetRandomUniqueElementsFromArray(availableStats, statsToSelect);

        for(let stat of selectedStats){
            let bonusType = PctStats.includes(stat) ? StatBonusType.Flat : StatBonusType.Pct;
            let bonus = GetStatBonusForObject(stat, this.Level, this.Quality, bonusType, this.Type);
            this.AddStatBonus(stat, bonusType, bonus, "generation")
        }

        let skillCount = 0;
        if (this.Quality == 5) { skillCount = math.random(1, 2) }
        else if (this.Quality == 4) { skillCount = 1}
        else if (this.Quality == 2 || this.Quality == 3) { skillCount = math.random(0, 1)}
        
        skillCount = math.min(skillCount, ArtefactSkills.size)
        
        this.Save<string[]>("SelectedSkills", GetRandomUniqueElementsFromArray(Array.from(ArtefactSkills.keys()), skillCount))
    }

    protected override SetupSkills(): void {
        super.SetupSkills();

        for(let skillId of this.Load<string[]>("SelectedSkills", [])){
            let skill = ArtefactSkills.get(skillId)!();
            this.AddSkill(skillId, skill)
            if (skill.Level == 0){ //First initialization
                skill.Level = this.Level;
            }
        }
    }
}

const ArtefactSkills: Map<string, () => Skill> = new Map();
ArtefactSkills.set("SkillHealPlayerOnKill", () => new SkillHealPlayerOnKill(l => 0.5 + 0.1 * l));
ArtefactSkills.set("SkillAuraOfDeath", () => new SkillAuraOfDeath(5, l => 2 + l / 10, l => 5 + l / 10));
ArtefactSkills.set("SkillCriticalDeath", () => new SkillCriticalDeath(l => 5 + l / 2, l => 3 + l / 5, l => 5 + l / 10));
ArtefactSkills.set("SkillThorns", () => new SkillThorns(l => math.min(4, 0.5 + l / 20)));
ArtefactSkills.set("SkillSpeedyRetreat", () => new SkillSpeedyRetreat(15, l => math.max(30, 60 - l), l => math.min(10, 3 + l / 5), l => 20 + l));
ArtefactSkills.set("SkillSuperCrit", () => new SkillSuperCrit(10, l => 25 + 5 * l));
ArtefactSkills.set("SkillFreeShot", () => new SkillFreeShot(l => math.min(15, 5 + l / 3)));
