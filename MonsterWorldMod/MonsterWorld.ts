import { IsPctRolled, Load, NumberToCondList, RandomFromArray, Save } from '../StalkerAPI/extensions/basic';
import { Log } from '../StalkerModBase';
import * as cfg from './MonsterWorldConfig';
import { MonsterWorldMod } from './MonsterWorldMod';
import { MWMonster } from './MWMonster';
import { MWPlayer } from './MWPlayer';
import { MWWeapon } from './MWWeapon';
import { MonsterConfig, LevelType, MonsterType, MonsterRank } from './MonsterWorldConfig';

type WeaponDropInfo = {
    level: number;
    quality: number;
}

type MonsterSpawnInfo = {
    level: number;
    boss: boolean;
}

export class MonsterWorld {
    private safeSmarts: LuaSet<Id>
    private player?: MWPlayer;
    private monsters: LuaTable<Id, MWMonster>
    private weapons: LuaTable<Id, MWWeapon>

    private weaponDrops: LuaTable<Id, WeaponDropInfo>
    //private monsterSpawns: LuaTable<Id, MonsterSpawnInfo>

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

        //Log(`Trying to spawn for: ${smart.name()}`)
        if (!Load(smart.id, "MW_Initialized", false)){
            smart.respawn_idle = 60 * 30;
            smart.max_population = 5;

            //Log(`Level name: ${level.name()}`)
            let locationCfg = cfg.LocationConfigs[level.name()];
            if (!locationCfg)
                return false;

            let selectedMonsters: MonsterType[] = [];
            for(const [monsterType, monsterCfg] of cfg.MonsterConfigs){
                if ((monsterCfg.level_start || 1) < (locationCfg.level || 1))
                    continue;
                if (((monsterCfg.level_type || (LevelType.NonLab)) & (locationCfg.level || LevelType.Open)) == 0)
                    continue;
                selectedMonsters.push(monsterType);
            }

            let selectedMonsterType = RandomFromArray(selectedMonsters);
            Save(smart.id, "MW_MonsterType", selectedMonsterType);
            smart.respawn_params = {
                "spawn_section_1": {
                    num: NumberToCondList(cfg.MonsterConfigs.get(selectedMonsterType).max_squads_per_smart || 2),
                    squads: ["simulation_monster_world"]
                },
            }
            smart.already_spawned = {"spawn_section_1": {num: 0}}

            //Log(`Initialized: ${smart.name()}`)
            Save(smart.id, "MW_Initialized", true);
        }

        
        if (this.safeSmarts.has(smart.id)) {
            //this.Log(`Smart is safe: ${smart.id} ${smart.name()}`)
            return false;
        }       

        //Log(`Spawning for: ${smart.name()}`)

        return true;
    }

    public OnSimSquadAddMember(obj: any, section: string, pos: vector, lvid: number, gvid: number, defaultFunction: (...args: any[]) => Id | undefined): Id | undefined {
        //Log(`OnSimSquadAddMember: ${section} ${type(obj)}`)
        if (section != "dog_normal_red")
            return;

        if(!obj.smart_id){
            Log(`"NO SMART!"`)
            return;
        }

        let monsterCfg = cfg.MonsterConfigs.get(Load<MonsterType>(obj.smart_id, "MW_MonsterType", undefined));
        if (monsterCfg == undefined){
            Log(`"NO monsterCfg!"`)
        }

        let squadSize = math.random(monsterCfg.squad_size_min, monsterCfg.squad_size_max);
        for(let i = 0; i < squadSize;){
            let locCfg = cfg.LocationConfigs[level.name()];
            let enemyLvl = math.max(locCfg.level || 1, this.Player.Level - 3);

            if (IsPctRolled(cfg.EnemyHigherLevelChance))
                enemyLvl++;

            let rank = MonsterRank.Common;

            if (IsPctRolled(cfg.EnemyEliteChance)) rank = MonsterRank.Elite;
            else if (IsPctRolled(cfg.EnemyBossChance)) rank = MonsterRank.Boss;

            let section = monsterCfg.common_section;
            if (rank == MonsterRank.Elite) section = monsterCfg.elite_section || section;
            else if (rank == MonsterRank.Boss) section = monsterCfg.boss_section || section;

            Log(`Pre spawn ${obj.smart_id} ${section}`)
            let monsterId = defaultFunction(obj, section, pos, lvid, gvid);
            if (monsterId == undefined){
                Log(`NO monster!`)
                continue;
            }
            Log(`Post spawn ${obj.smart_id} ${monsterId}`)

            Save(monsterId, "MW_SpawnParams", {
                level: enemyLvl,
                rank: rank,
                hpMult: monsterCfg.hp_mult || 1,
                xpMult: monsterCfg.xp_mult || 1,
                damageMult: monsterCfg.damage_mult || 1
            });
            i++;
        }
    }

    public OnPlayerHit(attackerGO: game_object) {
        if (!attackerGO.is_monster() || !attackerGO.is_stalker())
            return;

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

        let obj = level.object_by_id(shit.weapon_id);
        if (!obj.is_weapon()) 
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

        actor_menu.set_msg(1, `EXP +${monster.XPReward} for ${monster.GO.name()}`, 3, GetARGB(255, 20, 240, 20))
        this.Player.CurrentXP += monster.XPReward;

        if (IsPctRolled(cfg.EnemyDropChance)){
            this.GenerateDrop(monster)
        }
    }

    GenerateDrop(monster: MWMonster) {

        let typedSections = ini_sys.r_list("mw_drops_by_weapon_type", "sections");
        let selectedTypeSection = RandomFromArray(typedSections);

        let weaponCount = ini_sys.line_count(selectedTypeSection);
        let [_, weaponBaseSection] = ini_sys.r_line_ex(selectedTypeSection, math.random(0, weaponCount - 1))
        let weaponVariants = ini_sys.r_list(weaponBaseSection, "variants")
        let selectedVariant = RandomFromArray(weaponVariants)

        let sgo = alife_create_item(selectedVariant, db.actor);
        Log(`Dropping loot ${sgo.section_name()}:${sgo.id}`)
        let dropLevel = monster.Level;
        if (IsPctRolled(cfg.HigherLevelDropChancePct)){
            dropLevel++;
        }
            
        let qualityLevel = 1;
        for(let i = 0; i < cfg.QualityDropChance.length; i++){
            if (IsPctRolled(cfg.QualityDropChance[i][0])){
                qualityLevel = cfg.QualityDropChance[i][1]
            }
        }
    
        if (monster.Rank == MonsterRank.Elite){
            dropLevel++;
            qualityLevel++;
        }
        else if (monster.Rank == MonsterRank.Boss){
            dropLevel += 2;
            qualityLevel += 2;
        }
    
        this.weaponDrops.set(sgo.id, {level: dropLevel, quality: qualityLevel})
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


// //Log(`Setup configs for smart: ${smart.name()}`)

// if (math.random(1, 100) > 60){
//     smart.respawn_params = {
//         "spawn_section_1": {
//             num: NumberToCondList(3), 
//             squads: ["simulation_dog"]
//         },
//     }
// }
// else {
//     smart.respawn_params = {
//         "spawn_section_1": {
//             num: NumberToCondList(3), 
//             squads: ["simulation_pseudodog", "simulation_mix_dogs"]
//         }
//     } 
// }

// smart.already_spawned = {"spawn_section_1": {num: 0}, "spawn_section_2": {num: 0}}