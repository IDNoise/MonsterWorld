import { Log } from '../../StalkerModBase';
import * as cfg from '../Configs/Constants';
import { MinQuality, MaxQuality, WeaponStatsUsingUpgrades, WeaponStatsForGeneration, GetWeaponUpgradesByStat, GetWeaponSectinFieldNameByStat, GetWeaponBaseValueByStat} from '../Configs/Loot';
import { StatType, StatBonusType, PctStats, GetBonusDescription, GetStatBonusForObject, GetBonusDescriptionByType } from '../Configs/Stats';
import { GetRandomUniqueElementsFromArray } from '../Helpers/Collections';
import { IsPctRolled } from '../Helpers/Random';
import { MWItem } from './MWItem';
import { ObjectType } from './MWObject';

export class MWWeapon extends MWItem {


    get Type(): ObjectType { return ObjectType.Weapon }

    get WeaponType(): WeaponType { return this.Load<WeaponType>("WeaponType", WeaponType.Pistol); }
    set WeaponType(value: WeaponType) { this.Save("WeaponType", value); }

    get TimeBetweenShots(): number { return math.max(0.01, this.GO?.cast_Weapon()?.RPM()) }
    get Damage(): number { return this.GetStat(StatType.Damage); } //Per hit
    get DPS(): number { return this.Damage  * (1 / this.TimeBetweenShots) }
    get MagSize(): number { return math.floor(this.GetStat(StatType.MagSize)); }
    get FireDistance(): number { return this.GO?.cast_Weapon().GetFireDistance() || 1; }

    get Description(): string{
        let result = "";

        let stats: StatType[] = [
            StatType.Damage,
            StatType.Rpm,
            StatType.MagSize,
            StatType.ReloadSpeedBonusPct,
            StatType.Accuracy,
            StatType.Recoil,
            StatType.Flatness,
            StatType.CritChancePct,
            StatType.AutoFireMode,
        ]

        for(let stat of stats){
            result += GetBonusDescriptionByType(this, stat);
        }

        // result += GetBonusDescription(StatType.Damage, this.GetTotalPctBonus(StatType.Damage), true);
        // result += GetBonusDescription(StatType.Rpm, this.GetTotalPctBonus(StatType.Rpm), true);
        // result += GetBonusDescription(StatType.MagSize, this.GetStatDiffWithBase(StatType.MagSize));
        // result += GetBonusDescription(StatType.ReloadSpeedBonusPct, this.GetTotalFlatBonus(StatType.ReloadSpeedBonusPct));
        // result += GetBonusDescription(StatType.Accuracy, this.GetTotalPctBonus(StatType.Accuracy), true);
        // result += GetBonusDescription(StatType.Recoil, this.GetTotalPctBonus(StatType.Recoil), true);
        // result += GetBonusDescription(StatType.Flatness, this.GetTotalPctBonus(StatType.Flatness), true);
        // result += GetBonusDescription(StatType.CritChancePct, this.GetTotalFlatBonus(StatType.CritChancePct));
        // result += GetBonusDescription(StatType.AutoFireMode, this.GetTotalFlatBonus(StatType.AutoFireMode));

        return result;
    }

    OnReloadStart(anim_table: AnimationTable) {
        let mult = 1 + MonsterWorld.GetStat(StatType.ReloadSpeedBonusPct, this, MonsterWorld.Player) / 100;
        anim_table.anm_speed *= mult
    }

    OnReloadEnd(){
        this.RefillMagazine();
    }

    override GenerateStats() {
        super.GenerateStats();

        this.WeaponType = <WeaponType>ini_sys.r_float_ex(this.Section, "weapon_type")

        let baseDPS = cfg.WeaponDPSBase * math.pow(cfg.WeaponDPSExpPerLevel, this.Level - 1);

        let rpm = GetWeaponBaseValueByStat(this.Section, StatType.Rpm);
        const fireRate = 60 / rpm;
        let damagePerHit = baseDPS * fireRate;
        let magSize = GetWeaponBaseValueByStat(this.Section, StatType.MagSize);

        this.SetStatBase(StatType.Damage, damagePerHit)
        this.SetStatBase(StatType.Rpm, rpm);
        this.SetStatBase(StatType.MagSize, magSize)
        this.SetStatBase(StatType.Accuracy, GetWeaponBaseValueByStat(this.Section, StatType.Accuracy));
        this.SetStatBase(StatType.Recoil, GetWeaponBaseValueByStat(this.Section, StatType.Recoil));
        this.SetStatBase(StatType.Flatness, GetWeaponBaseValueByStat(this.Section, StatType.Flatness));

        let weaponUpgradesByBonusType: LuaTable<StatType, string[]> = new LuaTable();

        for (let uType of WeaponStatsUsingUpgrades) {
            let upgrades = GetWeaponUpgradesByStat(this.Section, uType)
            Log(`weaponUpgradesByBonusType ${uType}:${upgrades.length}`)
            if (upgrades.length != 0)
                weaponUpgradesByBonusType.set(uType, upgrades);
        }

        let availableBonuses: StatType[] = [];
        for(let type of WeaponStatsForGeneration){
            if (!WeaponStatsUsingUpgrades.includes(type) || weaponUpgradesByBonusType.has(type)){
                availableBonuses.push(type)
                Log(`availableBonuses ${type}`)
            }
        }        

        let statsToSelect = math.min(availableBonuses.length, 1 + this.Quality + math.floor(this.Level / 10));
        let selectedStats = GetRandomUniqueElementsFromArray(availableBonuses, statsToSelect);

        if (IsPctRolled(30) && weaponUpgradesByBonusType.has(StatType.Flatness)){ //Bullet speed is additional random bonus
            selectedStats.push(StatType.Flatness);
            Log(`selectedUpgradeTypes ${StatType.Flatness}`)
        }

        if (IsPctRolled(30) && weaponUpgradesByBonusType.has(StatType.AutoFireMode)){ //Auto fire is additional random bonus
            selectedStats.push(StatType.AutoFireMode);
            Log(`selectedUpgradeTypes ${StatType.AutoFireMode}`)
        }

        let damageBonusPct = 0;
        let allSelectedUpgrades: string[] = [];
        for (let stat of selectedStats) {
            if (stat == StatType.Damage) {
                damageBonusPct += math.random(3 + 7 * (this.Quality - 1), (15 + 15 * (this.Quality - 1)) * this.Quality)
            }
            else if (stat == StatType.ReloadSpeedBonusPct || stat == StatType.CritChancePct || stat == StatType.MagSize) {
                let bonus = GetStatBonusForObject(stat, this.Level, this.Quality, StatBonusType.Flat, this.Type);

                while (stat == StatType.MagSize && magSize * bonus / 100 < 1){
                    bonus += 3;
                }

                this.AddStatBonus(stat, StatBonusType.Flat, bonus, "generation")
            }
            else if (stat == StatType.AutoFireMode) {
                allSelectedUpgrades.push(weaponUpgradesByBonusType.get(stat)[0]);
                this.AddStatBonus(StatType.AutoFireMode, StatBonusType.Flat, 1, "generation")
            }
            else {
                let minUpgradesToSelect = 1 + (this.Quality - 1) / 2
                let maxUpgradesToSelect = 3 * this.Quality + 2.5 * math.max(0, this.Quality - 3);
                let upgradesToSelect = math.random(minUpgradesToSelect, maxUpgradesToSelect)
                
                let upgrades = weaponUpgradesByBonusType.get(stat);
                let bonusValue = 0;
                for(let i = 0; i < upgradesToSelect; i++){
                    const upgrade = upgrades[i];
                    allSelectedUpgrades.push(upgrade);
                    bonusValue += ini_sys.r_float_ex(upgrade.replace("mwu", "mwb"), GetWeaponSectinFieldNameByStat(stat), 0);
                }

                if (bonusValue != 0) {
                    let defaultValue = GetWeaponBaseValueByStat(this.Section, stat);
                    if (defaultValue == 0) 
                        defaultValue = 1;
                    Log(`Bonus ${stat}: ${bonusValue}, base: ${defaultValue}. %: ${bonusValue / defaultValue * 100}`);
                    bonusValue = bonusValue / defaultValue * 100;

                    this.AddStatBonus(stat, StatBonusType.Pct, math.abs(bonusValue), "generation")
                }
            }
        }

        damageBonusPct += cfg.WeaponDPSPctPerQuality * (this.Quality - 1);
        if (damageBonusPct > 0){
            this.AddStatBonus(StatType.Damage, StatBonusType.Pct, damageBonusPct, "generation")
        }

        Log(`Base DPS: ${baseDPS} DPS: ${this.DPS}. Damage per hit: ${damagePerHit}. Fire rate: ${fireRate}`)
        for (let upgrade of allSelectedUpgrades) {
            upgrade = upgrade.replace("mwu", "mwe");
            Log(`Installing upgrade: ${upgrade}`)
            this.GO.install_upgrade(upgrade);
        }
        this.RefillMagazine();
    }

    RefillMagazine(){
        this.GO?.cast_Weapon().SetAmmoElapsed(this.MagSize)
    }
}

export enum WeaponType{
    Pistol = 0,
    Shotgun,
    SMG,
    AssaultRifle,
    MachineGun,
    SniperRifle,
}