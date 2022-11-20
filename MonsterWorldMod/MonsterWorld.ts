import { IsPctRolled } from '../StalkerAPI/extensions/basic';
import { Log } from '../StalkerModBase';
import * as cfg from './MonsterWorldConfig';
import { MonsterWorldMod } from './MonsterWorldMod';
import { MWMonster } from './MWMonster';
import { MWPlayer } from './MWPlayer';
import { MWWeapon } from './MWWeapon';

type WeaponDropInfo = {
    level: number;
    quality: number;
}

export class MonsterWorld {
    private safeSmarts: LuaSet<Id>
    private player?: MWPlayer;
    private monsters: LuaTable<Id, MWMonster>
    private weapons: LuaTable<Id, MWWeapon>

    private weaponDrops: LuaTable<Id, WeaponDropInfo>

    constructor(public mod: MonsterWorldMod){
        this.safeSmarts = new LuaSet();
        this.monsters = new LuaTable();
        this.weapons = new LuaTable();
        this.weaponDrops = new LuaTable();
    }

    get Player(): MWPlayer{
        if (this.player == undefined)
            this.player = new MWPlayer(this, 0);
        return this.player;
    }

    GetMonster(monsterId: Id): MWMonster | undefined {
        if (!this.monsters.has(monsterId)){
            this.monsters.set(monsterId, new MWMonster(this, monsterId));
        }
        return this.monsters.get(monsterId);
    }
    
    CreateMonster(monster: game_object) {
        this.monsters.set(monster.id(), new MWMonster(this, monster.id()));
    }
    DestroyObject(id:Id) {
        this.monsters.delete(id);
        this.weapons.delete(id);
        this.weaponDrops.delete(id);
    }

    GetWeapon(itemId: Id): MWWeapon {
        if (!this.weapons.has(itemId)){
            this.weapons.set(itemId, new MWWeapon(this, itemId));
        }
        return this.weapons.get(itemId);
    }

    CreateItem(item: game_object){
        if (!IsWeapon(item))
            return;

        Log(`Create item ${item.section()}:${item.id()}. Drop configs = ${this.weaponDrops.length} `)
        
        let config = this.weaponDrops.get(item.id());
        Log(`Has config: ${config != undefined}`)
        this.weaponDrops.delete(item.id());
        if (this.weapons.has(item.id()))
            return;

        this.weapons.set(item.id(), new MWWeapon(this, item.id(), config?.level || 1));
    }

    public OnPlayerSpawned():void{
        db.actor.inventory_for_each((item) => this.CreateItem(item));
    }

    public Save(data: { [key: string]: any; }) {
        data.safeSmarts = this.safeSmarts;
        data.weaponDrops = this.weaponDrops;
    }

    public Load(data: { [key: string]: any; }) {
        this.safeSmarts = data.safeSmarts || new LuaSet();
        this.weaponDrops = data.weaponDrops || new LuaTable();
    }

    public FillStartPositions(){
        let setting_ini = new ini_file("misc\\simulation.ltx");
        setting_ini.section_for_each((section) => {
            
            let smart = SIMBOARD.smarts_by_names[section];
            if (!smart) {
                Log(`sim_board:fill_start_position incorrect smart by name ${section}`)
                return false;
            }

            //Log(`Iterating on ${section}. Smart: ${smart.id} ${smart.name()}`)

            const lineCount = setting_ini.line_count(section);
            for(let line = 0; line < lineCount; line++){
                let [_res, squad_section, countStr] = setting_ini.r_line(section, line)
                let count = tonumber(countStr) || 1

                let common = ini_sys.r_bool_ex(squad_section,"common", false)
                let faction = ini_sys.r_string_ex(squad_section,"faction")

                if (common){
                    let countMult = is_squad_monster[faction] ? 5 : 1;
                    count = round_idp(count * countMult)
                }
                
                Log(`     ${line + 1}/${lineCount}: ${squad_section} =${count} (${common})`)

                if (common) continue;
                if (!squad_section.includes("trader") && !squad_section.includes("mechanic") && !squad_section.includes("barman")){
                    continue;
                }

                this.safeSmarts.add(smart.id);
                //Log(`Added to safe smarts: ${smart.id}. safe smarts#: ${this.safeSmarts.length}`)
                continue;
                // for (let i = 0; i < count; i++){
                //     SIMBOARD.create_squad(smart, squad_section)
                // }
            }

            return false;
        });

        SIMBOARD.start_position_filled = true;
    }

    OnTryRespawn(smart: smart_terrain.se_smart_terrain): boolean {
        if (!smart.is_on_actor_level)
            return false;

        if (this.safeSmarts.has(smart.id)) {
            //this.Log(`Smart is safe: ${smart.id} ${smart.name()}`)
            return false;
        }       

        if (smart.respawn_idle == 5)
            return true;

        //super.OnSmartTerrainTryRespawn(smart);
        //Log(`Setup configs for smart: ${smart.name()}`)
        smart.respawn_idle = 5;
        smart.max_population = 5;

        if (math.random(1, 100) > 60){
            smart.respawn_params = {
                "spawn_section_1": {
                    num: xr_logic.parse_condlist(null, null, null, "3"), 
                    squads: ["simulation_snork"]
                },
            }
        }
        else {
            smart.respawn_params = {
                "spawn_section_1": {
                    num: xr_logic.parse_condlist(null, null, null, "3"), 
                    squads: ["simulation_pseudodog", "simulation_mix_dogs"]
                }
            } 
        }

        smart.already_spawned = {"spawn_section_1": {num: 0}, "spawn_section_2": {num: 0}}

        return true;
    }

    public OnPlayerHit(attackerGO: game_object) {
        let monster = this.GetMonster(attackerGO.id());
        if (monster == undefined) 
            return;

        this.Player.HP -= monster.Damage;
        Log(`Player [${ this.Player.HP} / ${this.Player.MaxHP}] was hit by ${monster.Name} for ${monster.Damage} damage`);
    }

    public OnMonsterHit(monsterGO: game_object, shit: hit) {
        let monster = this.GetMonster(monsterGO.id());
        if (monster == undefined) 
            return;

        let weapon = this.GetWeapon(shit.weapon_id);
        let damage = weapon.DamagePerHit;
        monster.HP -= damage;
        
        //actor_menu.set_msg(2, `Enemy ${monster.Name} was hit for ${damage}`, 3, GetARGB(255, 240, 20, 20))
        Log(`${monster.Name} [${monster.HP} / ${monster.MaxHP}] was hit by player for ${damage} damage`);
    }

    public OnMonsterKilled(monsterGO: game_object) {
        let monster = this.GetMonster(monsterGO.id());
        if (monster == undefined) 
            return;

        actor_menu.set_msg(1, `EXP +${monster.XPReward} for ${monster.Name}`, 3, GetARGB(255, 20, 240, 20))
        this.Player.CurrentXP += monster.XPReward;

        if (IsPctRolled(cfg.EnemyDropChance)){
            let sgo = alife_create_item("wpn_aps_mw", db.actor);
            Log(`Dropping loot ${sgo.section_name()}:${sgo.id}`)
            let dropLevel = monster.Level;
            if (monster.IsBoss) 
                dropLevel++;
            let qualityLevel = 1;
            if (IsPctRolled(25)) { qualityLevel = 2; }
            else if (IsPctRolled(12)) { qualityLevel = 3; }
            else if (IsPctRolled(6)) { qualityLevel = 4; }
            else if (IsPctRolled(3)) { qualityLevel = 5; }

            if (monster.IsBoss)
                qualityLevel++;

            this.weaponDrops.set(sgo.id, {level: dropLevel, quality: qualityLevel})
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

        weaponStats[utils_ui.StatType.Accuracy].index = 100;
        weaponStats[utils_ui.StatType.Accuracy].icon_p = "";
        weaponStats[utils_ui.StatType.Handling].index = 101;
        weaponStats[utils_ui.StatType.Handling].icon_p = "";

        return result;
    }

    UIGetItemName(obj: game_object, current: string): string{
        if (!IsWeapon(obj))
            return current;

        const weapon = this.GetWeapon(obj.id());

        //return `${cfg.QualityColors[weapon.Quality]}${cfg.Qualities[weapon.Quality]}${cfg.EndColorTag} ${current} ${cfg.LevelColor}L.${weapon.Level}${cfg.EndColorTag}`
        return `${cfg.Qualities[weapon.Quality]}  ${current}  L.${weapon.Level}`
    }

    UIGetItemDescription(obj: game_object, current: string): string{
        if (!IsWeapon(obj))
            return current;

        return this.GetWeapon(obj.id()).GetBonusDescription();
    }

    UIGetItemLevel(obj: game_object): number { return this.GetWeapon(obj.id()).Level; }
    UIGetWeaponDPS(obj: game_object): number { return this.GetWeapon(obj.id()).DamagePerHit * (1 / obj.cast_Weapon().RPM()); }
    UIGetWeaponDamagePerHit(obj: game_object): number { return this.GetWeapon(obj.id()).DamagePerHit; }
    UIGetWeaponRPM(obj: game_object): number { return 60 / obj.cast_Weapon().RPM(); }
    UIGetWeaponAmmoMagSize(obj: game_object): number { return obj.cast_Weapon().GetAmmoMagSize(); }
}