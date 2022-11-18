export type SmartTerrain = smart_terrain.se_smart_terrain

type LootTableEntryParams = {count?: number}
type LootTable = {[key: string]: LootTableEntryParams}

export class ModScriptBase {
    private logEnabled: boolean;

    constructor(public modName: string){
        this.logEnabled = true;
        this.RegisterCallbacks();
    }

    public Log(message: string) {
        if ( !this.logEnabled ) 
            return;
        log(`[${this.modName}:${time_global()}] ${message}`);
    }

    //Player
    protected OnActorFirstUpdate() : void {
        this.Log("OnActorFirstUpdate")
    }
    protected OnActorUpdate() : void {
        //this.Log("OnActorUpdate")
    }
    protected OnActorBeforeHit(shit: hit, boneId: BoneId): boolean {
        this.Log(`OnActorBeforeHit by ${shit.draftsman && shit.draftsman.section()}:${shit.draftsman && shit.draftsman.id()} with type: ${shit.type} and power: ${shit.power} from weapon_id: ${shit.weapon_id || "None"}`)
        return true;
    }
    protected OnActorHit(amount: number, localDirection: vector, attacker: game_object, boneId: BoneId): void {
        this.Log(`OnActorHit by ${attacker.section()}:${attacker.id()} for ${amount} in bone ${boneId}`)
    }

    //Monster
    protected OnMonsterNetSpawn(monster: game_object, serverObject: cse_alife_monster_base): void {
        this.Log(`OnMonsterNetSpawn ${monster.section()}:${monster.id()} by ${serverObject.id}`)
    }
    protected OnMonsterNetDestroy(monster: game_object): void {
        this.Log(`OnMonsterNetDestroy ${monster.section()}:${monster.id()}`)
    }
    protected OnMonsterBeforeHit(monster: game_object, shit: hit, boneId: BoneId): boolean {
        const weapon = level.object_by_id(shit.weapon_id);
        this.Log(`OnMonsterBeforeHit ${monster.section()}:${monster.id()} by ${shit.draftsman && shit.draftsman.section()}:${shit.draftsman.id()} with ${weapon && weapon.id() || "'no weapon'"} for ${shit.power} in bone ${boneId}`)
        return true;
    }
    protected OnMonsterHit(monster: game_object, amount: number, localDirection: vector, attacker: game_object, boneId: BoneId): void {
        this.Log(`OnMonsterHit ${monster.section()}:${monster.id()} by ${attacker.section()}:${attacker.id()} for ${amount} in bone ${boneId}`)
    }
    protected OnMonsterDeath(monster: game_object, killer: game_object): void {
        this.Log(`OnMonsterDeath ${monster.section()}:${monster.id()} by ${killer.section()}:${killer.id()}`)
    }
    protected OnMonsterActorUse(monster: game_object, user: game_object): void {
        this.Log(`OnMonsterActorUse ${monster.section()}:${monster.id()} by ${user.section()}:${user.id()}`)
    }
    protected OnMonsterLootInit(monster: game_object, lootTable: LootTable): void {
        this.Log(`OnMonsterLootInit ${monster.section()}:${monster.id()}`)
    }

    //NPC
    protected OnNpcNetSpawn(npc: game_object, serverObject: cse_alife_creature_actor): void {
        this.Log(`OnNpcNetSpawn ${npc.section()}:${npc.id()} by ${serverObject.id}`)
    }
    protected OnNpcNetDestroy(npc: game_object): void {
        this.Log(`OnNpcNetDestroy ${npc.section()}:${npc.id()}`)
    }
    protected OnNPCBeforeHit(npc: game_object, shit: hit, boneId: BoneId): boolean {
        this.Log(`OnNPCBeforeHit ${npc.section()}:${npc.id()} by ${shit.draftsman && shit.draftsman.section()}:${shit.draftsman.id()} for ${shit.power} in bone ${boneId}`)
        return true;
    }
    protected OnNPCHit(npc: game_object, amount: number, localDirection: vector, attacker: game_object, boneId: BoneId): void {
        this.Log(`OnNPCHit ${npc.section()}:${npc.id()} by ${attacker.section()}:${attacker.id()} for ${amount} in bone ${boneId}`)
    }
    protected OnNPCDeath(npc: game_object, killer: game_object): void {
        this.Log(`OnNPCDeath ${npc.section()}:${npc.id()} by ${killer.section()}:${killer.id()}`)
    }

    //Simulation
    protected OnSimulationFillStartPosition(): void{
        this.Log(`OnSimulationFillStartPosition`)
    }
    protected OnSmartTerrainTryRespawn(smart: SmartTerrain) : boolean{
        this.Log(`OnSmartTerrainTryRespawn ${smart.name()}`)
        return true;
    }

    //Server objects
    protected OnServerEntityRegister(serverObject: cse_alife_object, type: ServerObjectType): void{
        this.Log(`OnServerEntityRegister ${type} - ${serverObject.section_name()}:${serverObject.id} ${serverObject.name()}`)
    }
    protected OnServerEntityUnregister(serverObject: cse_alife_object, type: ServerObjectType): void{
        this.Log(`OnServerEntityUnregister ${type} - ${serverObject.section_name()}:${serverObject.id} ${serverObject.name()}`)
    }

    private RegisterCallbacks():void{
        this.Log("Register callbacks");

        //Actor
        RegisterScriptCallback("actor_on_first_update", () => this.OnActorFirstUpdate());
        RegisterScriptCallback("actor_on_update",  () => this.OnActorUpdate());
        RegisterScriptCallback("actor_on_before_hit",  (shit, boneId, flags : CallbackReturnFlags) => {
            flags.ret_value = this.OnActorBeforeHit(shit, boneId)
        });
        RegisterScriptCallback("actor_on_hit_callback",  (amount, localDirection, attacker, boneId) => this.OnActorHit(amount, localDirection, attacker, boneId));
        
        //Monster

        RegisterScriptCallback("monster_on_net_spawn",  (monster, serverObject) => this.OnMonsterNetSpawn(monster, serverObject));
        RegisterScriptCallback("monster_on_net_destroy",  (monster) => this.OnMonsterNetDestroy(monster));
        RegisterScriptCallback("monster_on_before_hit",  (monster, shit, boneId, flags : CallbackReturnFlags) => {
            flags.ret_value = this.OnMonsterBeforeHit(monster, shit, boneId);
        });
        RegisterScriptCallback("monster_on_hit_callback",  (monster, amount, localDirection, attacker, boneId) => this.OnMonsterHit(monster, amount, localDirection, attacker, boneId));
        RegisterScriptCallback("monster_on_death_callback",  (monster, killer) => this.OnMonsterDeath(monster, killer));
        RegisterScriptCallback("monster_on_actor_use_callback",  (monster, actor) => this.OnMonsterActorUse(monster, actor))
        RegisterScriptCallback("monster_on_loot_init", (monster, lootTable) => this.OnMonsterLootInit(monster, lootTable));

        //NPC
        RegisterScriptCallback("npc_on_net_spawn",  (npc, serverObject) => this.OnNpcNetSpawn(npc, serverObject));
        RegisterScriptCallback("npc_on_net_destroy",  (npc) => this.OnNpcNetDestroy(npc));
        RegisterScriptCallback("npc_on_before_hit",  (npc, shit, boneId, flags : CallbackReturnFlags) => { 
            flags.ret_value = this.OnNPCBeforeHit(npc, shit, boneId)
        });
        RegisterScriptCallback("npc_on_hit_callback",  (npc, amount, localDirection, attacker, boneId) => this.OnNPCHit(npc, amount, localDirection, attacker, boneId));
        RegisterScriptCallback("npc_on_death_callback",  (npc, killer) => this.OnNPCDeath(npc, killer));

        //Simulation
        RegisterScriptCallback("fill_start_position", () => this.OnSimulationFillStartPosition())
        RegisterScriptCallback("on_try_respawn", (smart, flags: CallbackReturnFlags) => {
            flags.disabled = !this.OnSmartTerrainTryRespawn(smart);
        });

        //Server objects
        RegisterScriptCallback("server_entity_on_register", (serverObject, type) => this.OnServerEntityRegister(serverObject, type));
        RegisterScriptCallback("server_entity_on_unregister", (serverObject, type) => this.OnServerEntityUnregister(serverObject, type));
    }
}