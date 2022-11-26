export const enum LevelType { 
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