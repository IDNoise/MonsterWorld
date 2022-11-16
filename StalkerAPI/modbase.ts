export class ModScriptBase {
    private modName: string;
    private logEnabled: boolean;

    constructor(modName: string){
        this.modName = modName;
        this.logEnabled = true;
        this.RegisterCallbacks();
    }

    protected OnActorFirstUpdate() : void {
        this.Log("OnActorFirstUpdate")
    }
    protected OnActorUpdate() : void {
        //this.Log("OnActorUpdate")
    }
    protected OnActorBeforeHit(hit: Hit, boneId: number): boolean {
        this.Log(`OnActorBeforeHit by ${hit.draftsman && hit.draftsman.id()}`)
        return true;
    }
    protected OnActorHit(amount: number, localDirection: Vector, attacker: GameObject, boneId: number): void {
        this.Log(`OnActorHit by ${attacker.id()} for ${amount} in bone ${boneId}`)
    }

    protected OnMonsterBeforeHit(monster: GameObject, hit: Hit, boneId: number): boolean {
        const weapon = level.object_by_id(hit.weapon_id);
        this.Log(`OnMonsterBeforeHit ${monster.id()} by ${hit.draftsman.id()} with ${weapon && weapon.id() || "'no weapon'"} for ${hit.power} in bone ${boneId}`)
        return true;
    }
    protected OnMonsterHit(monster: GameObject, amount: number, localDirection: Vector, attacker: GameObject, boneId: number): void {
        this.Log(`OnMonsterHit ${monster.id()} by ${attacker.id()} for ${amount} in bone ${boneId}`)
    }
    protected OnMonsterDeath(monster: GameObject, killer: GameObject): void {
        this.Log(`OnMonsterDeath ${monster.id()} by ${killer.id()}`)
    }
    protected OnMonsterActorUse(monster: GameObject, user: GameObject): void {
        this.Log(`OnMonsterActorUse ${monster.id()} by ${user.id()}`)
    }
    protected OnMonsterLootInit(monster: GameObject, lootTable: LuaMap<string, LuaMap<string, number>>): void {
        this.Log(`OnMonsterLootInit ${monster.id()}`)
    }

    protected OnNPCBeforeHit(npc: GameObject, hit: Hit, boneId: number): boolean {
        this.Log(`OnNPCBeforeHit ${npc.id()} by ${hit.draftsman.id()} for ${hit.power} in bone ${boneId}`)
        return true;
    }
    protected OnNPCHit(npc: GameObject, amount: number, localDirection: Vector, attacker: GameObject, boneId: number): void {
        this.Log(`OnNPCHit ${npc.id()} by ${attacker.id()} for ${amount} in bone ${boneId}`)
    }
    protected OnNPCDeath(npc: GameObject, killer: GameObject): void {
        this.Log(`OnNPCDeath ${npc.id()} by ${killer.id()}`)
    }

    private RegisterCallbacks():void{
        this.Log("Register callbacks");

        RegisterScriptCallback("actor_on_first_update", () => this.OnActorFirstUpdate());
        RegisterScriptCallback("actor_on_update",  () => this.OnActorUpdate());
        RegisterScriptCallback("actor_on_before_hit",  (hit, boneId, flags : CallbackReturnFlags) => {
            flags.ret_value = this.OnActorBeforeHit(hit, boneId)
        });
        RegisterScriptCallback("actor_on_hit_callback",  (amount, localDirection, attacker, boneId) => this.OnActorHit(amount, localDirection, attacker, boneId));
        
        RegisterScriptCallback("monster_on_before_hit",  (monster, hit, boneId, flags : CallbackReturnFlags) => {
            flags.ret_value = this.OnMonsterBeforeHit(monster, hit, boneId);
        });
        RegisterScriptCallback("monster_on_hit_callback",  (monster, amount, localDirection, attacker, boneId) => this.OnMonsterHit(monster, amount, localDirection, attacker, boneId));
        RegisterScriptCallback("monster_on_death_callback",  (monster, killer) => this.OnMonsterDeath(monster, killer));
        RegisterScriptCallback("monster_on_actor_use_callback",  (monster, actor) => this.OnMonsterActorUse(monster, actor))
        RegisterScriptCallback("monster_on_loot_init", (monster, lootTable) => this.OnMonsterLootInit(monster, lootTable));


        RegisterScriptCallback("npc_on_before_hit",  (npc, hit, boneId, flags : CallbackReturnFlags) => { 
            flags.ret_value = this.OnNPCBeforeHit(npc, hit, boneId)
        });
        RegisterScriptCallback("npc_on_hit_callback",  (npc, amount, localDirection, attacker, boneId) => this.OnNPCHit(npc, amount, localDirection, attacker, boneId));
        RegisterScriptCallback("npc_on_death_callback",  (npc, killer) => this.OnNPCDeath(npc, killer));
    }

    public Log(message: string) {
        if ( !this.logEnabled ) 
            return;
        log(`[${this.modName}:${time_global()}] ${message}`);
    }
}