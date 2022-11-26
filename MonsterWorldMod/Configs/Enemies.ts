import { LocationType } from "./Levels";

export const enum MonsterType {
    Dog = "Dog",
    PseudoDog = "Pseudo Dog",
    Cat = "Cat",
    Boar = "Boar",
    Snork = "Snork",
    Lurker = "Lurker",
    Bloodsucker = "Bloodsucker",
    Fracture = "Fracture",
    Flesh = "Flesh",
    Chimera = "Chimera",
    Burer = "Burer",
    Controller = "Controller",
    Psysucker = "Psysucker",
    Giant = "Giant",

    Monolith = "Monolith",
    Bandit = "Bandit",
    Mercenary = "Mercenary",
    Sin = "Sin",
    Army = "Army",
    Zombified = "Zombified",
}

export const enum MonsterRank {
    Common = 0,
    Elite,
    Boss,
}

export let MonsterRankConfigs = [
    {Rank: MonsterRank.Common, HpMult: 1,  XpMult: 1, DamageMult: 1,   DropLevelIncreaseChance: 1,  DropQualityIncreaseChance: 1,  TextColor: GetARGB(255,120,250,30)},
    {Rank: MonsterRank.Elite,  HpMult: 3,  XpMult: 2, DamageMult: 1.5, DropLevelIncreaseChance: 20, DropQualityIncreaseChance: 20, TextColor: GetARGB(255,20,20,240)},
    {Rank: MonsterRank.Boss,   HpMult: 10, XpMult: 5, DamageMult: 3,   DropLevelIncreaseChance: 50, DropQualityIncreaseChance: 50, TextColor: GetARGB(255,240,20,20)}
]

export let MonsterConfigs: LuaTable<MonsterType, MonsterConfig>;

type MonsterConfig = {
    LocationLevelStart: number;
    LocationLevelEnd?: number;
    LocationType: LocationType;
    MaxSquadsPerSmart?: number;

    SquadSizeMin?: number;
    SquadSizeMax?: number;

    HpMult?: number;
    DamageMult?: number;
    XpMult?: number;
    CommonSection: Section;
    EliteSection: Section;
    BossSection: Section;
}

MonsterConfigs = new LuaTable();

MonsterConfigs.set(MonsterType.Bandit, {
    LocationLevelStart: 1,
    LocationLevelEnd: 8,
    LocationType: LocationType.NonLab,
    HpMult: 1.5,
    XpMult: 1.1,
    DamageMult: 1.25,
    SquadSizeMin: 8,
    SquadSizeMax: 16,
    CommonSection: "sim_default_bandit_2",
    EliteSection: "sim_default_bandit_3",
    BossSection: "sim_default_bandit_4",
});

MonsterConfigs.set(MonsterType.Flesh, {
    LocationLevelStart: 1,
    LocationLevelEnd: 3,
    LocationType: LocationType.Open,
    HpMult: 1.4,
    XpMult: 1.2,
    SquadSizeMin: 5,
    SquadSizeMax: 10,
    CommonSection: "flesh_01a_weak",
    EliteSection: "flesh_02a_normal",
    BossSection: "flesh_bolot",
});

MonsterConfigs.set(MonsterType.Dog, {
    LocationType: LocationType.Open,
    LocationLevelStart: 1,
    LocationLevelEnd: 7,
    HpMult: 0.5,
    XpMult: 0.4,
    SquadSizeMin: 6,
    SquadSizeMax: 12,
    CommonSection: "dog_weak_white",
    EliteSection: "dog_strong_red",
    BossSection: "dog_strong_black",
});

MonsterConfigs.set(MonsterType.Boar, {
    LocationType: LocationType.Open,
    LocationLevelStart: 2,
    LocationLevelEnd: 9,
    HpMult: 1.25,
    SquadSizeMin: 4,
    SquadSizeMax: 8,
    CommonSection: "boar_01a_weak",
    EliteSection: "boar_02a_strong",
    BossSection: "boar_02a_hard",
});

MonsterConfigs.set(MonsterType.Zombified, {
    LocationType: LocationType.All,
    LocationLevelStart: 2,
    HpMult: 1.5,
    XpMult: 1,
    DamageMult: 1.25,
    SquadSizeMin: 10,
    SquadSizeMax: 24,
    CommonSection: "sim_default_zombied_2",
    EliteSection: "sim_default_zombied_3",
    BossSection: "sim_default_zombied_4",
});

MonsterConfigs.set(MonsterType.Cat, {
    LocationLevelStart: 3,
    LocationLevelEnd: 14,
    LocationType: LocationType.Open,
    HpMult: 0.75,
    XpMult: 0.75,
    SquadSizeMin: 4,
    SquadSizeMax: 8,
    CommonSection: "cat_normal_d",
    EliteSection: "cat_strong_b",
    BossSection: "cat_strong_afro",
});

MonsterConfigs.set(MonsterType.Army, {
    LocationLevelStart: 4,
    LocationType: LocationType.NonLab,
    HpMult: 1.75,
    XpMult: 1.25,
    DamageMult: 1.5,
    SquadSizeMin: 8,
    SquadSizeMax: 16,
    CommonSection: "sim_default_military_1",
    EliteSection: "sim_default_military_2",
    BossSection: "sim_default_military_3",
});

MonsterConfigs.set(MonsterType.PseudoDog, {
    LocationLevelStart: 4,
    LocationType: LocationType.All,
    HpMult: 1.25,
    DamageMult: 1.25,
    XpMult: 1.25,
    SquadSizeMin: 3,
    SquadSizeMax: 6,
    CommonSection: "pseudodog_weak",
    EliteSection: "pseudodog_strong",
    BossSection: "pseudodog_arena",
});

MonsterConfigs.set(MonsterType.Snork, {
    LocationLevelStart: 5,
    LocationType: LocationType.All,
    HpMult: 1.5,
    XpMult: 1.25,
    SquadSizeMin: 4,
    SquadSizeMax: 8,
    CommonSection: "snork_weak3",
    EliteSection: "snork_strong2",
    BossSection: "snork_strong_no_mask",
});

MonsterConfigs.set(MonsterType.Lurker, {
    LocationLevelStart: 5,
    LocationType: LocationType.Open,
    HpMult: 1.25,
    DamageMult: 1.5,
    XpMult: 1.35,
    SquadSizeMin: 3,
    SquadSizeMax: 8,
    CommonSection: "lurker_1_weak",
    EliteSection: "lurker_2_normal",
    BossSection: "lurker_3_strong",
});

MonsterConfigs.set(MonsterType.Bloodsucker, {
    LocationLevelStart: 5,
    LocationType: LocationType.Underground | LocationType.Lab,
    HpMult: 2.5,
    DamageMult: 1.5,
    XpMult: 2,
    SquadSizeMin: 2,
    SquadSizeMax: 5,
    CommonSection: "bloodsucker_green_weak",
    EliteSection: "bloodsucker_red_normal",
    BossSection: "bloodsucker_strong_big",
});

MonsterConfigs.set(MonsterType.Fracture, {
    LocationLevelStart: 6,
    LocationLevelEnd: 16,
    LocationType: LocationType.NonLab,
    HpMult: 1.75,
    XpMult: 1.35,
    SquadSizeMin: 3,
    SquadSizeMax: 7,
    CommonSection: "fracture_weak",
    EliteSection: "fracture_2",
    BossSection: "fracture_3",
});

MonsterConfigs.set(MonsterType.Burer, {
    LocationLevelStart: 7,
    LocationType: LocationType.Lab | LocationType.Underground,
    HpMult: 2.5,
    XpMult: 1.5,
    SquadSizeMin: 2,
    SquadSizeMax: 5,
    CommonSection: "burer_weak2",
    EliteSection: "burer_normal",
    BossSection: "burer_blue_blue",
});

MonsterConfigs.set(MonsterType.Controller, {
    LocationLevelStart: 7,
    LocationType: LocationType.Lab,
    HpMult: 6,
    XpMult: 3,
    SquadSizeMin: 1,
    SquadSizeMax: 3,
    MaxSquadsPerSmart: 1,
    CommonSection: "m_controller_normal666",
    EliteSection: "m_controller_normal777",
    BossSection: "m_controller_normal1111",
});

MonsterConfigs.set(MonsterType.Sin, {
    LocationLevelStart: 8,
    LocationType: LocationType.NonLab,
    HpMult: 2.1,
    XpMult: 1.5,
    DamageMult: 1.6,
    SquadSizeMin: 8,
    SquadSizeMax: 16,
    CommonSection: "sim_default_greh_2",
    EliteSection: "sim_default_greh_3",
    BossSection: "sim_default_greh_4",
});

MonsterConfigs.set(MonsterType.Psysucker, {
    LocationLevelStart: 15,
    LocationType: LocationType.Lab | LocationType.Underground,
    HpMult: 2,
    DamageMult: 1.25,
    XpMult: 1.5,
    SquadSizeMin: 3,
    SquadSizeMax: 7,
    CommonSection: "psysucker_white",
    EliteSection: "psysucker_brown",
    BossSection: "psysucker_black",
});

MonsterConfigs.set(MonsterType.Giant, {
    LocationLevelStart: 12,
    LocationType: LocationType.Open,
    HpMult: 8,
    DamageMult: 2,
    XpMult: 3,
    SquadSizeMin: 1,
    SquadSizeMax: 3,
    MaxSquadsPerSmart: 1,
    CommonSection: "gigant_weak",
    EliteSection: "gigant_normal",
    BossSection: "gigant_strong",
});

MonsterConfigs.set(MonsterType.Mercenary, {
    LocationLevelStart: 12,
    LocationType: LocationType.NonLab,
    HpMult: 2.25,
    XpMult: 1.5,
    DamageMult: 1.75,
    SquadSizeMin: 8,
    SquadSizeMax: 16,
    CommonSection: "sim_default_killer_2",
    EliteSection: "sim_default_killer_3",
    BossSection: "sim_default_killer_4",
});

MonsterConfigs.set(MonsterType.Chimera, {
    LocationLevelStart: 15,
    LocationType: LocationType.Open,
    HpMult: 4,
    DamageMult: 3,
    XpMult: 3,
    SquadSizeMin: 2,
    SquadSizeMax: 5,
    MaxSquadsPerSmart: 1,
    CommonSection: "chimera_weak",
    EliteSection: "chimera_strong",
    BossSection: "chimera_strong4",
});

MonsterConfigs.set(MonsterType.Monolith, {
    LocationLevelStart: 15,
    LocationType: LocationType.All,
    HpMult: 2.5,
    XpMult: 1.75,
    DamageMult: 2,
    SquadSizeMin: 10,
    SquadSizeMax: 20,
    CommonSection: "sim_default_monolith_2",
    EliteSection: "sim_default_monolith_3",
    BossSection: "sim_monolith_sniper",
});