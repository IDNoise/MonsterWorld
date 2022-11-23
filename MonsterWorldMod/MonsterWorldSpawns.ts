import { IsPctRolled, Load, NumberToCondList, RandomFromArray, Save } from '../StalkerAPI/extensions/basic';
import { Log } from '../StalkerModBase';
import * as cfg from './MonsterWorldConfig';
import { MonsterWorldMod } from './MonsterWorldMod';
import { MWMonster } from './MWMonster';
import { MWPlayer } from './MWPlayer';
import { MWWeapon } from './MWWeapon';
import { MonsterConfig, LevelType, MonsterType, MonsterRank } from './MonsterWorldConfig';
import { MonsterWorld } from './MonsterWorld';

export class MonsterWorldSpawns {
    private safeSmarts: LuaSet<Id>

    constructor(public world: MonsterWorld) {
        this.safeSmarts = new LuaSet();

        const oldSimSquadAddSquadMember = sim_squad_scripted.sim_squad_scripted.add_squad_member;
        const newSimSquadAddSquadMember = (obj: any, section: string, pos: vector, lvid: number, gvid: number) => {
            return this.OnSimSquadAddMember(obj, section, pos, lvid, gvid, oldSimSquadAddSquadMember);
        };
        sim_squad_scripted.sim_squad_scripted.add_squad_member = newSimSquadAddSquadMember;
    }

    Save(data: { [key: string]: any; }) {
        data.safeSmarts = this.safeSmarts;
    }
    Load(data: { [key: string]: any; }) {
        this.safeSmarts = data.safeSmarts || new LuaSet();
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

                if (squad_section.includes("trader") || squad_section.includes("mechanic") || squad_section.includes("barman")){
                    //this.safeSmarts.add(smart.id);
                    continue;
                }

                continue;
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

        //Log(`Trying to spawn for: ${smart.name()}`)
        let respawnInterval = 600;
        let maxPopulation = 5;
        if (!Load(smart.id, "MW_Initialized", false) || smart.respawn_idle != respawnInterval || smart.max_population != maxPopulation){
            if (Load(smart.id, "MW_Initialized", false)){
                //Log(`Initialized: ${smart.name()} was initialized but reset`)
            }
            smart.respawn_idle = respawnInterval;
            smart.max_population = maxPopulation;

            //Log(`Level name: ${level.name()}`)
            let locationCfg = cfg.LocationConfigs[level.name()];
            if (!locationCfg)
                return false;

            let selectedMonsters: MonsterType[] = [];
            for(const [monsterType, monsterCfg] of cfg.MonsterConfigs){
                //Log(`Level check: ${monsterCfg.level_start} > ${locationCfg.level} = ${(monsterCfg.level_start > locationCfg.level)}`)
                if (monsterCfg.level_start > locationCfg.level)
                    continue;
                //Log(`LevelType check: ${monsterCfg.level_type} & ${locationCfg.type} = ${(monsterCfg.level_type & locationCfg.type)}`)
                if ((monsterCfg.level_type & locationCfg.type) != locationCfg.type)
                    continue;
                selectedMonsters.push(monsterType);
            }

            Save(smart.id, "MW_MonsterTypes", selectedMonsters);
            //Log(`Selected monster: ${selectedMonsterType} (from ${selectedMonsters.length}) for ${smart.id}`)
            smart.respawn_params = {
                "spawn_section_1": {
                    num: NumberToCondList(2),
                    squads: ["simulation_monster_world"]
                },
            }
            smart.already_spawned = {"spawn_section_1": {num: 0}}
            smart.faction = "monster";
            smart.respawn_radius = 125;

            //Log(`Initialized: ${smart.name()}`)
            Save(smart.id, "MW_Initialized", true);
        }

        //Log(`Spawning for: ${smart.name()}`)

        return true;
    }

    public OnSimSquadAddMember(obj: any, section: string, pos: vector, lvid: number, gvid: number, defaultFunction: (...args: any[]) => Id | undefined): Id | undefined {
        //Log(`OnSimSquadAddMember: ${section} ${type(obj)}`)
        if (section != "dog_normal_red"){
            Log(`SPAWN PROBLEM Wrong section ${section}`)
            return;
        }

        if(!obj.smart_id){
            Log(`SPAWN PROBLEM  NO SMART!`)
            return;
        }

        let monsterTypes = Load<MonsterType[]>(obj.smart_id, "MW_MonsterTypes");
        let monsterType = RandomFromArray(monsterTypes);
        let monsterCfg = cfg.MonsterConfigs.get(monsterType);
        if (monsterCfg == undefined){
            Log(`SPAWN PROBLEM  NO monsterCfg! ${monsterType}`)
        }

        let squadSize = math.random(monsterCfg.squad_size_min, monsterCfg.squad_size_max);
        let isBossSpawned = false;
        let elitesSpawned = 0;

        let locCfg = cfg.LocationConfigs[level.name()];
        let locLevel = locCfg.level || 1;

        if (locLevel < 10){
            squadSize *= 0.5 + 0.05 * locLevel
        }

        for(let i = 0; i < squadSize;){
            
            let enemyLvl = math.max(locLevel, this.world.Player.Level - 3);

            if (IsPctRolled(cfg.EnemyHigherLevelChance))
                enemyLvl++;

            let rank = MonsterRank.Common;

            if (!isBossSpawned && IsPctRolled(cfg.EnemyEliteChance)) {
                elitesSpawned++;
                rank = MonsterRank.Elite;
            }
            else if (!isBossSpawned && elitesSpawned == 0 && IsPctRolled(cfg.EnemyBossChance)) {
                isBossSpawned = true
                rank = MonsterRank.Boss;
            }

            let section = monsterCfg.common_section;
            if (rank == MonsterRank.Elite) section = monsterCfg.elite_section;
            else if (rank == MonsterRank.Boss) section = monsterCfg.boss_section;

            let monsterId = defaultFunction(obj, section, pos, lvid, gvid);
            if (monsterId == undefined){
                Log(`SPAWN PROBLEM  NO monster!`)
                continue;
            }

            Save(monsterId, "MW_SpawnParams", {
                type: monsterType,
                level: enemyLvl,
                rank: rank
            });
            i++;
        }
    }
}