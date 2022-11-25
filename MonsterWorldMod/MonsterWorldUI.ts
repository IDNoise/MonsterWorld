import { Log } from '../StalkerModBase';
import { MonsterWorld } from './MonsterWorld';
import * as cfg from './MonsterWorldConfig';
import { StatType } from './MonsterWorldConfig';
import { MWMonster } from './MWMonster';

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
    
    private levelUpText: CUITextWnd;
    private levelUpShowTime: number = 0;

    private enemyHP: CUIStatic;
    private enemyHPBarName: CUITextWnd;
    private enemyHPBarValue: CUITextWnd;
    private enemyHPOutOfDistanceNotice: CUITextWnd;
    private enemyHPBarProgress: CUIProgressBar;
    
    private playerStatus: CUIStatic;
    private playerStatusLevelValue: CUITextWnd;
    private playerStatusXPBar: CUIProgressBar;
    private playerStatusXPBarValue: CUITextWnd;
    private playerStatusHPBar: CUIProgressBar;
    private playerStatusHPBarValue: CUITextWnd;

    private lastEnemyHpShowTime: number = 0;

    constructor(public World: MonsterWorld) {
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

        const oldUICellItemUpdate = utils_ui.UICellItem.Update;
        const newUICellItemUpdate = (s: any, obj: game_object): boolean => {
            let res = oldUICellItemUpdate(s, obj);

            s.bar?.Show(false) //Condition bar
            s.upgr?.Show(false)  //Upgrade marker
            s.mwLevel?.Show(false)  //Level text

            obj = obj || (s.ID && level.object_by_id(s.ID))
            if (!res || !obj) 
                return res;

            let weapon = this.World.GetWeapon(obj);
            if (!weapon)
                return res;

            if (!s.mwLevel){ //Add custom level text
                let xml = new CScriptXmlInit()
                xml.ParseFile("ui_monster_world.xml")
                s.mwLevel = xml.InitStatic(`item_additions:level_text`, s.cell)
                s.mwLevel.TextControl().SetFont(GetFontLetterica16Russian())
            }

            s.mwLevel.SetWndPos(new vector2().set(3, s.cell.GetHeight() - 14))
            s.mwLevel.TextControl().SetText(`L.${weapon.Level}   DPS:${math.floor(weapon.DPS)}`)
            s.mwLevel.TextControl().SetTextColor(cfg.QualityColors[weapon.Quality])
            s.mwLevel.Show(true)

            return res;
        }
        utils_ui.UICellItem.Update = newUICellItemUpdate


        const oldUIInfoItemUpdate = utils_ui.UIInfoItem.Update;
        const newUIInfoItemUpdate = (s: any, obj: game_object, sec: Section, flags: any): void => {
            oldUIInfoItemUpdate(s, obj, sec, flags)
            if (!obj) 
                return;

            let weapon = this.World.GetWeapon(obj);
            if (!weapon)
                return;
            
            s.name.SetTextColor(cfg.QualityColors[weapon.Quality])
        }
        utils_ui.UIInfoItem.Update = newUIInfoItemUpdate

        const oldUISortBySizeKind = utils_ui.sort_by_sizekind; 
        utils_ui.sort_by_sizekind = (t, a, b) => { //Sorting by DPS > level > quality
            let objA = t.get(a);
            let objB = t.get(b);
            let weaponA = this.World.GetWeapon(objA)
            let weaponB = this.World.GetWeapon(objB)
            if (weaponA != null && weaponB != null && weaponA != weaponB){
                if (weaponA.DPS != weaponB.DPS)
                    return weaponA.DPS > weaponB.DPS;
                else if(weaponA.Level != weaponB.Level)
                    return weaponA.Level > weaponB.Level;
                else if (weaponA.Quality != weaponB.Quality)
                    return weaponA.Quality > weaponB.Quality;
                else
                    return weaponA.id > weaponB.id;
            }
            return oldUISortBySizeKind(t, a, b);
        }

        const oldUIInventoryInitControls = ui_inventory.UIInventory.InitControls;
        ui_inventory.UIInventory.InitControls = (s: any) => {
            this.OnInitInventoryControls(s);
            oldUIInventoryInitControls(s);
        }
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
        this.UpdateLevelUpMessage();
        this.UpdateSkills();
    }

    public ShowLevelUpMessage(newLevel: number) {
        this.levelUpShowTime = time_global();
        this.levelUpText.Show(true);
        this.levelUpText.SetText(`LEVEL UP! NEW LEVEL: ${newLevel}`)
    }

    public ShowDamage(damage: number, isCrit: boolean = false, isKillHit: boolean = false){
        for(let i = 0; i < this.damageNumbers.length; i++){
            let entry = this.damageNumbers[i];
            if (entry.text.IsShown()) continue;

            let msg = `${math.max(1, math.floor(damage))}`

            entry.text.SetWndPos(new vector2().set(math.random(-15, 15), math.random(-5, 5)))
            entry.showTime = time_global();
            entry.text.SetTextColor(isCrit ? GetARGB(255, 255, 165, 5) : GetARGB(255, 240, 20, 20))
            entry.text.SetFont(isCrit || isKillHit ? GetFontGraffiti22Russian() : GetFontLetterica18Russian())
            entry.text.SetText(msg + (isCrit ? " X" : ""));
            entry.text.Show(true);
            
            return;
        }
    }

    public ShowXPReward(reward: number){
        for(let i = 0; i < this.xpRewardNumbers.length; i++){
            let entry = this.xpRewardNumbers[i];
            if (entry.text.IsShown()) continue;
            let msg = `+ ${math.floor(reward)} XP`
            entry.text.SetWndPos(new vector2().set(math.random(-30, 30), math.random(-3, 3)))
            entry.showTime = time_global();
            entry.text.SetFont(GetFontGraffiti22Russian())
            entry.text.SetText(msg);
            entry.text.Show(true);
            
            return;
        }
    }
    
    private InitHud(): boolean {
        if (this.playerStatus != null) 
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

            Log(`Initializing level_up`)
            this.levelUpText = xml.InitTextWnd("level_up", cs.wnd())
            this.levelUpText.Show(false);
            
            Log(`Initializing enemy_health`)
            this.enemyHP = xml.InitStatic("enemy_health", cs.wnd());
            xml.InitStatic("enemy_health:background", this.enemyHP)
            this.enemyHP.Show(false);
            this.enemyHPBarProgress = xml.InitProgressBar("enemy_health:value_progress", this.enemyHP)
            this.enemyHPBarName = xml.InitTextWnd("enemy_health:name", this.enemyHP)
            this.enemyHPBarValue = xml.InitTextWnd("enemy_health:value", this.enemyHP)
            this.enemyHPOutOfDistanceNotice = xml.InitTextWnd("enemy_health:out_of_distance", this.enemyHP)
            this.enemyHPOutOfDistanceNotice.Show(false)

            Log(`Initializing player status panel`)
            this.playerStatus = xml.InitStatic("player_status", cs.wnd());
            this.playerStatus.Show(true)
            xml.InitStatic("player_status:background", this.playerStatus)
            this.playerStatusLevelValue = xml.InitTextWnd("player_status:level", this.playerStatus) 
            this.playerStatusXPBar = xml.InitProgressBar("player_status:xpbar", this.playerStatus) 
            this.playerStatusXPBarValue = xml.InitTextWnd("player_status:xpbar_value", this.playerStatus) 
            this.playerStatusHPBar = xml.InitProgressBar("player_status:healthbar", this.playerStatus) 
            this.playerStatusHPBarValue = xml.InitTextWnd("player_status:healthbar_value", this.playerStatus) 
            
            return true;
        }

        return false;
    }

    private UpdateTarget(){
        //Log(`UpdateTarget start`)
        let targetObj = level.get_target_obj();
        if (!targetObj){
            this.HideEnemyHealthUI();
            //Log(`UpdateTarget end - no targetObj`)
            return;
        }

        let targetDist = level.get_target_dist();
        let monster = this.World.GetMonster(targetObj.id())
        if (targetDist < 300 && monster && monster.HP > 0){
            this.ShowEnemyHealthUI(monster);
        }
        else {
            this.HideEnemyHealthUI(monster?.IsDead || false);
        }
        //Log(`UpdateTarget end`)
    }

    private HideEnemyHealthUI(force: boolean = false) {
        if (force || time_global() - this.lastEnemyHpShowTime > 500)
            this.enemyHP?.Show(false);
    }
    
    private ShowEnemyHealthUI(monster: MWMonster) {
        this.lastEnemyHpShowTime = time_global();
        this.enemyHP.Show(true);
        this.enemyHPBarProgress.SetProgressPos(clamp(monster.HP / monster.MaxHP, 0, 1) * 100);
        this.enemyHPBarName.SetText(monster.Name);
        this.enemyHPBarName.SetTextColor(cfg.MonsterRankColors[monster.Rank]);
        this.enemyHPBarValue.SetText(`${math.floor(monster.HP)} / ${math.floor(monster.MaxHP)}`);
        
        let player = this.World.Player
        let playerPos = player.GO.position();
        let playerWeapon = player.Weapon;
        let distance = playerWeapon?.GO.cast_Weapon().GetFireDistance() || 100000;
        this.enemyHPOutOfDistanceNotice.Show(monster.GO.position().distance_to(playerPos) >= distance)
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
            if (now - entry.showTime > 1500){
                text.Show(false);
            }
            else {
                let pos = text.GetWndPos()
                pos.y -= 1;
                text.SetWndPos(pos);
            }
        }
    }

    private UpdateLevelUpMessage(){
        if (time_global() - this.levelUpShowTime > 3000){
            this.levelUpText.Show(false);
            return;
        }

        let pos = this.levelUpText.GetWndPos()
        pos.y -= 0.35;
        this.levelUpText.SetWndPos(pos)     
    }

    private UpdatePlayerLevelBar(){
        let player = this.World.Player;
        let levelInfo =`Level: ${player.Level}`;
        if (player.SkillPoints > 0){
            levelInfo += ` (SP: ${player.SkillPoints})`
        }
        this.playerStatusLevelValue.SetText(levelInfo)

        let currentXP = player.CurrentXP;
        let reqXP = player.RequeiredXP;
        this.playerStatusXPBarValue.SetText(`${math.floor(currentXP)} / ${math.floor(reqXP)}`)
        this.playerStatusXPBar.SetProgressPos(clamp(currentXP / reqXP, 0, 1) * 100)

        let currentHP = player.IsDead ? 0 : player.HP;
        let maxHP = player.MaxHP;
        this.playerStatusHPBarValue.SetText(`${math.floor(currentHP)} / ${math.floor(maxHP)}`)
        this.playerStatusHPBar.SetProgressPos(clamp(currentHP / maxHP, 0, 1) * 100)
    }

    private playerSkills: CUIStatic
    private playerSkillTotalSP: CUITextWnd;
    private playerSkillsScrollView: CUIScrollView
    private OnInitInventoryControls(s: any){
        let xml = new CScriptXmlInit()
        xml.ParseFile("ui_monster_world.xml")

        this.playerSkills = xml.InitStatic("player_skills", s)
        this.playerSkills.Show(true)
        xml.InitStatic("player_skills:background", this.playerSkills)
        this.playerSkillsScrollView = xml.InitScrollView("player_skills:list", this.playerSkills)
        this.playerSkillTotalSP = xml.InitTextWnd("player_skills:total_sp", this.playerSkills)

        for(let [skillId, skill] of this.World.Player.Skills){
            let skillEntry = xml.InitStatic("player_skills:skill", undefined);
            xml.InitStatic("player_skills:skill:background_frame", skillEntry)
            xml.InitStatic("player_skills:skill:background", skillEntry)
            skill.DescriptionText = xml.InitTextWnd("player_skills:skill:info", skillEntry)
            skill.LevelText = xml.InitTextWnd("player_skills:skill:level", skillEntry)
            skill.UpgradeButton = xml.Init3tButton("player_skills:skill:upgrade_button", skillEntry)
            let actionId = `upgrade_${skillId}`;
            s.Register(skill.UpgradeButton, actionId)
            let currentSkillId = skillId;
            s.AddCallback(actionId, ui_events.BUTTON_CLICKED, (id: string) => this.OnSkillUpgrade(id), currentSkillId)

            skill.UpdateUI();

            this.playerSkillsScrollView.AddWindow(skillEntry, true)
            skillEntry.SetAutoDelete(true)   
        }
    }

    OnSkillUpgrade(skillId: string): void{
        Log(`On skill upgrade ${skillId}`)
        let player = this.World.Player;
        let skill = player.Skills.get(skillId)
        skill?.Upgrade();
    }

    UpdateSkills(){
        if (!this.playerSkills || !this.playerSkills.IsShown()) return;

        this.playerSkillTotalSP.SetText(`Available SP: ${this.World.Player.SkillPoints}`)
        for(let [_, skill] of this.World.Player.Skills){
            skill.UpdateUpgradeButton();
        }
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

        let fireDistance: utils_ui.StatConfig = { index: 13, name: "Distance", value_functor: (obj: game_object, sec: Section) => this.UIGetWeaponFireDistance(obj), typ: "float", icon_p: "", track: false, magnitude: 1, unit: "m", compare: false, sign: false, show_always: true};
        weaponStats["fire_distance"] = fireDistance;

        weaponStats[utils_ui.StatType.Accuracy].index = 100;
        weaponStats[utils_ui.StatType.Accuracy].icon_p = "";
        weaponStats[utils_ui.StatType.Handling].index = 101;
        weaponStats[utils_ui.StatType.Handling].icon_p = "";

        return result;
    }

    UIGetItemName(obj: game_object, current: string): string{
        let weapon = this.World.GetWeapon(obj);
        if (weapon == undefined)
            return "";

        //return `${cfg.QualityColors[weapon.Quality]}${cfg.Qualities[weapon.Quality]}${cfg.EndColorTag} ${current} ${cfg.LevelColor}L.${weapon.Level}${cfg.EndColorTag}`
        return `${cfg.Qualities[weapon.Quality]} ${current} L.${weapon.Level}`
    }

    UIGetItemDescription(obj: game_object, current: string): string{
        let weapon = this.World.GetWeapon(obj);
        if (weapon == undefined)
            return "";

        return weapon.GetBonusDescription();
    }

    UIGetItemLevel(obj: game_object): number { 
        let weapon = this.World.GetWeapon(obj);
        if (weapon == undefined)
            return 0;

        return weapon.Level; 
    }

    UIGetWeaponDPS(obj: game_object): number { 
        let weapon = this.World.GetWeapon(obj);
        if (weapon == undefined)
            return 0;

        return weapon.DPS; 
    }

    UIGetWeaponDamagePerHit(obj: game_object): number { 
        let weapon = this.World.GetWeapon(obj);
        if (weapon == undefined)
            return 0;

        return weapon.DamagePerHit; 
    }

    UIGetWeaponRPM(obj: game_object): number { 
        let weapon = this.World.GetWeapon(obj);
        if (weapon == undefined)
            return 0;

        return 60 / weapon.RPM; 
    }

    UIGetWeaponAmmoMagSize(obj: game_object): number { 
        let weapon = this.World.GetWeapon(obj);
        if (weapon == undefined)
            return 0;

        return weapon.MagSize;
    }

    UIGetWeaponFireDistance(obj: game_object): number { 
        let weapon = this.World.GetWeapon(obj);
        if (weapon == undefined)
            return 0;

        return math.max(1, obj?.cast_Weapon()?.GetFireDistance() || 0); 
    }
}


// s.bar.SetColor(cfg.QualityColors[weapon.Quality])
// s.bar.ShowBackground(true)
//s.Add_CustomText(`L.: ${weapon.Level}`, null, null, cfg.QualityColors[weapon.Quality], GetFontSmall())
//s.ico.SetTextureColor(cfg.QualityColors[weapon.Quality])
// s.hl.SetTextureColor(cfg.QualityColors[weapon.Quality])
// s.hl.Show(true)