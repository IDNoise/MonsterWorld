import { TakeRandomFromArray } from '../StalkerAPI/extensions/basic';
import { Log } from '../StalkerModBase';
import { BaseMWObject } from './BaseMWObject';
import { MonsterWorld } from './MonsterWorld';
import * as cfg from './MonsterWorldConfig';

export class MWWeapon extends BaseMWObject {
    constructor(public mw: MonsterWorld, public id: Id, private spawnLevel?: number, private spawnQualityLevel?: number) {
        super(mw, id);
    }

    override Initialize(): void {
        this.Level = this.spawnLevel || 1;
        this.Quality = math.max(cfg.MinQuality, math.min(cfg.MaxQuality, this.spawnQualityLevel || 1));
        this.Bonuses = new LuaTable();

        if (this.GO.section().indexOf("knife") >= 0){
            this.DamagePerHit = cfg.WeaponDPSBase * 5;
            //DO smth with knife or fuck it?
            return;
        }

        const ammoMagSize = ini_sys.r_float_ex(this.GO.section(), "ammo_mag_size", 1);
        const rpm = ini_sys.r_float_ex(this.GO.section(), "rpm", 1);
        const fireRate = 60 / rpm;
        let baseDPS = cfg.WeaponDPSBase * math.pow(cfg.WeaponDPSExpPerLevel, this.Level - 1);

        let dps = baseDPS;
        if (ini_sys.r_string_ex(this.GO.section(), "tri_state_reload", "off") == "on"){
            dps += baseDPS * 0.5;
        }
        if (ammoMagSize < 8){
            dps += baseDPS * 0.15;
        }

        let upgradesByType: [BonusParams.Type, string[]][] = [];
        upgradesByType.push([BonusParams.Type.Damage, []]);

        let upgradeTypes = BonusParams.AllParams;
        for(let i = 0; i < upgradeTypes.length; i++){
            let uType = upgradeTypes[i];
            if (uType == BonusParams.Type.Damage) continue;
            if (ini_sys.r_string_ex(this.GO.section(), uType + "_upgrades", "") != "" ) {
                let upgrades = ini_sys.r_list(this.GO.section(), uType + "_upgrades", [])
                if (upgrades.length != 0)
                    upgradesByType.push([uType, upgrades]);
            }
            //Log(`After getting upgrade list ${uType}: ${upgrades.length}`)
        }

        //Log(`After filing map by upgrade type. ${upgradesByType.length}`)
        
        let selectedUpgradeTypes: [BonusParams.Type, string[]][] = [];
        let upgradeTypesToAdd = 2 + math.random(0, (this.Quality - 1));
        const upgradeTypesToSelect = math.min(upgradesByType.length, upgradeTypesToAdd);
        for(let i = 0; i < upgradeTypesToSelect; i++){
            const upgrades = TakeRandomFromArray(upgradesByType);
            selectedUpgradeTypes.push(upgrades)
        }

        //Log(`After selecting upgrade types. ${upgradeTypesToAdd} ${upgradeTypesToSelect} ${selectedUpgradeTypes.length} `)

        let damageBonus = 0;
        let allSelectedUpgrades: string[] = []
        for(let i = 0; i < selectedUpgradeTypes.length; i++){
            let upgradesPerTypeToSelect = 1 + (this.Level / 10) + (this.Quality - 1) / 2;
            let [t, upgrades] = selectedUpgradeTypes[i];
            //Log(`Adding ugprades ${upgradesPerTypeToSelect} from ${t} (${upgrades.length})`)
            if (t == BonusParams.Type.Damage){
                let bonus = 0;
                for(let j = 0; j < upgradesPerTypeToSelect; j++){
                    bonus +=  math.random(1, 5);
                }
                damageBonus = bonus;
            }
            else if (t == BonusParams.Type.FireMode){
                const upgrade = TakeRandomFromArray(upgrades);
                allSelectedUpgrades.push(upgrade);
                this.Bonuses.set(BonusParams.Type.FireMode, 1);
            }
            else {
                //higher quality selectes from better upgrades
                if (this.Quality < 3 && upgrades.length >= this.Quality + 3)
                    upgrades = upgrades.slice(0, math.min(2 + this.Quality, upgrades.length) - 1)
                else if (this.Quality >= 3 && upgrades.length >= this.Quality + 3)
                    upgrades = upgrades.slice(3)
                const toSelect = math.min(upgradesPerTypeToSelect, math.max(1, upgrades.length));
                let bonusValue = 0;

                for(let j = 0; j < toSelect; j++){
                    const upgrade = TakeRandomFromArray(upgrades);
                    allSelectedUpgrades.push(upgrade)
                    bonusValue += ini_sys.r_float_ex(upgrade.replace("mwu", "mwb"), BonusParams.SectionFields[t], 0)
                }

                //Log(`Bonus ${t}: ${bonusValue}`)

                if (bonusValue != 0){
                    if (BonusParams.PctBonuses.includes(t)){
                        const defaultValue = ini_sys.r_float_ex(this.GO.section(), BonusParams.SectionFields[t], 1);
                        Log(`Bonus ${t}: ${bonusValue}, base: ${defaultValue}. %: ${bonusValue / defaultValue * 100}`)
                        bonusValue = bonusValue / defaultValue * 100;
                    }
                    //Log(`After change: ${bonusValue}`)

                    this.Bonuses.set(t, math.abs(bonusValue));
                }
            }
        }

        //Log(`After selecting ugprades ${allSelectedUpgrades.length}`)

        damageBonus += cfg.WeaponDPSPctPerQuality * (this.Quality - 1);
        damageBonus += math.random(-cfg.WeaponDPSDeltaPct, cfg.WeaponDPSDeltaPct);
        this.Bonuses.set(BonusParams.Type.Damage, damageBonus);
        dps *= (1 + damageBonus / 100)

        this.DamagePerHit = dps * fireRate;

        //Log(`Base DPS: ${baseDPS} DPS: ${dps}. Damage per hit: ${this.DamagePerHit}. Fire rate: ${fireRate}`)
 
        for(let i = 0; i < allSelectedUpgrades.length; i++){
            let upgrade = allSelectedUpgrades[i].replace("mwu", "mwe");
            //Log(`Before install ${upgrade}`) 
            this.GO.install_upgrade(upgrade);
            //Log(`After install ${upgrade}`) 
        }

        Log(`Bonus description: ${this.GetBonusDescription()}`)

        this.GO.set_ammo_elapsed(this.GO.cast_Weapon().GetAmmoMagSize());
    }

    get Quality(): number { return this.Load("Quality"); }
    set Quality(quality: number) { this.Save("Quality", quality); }

    get DamagePerHit(): number { return this.Load("DamagePerHit"); }
    set DamagePerHit(damage: number) { this.Save("DamagePerHit", damage); }

    get Bonuses(): LuaTable<BonusParams.Type, number> { return this.Load("GeneratedBonuses"); }
    set Bonuses(bonuses: LuaTable<BonusParams.Type, number>) { this.Save("GeneratedBonuses", bonuses); }

    public GetBonusDescription(): string{
        let result = "";

        for(const type of BonusParams.AllParams){
            //Log(`Bonus ${type}: ${this.Bonuses.get(type) || -1}`)
            const value = this.Bonuses.get(type) || 0;
            if (value != 0)
                result += BonusParams.GetBonusDescription(type, value) + " \\n";
        }

        return result;
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
        BulletSpeed = "bullet_speed"
    }
    
    export let AllParams = [Type.Damage, Type.Rpm, Type.MagSize, Type.Dispersion, Type.Inertion, Type.Recoil, Type.BulletSpeed, Type.FireMode];

    export let SectionFields : {[key in Type]: string} = {
        damage: "_NotUsed",
        fire_mode: "_NotUsed",
        rpm: "rpm",
        mag_size: "ammo_mag_size",
        dispersion: "fire_dispersion_base",
        inertion: "crosshair_inertion",
        recoil: "cam_dispersion",
        bullet_speed: "bullet_speed"
    }

    export let PctBonuses = [Type.Damage, Type.Rpm, Type.Dispersion, Type.Inertion, Type.Recoil, Type.BulletSpeed];

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
        bullet_speed: "Flatness"
    }
}