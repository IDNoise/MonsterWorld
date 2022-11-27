import { GetBonusDescription, GetStatBonusForObject, IsStatGenerationSupported, StatBonusType, StatType, WeaponDamageBonusesByType, PctStats, DamageBonusesByEnemyType, GetBonusDescriptionByType } from '../Configs/Stats';
import { MWItem } from './MWItem';
import { ObjectType, MWObject } from './MWObject';
import { SkillAuraOfDeath } from '../Skills/SkillAuraOfDeath';
import { SkillCriticalDeath } from '../Skills/SkillCriticalDeath';
import { ArtefactStatsForGeneration } from "../Configs/Loot";
import { RandomFromArray, TakeRandomUniqueElementsFromArray } from "../Helpers/Collections";
import { Skill } from "../Skills/Skill";

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

        availableStats.push(RandomFromArray(WeaponDamageBonusesByType));
        availableStats.push(RandomFromArray(DamageBonusesByEnemyType));
            
        let statsToSelect = math.min(availableStats.length, math.min(6, this.Quality + this.Level / 15));
        let selectedStats = TakeRandomUniqueElementsFromArray(availableStats, statsToSelect);

        for(let stat of selectedStats){
            let bonusType = PctStats.includes(stat) ? StatBonusType.Flat : StatBonusType.Pct;
            let bonus = GetStatBonusForObject(stat, this.Level, this.Quality, bonusType, this.Type);
            this.AddStatBonus(stat, bonusType, bonus, "generation")
        }
    }

    protected override SetupSkills(): void {
        super.SetupSkills();

        let skillCount = 0;
        if (this.Quality == 5) { skillCount = math.random(2) }
        else if (this.Quality == 4) { skillCount = math.random(1)}
        else if (this.Quality == 2 || this.Quality == 3) { skillCount = math.random(0, 1)}
        
        skillCount = math.min(skillCount, ArtefactSkills.length)
        for(let i = 0; i < skillCount; i++){
            this.AddSkill(ArtefactSkills[i](this))
        }
        
        for(let [skillId, _] of this.Skills){
            this.SetSkillLevel(skillId, this.Level)
        }
    }
}

const ArtefactSkills: ((owner: MWObject) => Skill)[] = [
    owner => new SkillAuraOfDeath('aura_of_death', owner, 5, l => 2 + l / 2, l => 5 + l / 10),
    owner => new SkillCriticalDeath('crit_death', owner, l => 3 + l / 2, l => 3 + l / 5, l => 5 + l / 10),
]
