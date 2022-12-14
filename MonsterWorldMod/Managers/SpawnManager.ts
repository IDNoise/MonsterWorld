import { Log } from '../../StalkerModBase';
import { MonsterType, MonsterRank, AllMonsterTypes } from '../Configs/Enemies';
import { GetCurrentLocationCfg, LocationType, LocationConfigs } from '../Configs/Levels';
import { MonsterSpawnParams } from '../GameObjects/MWMonster';
import { GetRandomFromArray } from '../Helpers/Collections';
import { IsPctRolled } from '../Helpers/Random';
import { Load, Save, NumberToCondList } from '../Helpers/StalkerAPI';
import { GetEnemyParams, GetMonsterConfig, GetProgressionValue } from './MCM';

export class SpawnManager {
    private safeSmarts: LuaSet<Id>

    constructor() {
        this.safeSmarts = new LuaSet();

        const oldSimSquadAddSquadMember = sim_squad_scripted.sim_squad_scripted.add_squad_member;
        sim_squad_scripted.sim_squad_scripted.add_squad_member = (obj: any, section: string, pos: vector, lvid: number, gvid: number) => {
            return this.OnSimSquadAddMember(obj, section, pos, lvid, gvid, oldSimSquadAddSquadMember);
        };;
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
        let respawnInterval = GetEnemyParams("RespawnInterval");
        let maxPopulation = 2;
        if (!Load(smart.id, "MW_Initialized", false) || smart.respawn_idle != respawnInterval || smart.max_population != maxPopulation){
            if (Load(smart.id, "MW_Initialized", false)){
                //Log(`Initialized: ${smart.name()} was initialized but reset`)
            }
            smart.respawn_idle = respawnInterval;
            smart.max_population = maxPopulation;

            //Log(`Level name: ${level.name()}`)
            let locationCfg = GetCurrentLocationCfg();
            if (!locationCfg)
                return false;

            let selectedMonsters: MonsterType[] = [];
            let enabledMonsters: MonsterType[] = [];
            for(const monsterType of AllMonsterTypes){
                let monsterCfg = GetMonsterConfig(monsterType)

                if (monsterCfg.Enabled == false)
                    continue;
                
                enabledMonsters.push(monsterType)
                
                //Log(`Level check: ${monsterCfg.level_start} > ${locationCfg.level} = ${(monsterCfg.level_start > locationCfg.level)}`)
                if (monsterCfg.LocationLevelStart > locationCfg.Level || (monsterCfg.LocationLevelEnd != 0 && monsterCfg.LocationLevelEnd < locationCfg.Level))
                    continue;
                //Log(`LevelType check: ${monsterCfg.level_type} & ${locationCfg.type} = ${(monsterCfg.level_type & locationCfg.type)}`)
                if ((monsterCfg.LocationType & locationCfg.Type) != locationCfg.Type)
                    continue;

                selectedMonsters.push(monsterType);
            }

            if (selectedMonsters.length == 0){
                if (enabledMonsters.length > 0){
                    selectedMonsters.push(GetRandomFromArray(enabledMonsters))
                }
                else {
                    selectedMonsters.push(MonsterType.Boar)
                }
            }

            Save(smart.id, "MW_MonsterTypes", selectedMonsters);
            //Log(`Selected monster: ${selectedMonsterType} (from ${selectedMonsters.length}) for ${smart.id}`)
            smart.respawn_params = {
                "spawn_section_1": {
                    num: NumberToCondList(math.random(1, 2)),
                    squads: ["simulation_monster_world"]
                },
            }
            smart.already_spawned = {"spawn_section_1": {num: 0}}
            smart.faction = "monster";
            smart.respawn_radius = GetEnemyParams("MinDistanceFromPlayer");

            //Log(`Initialized: ${smart.name()}`)
            Save(smart.id, "MW_Initialized", true);
        }

        if (MonsterWorld.Monsters.length() > GetEnemyParams("MaxMonstersOnLocation")) //Limit amount of enemies on map
            return false;

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
        let monsterType = GetRandomFromArray(monsterTypes);
        let monsterCfg = GetMonsterConfig(monsterType);
        if (monsterCfg == undefined){
            Log(`SPAWN PROBLEM  NO monsterCfg! ${monsterType}`)
        }

        let squadSize = math.random(monsterCfg.SquadSizeMin, monsterCfg.SquadSizeMax);
        let isBossSpawned = false;
        let elitesSpawned = 0;

        let locCfg = LocationConfigs[level.name()];
        let locLevel = locCfg.Level || 1;

        if (locLevel < 5){
            squadSize *= 0.5 + 0.1 * locLevel
        }

        let playerLevel = MonsterWorld.Player.Level
        let enemyLvl = locLevel;
        if (locLevel < playerLevel){
            if (locLevel <= 5)
                enemyLvl = math.max(locLevel, playerLevel - 1);
            else if (locLevel <= 15)
                enemyLvl = math.max(locLevel, playerLevel);
            else if (locCfg.Type == LocationType.Open)
                enemyLvl = math.max(locLevel, playerLevel + 1);
            else if (locCfg.Type == LocationType.Underground)
                enemyLvl = math.max(locLevel, playerLevel + 3);
            else if (locCfg.Type == LocationType.Lab)
                enemyLvl = math.max(locLevel, playerLevel + 5);
        }

        for(let i = 0; i < squadSize;){
            let squadMemberLevel = enemyLvl;
            if (IsPctRolled(GetProgressionValue("EnemyHigherLevelChance")))
            squadMemberLevel++;

            let rank = MonsterRank.Common;

            if (!isBossSpawned && IsPctRolled(GetProgressionValue("EnemyEliteChance"))) {
                elitesSpawned++;
                rank = MonsterRank.Elite;
            }
            else if (!isBossSpawned && elitesSpawned == 0 && IsPctRolled(GetProgressionValue("EnemyBossChance"))) {
                isBossSpawned = true
                rank = MonsterRank.Boss;
            }

            let section = monsterCfg.CommonSection;
            if (rank == MonsterRank.Elite) section = monsterCfg.EliteSection;
            else if (rank == MonsterRank.Boss) section = monsterCfg.BossSection;

            let monsterId = defaultFunction(obj, section, pos, lvid, gvid);
            if (monsterId == undefined){
                Log(`SPAWN PROBLEM  NO monster!`)
                continue;
            }

            Save<MonsterSpawnParams>(monsterId, "MW_SpawnParams", {
                Type: monsterType,
                Level: squadMemberLevel,
                Rank: rank
            });
            i++;
        }
        //Log(`OnSimSquadAddMember: ${section} ${type(obj)} finished`)
    }
}