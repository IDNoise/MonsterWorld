import { EndColorTag } from "./UI";

export const enum StatType{
    //Player
    RunSpeedMult = 0,
    SprintSpeedMult,
    MaxHP,
    HPRegen,
    XPGainMult,

    //Weapon
    Damage, 
    MagSize,

    //Weapon from ugprades 
    Rpm,
    Accuracy,
    Recoil,
    Flatness,
    AutoFireMode,

    //Armor
    ArtefactSlots, //Predefined by quality    
    DamageResistancePct,

    //Item + Player
    ReloadSpeedBonusPct,
    CritDamagePct,
    CritChancePct,
    DamageToStalkersBonusPct,
    DamageToMutantssBonusPct,

    DamageWithPistolBonusPct,
    DamageWithSMGBonusPct,
    DamageWithShotgunBonusPct,
    DamageWithAssaultRifleBonusPct,
    DamageWithMachingGunBonusPct,
    DamageWithSniperRifleBonusPct,
}

export let StatTitles: {[key in StatType]: string} = {
    [StatType.RunSpeedMult]: "Run Speed",
    [StatType.SprintSpeedMult]: "Sprint Speed",
    [StatType.MaxHP]: "Max HP",
    [StatType.HPRegen]: "HP Regen",
    [StatType.XPGainMult]: "XP Gain",

    [StatType.Damage]: "Damage",
    
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

    [StatType.ArtefactSlots]: "Artefact slots",
    [StatType.DamageResistancePct]: "Damage Resistance",

    [StatType.DamageWithPistolBonusPct]: "Damage with Pistols",
    [StatType.DamageWithSMGBonusPct]: "Damage with SMGs",
    [StatType.DamageWithShotgunBonusPct]: "Damage with Shotguns",
    [StatType.DamageWithAssaultRifleBonusPct]: "Damage with Assault Rifles",
    [StatType.DamageWithMachingGunBonusPct]: "Damage with Machine Guns",
    [StatType.DamageWithSniperRifleBonusPct]: "Damage with Sniper Rifles",
}

export const enum StatBonusType{
    Flat = 0,
    Pct
}

export let PctStats: StatType[] = [
    StatType.CritDamagePct, 
    StatType.CritChancePct, 
    StatType.DamageToStalkersBonusPct, 
    StatType.DamageToMutantssBonusPct, 
    StatType.ReloadSpeedBonusPct,
    StatType.DamageResistancePct,
    StatType.DamageWithPistolBonusPct,
    StatType.DamageWithSMGBonusPct,
    StatType.DamageWithShotgunBonusPct,
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
    StatType.DamageWithShotgunBonusPct,
    StatType.DamageWithAssaultRifleBonusPct,
    StatType.DamageWithMachingGunBonusPct,
    StatType.DamageWithSniperRifleBonusPct,
]

export function GetBonusDescription(stat: StatType, bonus: number = 0, asPct: boolean = false): string{
    if (bonus == 0) 
        return ""

    if (NoValueStats.includes(stat))
        return `%c[255,255,255,0]${StatTitles[stat]}${EndColorTag}\\n`;
    
    const valueStr = `${NegativeBonuses.includes(stat) ? "-" : "+"}${math.floor(bonus)}${(asPct || PctStats.includes(stat)) ? "\%" : ""}`;
    return `%c[255,56,166,209]${valueStr.padEnd(6, " ")}${EndColorTag} ${StatTitles[stat]}\\n`
}