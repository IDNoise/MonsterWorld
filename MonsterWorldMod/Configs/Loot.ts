import { GetByWeightFromArray } from "../../StalkerAPI/extensions/basic";
import { EndColorTag } from "./UI";

export const enum DropType {
    Weapon = 0,
    Stimpack
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

export enum WeaponBonusParamType{
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

export let ParamsForSelection = [
    WeaponBonusParamType.Damage, 
    WeaponBonusParamType.Rpm, 
    WeaponBonusParamType.MagSize, 
    WeaponBonusParamType.Dispersion, 
    WeaponBonusParamType.Inertion, 
    WeaponBonusParamType.Recoil, 
    WeaponBonusParamType.ReloadSpeed, 
    WeaponBonusParamType.CritChance
]; 
export let ParamsWithWeaponUpgradesSelection = [
    WeaponBonusParamType.Rpm, 
    WeaponBonusParamType.Dispersion, 
    WeaponBonusParamType.Inertion, 
    WeaponBonusParamType.Recoil, 
    WeaponBonusParamType.BulletSpeed, 
    WeaponBonusParamType.FireMode
]; 

let NegativeBonuses = [WeaponBonusParamType.Recoil];
let HasNoValue = [WeaponBonusParamType.FireMode];

export let PctBonuses = [
    WeaponBonusParamType.Damage, 
    WeaponBonusParamType.Rpm, 
    WeaponBonusParamType.MagSize, 
    WeaponBonusParamType.Dispersion, 
    WeaponBonusParamType.Inertion, 
    WeaponBonusParamType.Recoil, 
    WeaponBonusParamType.BulletSpeed, 
    WeaponBonusParamType.ReloadSpeed, 
    WeaponBonusParamType.CritChance
];

export let SectionFields : {[key in WeaponBonusParamType]: string} = {
    damage: "_NotUsed",
    reload_speed: "_NotUsed",
    crit_chance: "_NotUsed",
    mag_size: "_NotUsed",
    rpm: "rpm",
    dispersion: "fire_dispersion_base",
    inertion: "crosshair_inertion",
    recoil: "cam_dispersion",
    bullet_speed: "bullet_speed",
    fire_mode: "fire_mode",
}

let BonusDescriptions : {[key in WeaponBonusParamType]: string} = {
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

export function GetBonusDescription(type: WeaponBonusParamType, bonus: number = 0): string{
    if (HasNoValue.includes(type))
        return `%c[255,255,255,0]${BonusDescriptions[type]}${EndColorTag}`;
        //return BonusDescriptions[type];
    
    const valueStr = `${NegativeBonuses.includes(type) ? "-" : "+"}${math.floor(bonus)}${PctBonuses.includes(type) ? "\%" : ""}`;
    //return `${BonusDescriptions[type]} ${valueStr}`
    return `%c[255,56,166,209]${valueStr.padEnd(6, " ")}${EndColorTag} ${BonusDescriptions[type]}`
}