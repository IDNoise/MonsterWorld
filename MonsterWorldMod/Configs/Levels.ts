export const enum LocationType { 
    None = 0,
    Open = 1 << 0,
    Underground = 1 << 1,
    Lab = 1 << 2,
    NonLab = LocationType.Open | LocationType.Underground,
    All = Open | Underground | Lab,
}

export type LocationConfig = {
    Level: number;
    Type: LocationType;
}

export function GetCurrentLocationCfg(): LocationConfig {
    return LocationConfigs[level.name()];
}

export function GetCurrentLocationType() : LocationType { return GetCurrentLocationCfg().Type; }

let locationLevel: number = 1;
export const LocationConfigs: {[name: string]: LocationConfig} = {
    ["l01_escape"]				: {
        Level: locationLevel++,
        Type: LocationType.Open,
    },
    ["l02_garbage"]				: {
        Level: locationLevel++,
        Type: LocationType.Open,
    },
    ["k00_marsh"]				: {
        Level: locationLevel++,
        Type: LocationType.Open,
    },
    ["l03_agroprom"]			: {
        Level: locationLevel++,
        Type: LocationType.Open,
    },
    ["l04_darkvalley"]			: {
        Level: locationLevel++,
        Type: LocationType.Open,
    },
    ["k01_darkscape"]			: {
        Level: locationLevel++,
        Type: LocationType.Open,
    },
    ["l05_bar"]					: {
        Level: locationLevel++,
        Type: LocationType.Open,
    },
    ["l06_rostok"]				: {
        Level: locationLevel++,
        Type: LocationType.Open,
    },
    ["l08_yantar"]				: {
        Level: locationLevel++,
        Type: LocationType.Open,
    },
    ["l07_military"]			: {
        Level: locationLevel++,
        Type: LocationType.Open,
    },
    ["k02_trucks_cemetery"]		: {
        Level: locationLevel++,
        Type: LocationType.Open,
    },
    ["l09_deadcity"]			: {
        Level: locationLevel++,
        Type: LocationType.Open,
    },
    ["l10_limansk"]				: {
        Level: locationLevel++,
        Type: LocationType.Open,
    },
    ["l10_radar"]				: {
        Level: locationLevel++,
        Type: LocationType.Open,
    },
    ["l10_red_forest"]			: {
        Level: locationLevel++,
        Type: LocationType.Open,
    },
    ["pripyat"]					: {
        Level: locationLevel++,
        Type: LocationType.Open,
    },
    ["l11_pripyat"]				: {
        Level: locationLevel++,
        Type: LocationType.Open,
    },
    ["l12_stancia"]				: {
        Level: locationLevel++,
        Type: LocationType.Open,
    },
    ["l12_stancia_2"]			: {
        Level: locationLevel++,
        Type: LocationType.Open,
    },
    ["l13_generators"]			: {
        Level: locationLevel++,
        Type: LocationType.Open,
    },
    ["y04_pole"]				: { ///wtf is this?
        Level: locationLevel++,
        Type: LocationType.Open,
    },
    ["jupiter"]					: {
        Level: locationLevel++,
        Type: LocationType.Open,
    },
    ["zaton"]					: {
        Level: locationLevel++,
        Type: LocationType.Open,
    },

    ["l03u_agr_underground"]	: {
        Type: LocationType.Underground,
        Level: locationLevel++,
    },
    ["l10u_bunker"]				: {
        Type: LocationType.Underground,
        Level: locationLevel++,
    },
    ["l11_hospital"]			: {
        Type: LocationType.Underground,
        Level: locationLevel++,
    },
    ["jupiter_underground"]		: {
        Type: LocationType.Underground,
        Level: locationLevel++,
    },
    ["l12u_control_monolith"]	: {
        Type: LocationType.Underground,
        Level: locationLevel++,
    },
    ["l12u_sarcofag"]			: {
        Type: LocationType.Underground,
        Level: locationLevel++,
    },
    ["l04u_labx18"]				: {
        Type: LocationType.Lab,
        Level: locationLevel++,
    },
    ["l08u_brainlab"]			: {
        Type: LocationType.Lab,
        Level: locationLevel++,
    },
    ["l13u_warlab"]				: {
        Type: LocationType.Lab,
        Level: locationLevel++,
    },
    ["labx8"]					: {
        Type: LocationType.Lab,
        Level: locationLevel++,
    },
}