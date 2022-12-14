import { Log } from '../../StalkerModBase';
import { ArmorStatsForGeneration } from '../Configs/Loot';
import { StatType, StatBonusType, PctStats, GetBonusDescription, WeaponDamageBonusesByType as WeaponTypeDamageBonuses, GetStatBonusForObject, DamageBonusesByEnemyType, GetBonusDescriptionByType } from '../Configs/Stats';
import { GetRandomUniqueElementsFromArray, GetRandomFromArray } from '../Helpers/Collections';
import { IsPctRolled } from '../Helpers/Random';
import { MWItem } from './MWItem';
import { ObjectType } from './MWObject';

export class MWArmor extends MWItem {

    get Type(): ObjectType { return ObjectType.Armor }

    get Description(): string{
        let result = "";

        result += GetBonusDescription(StatType.ArtefactSlots, this.GetStat(StatType.ArtefactSlots));

        for(let stat of this.GetPlayerStatBonusesOnEquip()){
            result += GetBonusDescriptionByType(this, stat);
        }

        return result;
    }

    get HPBonus():number { return this.GetTotalFlatBonus(StatType.MaxHP) }

    public override GetPlayerStatBonusesOnEquip(): StatType[] {
        let result = [
            StatType.MaxHP,
        ];

        for(let stat of ArmorStatsForGeneration)
            result.push(stat)

        for(let stat of WeaponTypeDamageBonuses)
            result.push(stat)

        for(let stat of DamageBonusesByEnemyType)
            result.push(stat)

        return result;
    }

    override GenerateStats(): void {
        super.GenerateStats();

        this.SetStatBase(StatType.ArtefactSlots, this.Quality);

        let availableStats: StatType[] = [];
        for(let stat of ArmorStatsForGeneration)
            availableStats.push(stat);  

        availableStats.push(GetRandomFromArray(WeaponTypeDamageBonuses))
        availableStats.push(GetRandomFromArray(DamageBonusesByEnemyType))

        let statsToSelect = math.min(availableStats.length, 1 + this.Quality);
        let selectedStats = GetRandomUniqueElementsFromArray(availableStats, statsToSelect);
        selectedStats.push(StatType.MaxHP) //Always has hp bonus

        for(let stat of selectedStats){
            let bonusType = PctStats.includes(stat) || stat == StatType.MaxHP ? StatBonusType.Flat : StatBonusType.Pct;
            let bonus = GetStatBonusForObject(stat, this.Level, this.Quality, bonusType, this.Type);
            this.AddStatBonus(stat, bonusType, bonus, "generation")
        }
    }
}