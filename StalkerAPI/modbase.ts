export class ModScriptBase {
    private modName: string;
    private logEnabled: boolean;

    constructor(modName: string){
        this.modName = modName;
        this.logEnabled = true;
        this.RegisterCallbacks();
    }

    //Actor
    protected OnActorFirstUpdate() : void {
        this.Log("OnActorFirstUpdate")
    }
    protected OnActorUpdate() : void {
        //this.Log("OnActorUpdate")
    }
    protected OnActorBeforeHit(shit: hit, boneId: number): boolean {
        this.Log(`OnActorBeforeHit by ${shit.draftsman && shit.draftsman.id()} with type: ${shit.type} and power: ${shit.power} from weapon_id: ${shit.weapon_id || "None"}`)
        return true;
    }
    protected OnActorHit(amount: number, localDirection: vector, attacker: game_object, boneId: number): void {
        this.Log(`OnActorHit by ${attacker.id()} for ${amount} in bone ${boneId}`)
    }

    //Monster
    protected OnMonsterBeforeHit(monster: game_object, shit: hit, boneId: number): boolean {
        const weapon = level.object_by_id(shit.weapon_id);
        this.Log(`OnMonsterBeforeHit ${monster.id()} by ${shit.draftsman.id()} with ${weapon && weapon.id() || "'no weapon'"} for ${shit.power} in bone ${boneId}`)
        return true;
    }
    protected OnMonsterHit(monster: game_object, amount: number, localDirection: vector, attacker: game_object, boneId: number): void {
        this.Log(`OnMonsterHit ${monster.id()} by ${attacker.id()} for ${amount} in bone ${boneId}`)
    }
    protected OnMonsterDeath(monster: game_object, killer: game_object): void {
        this.Log(`OnMonsterDeath ${monster.id()} by ${killer.id()}`)
    }
    protected OnMonsterActorUse(monster: game_object, user: game_object): void {
        this.Log(`OnMonsterActorUse ${monster.id()} by ${user.id()}`)
    }
    protected OnMonsterLootInit(monster: game_object, lootTable: LuaMap<string, LuaMap<string, number>>): void {
        this.Log(`OnMonsterLootInit ${monster.id()}`)
    }

    //NPC
    protected OnNPCBeforeHit(npc: game_object, shit: hit, boneId: number): boolean {
        this.Log(`OnNPCBeforeHit ${npc.id()} by ${shit.draftsman.id()} for ${shit.power} in bone ${boneId}`)
        return true;
    }
    protected OnNPCHit(npc: game_object, amount: number, localDirection: vector, attacker: game_object, boneId: number): void {
        this.Log(`OnNPCHit ${npc.id()} by ${attacker.id()} for ${amount} in bone ${boneId}`)
    }
    protected OnNPCDeath(npc: game_object, killer: game_object): void {
        this.Log(`OnNPCDeath ${npc.id()} by ${killer.id()}`)
    }

    //Simulation
    protected OnSimulationFillStartPosition(): void{
        this.Log(`OnSimulationFillStartPosition`)
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
        RegisterScriptCallback("monster_on_before_hit",  (monster, shit, boneId, flags : CallbackReturnFlags) => {
            flags.ret_value = this.OnMonsterBeforeHit(monster, shit, boneId);
        });
        RegisterScriptCallback("monster_on_hit_callback",  (monster, amount, localDirection, attacker, boneId) => this.OnMonsterHit(monster, amount, localDirection, attacker, boneId));
        RegisterScriptCallback("monster_on_death_callback",  (monster, killer) => this.OnMonsterDeath(monster, killer));
        RegisterScriptCallback("monster_on_actor_use_callback",  (monster, actor) => this.OnMonsterActorUse(monster, actor))
        RegisterScriptCallback("monster_on_loot_init", (monster, lootTable) => this.OnMonsterLootInit(monster, lootTable));

        //NPC
        RegisterScriptCallback("npc_on_before_hit",  (npc, shit, boneId, flags : CallbackReturnFlags) => { 
            flags.ret_value = this.OnNPCBeforeHit(npc, shit, boneId)
        });
        RegisterScriptCallback("npc_on_hit_callback",  (npc, amount, localDirection, attacker, boneId) => this.OnNPCHit(npc, amount, localDirection, attacker, boneId));
        RegisterScriptCallback("npc_on_death_callback",  (npc, killer) => this.OnNPCDeath(npc, killer));

        //Simulation
        RegisterScriptCallback("fill_start_position", () => this.OnSimulationFillStartPosition())

    }

    public Log(message: string) {
        if ( !this.logEnabled ) 
            return;
        log(`[${this.modName}:${time_global()}] ${message}`);
    }
}