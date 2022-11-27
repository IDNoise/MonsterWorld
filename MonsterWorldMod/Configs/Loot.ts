import { Log } from '../../StalkerModBase';
import { GetByWeightFromArray, TakeRandomElementFromArray, GetByWeightFromTable } from '../Helpers/Collections';
import { MonsterRank } from './Enemies';
import { StatType } from "./Stats";

export const enum DropType {
    Weapon = 0,
    Stimpack,
    Artefact,
    Armor,
}

export let MinQuality = 1;
export let MaxQuality = 5;

export let HigherLevelDropChancePct = 5;

export type QualityConfig = {
    MinPlayerLevel: number,
    Weight: number,
    Title: string,
    TextColor: ARGBColor,
    Particles: string,
}

export let QualityConfigs : LuaTable<number, QualityConfig> =  new LuaTable();
QualityConfigs.set(1, {MinPlayerLevel: 1,  Weight: 100, Title: "Common",    TextColor: GetARGB(255,230,230,230), Particles: "explosions\\effects\\campfire_hot_glow"});
QualityConfigs.set(2, {MinPlayerLevel: 2,  Weight: 25,  Title: "Uncommmon", TextColor: GetARGB(255,20,20,230),   Particles: "static\\effects\\net_base_green",});
QualityConfigs.set(3, {MinPlayerLevel: 5,  Weight: 15,  Title: "Rare",      TextColor: GetARGB(255,20,230,20),   Particles: "static\\effects\\net_base_blue"});
QualityConfigs.set(4, {MinPlayerLevel: 10, Weight: 7,   Title: "Epic",      TextColor: GetARGB(255,230,20,20),   Particles: "static\\effects\\net_base_red"});
QualityConfigs.set(5, {MinPlayerLevel: 15, Weight: 2,   Title: "Legendary", TextColor: GetARGB(255,240,165,5),   Particles: "_samples_particles_\\holo_lines"});

export function GetDropQuality(level: number): number {
    return GetByWeightFromTable(QualityConfigs, (el) => el.MinPlayerLevel >= level ? el.Weight : 0)
}

export type DropConfig = {
    Type: DropType,
    WeightsByRank: number[]
}
export let DropConfigs: DropConfig[] = [
    {Type: DropType.Weapon,   WeightsByRank: [75,  75,  75]},
    {Type: DropType.Stimpack, WeightsByRank: [10,  15,  25]},
    {Type: DropType.Armor,    WeightsByRank: [10,  15,  25]}, 
    {Type: DropType.Artefact, WeightsByRank: [5,   10,  20]}, 
]

export function GetDropType(rank: MonsterRank): DropType { return GetByWeightFromArray(DropConfigs, (e) => e.WeightsByRank[rank]).Type; }

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