import { IsPctRolled, TakeRandomUniqueElementsFromArray } from '../../StalkerAPI/extensions/basic';
import { Log } from '../../StalkerModBase';
import { BaseMWObject } from './BaseMWObject';
import { World } from '../World';
import * as cfg from '../Configs/Constants';
import { MinQuality, MaxQuality, WeaponBonusParamType, ParamsWithWeaponUpgradesSelection, GetBonusDescription, ParamsForSelection, PctBonuses, SectionFields} from '../Configs/Loot';
import { StatType, StatBonusType } from '../Configs/Stats';

export class MWWeapon extends BaseMWObject {
    
    constructor(public id: Id) {
        super(id);
    }

    override OnFirstTimeInitialize(): void {
        let spawnCfg = this.Load<WeaponSpawnParams>("SpawnParams", {level: 1, quality: 1})

        this.Level = spawnCfg.level;
        this.Quality = math.max(MinQuality, math.min(MaxQuality, spawnCfg.quality));
        this.DescriptionBonuses = new LuaTable();

        if (this.Section.indexOf("knife") >= 0){
            this.SetStatBase(StatType.DamagePerHit, cfg.WeaponDPSBase)
            //DO smth with knife or fuck it?
            return;
        }

        this.GenerateWeaponStats();
    }

    get Quality(): number { return this.Load("Quality"); }
    set Quality(quality: number) { this.Save("Quality", quality); }

    get DamagePerHit(): number { return this.GetStat(StatType.DamagePerHit); }
    get MagSize(): number { return math.floor(this.GetStat(StatType.MagSize)); }

    get DescriptionBonuses(): LuaTable<WeaponBonusParamType, number> { return this.Load("GeneratedBonuses"); }
    set DescriptionBonuses(bonuses: LuaTable<WeaponBonusParamType, number>) { this.Save("GeneratedBonuses", bonuses); }

    get RPM(): number { return math.max(0.0001, this.GO?.cast_Weapon()?.RPM()) }
    get DPS(): number { return this.DamagePerHit  * (1 / this.RPM) }

    public GetBonusDescription(): string{
        let result = "";

        for(const type of ParamsForSelection){
            const value = this.DescriptionBonuses.get(type) || 0;
            if (value != 0)
                result += GetBonusDescription(type, value) + " \\n";
        }

        return result;
    }

    public OnWeaponPickedUp(){
        //Log(`OnWeaponPickedUp`)
        this.RefillMagazine();
        this.GO.set_condition(100)
    }

    OnReloadStart(anim_table: AnimationTable) {
        let mult = 1 + MonsterWorld.GetStat(StatType.ReloadSpeedBonusPct, this, MonsterWorld.Player) / 100;
        Log(`OnReloadStart. Bonus: x${mult}`)
        anim_table.anm_speed *= mult
    }

    OnReloadEnd(){
        this.RefillMagazine();
    }

    private GetUpgradesByType(type: WeaponBonusParamType): string[] {
        if (ini_sys.r_string_ex(this.Section, type + "_upgrades", "") != "") {
            return ini_sys.r_list(this.Section, type + "_upgrades", []);
        }
        return [];
    }

    private GenerateWeaponStats() {
        //Log(`GenerateWeaponStats`)
        let baseDPS = cfg.WeaponDPSBase * math.pow(cfg.WeaponDPSExpPerLevel, this.Level - 1);

        const fireRate = 60 / ini_sys.r_float_ex(this.Section, "rpm", 1);
        let damagePerHit = baseDPS * fireRate;
        this.SetStatBase(StatType.DamagePerHit, damagePerHit)

        let magSize = ini_sys.r_float_ex(this.Section, "ammo_mag_size", 1);
        this.SetStatBase(StatType.MagSize, magSize)

        let weaponUpgradesByBonusType: LuaTable<WeaponBonusParamType, string[]> = new LuaTable();

        for (let uType of ParamsWithWeaponUpgradesSelection) {
            let upgrades = this.GetUpgradesByType(uType)
            //Log(`weaponUpgradesByBonusType ${uType}:${upgrades.length}`)
            if (upgrades.length != 0)
                weaponUpgradesByBonusType.set(uType, upgrades);
        }

        let availableBonuses: WeaponBonusParamType[] = [];
        for(let type of ParamsForSelection){
            if (!ParamsWithWeaponUpgradesSelection.includes(type) || weaponUpgradesByBonusType.has(type)){
                availableBonuses.push(type)
                //Log(`availableBonuses ${type}`)
            }
        }        

        let upgradeTypesToAdd = 1 + this.Quality + math.floor(this.Level / 5);
        const upgradeTypesToSelect = math.min(availableBonuses.length, upgradeTypesToAdd);
        let selectedUpgradeTypes = TakeRandomUniqueElementsFromArray(availableBonuses, upgradeTypesToSelect);

        if (!selectedUpgradeTypes.includes(WeaponBonusParamType.MagSize)){
            selectedUpgradeTypes.push(WeaponBonusParamType.MagSize);
        }

        if (IsPctRolled(30) && weaponUpgradesByBonusType.has(WeaponBonusParamType.BulletSpeed)){ //Bullet speed is additional bonus
            selectedUpgradeTypes.push(WeaponBonusParamType.BulletSpeed);
            //Log(`selectedUpgradeTypes ${BonusParams.Type.BulletSpeed}`)
        }

        if (IsPctRolled(30) && weaponUpgradesByBonusType.has(WeaponBonusParamType.FireMode)){ //Bullet speed is additional bonus
            selectedUpgradeTypes.push(WeaponBonusParamType.FireMode);
            //Log(`selectedUpgradeTypes ${BonusParams.Type.FireMode}`)
        }

        
        let damageBonusPct = 0;
        let allSelectedUpgrades: string[] = [];
        for (let paramType of selectedUpgradeTypes) {
            if (paramType == WeaponBonusParamType.Damage) {
                damageBonusPct += math.random(5 + 10 * (this.Quality - 1), (15 + 15 * (this.Quality - 1)) * this.Quality)
            }
            else if (paramType == WeaponBonusParamType.ReloadSpeed) {
                let reloadSpeedBonus = math.random(2 + 3 * (this.Quality - 1), (10 + 10 * (this.Quality - 1)) * this.Quality)
                this.DescriptionBonuses.set(WeaponBonusParamType.ReloadSpeed, reloadSpeedBonus)
                this.AddStatBonus(StatType.ReloadSpeedBonusPct, StatBonusType.Flat, reloadSpeedBonus, "generation")
            }
            else if (paramType == WeaponBonusParamType.CritChance) {
                let critChanceBonus = math.random(1, (0.5 + 0.4 * (this.Quality - 1)) * this.Quality)
                this.DescriptionBonuses.set(WeaponBonusParamType.CritChance, critChanceBonus)
                this.AddStatBonus(StatType.CritChancePct, StatBonusType.Flat, critChanceBonus, "generation")
            }
            else if (paramType == WeaponBonusParamType.MagSize) {
                let magSizeBonus = math.random(3 + 5 * (this.Quality - 1), (20 + 20 * (this.Quality - 1)) * this.Quality)
                while (magSize * magSizeBonus / 100 < 1){
                    magSizeBonus += 3;
                }

                this.DescriptionBonuses.set(WeaponBonusParamType.MagSize, magSizeBonus)
                this.AddStatBonus(StatType.MagSize, StatBonusType.Pct, magSizeBonus, "generation")
            }
            else if (paramType == WeaponBonusParamType.FireMode) {
                allSelectedUpgrades.push(weaponUpgradesByBonusType.get(paramType)[0]);
                this.DescriptionBonuses.set(WeaponBonusParamType.FireMode, 1);
            }
            else {
                let minUpgradesToSelect = 1 + 2 * (this.Quality - 1)
                let maxUpgradesToSelect = 4 * this.Quality;
                let upgradesToSelect = math.random(minUpgradesToSelect, maxUpgradesToSelect)
                
                let upgrades = weaponUpgradesByBonusType.get(paramType);
                let bonusValue = 0;
                for(let i = 0; i < upgradesToSelect; i++){
                    const upgrade = upgrades[i];
                    allSelectedUpgrades.push(upgrade);
                    bonusValue += ini_sys.r_float_ex(upgrade.replace("mwu", "mwb"), SectionFields[paramType], 0);
                }

                if (bonusValue != 0) {
                    if (PctBonuses.includes(paramType)) {
                        let defaultValue = ini_sys.r_float_ex(this.Section, SectionFields[paramType], 1);
                        if (defaultValue == 0) 
                            defaultValue = 1;
                        //Log(`Bonus ${t}: ${bonusValue}, base: ${defaultValue}. %: ${bonusValue / defaultValue * 100}`);
                        bonusValue = bonusValue / defaultValue * 100;
                    }

                    this.DescriptionBonuses.set(paramType, math.abs(bonusValue));
                }
            }
        }

        damageBonusPct += cfg.WeaponDPSPctPerQuality * (this.Quality - 1);
        if (damageBonusPct > 0){
            this.DescriptionBonuses.set(WeaponBonusParamType.Damage, damageBonusPct);
            this.AddStatBonus(StatType.DamagePerHit, StatBonusType.Pct, damageBonusPct, "generation")
        }

        //Log(`Base DPS: ${baseDPS} DPS: ${this.DPS}. Damage per hit: ${damagePerHit}. Fire rate: ${fireRate}`)
        for (let upgrade of allSelectedUpgrades) {
            upgrade = upgrade.replace("mwu", "mwe");
            //Log(`Installing upgrade: ${upgrade}`)
            this.GO.install_upgrade(upgrade);
        }
        this.RefillMagazine();
        //Log(`Bonus description: ${this.GetBonusDescription()}`);
    }

    

    RefillMagazine(){
        this.GO?.cast_Weapon().SetAmmoElapsed(this.MagSize)
    }
}

export type  WeaponSpawnParams = {
    level: number;
    quality: number;
}