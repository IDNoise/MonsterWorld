import { GetByWeightFromArray, TakeRandomElementFromArray, GetByWeightFromTable } from '../Helpers/Collections';
import { StatType } from "./Stats";
import { EndColorTag } from "./UI";

export const enum DropType {
    Weapon = 0,
    Stimpack,
    Art,
    Armor,
}

export let EnemyDropChanceByRank: number[] = [15, 100, 35];
export let MinQuality = 1;
export let MaxQuality = 5;

export let HigherLevelDropChancePct = 5;

export type QualityConfig = {
    Weight: number,
    Title: string,
    TextColor: ARGBColor,
    Particles: string,
}

export let QualityConfigs : LuaTable<number, QualityConfig> =  new LuaTable();
QualityConfigs.set(1, {Weight: 250, Title: "Common",    TextColor: GetARGB(255,230,230,230), Particles: "explosions\\effects\\campfire_sparks"});
QualityConfigs.set(2, {Weight: 20,  Title: "Uncommmon", TextColor: GetARGB(255,20,20,230),   Particles: "static\\effects\\net_base_green"});
QualityConfigs.set(3, {Weight: 10,  Title: "Rare",      TextColor: GetARGB(255,20,230,20),   Particles: "static\\effects\\net_base_blue"});
QualityConfigs.set(4, {Weight: 5,   Title: "Epic",      TextColor: GetARGB(255,230,20,20),   Particles: "static\\effects\\net_base_red"});
QualityConfigs.set(5, {Weight: 1,   Title: "Legendary", TextColor: GetARGB(255,240,165,5),   Particles: "_samples_particles_\\holo_lines"});

export function GetDropQuality(): number {
    return GetByWeightFromTable(QualityConfigs, (el) => el.Weight)
}

export type DropConfig = {
    Type: DropType,
    Weight: number
}
export let DropConfigs: DropConfig[] = [
    {Type: DropType.Weapon, Weight: 50},
    {Type: DropType.Stimpack, Weight: 10},
    {Type: DropType.Armor, Weight: 10}, 
    //{type: DropType.Art, weight: 500}, 
]

export function GetDropType(): DropType { return GetByWeightFromArray(DropConfigs, (e) => e.Weight).Type; }

export function GetStimpackByQuality(qualityLevel: number): Section {
    if (qualityLevel <= 2) return "mw_stimpack_25";
    if (qualityLevel <= 4) return "mw_stimpack_50";
    return "mw_stimpack_75"
}

export let ArmorStatsForGeneration = [
    StatType.DamageResistancePct,
    StatType.HPRegen,
]

export let WeaponStatsForGeneration = [
    StatType.Damage, 
    StatType.Rpm, 
    StatType.MagSize, 
    StatType.Accuracy, 
    StatType.Recoil, 
    StatType.ReloadSpeedBonusPct, 
    StatType.CritChancePct
]; 

export let WeaponStatsUsingUpgrades = [
    StatType.Rpm, 
    StatType.Accuracy, 
    StatType.Recoil, 
    StatType.Flatness, 
    StatType.AutoFireMode
]; 

export function GetWeaponUpgradesByStat(weaponSection: Section, stat: StatType): Section[]{
    let prefix = "";
    switch(stat){
        case StatType.Rpm: prefix = "rpm"; break; 
        case StatType.Accuracy: prefix = "dispersion"; break; 
        case StatType.Recoil: prefix = "recoil"; break; 
        case StatType.Flatness: prefix = "bullet_speed"; break; 
        case StatType.AutoFireMode: prefix = "fire_mode"; break; 
    }

    if (prefix == ""){
        return [];
    }

    let fieldName = `${prefix}_upgrades`;
    if (ini_sys.r_string_ex(weaponSection, fieldName, "") != "") {
        return ini_sys.r_list(weaponSection, fieldName, []);
    }

    return [];
}

export function GetWeaponSectinFieldNameByStat(stat: StatType): string {
    switch(stat){
        case StatType.Rpm: return "rpm"; 
        case StatType.Accuracy: return "fire_dispersion_base"; 
        case StatType.Recoil: return "cam_max_angle";
        case StatType.Flatness: return "bullet_speed"; 
        case StatType.MagSize: return "ammo_mag_size"; 
    }
    return "";
}

export function GetWeaponBaseValueByStat(weaponSection: Section, stat: StatType): number {
    let fieldName = GetWeaponSectinFieldNameByStat(stat);
    if (fieldName == ""){
        return 0;
    }

    return ini_sys.r_float_ex(weaponSection, fieldName, 0);
}