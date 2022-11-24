import { GetByWeightFromArray, RandomFromArray } from '../StalkerAPI/extensions/basic';

export enum LevelType { //if ((types & EnemyLevelType.Open) === EnemyLevelType.Open) {
    None = 0,
    Open = 1 << 0,
    Underground = 1 << 1,
    Lab = 1 << 2,
    NonLab = LevelType.Open | LevelType.Underground,
    All = Open | Underground | Lab,
}

export type LevelConfig = {
    level: number;
    type: LevelType;
}

let level: number = 1;
export const LocationConfigs: {[name: string]: LevelConfig} = {
    ["l01_escape"]				: {
        level: level++,
        type: LevelType.Open,
    },
    ["l02_garbage"]				: {
        level: level++,
        type: LevelType.Open,
    },
    ["k00_marsh"]				: {
        level: level++,
        type: LevelType.Open,
    },
    ["l03_agroprom"]			: {
        level: level++,
        type: LevelType.Open,
    },
    ["l04_darkvalley"]			: {
        level: level++,
        type: LevelType.Open,
    },
    ["k01_darkscape"]			: {
        level: level++,
        type: LevelType.Open,
    },
    ["l05_bar"]					: {
        level: level++,
        type: LevelType.Open,
    },
    ["l06_rostok"]				: {
        level: level++,
        type: LevelType.Open,
    },
    ["l08_yantar"]				: {
        level: level++,
        type: LevelType.Open,
    },
    ["l07_military"]			: {
        level: level++,
        type: LevelType.Open,
    },
    ["k02_trucks_cemetery"]		: {
        level: level++,
        type: LevelType.Open,
    },
    ["l09_deadcity"]			: {
        level: level++,
        type: LevelType.Open,
    },
    ["l10_limansk"]				: {
        level: level++,
        type: LevelType.Open,
    },
    ["l10_radar"]				: {
        level: level++,
        type: LevelType.Open,
    },
    ["l10_red_forest"]			: {
        level: level++,
        type: LevelType.Open,
    },
    ["pripyat"]					: {
        level: level++,
        type: LevelType.Open,
    },
    ["l11_pripyat"]				: {
        level: level++,
        type: LevelType.Open,
    },
    ["l12_stancia"]				: {
        level: level++,
        type: LevelType.Open,
    },
    ["l12_stancia_2"]			: {
        level: level++,
        type: LevelType.Open,
    },
    ["l13_generators"]			: {
        level: level++,
        type: LevelType.Open,
    },
    ["y04_pole"]				: { ///wtf is this?
        level: level++,
        type: LevelType.Open,
    },
    ["jupiter"]					: {
        level: level++,
        type: LevelType.Open,
    },
    ["zaton"]					: {
        level: level++,
        type: LevelType.Open,
    },

    ["l03u_agr_underground"]	: {
        type: LevelType.Underground,
        level: level++,
    },
    ["l10u_bunker"]				: {
        type: LevelType.Underground,
        level: level++,
    },
    ["l11_hospital"]			: {
        type: LevelType.Underground,
        level: level++,
    },
    ["jupiter_underground"]		: {
        type: LevelType.Underground,
        level: level++,
    },
    ["l12u_control_monolith"]	: {
        type: LevelType.Underground,
        level: level++,
    },
    ["l12u_sarcofag"]			: {
        type: LevelType.Underground,
        level: level++,
    },
    ["l04u_labx18"]				: {
        type: LevelType.Lab,
        level: level++,
    },
    ["l08u_brainlab"]			: {
        type: LevelType.Lab,
        level: level++,
    },
    ["l13u_warlab"]				: {
        type: LevelType.Lab,
        level: level++,
    },
    ["labx8"]					: {
        type: LevelType.Lab,
        level: level++,
    },
}

export enum MonsterType {
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

    MonolithSoldier = "Monolith soldier",
    Bandit = "Bandit",
    Mercenary = "Mercenary",
    Sin = "Sin",
    Army = "Army",
    Zombified = "Zombified",
};

export enum MonsterRank {
    Common,
    Elite,
    Boss,
};

export type MonsterSpawnParams = {
    type: MonsterType,
    level: number,
    rank: MonsterRank
};

export type  WeaponSpawnParams = {
    level: number;
    quality: number;
}

export type MonsterConfig = {
    type: MonsterType,
    level_start: number;
    level_end?: number;
    level_type: LevelType;
    max_squads_per_smart?: number;

    squad_size_min?: number;
    squad_size_max?: number;

    hp_mult?: number;
    damage_mult?: number;
    xp_mult?: number;
    common_section: Section;
    elite_section: Section;
    boss_section: Section;
};

export const MonsterConfigs: LuaTable<MonsterType, MonsterConfig> = new LuaTable();

MonsterConfigs.set(MonsterType.Bandit, {
    type: MonsterType.Bandit,
    level_start: 1,
    level_end: 8,
    level_type: LevelType.NonLab,
    squad_size_min: 5,
    squad_size_max: 12,
    common_section: "sim_default_bandit_2",
    elite_section: "sim_default_bandit_3",
    boss_section: "sim_default_bandit_4",
});

MonsterConfigs.set(MonsterType.Flesh, {
    type: MonsterType.Flesh,
    level_start: 1,
    level_end: 3,
    level_type: LevelType.Open,
    hp_mult: 1.4,
    xp_mult: 1.2,
    squad_size_min: 5,
    squad_size_max: 10,
    common_section: "flesh_01a_weak",
    elite_section: "flesh_02a_normal",
    boss_section: "flesh_bolot",
});

MonsterConfigs.set(MonsterType.Boar, {
    type: MonsterType.Boar,
    level_type: LevelType.Open,
    level_start: 2,
    level_end: 9,
    hp_mult: 1.25,
    squad_size_min: 4,
    squad_size_max: 8,
    common_section: "boar_01a_weak",
    elite_section: "boar_02a_strong",
    boss_section: "boar_02a_hard",
});

MonsterConfigs.set(MonsterType.Dog, {
    type: MonsterType.Dog,
    level_type: LevelType.Open,
    level_start: 1,
    level_end: 7,
    hp_mult: 0.5,
    xp_mult: 0.4,
    squad_size_min: 6,
    squad_size_max: 12,
    common_section: "dog_weak_white",
    elite_section: "dog_strong_red",
    boss_section: "dog_strong_black",
});

MonsterConfigs.set(MonsterType.Zombified, {
    type: MonsterType.Zombified,
    level_type: LevelType.All,
    level_start: 2,
    hp_mult: 1.5,
    xp_mult: 1,
    damage_mult: 0.75,
    squad_size_min: 5,
    squad_size_max: 12,
    common_section: "sim_default_zombied_2",
    elite_section: "sim_default_zombied_3",
    boss_section: "sim_default_zombied_4",
});

MonsterConfigs.set(MonsterType.Cat, {
    type: MonsterType.Cat,
    level_start: 3,
    level_end: 14,
    level_type: LevelType.Open,
    hp_mult: 0.75,
    xp_mult: 0.75,
    squad_size_min: 4,
    squad_size_max: 8,
    common_section: "cat_normal_d",
    elite_section: "cat_strong_b",
    boss_section: "cat_strong_afro",
});

MonsterConfigs.set(MonsterType.Army, {
    type: MonsterType.Army,
    level_start: 4,
    level_type: LevelType.NonLab,
    squad_size_min: 4,
    squad_size_max: 10,
    common_section: "sim_default_military_1",
    elite_section: "sim_default_military_2",
    boss_section: "sim_default_military_3",
});

MonsterConfigs.set(MonsterType.PseudoDog, {
    type: MonsterType.PseudoDog,
    level_start: 4,
    level_type: LevelType.All,
    hp_mult: 1.25,
    damage_mult: 1.25,
    xp_mult: 1.25,
    squad_size_min: 3,
    squad_size_max: 6,
    common_section: "pseudodog_weak",
    elite_section: "pseudodog_strong",
    boss_section: "pseudodog_arena",
});

MonsterConfigs.set(MonsterType.Snork, {
    type: MonsterType.Snork,
    level_start: 5,
    level_type: LevelType.All,
    hp_mult: 1.5,
    xp_mult: 1.25,
    squad_size_min: 4,
    squad_size_max: 8,
    common_section: "snork_weak3",
    elite_section: "snork_strong2",
    boss_section: "snork_strong_no_mask",
});

MonsterConfigs.set(MonsterType.Lurker, {
    type: MonsterType.Lurker,
    level_start: 5,
    level_type: LevelType.Open,
    hp_mult: 1.25,
    damage_mult: 1.5,
    xp_mult: 1.35,
    squad_size_min: 3,
    squad_size_max: 8,
    common_section: "lurker_1_weak",
    elite_section: "lurker_2_normal",
    boss_section: "lurker_3_strong",
});

MonsterConfigs.set(MonsterType.Bloodsucker, {
    type: MonsterType.Bloodsucker,
    level_start: 5,
    level_type: LevelType.Underground | LevelType.Lab,
    hp_mult: 2.5,
    damage_mult: 1.5,
    xp_mult: 2,
    squad_size_min: 2,
    squad_size_max: 5,
    common_section: "bloodsucker_green_weak",
    elite_section: "bloodsucker_red_normal",
    boss_section: "bloodsucker_strong_big",
});

MonsterConfigs.set(MonsterType.Fracture, {
    type: MonsterType.Fracture,
    level_start: 6,
    level_end: 16,
    level_type: LevelType.NonLab,
    hp_mult: 1.75,
    xp_mult: 1.35,
    squad_size_min: 3,
    squad_size_max: 7,
    common_section: "fracture_weak",
    elite_section: "fracture_2",
    boss_section: "fracture_3",
});

MonsterConfigs.set(MonsterType.Burer, {
    type: MonsterType.Burer,
    level_start: 7,
    level_type: LevelType.Lab | LevelType.Underground,
    hp_mult: 2.5,
    xp_mult: 1.5,
    squad_size_min: 2,
    squad_size_max: 5,
    common_section: "burer_weak2",
    elite_section: "burer_normal",
    boss_section: "burer_blue_blue",
});

MonsterConfigs.set(MonsterType.Controller, {
    type: MonsterType.Controller,
    level_start: 7,
    level_type: LevelType.Lab,
    hp_mult: 6,
    xp_mult: 3,
    squad_size_min: 1,
    squad_size_max: 3,
    max_squads_per_smart: 1,
    common_section: "m_controller_normal666",
    elite_section: "m_controller_normal777",
    boss_section: "m_controller_normal1111",
});

MonsterConfigs.set(MonsterType.Sin, {
    type: MonsterType.Sin,
    level_start: 8,
    level_type: LevelType.NonLab,
    squad_size_min: 6,
    squad_size_max: 12,
    common_section: "sim_default_greh_2",
    elite_section: "sim_default_greh_3",
    boss_section: "sim_default_greh_4",
});

MonsterConfigs.set(MonsterType.Psysucker, {
    type: MonsterType.Psysucker,
    level_start: 15,
    level_type: LevelType.Lab | LevelType.Underground,
    hp_mult: 2,
    damage_mult: 1.25,
    xp_mult: 1.5,
    squad_size_min: 3,
    squad_size_max: 7,
    common_section: "psysucker_white",
    elite_section: "psysucker_brown",
    boss_section: "psysucker_black",
});

MonsterConfigs.set(MonsterType.Giant, {
    type: MonsterType.Giant,
    level_start: 12,
    level_type: LevelType.Open,
    hp_mult: 8,
    damage_mult: 2,
    xp_mult: 3,
    squad_size_min: 1,
    squad_size_max: 3,
    max_squads_per_smart: 1,
    common_section: "gigant_weak",
    elite_section: "gigant_normal",
    boss_section: "gigant_strong",
});

MonsterConfigs.set(MonsterType.Mercenary, {
    type: MonsterType.Mercenary,
    level_start: 12,
    level_type: LevelType.NonLab,
    squad_size_min: 7,
    squad_size_max: 14,
    common_section: "sim_default_killer_2",
    elite_section: "sim_default_killer_3",
    boss_section: "sim_default_killer_4",
});

MonsterConfigs.set(MonsterType.Chimera, {
    type: MonsterType.Chimera,
    level_start: 15,
    level_type: LevelType.Open,
    hp_mult: 4,
    damage_mult: 3,
    xp_mult: 3,
    squad_size_min: 2,
    squad_size_max: 5,
    max_squads_per_smart: 1,
    common_section: "chimera_weak",
    elite_section: "chimera_strong",
    boss_section: "chimera_strong4",
});

MonsterConfigs.set(MonsterType.MonolithSoldier, {
    type: MonsterType.MonolithSoldier,
    level_start: 15,
    level_type: LevelType.All,
    hp_mult: 2.5,
    xp_mult: 1.75,
    damage_mult: 1.5,
    squad_size_min: 8,
    squad_size_max: 16,
    common_section: "sim_default_monolith_2",
    elite_section: "sim_default_monolith_3",
    boss_section: "sim_monolith_sniper",
});

//Player params
export let PlayerHPBase = 100;
export let PlayerHPPerLevel = 10;
export let PlayerHPRegenBase = 0.2;
export let PlayerHPRegenPctPerLevel = 10;
export let PlayerRunSpeedPctPerLevel = 2;

export let PlayerRunSpeedCoeff = 2.4;
export let PlayerRunBackSpeedCoeff = 1.4;
export let PlayerSprintSpeedCoeff = 2.1;

export let PlayerXPForFirstLevel = 250;
export let PlayerXPExp = 1.3;
export let PlayerXPPct = 100;

export let PlayerPointsPerLevelUp = 1;

//Monster params
export let EnemyHPBase = 50;
export let EnemyHPExpPerLevel = 1.15;
export let EnemyHPPctPerLevel = 75;
export let EnemyHpDeltaPct = 10;

export let EnemyDamageBase = PlayerHPBase / 20;
export let EnemyDamageExpPerLevel = 1.025; //1.1;
export let EnemyDamagePctPerLevel = 15;

export let EnemyXpRewardBase = PlayerXPForFirstLevel / 20;
export let EnemyXpRewardExpPerLevel = 1.25;
export let EnemyXpRewardPctPerLevel = 50;

export let EnemyHigherLevelChance = 5;
export let EnemyEliteChance = 15;
export let EnemyBossChance = 5;

export let EnemyHpMultsByRank: number[] = [1, 3, 10];
export let EnemyXpMultsByRank: number[] = [1, 3, 10];
export let EnemyDamageMultsByRank: number[] = [1, 1.5, 3];
export let EnemyDropLevelIncreaseChanceByRank: number[] = [1, 20, 50];
export let EnemyDropQualityIncreaseChanceByRank: number[] = [1, 20, 50];

//Weapons
export let WeaponDPSBase = EnemyHPBase / 0.3;
export let WeaponDPSExpPerLevel = EnemyHPExpPerLevel - 0.005;
export let WeaponDPSDeltaPct = 10;
export let WeaponDPSPctPerQuality = 25;

//Drops
export let EnemyDropChance = 150;
export let EnemyBossDropChance = 100;
export let EnemyEliteDropChance = 25;
export let MinQuality = 1;
export let MaxQuality = 5;

export let HigherLevelDropChancePct = 5;

export let QualityDropChance: [chance: number, level: number][] = [
    [25, 2],
    [13, 3],
    [6, 4],
    [2, 5],
];

export let Qualities: {[key: number]: string} = {
    1: "Common",
    2: "Uncommon",
    3: "Rare",
    4: "Epic",
    5: "Legendary",
};

export let QualityColors: {[key: number]: ARGBColor} = {
    1: GetARGB(255,230,230,230), //greish
    2: GetARGB(255,20,20,230), //blue
    3: GetARGB(255,20,230,20),  //green
    4: GetARGB(255,230,20,20),  //red
    5: GetARGB(255,240,165,5),   //orange
};

export let MonsterRankColors: {[key in MonsterRank]: ARGBColor} = {
    0: GetARGB(255,120,250,30),
    1: GetARGB(255,20,20,240), 
    2: GetARGB(255,240,20,20),
};

export let EndColorTag: string = "%c[default]"

export let LevelColor: string = "%c[255,104,210,26]"; //greenish

export enum DropType {
    Weapon,
    Stimpack
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
    {section: "mw_stimpack_25", quality: 1, weight: 100},
    {section: "mw_stimpack_50", quality: 3, weight: 50},
    {section: "mw_stimpack_75", quality: 5, weight: 25},
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

//Funny mess - anomaly2\\body_tear_00