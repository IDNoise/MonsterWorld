import { Log } from '../../StalkerModBase';
import * as cfg from '../Configs/Constants';
import { StatType, StatBonusType, PctStats, GetBonusDescription } from '../Configs/Stats';
import { TakeRandomUniqueElementsFromArray } from '../Helpers/Collections';
import { IsPctRolled } from '../Helpers/Random';
import { MWItem } from './MWItem';
import { ObjectType } from './MWObject';

export class MWArmor extends MWItem {

    get Type(): ObjectType { return ObjectType.Armor }

    get Description(): string{
        let result = "";

        let DescriptionStats: StatType[] = [
            StatType.MaxHP,
            StatType.ArtefactSlots,
            StatType.DamageResistancePct,
        ];

        for(const stat of DescriptionStats){
            let value = this.GetStat(stat);
            if (value != 0)
                result += GetBonusDescription(stat, value) + " \\n";
        }

        return result;
    }

    get HPBonus():number { return this.GetTotalFlatBonus(StatType.MaxHP) }

    override GeneateStats(): void {
        super.GeneateStats();

        this.SetStatBase(StatType.ArtefactSlots, this.Quality);

        let maxHPBonus = 5 * this.Level + math.random((this.Quality - 1) * this.Level / 2, (5 + 2 * this.Quality) * this.Level);
        this.AddStatBonus(StatType.MaxHP, StatBonusType.Flat, maxHPBonus, "generation")

        let availableBonuses: StatType[] = [StatType.DamageResistancePct];
        let upgradeTypesToAdd = 1 + this.Quality;
        const upgradeTypesToSelect = math.min(availableBonuses.length, upgradeTypesToAdd);
        let selectedUpgradeStats = TakeRandomUniqueElementsFromArray(availableBonuses, upgradeTypesToSelect);

        for(let stat of selectedUpgradeStats){
            if (stat == StatType.DamageResistancePct) {
                let damageResistanceBonus = math.random(2 + 2 * (this.Quality - 1), (4 + 1.5 * (this.Quality - 1)) * this.Quality)
                this.AddStatBonus(StatType.DamageResistancePct, StatBonusType.Flat, damageResistanceBonus, "generation")
            }
        }
    }
}