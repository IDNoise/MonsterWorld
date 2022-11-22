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
};

export enum MonsterRank {
    Common,
    Elite,
    Boss,
};

export type MonsterSpawnParams = {
    type: MonsterType,
    level: number,
    rank: MonsterRank,
    hpMult: number,
    xpMult: number,
    damageMult: number
};

export type  WeaponSpawnParams = {
    level: number;
    quality: number;
}

export type MonsterConfig = {
    type: MonsterType,
    level_start: number;
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
MonsterConfigs.set(MonsterType.Dog, {
    type: MonsterType.Dog,
    level_type: LevelType.Open,
    level_start: 1,
    hp_mult: 0.5,
    xp_mult: 0.5,
    squad_size_min: 6,
    squad_size_max: 12,
    common_section: "dog_weak_white",
    elite_section: "dog_strong_red",
    boss_section: "dog_strong_black",
});

MonsterConfigs.set(MonsterType.Boar, {
    type: MonsterType.Boar,
    level_type: LevelType.Open,
    level_start: 1,
    hp_mult: 1.25,
    squad_size_min: 4,
    squad_size_max: 10,
    common_section: "boar_01a_weak",
    elite_section: "boar_02a_strong",
    boss_section: "boar_02a_hard",
});

MonsterConfigs.set(MonsterType.Cat, {
    type: MonsterType.Cat,
    level_start: 2,
    level_type: LevelType.Open,
    hp_mult: 0.75,
    xp_mult: 0.75,
    squad_size_min: 4,
    squad_size_max: 8,
    common_section: "cat_normal_d",
    elite_section: "cat_strong_b",
    boss_section: "cat_strong_afro",
});

MonsterConfigs.set(MonsterType.PseudoDog, {
    type: MonsterType.PseudoDog,
    level_start: 3,
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

//Player params
export let PlayerHPBase = 100;

export let PlayerXPForFirstLevel = 250;
export let PlayerXPExp = 1.3;
export let PlayerXPPct = 100;

export let PlayerPointsPerLevelUp = 1;

//Monster params
export let EnemyHPBase = 50;
export let EnemyHPExpPerLevel = 1.1;
export let EnemyHPPctPerLevel = 25;
export let EnemyHpDeltaPct = 10;

export let EnemyDamageBase = PlayerHPBase / 25;
export let EnemyDamageExpPerLevel = 1.1;
export let EnemyDamagePctPerLevel = 10;

export let EnemyXpRewardBase = 10;
export let EnemyXpRewardExpPerLevel = 1.25;
export let EnemyXpRewardPctPerLevel = 25;

export let EnemyHigherLevelChance = 5;
export let EnemyEliteChance = 15;
export let EnemyBossChance = 5;

export let EnemyBossHPMult = 10;
export let EnemyBossXPRewardMult = 10;
export let EnemyBossDamageMult = 2.5;
export let EnemyBossDropLevelIncreaseChance = 50;
export let EnemyBossDropQualityIncreaseChance = 50;

export let EnemyEliteHPMult = 3;
export let EnemyEliteXPRewardMult = 3;
export let EnemyEliteDamageMult = 1.5;
export let EnemyEliteDropLevelIncreaseChance = 20;
export let EnemyEliteDropQualityIncreaseChance = 20;

//Weapons
export let WeaponDPSBase = EnemyHPBase / 0.2;
export let WeaponDPSExpPerLevel = EnemyHPExpPerLevel;
export let WeaponDPSDeltaPct = 10;
export let WeaponDPSPctPerQuality = 25;

//Drops
export let EnemyDropChance = 100;//20;
export let EnemyBossDropChance = 100;
export let EnemyEliteDropChance = 50;
export let MinQuality = 1;
export let MaxQuality = 5;

export let HigherLevelDropChancePct = 5;

export let QualityDropChance: [chance: number, level: number][] = [
    [30, 2],
    [15, 3],
    [7, 4],
    [3, 5],
];

export let Qualities: {[key: number]: string} = {
    1: "Common",
    2: "Uncommon",
    3: "Rare",
    4: "Epic",
    5: "Legendary",
};

export let QualityColors: {[key: number]: string} = {
    1: "%c[255,180,180,180]", //greish
    2: "%c[255,30,30,220]", //blue
    3: "%c[255,30,220,30]",  //green
    4: "%c[255,220,30,30]",  //red
    5: "%c[255,240,165,5]",   //orange
};

export let MonsterRankColors: {[key in MonsterRank]: ARGBColor} = {
    0: GetARGB(255,120,250,30),
    1: GetARGB(255,20,20,240), 
    2: GetARGB(255,240,20,20),
};

export let EndColorTag: string = "%c[default]"

export let LevelColor: string = "%c[255,104,210,26]"; //greenish


