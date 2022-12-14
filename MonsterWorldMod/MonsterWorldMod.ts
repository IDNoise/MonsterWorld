import { Log, StalkerModBase } from '../StalkerModBase';
import { DropType } from './Configs/Loot';
import { StatType } from './Configs/Stats';
import { CriticalBones } from './Constants/CritBones';
import { ReloadAnims } from './Constants/WeaponAnimations';
import { ItemSpawnParams } from './GameObjects/MWItem';
import { CreateWorldPositionAtGO, Save } from './Helpers/StalkerAPI';
import { HitInfo, World } from './World';

export class MonsterWorldMod extends StalkerModBase {
    public World: World;

    private playerHitsThisFrame: LuaSet<Id> = new LuaSet();
    private monsterHitsThisFrame: Map<Id, HitInfo> = new Map();

    constructor(){
        super();

        StalkerModBase.ModName = "MonsterWorldMod";
        StalkerModBase.IsLogEnabled = true;

        this.World = new World(this);
        this.RegisterCallbacks();
    }

    protected override OnSaveState(data: { [key: string]: any; }): void {
        super.OnSaveState(data);
        this.World.Save(data);
    }

    protected OnLoadState(data: { [key: string]: any; }): void {
        super.OnLoadState(data);
        this.World.Load(data)
    }

    protected override OnMonsterNetSpawn(monster: game_object, serverObject: cse_alife_monster_base): void {
        super.OnMonsterNetSpawn(monster, serverObject);
        this.World.GetMonster(monster);
    }

    protected override OnNpcNetSpawn(npc: game_object, serverObject: cse_alife_human_stalker): void {
        super.OnNpcNetSpawn(npc, serverObject);
        this.World.GetMonster(npc);
    }

    protected override OnItemNetSpawn(item: game_object, serverObject: cse_alife_item): void {
        super.OnItemNetSpawn(item, serverObject);
        //this.World.GetWeapon(item.id());
    }

    protected override OnItemTake(item: game_object): void {
        super.OnItemTake(item);
        this.World.OnTakeItem(item);
    }

    protected override OnItemDrop(item: game_object): void {
        super.OnItemDrop(item);
        let se_obj = alife().object(item.id());
        if (se_obj != undefined)
            alife_release(se_obj)
    }

    protected override OnItemUse(item: game_object): void {
        super.OnItemTake(item);
        this.World.OnItemUse(item);
    }

    protected override OnItemToRuck(item: game_object): void {
        super.OnItemToRuck(item);
        this.World.OnItemToRuck(item);
    }

    protected override OnItemToSlot(item: game_object): void {
        super.OnItemToSlot(item);
        this.World.OnItemToSlot(item);
    }

    protected override OnItemToBelt(item: game_object): void {
        super.OnItemToBelt(item);
        this.World.OnItemToBelt(item);
    }

    protected override OnWeaponFired(obj: game_object, wpn: game_object, ammo_elapsed: number): void {
        super.OnWeaponFired(obj, wpn, ammo_elapsed)
        if(obj.id() == 0){
            this.World.OnWeaponFired(wpn, ammo_elapsed)
        }
    }

    protected override OnHudAnimationPlay(item: game_object, anim_table: AnimationTable): void {
        super.OnHudAnimationPlay(item, anim_table);

        let weapon = this.World.GetWeapon(item)
        if (weapon == undefined)
            return;

        weapon.IsInIdleAnimation = anim_table.anm_name.includes("idle");
        if (ReloadAnims.includes(anim_table.anm_name))
            weapon.OnReloadStart(anim_table)
    }

    protected override OnHudAnimationEnd(item: game_object, section: string, motion: any, state: any, slot: any): void {
        super.OnHudAnimationEnd(item, section, motion, state, slot)

        let weapon = this.World.GetWeapon(item)
        if (weapon == undefined)
            return;

        if (ReloadAnims.includes(motion)){
            weapon.OnReloadEnd()
        }
    }

    protected override OnBeforeKeyPress(key: DIK_keys, bind: key_bindings, dis: boolean): boolean {
        if (bind == key_bindings.kWPN_RELOAD){
            let weapon = this.World.Player.ActiveWeapon;
            let weaponGO = weapon?.GO.cast_Weapon();
            if (weapon != undefined && weaponGO != undefined && weapon.IsInIdleAnimation)
            {
                let ammoElapsed = weaponGO.GetAmmoElapsed();
                if (ammoElapsed > weapon.GetStatBase(StatType.MagSize) && ammoElapsed < weapon.MagSize){
                    weaponGO.SetAmmoElapsed(0);
                    this.World.Player.GO.reload_weapon()
                    return false;
                }
            }
        }

        return super.OnBeforeKeyPress(key, bind, dis)
    }

    // protected override OnItemFocusReceive(item: game_object): void {
    //     super.OnItemFocusReceive(item);
    //     //this.world.GetWeapon(item.id());
    // }

    protected override OnNpcNetDestroy(npc: game_object): void {
        super.OnNpcNetDestroy(npc)
        this.OnMonsterNetDestroy(npc);
    }

    protected override OnMonsterNetDestroy(monster: game_object): void {
        super.OnMonsterNetDestroy(monster)
        this.World?.DestroyObject(monster.id());
    }

    protected override OnServerEntityUnregister(serverObject: cse_alife_object, type: ServerObjectType): void {
        super.OnServerEntityUnregister(serverObject, type)
        this.World?.DestroyObject(serverObject.id);
    }

    protected override OnActorFirstUpdate(): void {
        super.OnActorFirstUpdate();
        this.World.OnPlayerSpawned();
    }

    protected override OnUpdate(deltaTime: number): void {
        super.OnUpdate(deltaTime);
        this.World.Update(deltaTime);

        if (this.monsterHitsThisFrame.size > 0){
            this.World.OnMonstersHit(this.monsterHitsThisFrame);
            this.monsterHitsThisFrame = new Map();
        }

        this.playerHitsThisFrame = new LuaSet();
    }

    protected override OnActorBeforeHit(shit: hit, boneId: BoneId): boolean {
        super.OnActorBeforeHit(shit, boneId);   
        
        if (!this.CanHitPlayer(shit.draftsman.id())) 
            return false;

        this.World.OnPlayerHit(shit, boneId);  

        shit.power = 0;
        shit.impulse = 0;
        return true; 
    }

    protected override OnSimulationFillStartPosition(): void {
        super.OnSimulationFillStartPosition();
        this.World.SpawnManager.FillStartPositions();
    }

    protected override OnSmartTerrainTryRespawn(smart: SmartTerrain): boolean {
        super.OnSmartTerrainTryRespawn(smart)
        return this.World.SpawnManager.OnTryRespawn(smart);
    }

    protected override OnMonsterBeforeHit(monsterGO: game_object, shit: hit, boneId: BoneId): boolean {
        super.OnMonsterBeforeHit(monsterGO, shit, boneId);

        if (monsterGO.health <= 0 || shit.draftsman.id() != 0)// || (shit.type != HitType.fire_wound && shit.type != HitType.wound))
            return false;

        let monster = this.World.GetMonster(monsterGO)
        if (monster == undefined) 
            return false;

        let weapon = this.World.GetWeapon(shit.weapon_id)
        if (weapon == undefined)
            return false;

        let isCritPartHit = CriticalBones[monster.MonsterType].includes(boneId)
        let hitInfo = {monster: monster, weapon: weapon, isCritPartHit: isCritPartHit};
        let currentHitInfo = this.monsterHitsThisFrame.get(monster.id);
        if (currentHitInfo != undefined){
            hitInfo.isCritPartHit ||= currentHitInfo.isCritPartHit;
        }
        this.monsterHitsThisFrame.set(monster.id, hitInfo);

        shit.power = 0;
        return true;
    }

    protected override OnNPCBeforeHit(npc: game_object, shit: hit, boneId: number): boolean {
        super.OnNPCBeforeHit(npc, shit, boneId)
        return this.OnMonsterBeforeHit(npc, shit, boneId);
    }

    private debugDropQuality: number = 1;
    protected override OnKeyRelease(key: DIK_keys): void {
        super.OnKeyRelease(key)

        let noTest = false;//true;
        if (noTest) 
            return;

        if (key == DIK_keys.DIK_DELETE) {
            this.World.Player.SkillPoints += 1000;
        }

        if (key == DIK_keys.DIK_1) { this.debugDropQuality = 1; }
        if (key == DIK_keys.DIK_2) { this.debugDropQuality = 2; }
        if (key == DIK_keys.DIK_3) { this.debugDropQuality = 3; }
        if (key == DIK_keys.DIK_4) { this.debugDropQuality = 4; }
        if (key == DIK_keys.DIK_5) { this.debugDropQuality = 5; }


        let item: cse_alife_object | undefined = undefined;
        let dropLevel = math.random(1, 30);
        let qualityLevel = this.debugDropQuality;
        let itemType: DropType = DropType.Weapon;
        if (key == DIK_keys.DIK_UP) {
            item = this.World.GenerateWeaponDrop(dropLevel, qualityLevel, CreateWorldPositionAtGO(db.actor));
            itemType = DropType.Weapon;
        }
        else if (key == DIK_keys.DIK_DOWN) {
            item = this.World.GenerateStimpackDrop(dropLevel, qualityLevel, CreateWorldPositionAtGO(db.actor));
            itemType = DropType.Stimpack;
        }
        else if (key == DIK_keys.DIK_RIGHT) {
            item = this.World.GenerateArmorDrop(dropLevel, qualityLevel, CreateWorldPositionAtGO(db.actor));
            itemType = DropType.Armor;
        }
        else if (key == DIK_keys.DIK_LEFT) {
            item = this.World.GenerateArtefactDrop(dropLevel, qualityLevel, CreateWorldPositionAtGO(db.actor));
            itemType = DropType.Artefact;
        }
        if (item != null){ 
            Save<ItemSpawnParams>(item.id, "MW_SpawnParams", {Level: dropLevel, Quality: qualityLevel});
            this.World.HighlightDroppedItem(item.id, itemType, qualityLevel) 
        }
    }

    // protected override OnMonsterDeath(monster: game_object, killer: game_object): void {
    //     super.OnMonsterDeath(monster, killer)
    //     if (killer.id() != 0)
    //         return;

    //     this.World.OnMonsterKilled(monster)
    // }

    CanHitPlayer(attackerId: Id): boolean {
        if (this.playerHitsThisFrame.has(attackerId))
            return false;

        this.playerHitsThisFrame.add(attackerId);
        return true;
    }

    GetMCMConfig(): MCMMainGroup {
        return this.World.MCM.GetConfig();
    }
}

export let MOD : MonsterWorldMod;

export function StartMonsterWorld(){
    if (MOD != undefined)
        return;
        
    MOD = new MonsterWorldMod();
}

export function GetMCMConfig(){
    StartMonsterWorld()
    return MOD.GetMCMConfig();
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