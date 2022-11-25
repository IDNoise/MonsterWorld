import { TakeRandomFromArray, IsPctRolled } from '../StalkerAPI/extensions/basic';
import { Log } from '../StalkerModBase';
import { BaseMWObject } from './BaseMWObject';
import { MonsterWorld } from './MonsterWorld';
import * as cfg from './MonsterWorldConfig';
import { WeaponSpawnParams, StatType, WeaponBonusParamType, StatBonusType} from './MonsterWorldConfig';

export class MWWeapon extends BaseMWObject {
    
    constructor(public World: MonsterWorld, public id: Id) {
        super(World, id);
    }

    override Initialize(): void {
        let spawnCfg = this.Load<WeaponSpawnParams>("SpawnParams", {level: 1, quality: 1})

        this.Level = spawnCfg.level;
        this.Quality = math.max(cfg.MinQuality, math.min(cfg.MaxQuality, spawnCfg.quality));
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

    get DescriptionBonuses(): LuaTable<WeaponBonusParamType, number> { return this.Load("GeneratedBonuses"); }
    set DescriptionBonuses(bonuses: LuaTable<WeaponBonusParamType, number>) { this.Save("GeneratedBonuses", bonuses); }

    get RPM(): number { return math.max(0.0001, this.GO?.cast_Weapon()?.RPM()) }
    get DPS(): number { return this.DamagePerHit  * (1 / this.RPM) }

    public GetBonusDescription(): string{
        let result = "";

        for(const type of cfg.ParamsForSelection){
            const value = this.DescriptionBonuses.get(type) || 0;
            if (value != 0)
                result += cfg.GetBonusDescription(type, value) + " \\n";
        }

        return result;
    }

    public OnWeaponPickedUp(){
        //Log(`OnWeaponPickedUp`)
        this.GO.set_ammo_elapsed(this.GO.cast_Weapon().GetAmmoMagSize());
        this.GO.set_condition(100)
    }

    OnReloadStart(anim_table: AnimationTable) {
        let mult = 1 + this.World.GetStat(StatType.ReloadSpeedBonusPct, this, this.World.Player) / 100;
        Log(`OnReloadStart. Bonus: x${mult}`)
        anim_table.anm_speed *= mult
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

        let weaponUpgradesByBonusType: LuaTable<WeaponBonusParamType, string[]> = new LuaTable();

        for (let i = 0; i < cfg.ParamsWithWeaponUpgradesSelection.length; i++) {
            let uType = cfg.ParamsWithWeaponUpgradesSelection[i];
            let upgrades = this.GetUpgradesByType(uType)
            //Log(`weaponUpgradesByBonusType ${uType}:${upgrades.length}`)
            if (upgrades.length != 0)
                weaponUpgradesByBonusType.set(uType, upgrades);
        }

        let selectedUpgradeTypes: WeaponBonusParamType[] = [];
        let availableBonuses: WeaponBonusParamType[] = [];
        for(let i = 0; i < cfg.ParamsForSelection.length; i++){
            let type = cfg.ParamsForSelection[i];
            if (!cfg.ParamsWithWeaponUpgradesSelection.includes(type) || weaponUpgradesByBonusType.has(type)){
                availableBonuses.push(type)
                //Log(`availableBonuses ${type}`)
            }
        }        

        let upgradeTypesToAdd = 1 + this.Quality + math.floor(this.Level / 5);
        const upgradeTypesToSelect = math.min(availableBonuses.length, upgradeTypesToAdd);
        for (let i = 0; i < upgradeTypesToSelect; i++) {
            const type = TakeRandomFromArray(availableBonuses);
            selectedUpgradeTypes.push(type);
            //Log(`selectedUpgradeTypes ${type}`)
        }

        if (IsPctRolled(30) && weaponUpgradesByBonusType.has(WeaponBonusParamType.BulletSpeed)){ //Bullet speed is additional bonus
            selectedUpgradeTypes.push(WeaponBonusParamType.BulletSpeed);
            //Log(`selectedUpgradeTypes ${BonusParams.Type.BulletSpeed}`)
        }

        if (IsPctRolled(30) && weaponUpgradesByBonusType.has(WeaponBonusParamType.FireMode)){ //Bullet speed is additional bonus
            selectedUpgradeTypes.push(WeaponBonusParamType.FireMode);
            //Log(`selectedUpgradeTypes ${BonusParams.Type.FireMode}`)
        }

        let minUpgradesToSelect = 1 + 2 * (this.Quality - 1)
        let maxUpgradesToSelect = 4 * this.Quality;

        let damageBonusPct = 0;
        let allSelectedUpgrades: string[] = [];
        for (let upgradeTypeIndex = 0; upgradeTypeIndex < selectedUpgradeTypes.length; upgradeTypeIndex++) {
            let upgradesToSelect = math.random(minUpgradesToSelect, maxUpgradesToSelect)
            let t = selectedUpgradeTypes[upgradeTypeIndex];
            if (t == WeaponBonusParamType.Damage) {
                damageBonusPct += upgradesToSelect * cfg.WeaponDamageBonusPctPerUpgrade;
            }
            else if (t == WeaponBonusParamType.ReloadSpeed) {
                let reloadSpeedBonus = upgradesToSelect * cfg.WeaponReloadSpeedBonusPctPerUpgrade;
                this.DescriptionBonuses.set(WeaponBonusParamType.ReloadSpeed, reloadSpeedBonus)
                this.AddStatBonus(StatType.ReloadSpeedBonusPct, StatBonusType.Flat, reloadSpeedBonus, "generation")
            }
            else if (t == WeaponBonusParamType.CritChance) {
                let critChanceBonus = 1 + upgradesToSelect * cfg.WeaponCritChanceBonusPctPerUpgrade;
                this.DescriptionBonuses.set(WeaponBonusParamType.CritChance, critChanceBonus)
                this.AddStatBonus(StatType.CritChancePct, StatBonusType.Flat, critChanceBonus, "generation")
            }
            else if (t == WeaponBonusParamType.FireMode) {
                allSelectedUpgrades.push(weaponUpgradesByBonusType.get(t)[0]);
                this.DescriptionBonuses.set(WeaponBonusParamType.FireMode, 1);
            }
            else {
                let upgrades = weaponUpgradesByBonusType.get(t);
                let bonusValue = 0;
                for(let i = 0; i < upgradesToSelect; i++){
                    const upgrade = upgrades[i];
                    allSelectedUpgrades.push(upgrade);
                    bonusValue += ini_sys.r_float_ex(upgrade.replace("mwu", "mwb"), cfg.SectionFields[t], 0);
                }

                if (bonusValue != 0) {
                    if (cfg.PctBonuses.includes(t)) {
                        let defaultValue = ini_sys.r_float_ex(this.Section, cfg.SectionFields[t], 1);
                        if (defaultValue == 0) 
                            defaultValue = 1;
                        //Log(`Bonus ${t}: ${bonusValue}, base: ${defaultValue}. %: ${bonusValue / defaultValue * 100}`);
                        bonusValue = bonusValue / defaultValue * 100;
                    }

                    this.DescriptionBonuses.set(t, math.abs(bonusValue));
                }
            }
        }

        damageBonusPct += cfg.WeaponDPSPctPerQuality * (this.Quality - 1);
        damageBonusPct  = math.max(0, damageBonusPct + math.random(-cfg.WeaponDPSDeltaPct, cfg.WeaponDPSDeltaPct));
        if (damageBonusPct > 0){
            this.DescriptionBonuses.set(WeaponBonusParamType.Damage, damageBonusPct);
            this.AddStatBonus(StatType.DamagePerHit, StatBonusType.Pct, damageBonusPct, "generation")
        }

        //Log(`Base DPS: ${baseDPS} DPS: ${this.DPS}. Damage per hit: ${damagePerHit}. Fire rate: ${fireRate}`)
        for (let i = 0; i < allSelectedUpgrades.length; i++) {
            let upgrade = allSelectedUpgrades[i].replace("mwu", "mwe");
            //Log(`Installing upgrade: ${upgrade}`)
            this.GO.install_upgrade(upgrade);
        }

        //Log(`Bonus description: ${this.GetBonusDescription()}`);
    }
}
