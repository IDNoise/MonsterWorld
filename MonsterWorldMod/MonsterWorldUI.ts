import { IsPctRolled, Load, NumberToCondList, RandomFromArray, Save } from '../StalkerAPI/extensions/basic';
import { Log } from '../StalkerModBase';
import * as cfg from './MonsterWorldConfig';
import { MonsterWorldMod } from './MonsterWorldMod';
import { MWMonster } from './MWMonster';
import { MWPlayer } from './MWPlayer';
import { MWWeapon } from './MWWeapon';
import { MonsterConfig, LevelType, MonsterType, MonsterRank } from './MonsterWorldConfig';
import { MonsterWorld } from './MonsterWorld';

export class MonsterWorldUI {

    constructor(public world: MonsterWorld) {
        const oldPrepareStatsTable = utils_ui.prepare_stats_table;
        utils_ui.prepare_stats_table = () => this.PrepareUIItemStatsTable(oldPrepareStatsTable);

        const oldGetStatsValue = utils_ui.get_stats_value;
        utils_ui.get_stats_value = (obj, sec, gr, stat) => {
            if (type(gr.value_functor) == "function") {
                const cb = gr.value_functor;
                return cb(obj, sec);
            } 
            return oldGetStatsValue(obj, sec, gr, stat);
        };

        const oldGetItemName = ui_item.get_obj_name;
        ui_item.get_obj_name = (obj) => this.UIGetItemName(obj, oldGetItemName(obj));

        const oldGetItemDesc = ui_item.get_obj_desc;
        ui_item.get_obj_desc = (obj) => this.UIGetItemDescription(obj, oldGetItemDesc(obj));
    }

    Save(data: { [key: string]: any; }) {
        
    }
    Load(data: { [key: string]: any; }) {
        
    }

    PrepareUIItemStatsTable(oldPrepareStatsTable: () => utils_ui.StatsTable): utils_ui.StatsTable {
        let result = oldPrepareStatsTable() || utils_ui.stats_table;

        let weaponStats = result[utils_ui.ItemType.Weapon];

        let dpsConfig: utils_ui.StatConfig = { index: 1, name: "DPS", value_functor: (obj: game_object, sec: Section) => this.UIGetWeaponDPS(obj), typ: "float", icon_p: "", track: false, magnitude: 1, unit: "", compare: false, sign: false, show_always: true};
        weaponStats["dps"] = dpsConfig;

        weaponStats[utils_ui.StatType.Damage].index = 10;
        weaponStats[utils_ui.StatType.Damage].track = false;
        weaponStats[utils_ui.StatType.Damage].sign = false;
        weaponStats[utils_ui.StatType.Damage].magnitude = 1;
        weaponStats[utils_ui.StatType.Damage].icon_p = "";
        weaponStats[utils_ui.StatType.Damage].value_functor = (obj: game_object, sec: Section) => this.UIGetWeaponDamagePerHit(obj);

        weaponStats[utils_ui.StatType.FireRate].index = 11;
        weaponStats[utils_ui.StatType.FireRate].track = false;
        weaponStats[utils_ui.StatType.FireRate].sign = false;
        weaponStats[utils_ui.StatType.FireRate].magnitude = 1;
        weaponStats[utils_ui.StatType.FireRate].unit = "RPM";
        weaponStats[utils_ui.StatType.FireRate].icon_p = "";
        weaponStats[utils_ui.StatType.FireRate].value_functor = (obj: game_object, sec: Section) => this.UIGetWeaponRPM(obj);

        weaponStats[utils_ui.StatType.AmmoMagSize].index = 12;
        weaponStats[utils_ui.StatType.AmmoMagSize].track = false;
        weaponStats[utils_ui.StatType.AmmoMagSize].sign = false;
        weaponStats[utils_ui.StatType.AmmoMagSize].magnitude = 1;
        weaponStats[utils_ui.StatType.AmmoMagSize].icon_p = "";
        weaponStats[utils_ui.StatType.AmmoMagSize].value_functor = (obj: game_object, sec: Section) => this.UIGetWeaponAmmoMagSize(obj);

        weaponStats[utils_ui.StatType.Accuracy].index = 100;
        weaponStats[utils_ui.StatType.Accuracy].icon_p = "";
        weaponStats[utils_ui.StatType.Handling].index = 101;
        weaponStats[utils_ui.StatType.Handling].icon_p = "";

        return result;
    }

    UIGetItemName(obj: game_object, current: string): string{
        if (!IsWeapon(obj))
            return current;

        const weapon = this.world.GetWeapon(obj.id());

        //return `${cfg.QualityColors[weapon.Quality]}${cfg.Qualities[weapon.Quality]}${cfg.EndColorTag} ${current} ${cfg.LevelColor}L.${weapon.Level}${cfg.EndColorTag}`
        return `${cfg.Qualities[weapon.Quality]}  ${current}  L.${weapon.Level}`
    }

    UIGetItemDescription(obj: game_object, current: string): string{
        if (!IsWeapon(obj))
            return current;

        return this.world.GetWeapon(obj.id()).GetBonusDescription();
    }

    UIGetItemLevel(obj: game_object): number { return this.world.GetWeapon(obj.id()).Level; }
    UIGetWeaponDPS(obj: game_object): number { return this.world.GetWeapon(obj.id()).DamagePerHit * (1 / obj.cast_Weapon().RPM()); }
    UIGetWeaponDamagePerHit(obj: game_object): number { return this.world.GetWeapon(obj.id()).DamagePerHit; }
    UIGetWeaponRPM(obj: game_object): number { return 60 / obj.cast_Weapon().RPM(); }
    UIGetWeaponAmmoMagSize(obj: game_object): number { return obj.cast_Weapon().GetAmmoMagSize(); }
}