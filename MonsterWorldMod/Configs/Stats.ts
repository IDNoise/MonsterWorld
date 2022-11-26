export const enum StatType{
    RunSpeed = 0, //Player only
    SprintSpeed, //Player only
    MaxHP, //Player only
    HPRegen, //Player only

    DamagePerHit, //Weapon only

    ReloadSpeedBonusPct, //Player + Weapon
    CritDamagePct, //Player + Weapon
    CritChancePct, //Player + Weapon
    DamageToStalkersBonusPct, //Player + Weapon
    DamageToMutantssBonusPct, //Player + Weapon
    MagSize, //Player + Weapon
}

export let PctStats: StatType[]

export const enum StatBonusType{
    Flat = 0,
    Pct,
    Mult
}

export let StatTitles: {[key in StatType]: string}

PctStats = [StatType.CritDamagePct, StatType.CritChancePct, StatType.DamageToStalkersBonusPct, StatType.DamageToMutantssBonusPct, StatType.ReloadSpeedBonusPct];

StatTitles = {
    [StatType.RunSpeed]: "Run Speed",
    [StatType.SprintSpeed]: "Sprint Speed",
    [StatType.MaxHP]: "Max HP",
    [StatType.HPRegen]: "HP Regen",
    [StatType.DamagePerHit]: "Damage per Hit",
    [StatType.ReloadSpeedBonusPct]: "Reload Speed",
    [StatType.CritDamagePct]: "Crit Damage",
    [StatType.CritChancePct]: "Crit Chance",
    [StatType.DamageToStalkersBonusPct]: "Damage to Stalkers",
    [StatType.DamageToMutantssBonusPct]: "Damage to Mutants",
    [StatType.MagSize]: "Ammo",
}