import { TakeRandomFromArray, IsPctRolled } from '../StalkerAPI/extensions/basic';
import { Log } from '../StalkerModBase';
import { BaseMWObject } from './BaseMWObject';
import { MonsterWorld } from './MonsterWorld';
import * as cfg from './MonsterWorldConfig';
import { WeaponSpawnParams } from './MonsterWorldConfig';

export class MWWeapon extends BaseMWObject {
    
    constructor(public mw: MonsterWorld, public id: Id) {
        super(mw, id);
    }

    override Initialize(): void {
        let spawnCfg = this.Load<WeaponSpawnParams>("SpawnParams", {level: 1, quality: 1})

        this.Level = spawnCfg.level;
        this.Quality = math.max(cfg.MinQuality, math.min(cfg.MaxQuality, spawnCfg.quality));
        this.Bonuses = new LuaTable();

        if (this.Section.indexOf("knife") >= 0){
            this.DamagePerHit = cfg.WeaponDPSBase * 5;
            //DO smth with knife or fuck it?
            return;
        }

        this.GenerateWeaponStats();
    }

    get Quality(): number { return this.Load("Quality"); }
    set Quality(quality: number) { this.Save("Quality", quality); }

    get DamagePerHit(): number { return this.Load("DamagePerHit"); }
    set DamagePerHit(damage: number) { this.Save("DamagePerHit", damage); }

    get CritChance(): number { return this.Bonuses.get(BonusParams.Type.CritChance) || 0 }

    get Bonuses(): LuaTable<BonusParams.Type, number> { return this.Load("GeneratedBonuses"); }
    set Bonuses(bonuses: LuaTable<BonusParams.Type, number>) { this.Save("GeneratedBonuses", bonuses); }

    get DPS(): number { return this.DamagePerHit  * (1 / this.GO.cast_Weapon().RPM()) }

    public GetBonusDescription(): string{
        let result = "";

        for(const type of BonusParams.ParamsForSelection){
            const value = this.Bonuses.get(type) || 0;
            if (value != 0)
                result += BonusParams.GetBonusDescription(type, value) + " \\n";
        }

        return result;
    }

    public OnWeaponPickedUp(){
        Log(`OnWeaponPickedUp`)
        this.GO.set_ammo_elapsed(this.GO.cast_Weapon().GetAmmoMagSize());
        this.GO.set_condition(100)
    }

    OnReloadStart(anim_table: AnimationTable) {
        Log(`OnReloadStart`)
        let bonus = this.Bonuses.get(BonusParams.Type.ReloadSpeed) || 0;
        anim_table.anm_speed *= (1 + bonus / 100)
    }

    private GetUpgradesByType(type: BonusParams.Type): string[] {
        if (ini_sys.r_string_ex(this.Section, type + "_upgrades", "") != "") {
            return ini_sys.r_list(this.Section, type + "_upgrades", []);
        }
        return [];
    }

    private GenerateWeaponStats() {
        Log(`GenerateWeaponStats`)
        let baseDPS = cfg.WeaponDPSBase * math.pow(cfg.WeaponDPSExpPerLevel, this.Level - 1);

        let weaponUpgradesByBonusType: LuaTable<BonusParams.Type, string[]> = new LuaTable();

        for (let i = 0; i < BonusParams.ParamsWithWeaponUpgradesSelection.length; i++) {
            let uType = BonusParams.ParamsWithWeaponUpgradesSelection[i];
            let upgrades = this.GetUpgradesByType(uType)
            Log(`weaponUpgradesByBonusType ${uType}:${upgrades.length}`)
            if (upgrades.length != 0)
                weaponUpgradesByBonusType.set(uType, upgrades);
        }

        let selectedUpgradeTypes: BonusParams.Type[] = [];
        let availableBonuses: BonusParams.Type[] = [];
        for(let i = 0; i < BonusParams.ParamsForSelection.length; i++){
            let type = BonusParams.ParamsForSelection[i];
            if (!BonusParams.ParamsWithWeaponUpgradesSelection.includes(type) || weaponUpgradesByBonusType.has(type)){
                availableBonuses.push(type)
                Log(`availableBonuses ${type}`)
            }
        }        

        let upgradeTypesToAdd = 1 + this.Quality;
        const upgradeTypesToSelect = math.min(availableBonuses.length, upgradeTypesToAdd);
        for (let i = 0; i < upgradeTypesToSelect; i++) {
            const type = TakeRandomFromArray(availableBonuses);
            selectedUpgradeTypes.push(type);
            Log(`selectedUpgradeTypes ${type}`)
        }

        if (IsPctRolled(100) && weaponUpgradesByBonusType.has(BonusParams.Type.BulletSpeed)){ //Bullet speed is additional bonus
            selectedUpgradeTypes.push(BonusParams.Type.BulletSpeed);
            Log(`selectedUpgradeTypes ${BonusParams.Type.BulletSpeed}`)
        }

        if (IsPctRolled(100) && weaponUpgradesByBonusType.has(BonusParams.Type.FireMode)){ //Bullet speed is additional bonus
            selectedUpgradeTypes.push(BonusParams.Type.FireMode);
            Log(`selectedUpgradeTypes ${BonusParams.Type.FireMode}`)
        }

        let damageBonusPct = 0;
        let reloadSpeedBonusPct = 0;
        let critChanceBonusPct = 0;
        let allSelectedUpgrades: string[] = [];
        for (let i = 0; i < selectedUpgradeTypes.length; i++) {
            let upgradesPerTypeToSelect = 1 + (this.Level / 10) + (this.Quality - 1) / 2;
            let t = selectedUpgradeTypes[i];
            if (t == BonusParams.Type.Damage) {
                let bonus = 0;
                for (let j = 0; j < upgradesPerTypeToSelect; j++) {
                    bonus += math.random(1, 5 + this.Quality);
                }
                damageBonusPct = bonus;
            }
            else if (t == BonusParams.Type.ReloadSpeed) {
                let bonus = 0;
                for (let j = 0; j < upgradesPerTypeToSelect; j++) {
                    bonus += math.random(2, 5 + this.Quality);
                }
                reloadSpeedBonusPct = bonus;
            }
            else if (t == BonusParams.Type.CritChance) {
                critChanceBonusPct = math.random(1, this.Quality /2 + upgradesPerTypeToSelect);
            }
            else if (t == BonusParams.Type.FireMode) {
                allSelectedUpgrades.push(weaponUpgradesByBonusType.get(t)[0]);
                this.Bonuses.set(BonusParams.Type.FireMode, 1);
            }
            else {
                let upgrades = weaponUpgradesByBonusType.get(t);
                //higher quality selectes from better upgrades
                if (this.Quality < 3 && upgrades.length >= this.Quality + 3)
                    upgrades = upgrades.slice(0, math.min(2 + this.Quality, upgrades.length) - 1);
                else if (this.Quality >= 3 && upgrades.length >= this.Quality + 3)
                    upgrades = upgrades.slice(3);
                const toSelect = math.min(upgradesPerTypeToSelect, math.max(1, upgrades.length));
                let bonusValue = 0;

                for (let j = 0; j < toSelect; j++) {
                    const upgrade = TakeRandomFromArray(upgrades);
                    allSelectedUpgrades.push(upgrade);
                    bonusValue += ini_sys.r_float_ex(upgrade.replace("mwu", "mwb"), BonusParams.SectionFields[t], 0);
                }

                if (bonusValue != 0) {
                    if (BonusParams.PctBonuses.includes(t)) {
                        const defaultValue = ini_sys.r_float_ex(this.Section, BonusParams.SectionFields[t], 1);
                        Log(`Bonus ${t}: ${bonusValue}, base: ${defaultValue}. %: ${bonusValue / defaultValue * 100}`);
                        bonusValue = bonusValue / defaultValue * 100;
                    }

                    this.Bonuses.set(t, math.abs(bonusValue));
                }
            }
        }

        Log(`Setting bonuses for damage/reload/crit`)
        this.Bonuses.set(BonusParams.Type.ReloadSpeed, reloadSpeedBonusPct)
        this.Bonuses.set(BonusParams.Type.CritChance, critChanceBonusPct)

        damageBonusPct += cfg.WeaponDPSPctPerQuality * (this.Quality - 1);
        if (damageBonusPct >= cfg.WeaponDPSDeltaPct) {
            damageBonusPct += math.random(-cfg.WeaponDPSDeltaPct, cfg.WeaponDPSDeltaPct);
        }
        this.Bonuses.set(BonusParams.Type.Damage, damageBonusPct);

        let dps = baseDPS;
        dps *= (1 + damageBonusPct / 100);
        //const ammoMagSize = ini_sys.r_float_ex(this.Section, "ammo_mag_size", 1);
        const rpm = ini_sys.r_float_ex(this.Section, "rpm", 1);
        const fireRate = 60 / rpm;
        this.DamagePerHit = dps * fireRate;

        Log(`Base DPS: ${baseDPS} DPS: ${dps}. Damage per hit: ${this.DamagePerHit}. Fire rate: ${fireRate}`)
        for (let i = 0; i < allSelectedUpgrades.length; i++) {
            let upgrade = allSelectedUpgrades[i].replace("mwu", "mwe");
            Log(`Installing upgrade: ${upgrade}`)
            this.GO.install_upgrade(upgrade);
        }

        Log(`Bonus description: ${this.GetBonusDescription()}`);
    }
}

export module BonusParams {
    export const enum Type{
        Damage = "damage",
        Rpm = "rpm",
        MagSize = "mag_size",
        FireMode = "fire_mode",
        Dispersion = "dispersion",
        Inertion = "inertion",
        Recoil = "recoil",
        ReloadSpeed = "reload_speed",
        BulletSpeed = "bullet_speed",
        CritChance = "crit_chance",
    }
    
    export let ParamsForSelection = [Type.Damage, Type.Rpm, Type.MagSize, Type.Dispersion, Type.Inertion, Type.Recoil, Type.ReloadSpeed, Type.CritChance]; 
    export let ParamsWithWeaponUpgradesSelection = [Type.Rpm, Type.MagSize, Type.Dispersion, Type.Inertion, Type.Recoil, Type.BulletSpeed, Type.FireMode]; 

    export let SectionFields : {[key in Type]: string} = {
        damage: "_NotUsed",
        fire_mode: "_NotUsed",
        reload_speed: "_NotUsed",
        crit_chance: "_NotUsed",
        rpm: "rpm",
        mag_size: "ammo_mag_size",
        dispersion: "fire_dispersion_base",
        inertion: "crosshair_inertion",
        recoil: "cam_dispersion",
        bullet_speed: "bullet_speed"
    }

    export let PctBonuses = [Type.Damage, Type.Rpm, Type.Dispersion, Type.Inertion, Type.Recoil, Type.BulletSpeed, Type.ReloadSpeed, Type.CritChance];

    export function GetBonusDescription(type: Type, bonus: number = 0): string{
        if (HasNoValue.includes(type))
            return `%c[255,255,255,0]${BonusDescriptions[type]}${cfg.EndColorTag}`;
            //return BonusDescriptions[type];
        
        const valueStr = `${NegativeBonuses.includes(type) ? "-" : "+"}${math.floor(bonus)}${PctBonuses.includes(type) ? "\%" : ""}`;
        //return `${BonusDescriptions[type]} ${valueStr}`
        return `%c[255,56,166,209]${valueStr.padEnd(6, " ")}${cfg.EndColorTag} ${BonusDescriptions[type]}`
    }

    let NegativeBonuses = [Type.Recoil];
    let HasNoValue = [Type.FireMode];

    let BonusDescriptions : {[key in Type]: string} = {
        damage: "Damage",
        rpm: "Fire Rate",
        mag_size: "Mag size",
        fire_mode: "AUTO fire mode enabled",
        dispersion: "Accuracy",
        inertion: "Handling",
        recoil: "Recoil",
        reload_speed: "Reload speed",
        crit_chance: "Crit chance",
        bullet_speed: "Flatness"
    }
}