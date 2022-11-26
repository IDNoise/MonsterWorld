import { GetByWeightFromArray, TakeRandomElementFromArray } from '../Helpers/Collections';
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

export let QualityWeights = [
    {quality: 1, weight: 250},
    {quality: 2, weight: 20},
    {quality: 3, weight: 10},
    {quality: 4, weight: 5},
    {quality: 5, weight: 1},
];

export function GetDropQuality(): number {
    return GetByWeightFromArray(QualityWeights, (el) => el.weight).quality
}

export type DropConfig = {
    type: DropType,
    weight: number
}
export let DropConfigs: DropConfig[] = [
    {type: DropType.Weapon, weight: 50},
    {type: DropType.Stimpack, weight: 10},
    {type: DropType.Armor, weight: 10}, 
    //{type: DropType.Art, weight: 500}, 
]

export function GetDropType(): DropType { return GetByWeightFromArray(DropConfigs, (e) => e.weight).type; }

export function GetStimpackByQuality(qualityLevel: number): Section {
    if (qualityLevel <= 2) return "mw_stimpack_25";
    if (qualityLevel <= 4) return "mw_stimpack_50";
    return "mw_stimpack_75"
}

export function GetDropParticles(type: DropType, quality: number): string {
    if (quality == 1) return "explosions\\effects\\campfire_sparks";
    if (quality == 2) return "static\\effects\\net_base_green";
    if (quality == 3) return "static\\effects\\net_base_blue";
    if (quality == 4) return "static\\effects\\net_base_red";
    return "_samples_particles_\\holo_lines";
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