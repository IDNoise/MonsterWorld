import { EndColorTag } from "./UI";

export const enum StatType{
    RunSpeedMult = 0, //Player only
    SprintSpeedMult, //Player only
    MaxHP, //Player only
    HPRegen, //Player only
    XPGainMult, //Player only

    Damage, //Weapon only

    Rpm, //Weapon - only from upgrades
    Accuracy, //Weapon - only from upgrades
    Recoil, //Weapon - only from upgrades
    Flatness, //Weapon - only from upgrades
    AutoFireMode, //Weapon - only from upgrades

    ReloadSpeedBonusPct, //Player + Weapon
    CritDamagePct, //Player + Weapon
    CritChancePct, //Player + Weapon
    DamageToStalkersBonusPct, //Player + Weapon
    DamageToMutantssBonusPct, //Player + Weapon
    MagSize, //Player + Weapon

    DamageResistancePct, //Armor
    ArtefactSlots // Armor - Predefined by quality    
}

export let StatTitles: {[key in StatType]: string} = {
    [StatType.RunSpeedMult]: "Run Speed",
    [StatType.SprintSpeedMult]: "Sprint Speed",
    [StatType.MaxHP]: "Max HP",
    [StatType.HPRegen]: "HP Regen",
    [StatType.XPGainMult]: "XP Gain",

    [StatType.Damage]: "Damage per Hit",
    
    [StatType.ReloadSpeedBonusPct]: "Reload Speed",
    [StatType.CritDamagePct]: "Crit Damage",
    [StatType.CritChancePct]: "Crit Chance",
    [StatType.DamageToStalkersBonusPct]: "Damage to Stalkers",
    [StatType.DamageToMutantssBonusPct]: "Damage to Mutants",
    [StatType.MagSize]: "Ammo",
    [StatType.Rpm]: "Fire rate",
    [StatType.Accuracy]: "Accuracy",
    [StatType.Recoil]: "Recoil",
    [StatType.Flatness]: "Flatness",
    [StatType.AutoFireMode]:  "AUTO Fire mode enabled",

    [StatType.DamageResistancePct]: "Damage Resistance",

    [StatType.ArtefactSlots]: "Artefact slots",
}

export const enum StatBonusType{
    Flat = 0,
    Pct,
    Mult
}

export let PctStats: StatType[] = [
    StatType.CritDamagePct, 
    StatType.CritChancePct, 
    StatType.DamageToStalkersBonusPct, 
    StatType.DamageToMutantssBonusPct, 
    StatType.ReloadSpeedBonusPct,
    StatType.DamageResistancePct,
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

export function GetBonusDescription(stat: StatType, bonus: number = 0, asPct: boolean = false): string{
    if (bonus == 0) 
        return ""

    if (NoValueStats.includes(stat))
        return `%c[255,255,255,0]${StatTitles[stat]}${EndColorTag}\\n`;
    
    const valueStr = `${NegativeBonuses.includes(stat) ? "-" : "+"}${math.floor(bonus)}${(asPct || PctStats.includes(stat)) ? "\%" : ""}`;
    return `%c[255,56,166,209]${valueStr.padEnd(6, " ")}${EndColorTag} ${StatTitles[stat]}\\n`
}