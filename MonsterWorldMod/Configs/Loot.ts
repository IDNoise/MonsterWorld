import { GetByWeightFromArray } from "../Helpers/Collections";
import { StatType } from "./Stats";
import { EndColorTag } from "./UI";

export const enum DropType {
    Weapon = 0,
    Stimpack,
    Art
}

export let EnemyDropChanceByRank: number[] = [15, 100, 35];
export let MinQuality = 1;
export let MaxQuality = 5;

export let HigherLevelDropChancePct = 5;

export let QualityWeights = [
    {quality: 1, weight: 100},
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
    //{type: DropType.Art, weight: 500}, 
]

export function GetDropType(): DropType { return GetByWeightFromArray(DropConfigs, (e) => e.weight).type; }

export type StimpackConfig = {
    section: Section,
    quality: number,
    weight: number
}
export let Stimpacks: StimpackConfig[] = [
    {section: "mw_stimpack_25", quality: 1, weight: 150},
    {section: "mw_stimpack_50", quality: 3, weight: 40},
    {section: "mw_stimpack_75", quality: 5, weight: 10},
]

export function GetStimpack(): [Section, number] { 
    let stimpack = GetByWeightFromArray(Stimpacks, (e) => e.weight);
    return [stimpack.section, stimpack.quality]; 
}

export function GetDropParticles(type: DropType, quality: number): string {
    if (type == DropType.Weapon || type == DropType.Stimpack){
        if (quality <= 2) return "static\\effects\\net_base_green";
        if (quality <= 4) return "static\\effects\\net_base_blue";
        return "static\\effects\\net_base_red";
    }

    return "_samples_particles_\\holo_lines";
}

export let WeaponStatsForGeneration = [
    StatType.Damage, 
    StatType.RpmBonusPct, 
    StatType.MagSize, 
    StatType.DispersionBonusPct, 
    StatType.RecoilBonusPct, 
    StatType.ReloadSpeedBonusPct, 
    StatType.CritChancePct
]; 

export let WeaponStatsUsingUpgrades = [
    StatType.RpmBonusPct, 
    StatType.DispersionBonusPct, 
    StatType.RecoilBonusPct, 
    StatType.BulletSpeedBonusPct, 
    StatType.AutoFireModeState
]; 

export function GetWeaponUpgradesByStat(weaponSection: Section, stat: StatType): Section[]{
    let prefix = "";
    switch(stat){
        case StatType.RpmBonusPct: prefix = "rpm"; break; 
        case StatType.DispersionBonusPct: prefix = "dispersion"; break; 
        case StatType.RecoilBonusPct: prefix = "recoil"; break; 
        case StatType.BulletSpeedBonusPct: prefix = "bullet_speed"; break; 
        case StatType.AutoFireModeState: prefix = "fire_mode"; break; 
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
        case StatType.RpmBonusPct: return "rpm"; 
        case StatType.DispersionBonusPct: return "fire_dispersion_base"; 
        case StatType.RecoilBonusPct: return "cam_max_angle";
        case StatType.BulletSpeedBonusPct: return "bullet_speed"; 
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