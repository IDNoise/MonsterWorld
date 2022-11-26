import { EndColorTag } from "./UI";

export const enum StatType{
    RunSpeed = 0, //Player only
    SprintSpeed, //Player only
    MaxHP, //Player only
    HPRegen, //Player only

    Damage, //Weapon only

    ReloadSpeedBonusPct, //Player + Weapon
    CritDamagePct, //Player + Weapon
    CritChancePct, //Player + Weapon
    DamageToStalkersBonusPct, //Player + Weapon
    DamageToMutantssBonusPct, //Player + Weapon
    MagSize, //Player + Weapon

    //Bonuses from weapon upgrades
    AutoFireModeState,
    RpmBonusPct,
    DispersionBonusPct,
    RecoilBonusPct,
    BulletSpeedBonusPct,
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
    StatType.RpmBonusPct,
    StatType.DispersionBonusPct,
    StatType.RecoilBonusPct,
    StatType.BulletSpeedBonusPct,
];

export let NoValueStats: StatType[] = [
    StatType.AutoFireModeState
]

export let NegativeBonuses = [
    StatType.RecoilBonusPct
];

export let StatTitles: {[key in StatType]: string} = {
    [StatType.RunSpeed]: "Run Speed",
    [StatType.SprintSpeed]: "Sprint Speed",
    [StatType.MaxHP]: "Max HP",
    [StatType.HPRegen]: "HP Regen",
    [StatType.Damage]: "Damage per Hit",
    [StatType.ReloadSpeedBonusPct]: "Reload Speed",
    [StatType.CritDamagePct]: "Crit Damage",
    [StatType.CritChancePct]: "Crit Chance",
    [StatType.DamageToStalkersBonusPct]: "Damage to Stalkers",
    [StatType.DamageToMutantssBonusPct]: "Damage to Mutants",
    [StatType.MagSize]: "Ammo",

    [StatType.AutoFireModeState]: "AUTO fire mode enabled",
    [StatType.RpmBonusPct]: "Fire rate",
    [StatType.DispersionBonusPct]: "Accuracy",
    [StatType.RecoilBonusPct]: "Recoil",
    [StatType.BulletSpeedBonusPct]: "Flatness",
}


export function GetBonusDescription(stat: StatType, bonus: number = 0, asPct: boolean = false): string{
    if (NoValueStats.includes(stat))
        return `%c[255,255,255,0]${StatTitles[stat]}${EndColorTag}`;
    
    const valueStr = `${NegativeBonuses.includes(stat) ? "-" : "+"}${math.floor(bonus)}${(asPct || PctStats.includes(stat)) ? "\%" : ""}`;
    return `%c[255,56,166,209]${valueStr.padEnd(6, " ")}${EndColorTag} ${StatTitles[stat]}`
}