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
        this.Quality = this.spawnQualityLevel || 5;
        this.Bonuses = new LuaTable();

        if (this.GO.section().indexOf("knife") >= 0){
            //DO smth with knife or fuck it?
            return;
        }

        let baseDPS = cfg.WeaponDPSBase * math.pow(cfg.WeaponDPSExpPerLevel, this.Level - 1) * (1 + math.random(cfg.WeaponDPSDeltaPctMin, cfg.WeaponDPSDeltaPctMax) / 100);
        if (ini_sys.r_string_ex(this.GO.section(), "tri_state_reload", "off") == "on"){
            baseDPS *= 2;
        }
        
        let dps = baseDPS;

        let upgradesByType: [BonusParams.Type, string[]][] = [];
        upgradesByType.push([BonusParams.Type.Damage, []]);

        let upgradeTypes = BonusParams.AllParams;
        for(let i = 0; i < upgradeTypes.length; i++){
            let uType = upgradeTypes[i];
            if (uType == BonusParams.Type.Damage) continue;
            let upgrades = ini_sys.r_list(this.GO.section(), uType + "_upgrades", [])
            upgradesByType.push([uType, upgrades]);
            //Log(`After getting upgrade list ${uType}: ${upgrades.length}`)
        }

        //Log(`After filing map by upgrade type. ${upgradesByType.length}`)
        
        let selectedUpgradeTypes: [BonusParams.Type, string[]][] = [];
        let upgradeTypesToAdd = 3 + math.random(1, this.Quality);
        const upgradeTypesToSelect = math.min(upgradesByType.length, upgradeTypesToAdd);
        for(let i = 0; i < upgradeTypesToSelect; i++){
            const upgrades = TakeRandomFromArray(upgradesByType);
            selectedUpgradeTypes.push(upgrades)
        }

        //Log(`After selecting upgrade types. ${upgradeTypesToAdd} ${upgradeTypesToSelect} ${selectedUpgradeTypes.length} `)

        let damageBonus = 0;
        let allSelectedUpgrades: string[] = []
        for(let i = 0; i < selectedUpgradeTypes.length; i++){
            let upgradesPerTypeToSelect = 1 + (this.Level / 10) + this.Quality / 2;
            const [t, upgrades] = selectedUpgradeTypes[i];
            //Log(`Adding ugprades ${upgradesPerTypeToSelect} from ${t} (${upgrades.length})`)
            if (t == BonusParams.Type.Damage){
                let bonus = 0;
                for(let j = 0; j < upgradesPerTypeToSelect; j++){
                    bonus +=  math.random(5, 5);
                }
                damageBonus = bonus;
            }
            else if (t == BonusParams.Type.FireMode){
                const upgrade = TakeRandomFromArray(upgrades);
                allSelectedUpgrades.push(upgrade);
                this.Bonuses.set(BonusParams.Type.FireMode, 1);
            }
            else {
                const toSelect = math.min(upgradesPerTypeToSelect, math.max(1, upgrades.length - 1));
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
                        bonusValue = bonusValue / defaultValue * 100;
                    }
                    //Log(`After change: ${bonusValue}`)

                    this.Bonuses.set(t, math.abs(bonusValue));
                }
            }
        }

        //Log(`After selecting ugprades ${allSelectedUpgrades.length}`)

        damageBonus += cfg.WeaponDPSPctPerQuality * this.Quality;
        this.Bonuses.set(BonusParams.Type.Damage, damageBonus);
        dps *= (1 + damageBonus / 100)


        const fireRate = this.GO.cast_Weapon().RPM();
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
    set Quality(level: number) { this.Save("Quality", level); }

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
                result += BonusParams.GetBonusDescription(type, value) + "\n";
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
            return BonusDescriptions[type];
        
        return `${BonusDescriptions[type]} ${NegativeBonuses.includes(type) ? "-" : "+"}${math.floor(bonus)}${PctBonuses.includes(type) ? "%" : ""}`
    }

    let NegativeBonuses = [Type.Recoil];
    let HasNoValue = [Type.FireMode];

    let BonusDescriptions : {[key in Type]: string} = {
        damage: "Damage",
        rpm: "Fire Rate",
        mag_size: "Mag size",
        fire_mode: "Full AUTO",
        dispersion: "Accurecy",
        inertion: "Handling",
        recoil: "Recoil",
        bullet_speed: "Flatness"
    }
}