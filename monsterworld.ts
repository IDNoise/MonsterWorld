import { ModScriptBase, SmartTerrain } from './modbase';
import { EnableMutantLootingWithoutKnife } from './StalkerAPI/extensions/basic';

class MonsterWorld extends ModScriptBase{
    private lastEnemySpawnTime: number = 0;
    private safeSmarts: Id[] = [];

    constructor(){
        super("MonsterWorld");
    }

    protected override OnSaveState(data: { [key: string]: any; }): void {
        super.OnSaveState(data);
        data.safeSmarts = this.safeSmarts;
    }

    protected OnLoadState(data: { [key: string]: any; }): void {
        super.OnLoadState(data);
        this.safeSmarts = data.safeSmarts || [];
    }

    protected OnActorFirstUpdate(): void {
        super.OnActorFirstUpdate();
        EnableMutantLootingWithoutKnife();
    }

    protected OnActorBeforeHit(hit: hit, boneId: BoneId): boolean {
        super.OnActorBeforeHit(hit, boneId);        
        return false;
    }

    protected OnSimulationFillStartPosition(): void {
        super.OnSimulationFillStartPosition();
        callstack();

        let setting_ini = new ini_file("misc\\simulation.ltx");
        setting_ini.section_for_each((section) => {
            
            let smart = SIMBOARD.smarts_by_names[section];
            if (!smart) {
                this.Log(`sim_board:fill_start_position incorrect smart by name ${section}`)
                return false;
            }

            this.Log(`Iterating on ${section}. Smart: ${smart.id} ${smart.name()}`)

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
                
                this.Log(`     ${line + 1}/${lineCount}: ${squad_section} =${count} (${common})`)

                if (common) continue;
                if (!squad_section.includes("trader") && !squad_section.includes("mechanic") && !squad_section.includes("barman")) continue;

                this.safeSmarts.push(smart.id);
                this.Log(`Added to safe smarts: ${smart.id}. safe smarts#: ${this.safeSmarts.length}`)

                for (let i = 0; i < count; i++){
                    SIMBOARD.create_squad(smart, squad_section)
                }
            }

            return false;
        });

        SIMBOARD.start_position_filled = true;
    }

    protected override OnSmartTerrainTryRespawn(smart: SmartTerrain): boolean {
        if (!smart.is_on_actor_level)
            return false;

        if (this.safeSmarts.indexOf(smart.id) >= 0) {
            //this.Log(`Smart is safe: ${smart.id} ${smart.name()}`)
            return false;
        }       

        if (smart.respawn_idle == 5)
            return true;

        //super.OnSmartTerrainTryRespawn(smart);
        this.Log(`Setup configs for smart: ${smart.name()}`)
        smart.respawn_idle = 5;
        smart.max_population = 5;

        if (math.random(1, 100) > 60){
            smart.respawn_params = {
                "spawn_section_1": {
                    num: xr_logic.parse_condlist(null, null, null, "3"), 
                    squads: ["simulation_snork"], 
                    helicopter: false
                },
                "spawn_section_2": {
                    num: xr_logic.parse_condlist(null, null, null, "3"), 
                    squads: ["simulation_snork"], 
                    helicopter: false
                }
            }
        }
        else {
            smart.respawn_params = {
                "spawn_section_1": {
                    num: xr_logic.parse_condlist(null, null, null, "10"), 
                    squads: ["simulation_pseudodog", "simulation_mix_dogs"], 
                    helicopter: false
                }
            } 
        }

        smart.already_spawned = {"spawn_section_1": {num: 0}, "spawn_section_2": {num: 0}}

        return true;
    }
}

declare var MW : MonsterWorld;

export function StartMonsterWorld(){
    MW = new MonsterWorld();
}




// protected OnMonsterDeath(monster: game_object, killer: game_object): void {
//     super.OnMonsterDeath(monster, killer);
//     const params = new LuaTable();
//     params.set("ammo", math.random(10, 100));
//     alife_create_item("ammo_357_hp_mag", db.actor, {ammo: math.random(10, 100)})
//     for (let index = 0; index < math.random(1, 20); index++) {
//         let randomOffset = CreateVector(math.random(-5, 5), math.random(-5, 5), math.random(-5, 5));
//         let point = CreateWorldPositionAtPosWithGO(monster.position().add(randomOffset), monster);
//         alife_create_item("ammo_357_hp_mag", point, {ammo: math.random(10, 1000)})
//     }
        
//     alife_create_item("ammo_357_hp_mag", CreateWorldPosition(killer), {ammo: math.random(10, 100))
// }

// protected OnMonsterLootInit(monster: game_object, lootTable: LuaMap<string, LuaMap<string, number>>): void {
//     super.OnMonsterLootInit(monster, lootTable)
    
//     const weaponSection = "wpn_ak105";
//     const params = new LuaMap<string, number>();
//     params.set("count", 1);
//     lootTable.set(weaponSection, params);

//     log(`Monster Was hitted: ${Load<number>(monster, "hitted", 0)} times`)
// }

// protected OnMonsterBeforeHit(monster: game_object, shit: hit, boneId: number): boolean{
//     super.OnMonsterBeforeHit(monster, shit, boneId);
//     // Save(monster, "hitted", Load<number>(monster, "hitted", 0) + 1)
//     return true;
// } 

// protected OnNPCBeforeHit(npc: game_object, shit: hit, boneId: number): boolean {
//     super.OnNPCBeforeHit(npc, shit, boneId)

//     let shitX = new hit(shit)
//     let shitY = new hit()
//     return true;
// }

// protected OnActorUpdate(): void {
//     super.OnActorUpdate();

//     if (time_global() < this.lastEnemySpawnTime + 5000)
//         return;

//     this.lastEnemySpawnTime = time_global();

//     let spawned = null;
//     let section = null;
//     let rand = math.random(1, 100);
//     if (rand < 10){ section = "sim_default_zombied_1"; }
//     else if (rand < 20){ section = "flesh_01a_normal"; }
//     else if (rand < 30) { section = "pseudodog_grey_strong"; }
//     else if (rand < 40) { section = "bibliotekar_strong"; }
//     else if (rand < 50) { section = "lurker_3_weak"; }
//     else if (rand < 60) { section = "chimera_strong4"; }

//     if (section != null){
//         let pos = db.actor.position().add(CreateVector(math.random(-50, 50), 3, math.random(-50, 50)));
//         spawned = alife_create(section, pos, db.actor.level_vertex_id(), db.actor.game_vertex_id())
//         if (spawned != null){
//             spawned.scripted_target = "actor";
//             spawned.assigned_target_id = 0;
//             spawned.current_target_id = 0;
//             spawned.rush_to_target = true;
//         }   
//     }
// }

// protected OnMonsterLootInit(monster: game_object, lootTable: LootTable): void {
//     super.OnMonsterLootInit(monster, lootTable)
    
//     lootTable["wpn_ak105"] = {count: 1};

//     log(`Monster Was hitted: ${Load<number>(monster, "hitted", 0)} times`)
// }

// alife_create("sim_default_zombied_1", spawn_smart);

// const oldCreateNpc = sim_squad_scripted.sim_squad_scripted.create_npc;
        // sim_squad_scripted.sim_squad_scripted.create_npc = (spawn_smart : smart_terrain.se_smart_terrain, pos: vector, lvid:LevelVertexId, gvid:GameVertexId) => {
        //     this.Log(`sim_squad_scripted.create_npc from ${spawn_smart && spawn_smart.name() || "not smart"}. lvid: ${lvid || spawn_smart.m_level_vertex_id}, gvid: ${gvid || spawn_smart.m_game_vertex_id}`);

        //     oldCreateNpc(spawn_smart, pos, lvid, gvid);
        // };