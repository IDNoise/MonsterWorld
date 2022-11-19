
export enum MonsterType {
    Dog = 0,
    PseudoDog,
    Cat,
    Boar,
    Snork,
}

export class MonsterConfig {
    level_start?: number = 1;
    hp_mult?: number = 1;
    damage_mult?: number = 1;
    squad_size_min?: number = 1;
    squad_size_max?: number = 15;
}

export class LevelConfig {
    level?: number = 1;
    enemy_types?: MonsterType[];
}

export const LocationConfigs: {[name: string]: LevelConfig} = {
    ["l01_escape"]				: {
        level: 1,
    },
    ["l02_garbage"]				: {
        level: 2
    },
    ["k00_marsh"]				: {
        level: 3
    },

    // 
    ["jupiter"]					: {

    },
    ["jupiter_underground"]		: {

    },
    ["k01_darkscape"]			: {

    },
    ["k02_trucks_cemetery"]		: {

    },
    ["l03_agroprom"]			: {

    },
    ["l03u_agr_underground"]	: {

    },
    ["l04_darkvalley"]			: {

    },
    ["l04u_labx18"]				: {

    },
    ["l05_bar"]					: {

    },
    ["l06_rostok"]				: {

    },
    ["l07_military"]			: {

    },
    ["l08_yantar"]				: {

    },
    ["l08u_brainlab"]			: {

    },
    ["l09_deadcity"]			: {
        
    },
    ["l10_limansk"]				: {

    },
    ["l10_radar"]				: {

    },
    ["l10_red_forest"]			: {

    },
    ["l10u_bunker"]				: {

    },
    ["l11_hospital"]			: {

    },
    ["l11_pripyat"]				: {

    },
    ["l12_stancia"]				: {

    },
    ["l12_stancia_2"]			: {

    },
    ["l12u_control_monolith"]	: {

    },
    ["l12u_sarcofag"]			: {

    },
    ["l13_generators"]			: {

    },
    ["l13u_warlab"]				: {

    },
    ["labx8"]					: {

    },
    ["pripyat"]					: {

    },
    ["zaton"]					: {

    },
    ["y04_pole"]				: {

    },
}

export const MonsterConfigs: {[type in MonsterType]: MonsterConfig} = {
    [MonsterType.Dog]: {

    },
    [MonsterType.PseudoDog]: {

    },
    [MonsterType.Cat]: {

    },
    [MonsterType.Boar]: {

    },
    [MonsterType.Snork]: {
        
    },
}

export let PlayerHPBase = 100;
//export let PlayerHP
export let MonsterHPBase = 100;
export let MonsterHPExpPerLevel = 1.1;
export let MonsterHPPctPerLevel = 0.5;
export let MonsterHpDeltaPct = 30;

export let MonsterDamageBase = PlayerHPBase / 10;
export let MonsterDamageExpPerLevel = 1.1;

export let EnemyExpRewardPerLevelBase = 10;