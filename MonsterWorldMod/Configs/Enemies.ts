import { LevelType } from "./Levels";

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

export let MonsterConfigs: LuaTable<MonsterType, MonsterConfig>;

type MonsterConfig = {
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
}

MonsterConfigs = new LuaTable();

MonsterConfigs.set(MonsterType.Bandit, {
    type: MonsterType.Bandit,
    level_start: 1,
    level_end: 8,
    level_type: LevelType.NonLab,
    hp_mult: 1.5,
    xp_mult: 1.1,
    damage_mult: 1.25,
    squad_size_min: 8,
    squad_size_max: 16,
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

MonsterConfigs.set(MonsterType.Zombified, {
    type: MonsterType.Zombified,
    level_type: LevelType.All,
    level_start: 2,
    hp_mult: 1.5,
    xp_mult: 1,
    damage_mult: 1.25,
    squad_size_min: 10,
    squad_size_max: 24,
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
    hp_mult: 1.75,
    xp_mult: 1.25,
    damage_mult: 1.5,
    squad_size_min: 8,
    squad_size_max: 16,
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
    hp_mult: 2.1,
    xp_mult: 1.5,
    damage_mult: 1.6,
    squad_size_min: 8,
    squad_size_max: 16,
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
    hp_mult: 2.25,
    xp_mult: 1.5,
    damage_mult: 1.75,
    squad_size_min: 8,
    squad_size_max: 16,
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

MonsterConfigs.set(MonsterType.Monolith, {
    type: MonsterType.Monolith,
    level_start: 15,
    level_type: LevelType.All,
    hp_mult: 2.5,
    xp_mult: 1.75,
    damage_mult: 2,
    squad_size_min: 10,
    squad_size_max: 20,
    common_section: "sim_default_monolith_2",
    elite_section: "sim_default_monolith_3",
    boss_section: "sim_monolith_sniper",
});