import { Log } from '../../StalkerModBase';
import * as cfg from '../Configs/Constants';
import { ArmorStatsForGeneration } from '../Configs/Loot';
import { StatType, StatBonusType, PctStats, GetBonusDescription, WeaponDamageBonusesByType as WeaponTypeDamageBonuses, GetStatBonusForObject, DamageBonusesByEnemyType, GetBonusDescriptionByType } from '../Configs/Stats';
import { TakeRandomUniqueElementsFromArray, RandomFromArray } from '../Helpers/Collections';
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

        //Armor always has HP bonus
        let maxHPBonus = 5 * this.Level + math.random((this.Quality - 1) * this.Level / 2, (5 + 2 * this.Quality) * this.Level);
        this.AddStatBonus(StatType.MaxHP, StatBonusType.Flat, maxHPBonus, "generation")

        let availableStats: StatType[] = [];
        for(let stat of ArmorStatsForGeneration)
            availableStats.push(stat);  

        availableStats.push(RandomFromArray(WeaponTypeDamageBonuses))
        availableStats.push(RandomFromArray(DamageBonusesByEnemyType))


        let statsToSelect = math.min(availableStats.length, 1 + this.Quality);
        let selectedStats = TakeRandomUniqueElementsFromArray(availableStats, statsToSelect);

        for(let stat of selectedStats){
            let bonusType = PctStats.includes(stat) ? StatBonusType.Flat : StatBonusType.Pct;
            let bonus = GetStatBonusForObject(stat, this.Level, this.Quality, bonusType, this.Type);
            this.AddStatBonus(stat, bonusType, bonus, "generation")
        }
    }
}