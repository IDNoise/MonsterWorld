import { EnableMutantLootingWithoutKnife } from '../StalkerAPI/extensions/basic';
import { StalkerModBase } from '../StalkerModBase';
import { MonsterWorld } from './MonsterWorld';
import { MWMonster } from './MWMonster';
import { MWPlayer } from './MWPlayer';

export class MonsterWorldMod extends StalkerModBase {
    private world: MonsterWorld;
    
    constructor(){
        super();
        StalkerModBase.ModName = "MonsterWorldMod";
        StalkerModBase.IsLogEnabled = true;
        this.world = new MonsterWorld(this);
    }

    protected override OnSaveState(data: { [key: string]: any; }): void {
        super.OnSaveState(data);
        this.world.Save(data);
    }

    protected OnLoadState(data: { [key: string]: any; }): void {
        super.OnLoadState(data);
        this.world.Load(data);
    }

    protected OnActorFirstUpdate(): void {
        super.OnActorFirstUpdate();
        EnableMutantLootingWithoutKnife();
    }

    protected OnActorBeforeHit(shit: hit, boneId: BoneId): boolean {
        super.OnActorBeforeHit(shit, boneId);   
        
        if (!this.CanHit(db.actor.id(), shit.draftsman.id())) 
            return false;

        this.world.OnPlayerHit(this.GetMWMonster(shit.draftsman));  

        shit.power = 0.0000001;
        return true; 
    }

    protected OnSimulationFillStartPosition(): void {
        super.OnSimulationFillStartPosition();
        this.world.FillStartPositions();
    }

    protected override OnSmartTerrainTryRespawn(smart: SmartTerrain): boolean {
        return this.world.OnTryRespawn(smart);
    }

    // protected override OnMonsterNetSpawn(monster: game_object, serverObject: cse_alife_monster_base): void {
    //     this.GetMWMonster(monster);
    // }

    hitsThisFrame: [Id, Id][] = [];
    lastHitFrame: number = -1;
    protected override OnMonsterBeforeHit(monster: game_object, shit: hit, boneId: number): boolean {
        super.OnMonsterBeforeHit(monster, shit, boneId);

        if (monster.health <= 0)
            return false;

        if (shit.draftsman.id() != 0) 
            return false;

        if (shit.type != HitType.fire_wound && shit.type != HitType.wound) 
            return false;

        if (!this.CanHit(monster.id(), shit.draftsman.id())) 
            return false;

        this.world.OnMonsterHit(this.GetMWMonster(monster));

        shit.power = 0.0000001;
        return true;
    }

    protected override OnMonsterDeath(monster: game_object, killer: game_object): void {
        if (killer.id() != 0)
            return;

        this.world.OnMonsterKilled(this.GetMWMonster(monster))
    }

    CanHit(target: Id, attacker: Id): boolean {
        if (this.lastHitFrame != time_global()) {
            this.hitsThisFrame = [];
            this.lastHitFrame = time_global();
        }

        if (this.hitsThisFrame.indexOf([target, attacker]) >= 0)
            return false;

        this.hitsThisFrame.push([target, attacker]);
        return true;
    }

    GetMWMonster(monster: game_object) : MWMonster {  return new MWMonster(monster); }
    GetMWPlayer() : MWPlayer {  return new MWPlayer(db.actor); }
}

export let MOD : MonsterWorldMod;

export function StartMonsterWorld(){
    MOD = new MonsterWorldMod();
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