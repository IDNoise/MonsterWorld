import { IsPctRolled, Load, NumberToCondList, RandomFromArray, Save } from '../StalkerAPI/extensions/basic';
import { Log } from '../StalkerModBase';
import * as cfg from './MonsterWorldConfig';
import { MonsterWorldMod } from './MonsterWorldMod';
import { MWMonster } from './MWMonster';
import { MWPlayer } from './MWPlayer';
import { MWWeapon } from './MWWeapon';
import { MonsterConfig, LevelType, MonsterType, MonsterRank } from './MonsterWorldConfig';
import { MonsterWorld } from './MonsterWorld';

type DamageNumberEntry = {
    showTime: number;
    text: CUITextWnd;
}

type XPNumberEntry = {
    showTime: number;
    text: CUITextWnd;
}

export class MonsterWorldUI {
    private damageNumbersContainer: CUIStatic;
    private xpRewardNumbersContainer: CUIStatic;
    private damageNumbers: DamageNumberEntry[] = [];
    private xpRewardNumbers: XPNumberEntry[] = [];
    
    private enemyHP: CUIStatic;
    private enemyHPBarName: CUITextWnd;
    private enemyHPBarValue: CUITextWnd;
    private enemyHPBarProgress: CUIProgressBar;

    private playerLevelBar: CUIStatic;
    private playerLevelBarLevel: CUITextWnd;
    private playerLevelBarXP: CUITextWnd;
    private playerLevelBarProgress: CUIProgressBar;

    private lastEnemyHpShowTime: number = 0;

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

    public Save(data: { [key: string]: any; }) {
        
    }

    public Load(data: { [key: string]: any; }) {
        
    }

    public Update() {
        if (!this.InitHud())
            return;

        this.UpdateTarget();
        this.UpdateDamageNumbers();
        this.UpdateXpRewardNumbers();
        this.UpdatePlayerLevelBar();
    }

    public ShowDamage(damage: number, isCrit: boolean = false, isKillHit: boolean = false){
        for(let i = 0; i < this.damageNumbers.length; i++){
            let entry = this.damageNumbers[i];
            if (entry.text.IsShown()) continue;
            entry.text.SetWndPos(new vector2().set(math.random(-15, 15), math.random(-5, 5)))
            entry.showTime = time_global();
            let msg = `${math.floor(damage)}`
            if (isCrit) msg += " X"
            if (isKillHit) msg += ""
            entry.text.SetText(msg);
            entry.text.Show(true);
            
            return;
        }
    }

    public ShowXPReward(reward: number){
        for(let i = 0; i < this.xpRewardNumbers.length; i++){
            let entry = this.xpRewardNumbers[i];
            if (entry.text.IsShown()) continue;
            entry.text.SetWndPos(new vector2().set(math.random(-30, 30), math.random(-3, 3)))
            entry.showTime = time_global();
            let msg = `+ ${math.floor(reward)} XP`
            entry.text.SetText(msg);
            entry.text.Show(true);
            
            return;
        }
    }
    
    private InitHud(): boolean {
        if (this.damageNumbersContainer != null && this.enemyHP != null && this.xpRewardNumbersContainer != null) 
            return true;

        let hud = get_hud();
        if (hud == undefined) 
            return false;

        let cs = hud.GetCustomStatic("mp_ah_buy")
        if (cs == undefined)
            hud.AddCustomStatic("mp_ah_buy", true)
        cs = hud.GetCustomStatic("mp_ah_buy")
        if (cs != undefined){
            let xml = new CScriptXmlInit()
            xml.ParseFile("ui_monster_world.xml")
            cs.wnd().SetWndPos(new vector2().set(0, 0))
            cs.wnd().Show(true);

            Log(`Initializing damage_numbers`)
            this.damageNumbersContainer = xml.InitStatic("damage_numbers", cs.wnd())
            this.damageNumbersContainer.Show(true)
            for(let i = 0; i < 30; i++){
                let textEntry = xml.InitTextWnd("damage_numbers:damage_number", this.damageNumbersContainer);
                textEntry.Show(false);
                this.damageNumbers.push({ 
                    text: textEntry,
                    showTime: 0
                });
            }

            Log(`Initializing xp_reward_numbers`)
            this.xpRewardNumbersContainer = xml.InitStatic("xp_reward_numbers", cs.wnd())
            this.xpRewardNumbersContainer.Show(true)
            for(let i = 0; i < 30; i++){
                let textEntry = xml.InitTextWnd("xp_reward_numbers:xp_reward_number", this.xpRewardNumbersContainer);
                textEntry.Show(false);
                this.xpRewardNumbers.push({ 
                    text: textEntry,
                    showTime: 0
                });
            }
            
            Log(`Initializing enemy_health`)
            this.enemyHP = xml.InitStatic("enemy_health", cs.wnd());
            this.enemyHP.Show(false);
            xml.InitStatic("enemy_health:value_progress_background", this.enemyHP)
            this.enemyHPBarProgress = xml.InitProgressBar("enemy_health:value_progress", this.enemyHP)
            this.enemyHPBarName = xml.InitTextWnd("enemy_health:name", this.enemyHP)
            this.enemyHPBarValue = xml.InitTextWnd("enemy_health:value", this.enemyHP)

            Log(`Initializing level_bar`)
            this.playerLevelBar = xml.InitStatic("level_bar", cs.wnd());
            this.playerLevelBar.Show(true);
            xml.InitStatic("level_bar:progress_background", this.playerLevelBar)
            this.playerLevelBarProgress = xml.InitProgressBar("level_bar:progress", this.playerLevelBar) 
            this.playerLevelBarLevel = xml.InitTextWnd("level_bar:level", this.playerLevelBar)
            this.playerLevelBarXP = xml.InitTextWnd("level_bar:xp", this.playerLevelBar)
            
            return true;
        }

        return false;
    }

    private UpdateTarget(){
        let targetObj = level.get_target_obj();
        if (!targetObj){
            this.HideEnemyHealthUI();
            return;
        }

        let targetDist = level.get_target_dist();
        let monster = this.world.GetMonster(targetObj.id())
        if (targetDist < 300 && monster && monster.HP > 0){
            this.ShowEnemyHealthUI(monster);
        }
        else {
            this.HideEnemyHealthUI(monster?.IsDead || false);
        }
    }

    private HideEnemyHealthUI(force: boolean = false) {
        if (force || time_global() - this.lastEnemyHpShowTime > 500)
            this.enemyHP?.Show(false);
    }
    
    private ShowEnemyHealthUI(monster: MWMonster) {
        if (!this.enemyHP) return;

        this.lastEnemyHpShowTime= time_global();
        this.enemyHP.Show(true);
        this.enemyHPBarProgress.SetProgressPos(monster.HP / monster.MaxHP * 100);
        this.enemyHPBarName.SetText(monster.Name);
        this.enemyHPBarValue.SetText(`${math.floor(monster.HP)} / ${math.floor(monster.MaxHP)}`);
    }

    private UpdateDamageNumbers(){
        let now = time_global();
        for(let i = 0; i < this.damageNumbers.length; i++){
            let entry = this.damageNumbers[i];
            let text = entry.text;
            if (now - entry.showTime > 750){
                text.Show(false);
            }
            else {
                let pos = text.GetWndPos()
                pos.y -= 2;
                text.SetWndPos(pos);
            }
        }
    }

    private UpdateXpRewardNumbers(){
        let now = time_global();
        for(let i = 0; i < this.xpRewardNumbers.length; i++){
            let entry = this.xpRewardNumbers[i];
            let text = entry.text;
            if (now - entry.showTime > 2000){
                text.Show(false);
            }
            else {
                let pos = text.GetWndPos()
                pos.y -= 1;
                text.SetWndPos(pos);
            }
        }
    }

    private UpdatePlayerLevelBar(){
        let player = this.world.Player;
        let levelInfo =`Level ${player.Level}`;
        if (player.StatPoints > 0){
            levelInfo += ` (SP: ${player.StatPoints})`
        }
        this.playerLevelBarLevel.SetText(levelInfo)

        let currentXP = player.CurrentXP;
        let reqXP = player.RequeiredXP;
        this.playerLevelBarXP.SetText(`${currentXP} / ${reqXP}`)
        this.playerLevelBarProgress.SetProgressPos(clamp(currentXP / reqXP, 0, 1) * 100)
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


