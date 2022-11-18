
enum MonsterType {
    Dog = 0,
    PseudoDog,
    Cat,
    Boar,
    Snork,
}

class MonsterConfig {
    level_start?: number = 1;
    hp_mult?: number = 1;
    damage_mult?: number = 1;
    squad_size_min?: number = 1;
    squad_size_max?: number = 15;
}

class LevelConfig {
    level?: number = 1;
    enemy_types?: MonsterType[];
}

const LevelConfigs: {[name: string]: LevelConfig} = {
    ["l01_escape"]				: {
        level: 1,
    },
    ["l02_garbage"]				: {
        level: 2
    },
    // 
    ["jupiter"]					: {

    },
    ["jupiter_underground"]		: {

    },
    ["k00_marsh"]				: {

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

const MonsterConfigs: {[type in MonsterType]: MonsterConfig} = {
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