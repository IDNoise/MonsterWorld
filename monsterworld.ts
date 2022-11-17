import { CreateVector } from './StalkerAPI/extensions/basic';
import { ModScriptBase } from './StalkerAPI/modbase';

class MonsterWorld extends ModScriptBase{
    private lastEnemySpawnTime: number = 0;

    constructor(){
        super("MonsterWorld");

        item_knife.is_equipped = () => true;
        item_knife.get_condition = () => 1;
        item_knife.degradate = () => {};
        item_knife.can_loot = (monster) => true;
        item_knife.is_axe = () => false;

        const oldCreateNpc = sim_squad_scripted.sim_squad_scripted.create_npc;
        sim_squad_scripted.sim_squad_scripted.create_npc = (spawn_smart : smart_terrain.se_smart_terrain, pos: vector, lvid:LevelVertexId, gvid:GameVertexId) => {
            this.Log(`sim_squad_scripted.create_npc from ${spawn_smart && spawn_smart.id || "not smart"}. lvid: ${lvid || spawn_smart.m_level_vertex_id}, gvid: ${gvid || spawn_smart.m_game_vertex_id}`);
            //oldCreateNpc(...args);

            // if (!simulation_objects.is_on_the_actor_level(spawn_smart)){
            //     this.Log("wrong level " + spawn_smart.m_level_vertex_id)
            //     return;
            // }

            // if(spawn_smart != null){
            //     this.Log("here")
            //     alife_create("sim_default_zombied_1", spawn_smart);
            //     this.Log("there")
            // }
            // else {
            //     //alife_create("sim_default_zombied_1", pos, lvid, gvid);
            // }
        };
    }

    protected OnActorFirstUpdate(): void {
        super.OnActorFirstUpdate();
    }

    protected OnActorBeforeHit(hit: hit, boneId: number): boolean {
        super.OnActorBeforeHit(hit, boneId);        
        return false;
    }

    protected OnActorUpdate(): void {
        super.OnActorUpdate();

        if (time_global() < this.lastEnemySpawnTime + 5000)
            return;

        this.lastEnemySpawnTime = time_global();

        let spawned = null;
        let section = null;
        let rand = math.random(1, 100);
        if (rand < 10){ section = "sim_default_zombied_1"; }
        else if (rand < 20){ section = "flesh_01a_normal"; }
        else if (rand < 30) { section = "pseudodog_grey_strong"; }
        else if (rand < 40) { section = "bibliotekar_strong"; }
        else if (rand < 50) { section = "lurker_3_weak"; }
        else if (rand < 60) { section = "chimera_strong4"; }

        if (section != null){
            let pos = db.actor.position().add(CreateVector(math.random(-50, 50), 3, math.random(-50, 50)));
            spawned = alife_create(section, pos, db.actor.level_vertex_id(), db.actor.game_vertex_id())
            if (spawned != null){
                spawned.scripted_target = "actor";
                spawned.rush_to_target = true;
            }   
        }
    }

    protected OnSimulationFillStartPosition(): void {
        super.OnSimulationFillStartPosition();
        //SIMBOARD.start_position_filled = true;
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