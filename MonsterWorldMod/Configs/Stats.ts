import { Log } from '../../StalkerModBase';
import { MWObject, ObjectType } from '../GameObjects/MWObject';
import { EndColorTag } from "./UI";

export const enum StatType{
    //Player
    MaxHP = "MaxHP",
    HPRegen = "HPRegen",
    RunSpeedMult = "RunSpeedMult",
    SprintSpeedMult = "SprintSpeedMult",
    XPGainMult = "XPGainMult",
    EvasionChancePct = "EvasionChancePct",
    FreeShotOnCritChancePct = "FreeShotOnCritChancePct",

    //Weapon
    Damage = "Damage",
    MagSize = "MagSize",

    //Weapon from ugprades 
    Rpm = "Rpm",
    Accuracy = "Accuracy",
    Recoil = "Recoil",
    Flatness = "Flatness",
    AutoFireMode = "AutoFireMode",

    //Armor
    ArtefactSlots = "ArtefactSlots", //Predefined by quality    
    DamageResistancePct = "DamageResistancePct",

    //Stimpack
    HealPct = "HealPct",

    //Item + Player
    ReloadSpeedBonusPct = "ReloadSpeedBonusPct",
    CritChancePct = "CritChancePct",
    CritDamagePct = "CritDamagePct",
    DamageToStalkersBonusPct = "DamageToStalkersBonusPct",
    DamageToMutantssBonusPct = "DamageToMutantssBonusPct",

    DamageWithPistolBonusPct = "DamageWithPistolBonusPct",
    DamageWithSMGBonusPct = "DamageWithSMGBonusPct",
    //DamageWithShotgunBonusPct = "DamageWithShotgunBonusPct",
    DamageWithAssaultRifleBonusPct = "DamageWithAssaultRifleBonusPct",
    DamageWithMachingGunBonusPct = "DamageWithMachingGunBonusPct",
    DamageWithSniperRifleBonusPct = "DamageWithSniperRifleBonusPct",
}

export let StatTitles: {[key in StatType]: string} = {
    [StatType.RunSpeedMult]: "Run Speed",
    [StatType.SprintSpeedMult]: "Sprint Speed",
    [StatType.MaxHP]: "Max HP",
    [StatType.HPRegen]: "HP Regen",
    [StatType.XPGainMult]: "XP Gain",
    [StatType.EvasionChancePct]: "Evasion Chance",
    [StatType.FreeShotOnCritChancePct]: "Free Shot on Crit Chance",

    [StatType.Damage]: "Damage",
    
    [StatType.ReloadSpeedBonusPct]: "Reload Speed",
    [StatType.CritDamagePct]: "Crit Damage",
    [StatType.CritChancePct]: "Crit Chance",
    [StatType.DamageToStalkersBonusPct]: "Damage to Stalkers",
    [StatType.DamageToMutantssBonusPct]: "Damage to Mutants",
    [StatType.MagSize]: "Mag Size",
    [StatType.Rpm]: "Fire rate",
    [StatType.Accuracy]: "Accuracy",
    [StatType.Recoil]: "Recoil",
    [StatType.Flatness]: "Flatness",
    [StatType.AutoFireMode]:  "Full AUTO mode",

    [StatType.ArtefactSlots]: "Artefact slots",
    [StatType.DamageResistancePct]: "Damage Resistance",

    [StatType.HealPct]: "Heal",

    [StatType.DamageWithPistolBonusPct]: "Damage with Pistols",
    [StatType.DamageWithSMGBonusPct]: "Damage with SMGs",
    //[StatType.DamageWithShotgunBonusPct]: "Damage with Shotguns",
    [StatType.DamageWithAssaultRifleBonusPct]: "Damage with Assault Rifles",
    [StatType.DamageWithMachingGunBonusPct]: "Damage with Machine Guns",
    [StatType.DamageWithSniperRifleBonusPct]: "Damage with Sniper Rifles",
}

export const enum StatBonusType{
    Flat = "flat",
    Pct = "pct"
}

export let PctStats: StatType[] = [
    StatType.EvasionChancePct, 
    StatType.CritDamagePct, 
    StatType.CritChancePct, 
    StatType.DamageToStalkersBonusPct, 
    StatType.DamageToMutantssBonusPct, 
    StatType.ReloadSpeedBonusPct,
    StatType.DamageResistancePct,
    StatType.HealPct,
    StatType.DamageWithPistolBonusPct,
    StatType.DamageWithSMGBonusPct,
    //StatType.DamageWithShotgunBonusPct,
    StatType.DamageWithAssaultRifleBonusPct,
    StatType.DamageWithMachingGunBonusPct,
    StatType.DamageWithSniperRifleBonusPct,
];

export let MultStats: StatType[] = [
    StatType.RunSpeedMult,
    StatType.SprintSpeedMult,
    StatType.XPGainMult,
]

export let NoValueStats: StatType[] = [
    StatType.AutoFireMode
]

export let NegativeBonuses = [
    StatType.Recoil
];

export let WeaponDamageBonusesByType: StatType[] = [
    StatType.DamageWithPistolBonusPct,
    StatType.DamageWithSMGBonusPct,
    //StatType.DamageWithShotgunBonusPct,
    StatType.DamageWithAssaultRifleBonusPct,
    StatType.DamageWithMachingGunBonusPct,
    StatType.DamageWithSniperRifleBonusPct,
]

export let DamageBonusesByEnemyType: StatType[] = [
    StatType.DamageToStalkersBonusPct,
    StatType.DamageToMutantssBonusPct,
]

type MaxStatValueConfig = {
    Total?: number,
    Flat?: number,
    Pct?: number,
}

export let MaxValueByStat: Map<StatType, MaxStatValueConfig> = new Map()
.set(StatType.ReloadSpeedBonusPct, {Total: 300})
.set(StatType.DamageResistancePct, {Total: 90})
.set(StatType.CritChancePct, {Total: 25})
.set(StatType.EvasionChancePct, {Total: 25})
.set(StatType.HPRegen, {Total: 5})
.set(StatType.RunSpeedMult, {Total: 1.75})
.set(StatType.SprintSpeedMult, {Total: 1.75})
.set(StatType.FreeShotOnCritChancePct, {Total: 50})
;

export function GetBonusDescriptionByType(object: MWObject, stat: StatType): string{
    let result = "";
    let totalFlatBonus = object.GetTotalFlatBonus(stat);
    result += GetBonusDescription(stat, totalFlatBonus);
    if (!PctStats.includes(stat)){
        result += GetBonusDescription(stat, object.GetTotalPctBonus(stat), true);
    }
    
    return result;
}

export function GetBonusDescription(stat: StatType, bonus: number = 0, asPct: boolean = false): string{
    if (bonus == 0) 
        return ""

    if (NoValueStats.includes(stat))
        return `%c[255,255,255,0]${StatTitles[stat]}${EndColorTag}\\n`;
    
    const valueStr = `${NegativeBonuses.includes(stat) ? "-" : "+"}${math.floor(bonus)}${(asPct || PctStats.includes(stat)) ? "%" : ""}`;
    return `%c[255,56,166,209]${valueStr.padEnd(6, " ")}${EndColorTag} ${StatTitles[stat]}\\n`
}

export function GetStatBonusForObject(stat: StatType, level: number, quality: number, bonusType: StatBonusType, objectType: ObjectType): number {
    //Log(`GetStatBonusForObject s=${stat} l=${level} q=${quality} `)
    let generator = ObjectBonusGenerators.get(stat);
    if (generator == undefined){
        Log(`NO STAT BONUS GENERATOR FOR: ${stat}`)
        return 0;
    }
    return generator(stat, level, quality, bonusType, objectType)
}

export function IsStatGenerationSupported(stat: StatType){
    let generator = ObjectBonusGenerators.get(stat);
    return generator != undefined;
}

function CheckSupportedBonusType(stat: StatType, bonusType: StatBonusType, ...args: StatBonusType[]): boolean{
    if (!args.includes(bonusType)){
        Log(`Not supported bonus type ${bonusType} for ${stat}`)
        return false;
    }
    return true;
}

function CheckSupportedObjectType(stat: StatType, objectType: ObjectType, ...args: ObjectType[]): boolean{
    if (!args.includes(objectType)){
        Log(`Not supported object type ${objectType} for ${stat}`)
        return false;
    }
    return true;
}

let ScalingRangesByQuality = [
    {Min: 1,  Max: 35},
    {Min: 15, Max: 55},
    {Min: 30, Max: 75},
    {Min: 45, Max: 95},
    {Min: 60, Max: 100},
]

let MaxLevelForScaling = 30;

function GetBonusValue(minValue: number, maxValue: number, level?: number, quality?: number, levelPct?: number): number{
    const diff = maxValue - minValue;
    //Log(`Level: ${level}, quality: ${quality} Min: ${minValue} Max:${maxValue}`)

    let result = math.random(minValue, maxValue);
    if (level != undefined && quality != undefined){
        levelPct = levelPct || 50;
        const maxValueAtLevel = diff * (1 - levelPct / 100) + (diff * (levelPct / 100) / MaxLevelForScaling) * level;
        const qualityScaling = ScalingRangesByQuality[quality - 1];
        result = minValue + math.random(maxValueAtLevel * qualityScaling.Min / 100, maxValueAtLevel * qualityScaling.Max / 100)
    }
    else if (level != undefined){
        levelPct = levelPct || 50;
        const maxValueAtLevel = diff * (1 - levelPct / 100) + (diff * (levelPct / 100) / MaxLevelForScaling) * level;
        result = minValue + math.random(0,  maxValueAtLevel)
    }
    else if (quality != undefined){
        const qualityScaling = ScalingRangesByQuality[quality - 1];
        result = minValue + math.random(diff * qualityScaling.Min / 100, diff * qualityScaling.Max / 100)
    }
    return clamp(result, minValue, maxValue);
}

const MaxValueMultByObjectType: {[name in ObjectType]: number} = {
    [ObjectType.Player]: 1,
    [ObjectType.Monster]: 1,
    [ObjectType.Weapon]: 1,
    [ObjectType.Armor]: 1,
    [ObjectType.Artefact]: 1 / 2,
    [ObjectType.Stimpack]: 1
}

type StatBonusGenerator = (stat: StatType, level: number, quality: number, bonusType: StatBonusType, objectType: ObjectType) => number;

let ObjectBonusGenerators: Map<StatType, StatBonusGenerator> = new Map();

ObjectBonusGenerators.set(StatType.ReloadSpeedBonusPct, (stat, level, quality, bonusType, objectType) => {
    CheckSupportedBonusType(stat, bonusType, StatBonusType.Flat)
    return GetBonusValue(2, 100 * MaxValueMultByObjectType[objectType], level, quality);
});

ObjectBonusGenerators.set(StatType.MagSize, (stat, level, quality, bonusType, objectType) => {
    CheckSupportedBonusType(stat, bonusType, StatBonusType.Pct)
    CheckSupportedObjectType(stat, objectType, ObjectType.Weapon)
    return GetBonusValue(5, 500, level, quality);
});

ObjectBonusGenerators.set(StatType.CritChancePct, (stat, level, quality, bonusType, objectType) => {
    CheckSupportedBonusType(stat, bonusType, StatBonusType.Flat)
    return GetBonusValue(1, 15 * MaxValueMultByObjectType[objectType], level, quality);
});

ObjectBonusGenerators.set(StatType.CritDamagePct, (stat, level, quality, bonusType, objectType) => {
    CheckSupportedBonusType(stat, bonusType, StatBonusType.Flat)
    return GetBonusValue(3, 150 * MaxValueMultByObjectType[objectType], level, quality);
});

ObjectBonusGenerators.set(StatType.DamageResistancePct, (stat, level, quality, bonusType, objectType) => {
    CheckSupportedBonusType(stat, bonusType, StatBonusType.Flat)
    return GetBonusValue(1, objectType == ObjectType.Armor ? 50 : 5, level, quality);
});

ObjectBonusGenerators.set(StatType.HPRegen, (stat, level, quality, bonusType, objectType) => {
    CheckSupportedBonusType(stat, bonusType, StatBonusType.Pct)
    return GetBonusValue(5, 1000 * MaxValueMultByObjectType[objectType], level, quality);
});

ObjectBonusGenerators.set(StatType.XPGainMult, (stat, level, quality, bonusType, objectType) => {
    CheckSupportedBonusType(stat, bonusType, StatBonusType.Pct)
    return GetBonusValue(10, 150 * MaxValueMultByObjectType[objectType], level, quality);
});

ObjectBonusGenerators.set(StatType.MaxHP, (stat, level, quality, bonusType, objectType) => {
    if (bonusType == StatBonusType.Pct)
        return GetBonusValue(2, 75 * MaxValueMultByObjectType[objectType], level, quality);
    return GetBonusValue(10, 1000 * MaxValueMultByObjectType[objectType], level, quality, 1);
});

ObjectBonusGenerators.set(StatType.EvasionChancePct, (stat, level, quality, bonusType, objectType) => {
    CheckSupportedBonusType(stat, bonusType, StatBonusType.Flat)
    return GetBonusValue(0.5, 10 * MaxValueMultByObjectType[objectType], level, quality);
});

ObjectBonusGenerators.set(StatType.FreeShotOnCritChancePct, (stat, level, quality, bonusType, objectType) => {
    CheckSupportedBonusType(stat, bonusType, StatBonusType.Flat)
    return GetBonusValue(3, 30 * MaxValueMultByObjectType[objectType], level, quality);
});


let WeaponDamageBonusByTypeGenerator: StatBonusGenerator = (stat, level, quality, bonusType, objectType) => {
    CheckSupportedBonusType(stat, bonusType, StatBonusType.Flat)
    return GetBonusValue(2, 150 * MaxValueMultByObjectType[objectType], level, quality);
}

ObjectBonusGenerators.set(StatType.DamageWithPistolBonusPct, WeaponDamageBonusByTypeGenerator);
ObjectBonusGenerators.set(StatType.DamageWithSMGBonusPct, WeaponDamageBonusByTypeGenerator);
//ObjectBonusGenerators.set(StatType.DamageWithShotgunBonusPct, WeaponDamageBonusByTypeGenerator);
ObjectBonusGenerators.set(StatType.DamageWithAssaultRifleBonusPct, WeaponDamageBonusByTypeGenerator);
ObjectBonusGenerators.set(StatType.DamageWithMachingGunBonusPct, WeaponDamageBonusByTypeGenerator);
ObjectBonusGenerators.set(StatType.DamageWithSniperRifleBonusPct, WeaponDamageBonusByTypeGenerator);

let DamageBonusByEnemyTypeGenerator: StatBonusGenerator = (stat, level, quality, bonusType, objectType) => {
    CheckSupportedBonusType(stat, bonusType, StatBonusType.Flat)
    return GetBonusValue(3, 150 * MaxValueMultByObjectType[objectType], level, quality);
}

ObjectBonusGenerators.set(StatType.DamageToStalkersBonusPct, DamageBonusByEnemyTypeGenerator);
ObjectBonusGenerators.set(StatType.DamageToMutantssBonusPct, DamageBonusByEnemyTypeGenerator);