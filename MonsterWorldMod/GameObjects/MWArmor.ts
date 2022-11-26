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

        result += GetBonusDescription(StatType.MaxHP, this.GetTotalFlatBonus(StatType.MaxHP));
        result += GetBonusDescription(StatType.ArtefactSlots, this.GetStat(StatType.ArtefactSlots));
        result += GetBonusDescription(StatType.DamageResistancePct, this.GetTotalFlatBonus(StatType.DamageResistancePct));
        result += GetBonusDescription(StatType.HPRegen, this.GetTotalPctBonus(StatType.HPRegen), true);

        return result;
    }

    get HPBonus():number { return this.GetTotalFlatBonus(StatType.MaxHP) }

    override GeneateStats(): void {
        super.GeneateStats();

        this.SetStatBase(StatType.ArtefactSlots, this.Quality);

        let maxHPBonus = 5 * this.Level + math.random((this.Quality - 1) * this.Level / 2, (5 + 2 * this.Quality) * this.Level);
        this.AddStatBonus(StatType.MaxHP, StatBonusType.Flat, maxHPBonus, "generation")

        let availableBonuses: StatType[] = [
            StatType.DamageResistancePct,
            StatType.HPRegen
        ];
        let upgradeTypesToAdd = 1 + this.Quality;
        const upgradeTypesToSelect = math.min(availableBonuses.length, upgradeTypesToAdd);
        let selectedUpgradeStats = TakeRandomUniqueElementsFromArray(availableBonuses, upgradeTypesToSelect);

        for(let stat of selectedUpgradeStats){
            if (stat == StatType.DamageResistancePct) {
                let damageResistanceBonus = math.random(2 + 2 * (this.Quality - 1), (4 + 1.5 * (this.Quality - 1)) * this.Quality)
                this.AddStatBonus(StatType.DamageResistancePct, StatBonusType.Flat, damageResistanceBonus, "generation")
            }
            else if (stat == StatType.HPRegen) {
                let hpRegenBonus = math.random(10 + 5 * (this.Quality - 1), (30 + 10 * (this.Quality - 1)) * this.Quality)
                this.AddStatBonus(StatType.HPRegen, StatBonusType.Pct, hpRegenBonus, "generation")
            }
        }
    }
}