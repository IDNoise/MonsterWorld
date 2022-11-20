declare namespace utils_ui{
    const enum ItemType {
        Weapon = "weapon",
        Outfit = "outfit",
        Backpack = "backpack",
        Artefact = "artefact",
        Bbooster = "booster",
    }
    const enum StatType {
        Damage = "damage",
        FireRate = "fire_rate",
        AmmoMagSize = "ammo_mag_size",
        Accuracy = "accuracy",
        Handling = "handling",
    }

    type StatConfig = {
        index: number, //showing stat by numric order
        typ: "float" | string, //parameter value type, important for parsing the value out of parameter section
        name: string, //translation string or real string
        icon_p: string, //icon to show on positive value
        icon_n?: string, //icon to show on negavtive value (empty means use positive icon for all occasions)
        track: boolean, //should stat be represnted by a progress bar or text
        unit: string, //suffix
        magnitude: number, //multiplier for parameter value, to represent it to the player for better readings
        compare: boolean, //allow state comparison with different items (for item info box)
        sign: boolean, //show number sign +/-
        show_always: boolean, //should we show state even if value was 0
        value_functor?: any, //calculate paramter value by using a special function
    }

    type StatsTable = {[key: string]: {[statKey: string]: StatConfig}};
    
    const stats_table: StatsTable;
    function prepare_stats_table(): StatsTable;
    function get_stats_func_value(obj: game_object, sec: Section, file: string, func: string, ...args: any[]): any;
    function get_stats_value(obj: game_object, sec: Section, gr: StatConfig, stat: string): number;
    function get_stats_string_value(obj: game_object, sec: Section, gr: StatConfig, stat: string, to_text?: boolean): string;
}


// stats_table["weapon"] = {
//     ["accuracy"]       			   = { index= 1, typ= "float",   name= "ui_inv_accuracy", 		icon_p= "ui_wp_prop_tochnost", 			icon_n= "", track= true, 	
//                                          magnitude= 1,   	unit= "", compare= false, sign= false, show_always= true, value_functor= {"utils_ui","prop_accuracry"} },
//     ["handling"]                   = { index= 2, typ= "float",   name= "ui_inv_handling", 		icon_p= "ui_wp_prop_ergonomics", 		icon_n= "", track= true, 	magnitude= 1,      	unit= "", compare= false, sign= true, show_always= true, value_functor= {"utils_ui","prop_handling"} },
//     ["damage"]                     = { index= 3, typ= "float",   name= "ui_inv_damage", 		icon_p= "ui_wp_prop_damage", 			icon_n= "", track= false, 	magnitude= 100,		unit= "", compare= false, sign= false, show_always= true , value_functor= {"utils_ui","prop_damage"} },
//     ["fire_rate"]                  = { index= 4, typ= "float",   name= "ui_inv_rate_of_fire", 	icon_p= "ui_wp_prop_skorostrelnost", 	icon_n= "", track= false, 	magnitude= 1, 		unit= "RPM", compare= false, sign= false, show_always= true, value_functor= {"utils_ui","prop_rpm"} },
//     ["ammo_mag_size"]              = { index= 5, typ= "float",   name= "ui_ammo_count", 		icon_p= "ui_wp_propery_07", 			icon_n= "", track= false, 	magnitude= 1,      	unit= "", compare= false, sign= false ,show_always= true },
// }

// stats_table["outfit"] = {
//     ["fire_wound_protection"]      = { index= 1, typ= "float",   name= "ui_inv_outfit_fire_wound_protection",    icon_p= "ui_am_propery_01",   icon_n= "", track= true, magnitude= (1/SYS_GetParam(2,"actor_condition","max_fire_wound_protection")), 	unit= "", condition= true,	compare= false, sign= true, show_always= true , value_functor= {"utils_item","get_outfit_protection", "FireWound"}},
//     ["burn_protection"]            = { index= 2, typ= "float",   name= "ui_inv_outfit_burn_protection",          icon_p= "ui_am_prop_thermo",  icon_n= "", track= true, magnitude= (1/SYS_GetParam(2,"actor_condition","fire_zone_max_power")), 		unit= "", condition= true,	compare= false, sign= true, show_always= true , value_functor= {"utils_item","get_outfit_protection", "Burn"} },
//     ["shock_protection"]           = { index= 3, typ= "float",   name= "ui_inv_outfit_shock_protection",         icon_p= "ui_am_prop_electro", icon_n= "", track= true, magnitude= (1/SYS_GetParam(2,"actor_condition","electra_zone_max_power")), 		unit= "", condition= true,	compare= false, sign= true, show_always= true , value_functor= {"utils_item","get_outfit_protection", "Shock"}},
//     ["chemical_burn_protection"]   = { index= 4, typ= "float",   name= "ui_inv_outfit_chemical_burn_protection", icon_p= "ui_am_prop_chem",    icon_n= "", track= true, magnitude= (1/SYS_GetParam(2,"actor_condition","acid_zone_max_power")),     	unit= "", condition= true,	compare= false, sign= true, show_always= true , value_functor= {"utils_item","get_outfit_protection", "ChemicalBurn"}},
//     ["radiation_protection"]       = { index= 5, typ= "float",   name= "ui_inv_outfit_radiation_protection",     icon_p= "ui_am_propery_09",   icon_n= "", track= true, magnitude= (1/SYS_GetParam(2,"actor_condition","radio_zone_max_power")), 		unit= "", condition= true,	compare= false, sign= true, show_always= true , value_functor= {"utils_item","get_outfit_protection", "Radiation"}},
//     ["telepatic_protection"]       = { index= 6, typ= "float",   name= "ui_inv_outfit_telepatic_protection",     icon_p= "ui_am_propery_11",   icon_n= "", track= true, magnitude= (1/SYS_GetParam(2,"actor_condition","psi_zone_max_power")),      	unit= "", condition= true,	compare= false, sign= true, show_always= true , value_functor= {"utils_item","get_outfit_protection", "Telepatic"}},
//     ["wound_protection"]           = { index= 7, typ= "float",   name= "ui_inv_outfit_wound_protection",         icon_p= "ui_am_prop_wound",   icon_n= "", track= true, magnitude= (1/SYS_GetParam(2,"actor_condition","max_wound_protection")), 		unit= "", condition= true,	compare= false, sign= true, show_always= true , value_functor= {"utils_item","get_outfit_protection", "Wound"}},
//     ["strike_protection"]          = { index= 8, typ= "float",   name= "ui_inv_outfit_strike_protection",        icon_p= "ui_am_prop_strike",  icon_n= "", track= true, magnitude= 1,                                                                   unit= "", condition= true,	compare= false, sign= true, show_always= true , value_functor= {"utils_item","get_outfit_protection", "Strike"}},
//     ["explosion_protection"]       = { index= 9, typ= "float",   name= "ui_inv_outfit_explosion_protection",     icon_p= "ui_am_prop_explo",   icon_n= "", track= true, magnitude= 1,                                                                   unit= "", condition= true,	compare= false, sign= true, show_always= true , value_functor= {"utils_item","get_outfit_protection", "Explosion"}},
//     ["artefact_count"]			   = { index= 10, typ= "float",   name= "ui_inv_outfit_artefact_count",       	 icon_p= "ui_am_prop_artefact",icon_n= "", track= false, magnitude= 1,                                                                  unit= "",                   compare= false, sign= false,show_always= true , value_functor= {"utils_item","get_outfit_belt_size"}},
//     ["additional_inventory_weight"]= { index= 11, typ= "float",   name= "ui_inv_outfit_additional_weight",       icon_p= "ui_am_propery_08",   icon_n= "ui_am_prop_carry_weight_negative", track= false, magnitude= 1,                                  unit= "st_kg",              compare= false, sign= true, show_always= true , value_functor= {"utils_item","get_outfit_property", "additional_inventory_weight"}},
// }

// stats_table["backpack"] = {
//     ["additional_inventory_weight"]= { index= 1, typ= "float",   name= "ui_inv_outfit_additional_weight",       icon_p= "ui_am_propery_08",   icon_n= "ui_am_prop_carry_weight_negative", track= false, magnitude= 1, unit= "st_kg", compare= false, sign= true, show_always= true},
// }

// stats_table["artefact"] = {
//     ["condition"]                  = { index= 1,  typ= "float",   name= "ui_inv_af_condition",                    icon_p= "ui_am_condition",                  icon_n= "",                                 track= false, magnitude= 100,   unit= "st_perc",    compare= false, sign= true, show_always= true , value_functor= {"utils_ui","prop_condition"} },
//     ["health_restore_speed"]       = { index= 2,  typ= "float",   name= "ui_inv_health",                          icon_p= "ui_am_propery_05",                 icon_n= "ui_am_prop_health_negative",       track= false, magnitude= 6600,  unit= "",           condition= true,	compare= false, sign= true, show_always= false },
//     ["radiation_restore_speed"]    = { index= 3,  typ= "float",   name= "ui_inv_radiation",                       icon_p= "ui_am_propery_09",                 icon_n= "ui_am_prop_radio_restore",         track= false, magnitude= 47000, unit= "st_msv_sec", condition= true,	compare= false, sign= true, show_always= false, sign_inverse= true },
//     ["satiety_restore_speed"]      = { index= 4,  typ= "float",   name= "ui_inv_satiety",                         icon_p= "ui_am_prop_satiety_restore_speed", icon_n= "ui_am_prop_satiety",               track= false, magnitude= 100,   unit= "",           condition= true,	compare= false, sign= true, show_always= false },
//     ["power_restore_speed"]        = { index= 5,  typ= "float",   name= "ui_inv_power",                           icon_p= "ui_am_propery_07",                 icon_n= "ui_am_prop_power_restore",         track= false, magnitude= 30000, unit= "st_perc",    condition= true,	compare= false, sign= true, show_always= false },
//     ["bleeding_restore_speed"]     = { index= 6,  typ= "float",   name= "ui_inv_bleeding",                        icon_p= "ui_am_prop_restore_bleeding",      icon_n= "ui_am_prop_bleeding_restore",      track= false, magnitude= 15000, unit= "st_ml_min",  condition= true,	compare= false, sign= true, show_always= false },
//     ["burn_immunity"]              = { index= 7,  typ= "float",   name= "ui_inv_outfit_burn_protection",          icon_p= "ui_am_prop_thermo",                icon_n= "ui_am_prop_burn_immunity",         track= false, magnitude= 84800, unit= "st_perc",    condition= true,	compare= false, sign= true, show_always= false ,section= "hit_absorbation_sect" },
//     ["shock_immunity"]             = { index= 8,  typ= "float",   name= "ui_inv_outfit_shock_protection",         icon_p= "ui_am_prop_electro",               icon_n= "ui_am_prop_shock_immunity",        track= false, magnitude= 8000,  unit= "st_kv",      condition= true,	compare= false, sign= true, show_always= false ,section= "hit_absorbation_sect" },
//     ["radiation_immunity"]         = { index= 9,  typ= "float",   name= "ui_inv_outfit_radiation_protection",     icon_p= "ui_am_propery_09",                 icon_n= "ui_am_prop_radiation_immunity",    track= false, magnitude= 750,   unit= "st_perc",    condition= true,	compare= false, sign= true, show_always= false ,section= "hit_absorbation_sect" },
//     ["telepatic_immunity"]         = { index= 10, typ= "float",   name= "ui_inv_outfit_telepatic_protection",     icon_p= "ui_am_propery_11",                 icon_n= "ui_am_prop_telepat_immunity",      track= false, magnitude= 5800,  unit= "st_perc",    condition= true,	compare= false, sign= true, show_always= false ,section= "hit_absorbation_sect" },
//     ["chemical_burn_immunity"]     = { index= 11, typ= "float",   name= "ui_inv_outfit_chemical_burn_protection", icon_p= "ui_am_prop_chem",                  icon_n= "ui_am_prop_chemburn_immunity",     track= false, magnitude= 19100, unit= "st_perc",    condition= true,	compare= false, sign= true, show_always= false ,section= "hit_absorbation_sect" },
//     ["wound_immunity"]             = { index= 12, typ= "float",   name= "ui_inv_outfit_wound_protection",         icon_p= "ui_am_prop_wound",                 icon_n= "ui_am_prop_wound_minus",           track= false, magnitude= 2500,  unit= "st_j",       condition= true,	compare= false, sign= true, show_always= false ,section= "hit_absorbation_sect" },
//     ["fire_wound_immunity"]        = { index= 13, typ= "float",   name= "ui_inv_outfit_fire_wound_protection",    icon_p= "ui_am_propery_01",                 icon_n= "ui_am_prop_fire_wound_negative",   track= false, magnitude= 2500,  unit= "st_j",       condition= true,	compare= false, sign= true, show_always= false ,section= "hit_absorbation_sect" },
//     ["explosion_immunity"]         = { index= 14, typ= "float",   name= "ui_inv_outfit_explosion_protection",     icon_p= "ui_am_prop_explo",                 icon_n= "ui_am_prop_explo_minus",           track= false, magnitude= 2500,  unit= "st_j",       condition= true,	compare= false, sign= true, show_always= false ,section= "hit_absorbation_sect" },
//     ["strike_immunity"]            = { index= 15, typ= "float",   name= "ui_inv_outfit_strike_protection",        icon_p= "ui_am_prop_strike",                icon_n= "ui_am_prop_strike_minus",          track= false, magnitude= 2500,  unit= "st_j",       condition= true,	compare= false, sign= true, show_always= false ,section= "hit_absorbation_sect" },
//     ["additional_inventory_weight"]= { index= 16, typ= "float",   name= "ui_inv_outfit_additional_weight",        icon_p= "ui_am_propery_08",                 icon_n= "ui_am_prop_carry_weight_negative", track= false, magnitude= 1000,  unit= "st_g",       compare= false, sign= true, show_always= false },
// }

// stats_table["booster"] = {
//     ["boost_time"]                 = { index= 1,   typ= "float",  name= "ui_inv_effect_time",                     icon_p= "ui_am_prop_time_period",           icon_n= "",                                track= false, magnitude= 1,     unit= "ui_inv_seconds", compare= false, sign= true, show_always= false },
//     ["boost_health_restore"]       = { index= 2,   typ= "float",  name= "ui_inv_health",                          icon_p= "ui_am_propery_05",                 icon_n= "",                                track= false, magnitude= 1000,   unit= "st_perc",       compare= false, sign= true, show_always= false },
//     ["boost_radiation_restore"]    = { index= 3,   typ= "float",  name= "ui_inv_radiation",                       icon_p= "ui_am_propery_09",                 icon_n= "",                                track= false, magnitude= 30000,  unit= "st_msv_sec",    compare= false, sign= true, show_always= false, sign_inverse_txt= true },
//     ["eat_satiety"]                = { index= 4,   typ= "float",  name= "ui_inv_satiety",                         icon_p= "ui_am_prop_satiety_restore_speed", icon_n= "ui_am_prop_satiety",              track= false, magnitude= 1000,   unit= "st_kcal",       compare= false, sign= true, show_always= false },
//     ["boost_anabiotic"]            = { index= 5,   typ= "float",  name= "",                                       icon_p= "ui_am_prop_Vibros",                icon_n= "ui_am_prop_anabiotic",            track= false, magnitude= 1000,   unit= "",              compare= false, sign= true, show_always= false },
//     ["boost_power_restore"]        = { index= 6,   typ= "float",  name= "ui_inv_power",                           icon_p= "ui_am_propery_07",                 icon_n= "ui_am_prop_power_restore",        track= false, magnitude= 100000, unit= "st_microg",     compare= false, sign= true, show_always= false },
//     ["boost_bleeding_restore"]     = { index= 7,   typ= "float",  name= "ui_inv_bleeding",                        icon_p= "ui_am_prop_restore_bleeding",      icon_n= "ui_am_prop_bleeding_restore",     track= false, magnitude= 150000, unit= "st_ml_min",     compare= false, sign= true, show_always= false },
//     ["boost_radiation_protection"] = { index= 8,   typ= "float",  name= "ui_inv_outfit_radiation_protection",     icon_p= "ui_am_propery_09",                 icon_n= "ui_am_prop_radiation_protection", track= false, magnitude= 12000,  unit= "st_msv",        compare= false, sign= true, show_always= false },
//     ["boost_telepat_protection"]   = { index= 9,   typ= "float",  name= "ui_inv_outfit_telepatic_protection",     icon_p= "ui_am_propery_11",                 icon_n= "ui_am_prop_telepat_protection",   track= false, magnitude= 1500,   unit= "st_mt",         compare= false, sign= true, show_always= false },
//     ["boost_chemburn_protection"]  = { index= 10,  typ= "float",  name= "ui_inv_outfit_chemical_burn_protection", icon_p= "ui_am_prop_chem",                  icon_n= "ui_am_prop_chemburn_protection",  track= false, magnitude= 24750,  unit= "st_perc",       compare= false, sign= true, show_always= false },
//     ["boost_burn_immunity"]        = { index= 11,  typ= "float",  name= "ui_inv_outfit_burn_protection",          icon_p= "ui_am_prop_thermo",                icon_n= "ui_am_prop_burn_immunity",        track= false, magnitude= 300,    unit= "st_kw_m2",      compare= false, sign= true, show_always= false },
//     ["boost_shock_immunity"]       = { index= 12,  typ= "float",  name= "ui_inv_outfit_shock_protection",         icon_p= "ui_am_prop_electro",               icon_n= "ui_am_prop_shock_immunity",       track= false, magnitude= 480,    unit= "st_v",          compare= false, sign= true, show_always= false },
//     ["boost_radiation_immunity"]   = { index= 13,  typ= "float",  name= "ui_inv_outfit_radiation_protection",     icon_p= "ui_am_propery_09",                 icon_n= "ui_am_prop_radiation_immunity",   track= false, magnitude= 3000,   unit= "st_msv",        compare= false, sign= true, show_always= false },
//     ["boost_telepat_immunity"]     = { index= 14,  typ= "float",  name= "ui_inv_outfit_telepatic_protection",     icon_p= "ui_am_propery_11",                 icon_n= "ui_am_prop_telepat_immunity",     track= false, magnitude= 300,    unit= "st_mt",         compare= false, sign= true, show_always= false },
//     ["boost_chemburn_immunity"]    = { index= 15,  typ= "float",  name= "ui_inv_outfit_chemical_burn_protection", icon_p= "ui_am_prop_chem",                  icon_n= "ui_am_prop_chemburn_immunity",    track= false, magnitude= 380000, unit= "st_perc",       compare= false, sign= true, show_always= false },
//     ["boost_max_weight"]           = { index= 16,  typ= "float",  name= "ui_inv_outfit_additional_weight",        icon_p= "ui_am_propery_08",                 icon_n= "ui_am_prop_max_weight",           track= false, magnitude= 1000,  unit= "st_g",           compare= false, sign= true, show_always= false },
// }