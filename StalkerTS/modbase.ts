export class ModScriptBase {
    private modName: string;

    constructor(modName: string){
        this.modName = modName;
        this.RegisterCallbacks()
    }

    OnActorFirstUpdate() : void {}
    OnActorUpdate() : void {}

    OnMonsterBeforeHit(monster: Obj, hit: SHit, boneId: number, flags : CallbackReturnFlags): void {}
    OnMonsterHit(monster: Obj, amount: number, localDirection: Vector, attacker: Obj, boneId: number): void {}
    OnMonsterDeath(monster: Obj, killer: Obj): void {}

    RegisterCallbacks():void{
        log("Register callbacks")

        RegisterScriptCallback("actor_on_first_update", () => this.OnActorFirstUpdate())
        RegisterScriptCallback("actor_on_update",  () => this.OnActorUpdate())

        RegisterScriptCallback("monster_on_before_hit",  (monster, amount, localDirection, attacker, boneId) => this.OnMonsterHit(monster, amount, localDirection, attacker, boneId))
        RegisterScriptCallback("monster_on_death_callback",  (monster, killer) => this.OnMonsterDeath(monster, killer))
    }

    Log(message: string) {
        log(`[${this.modName}:${time_global()}] ${message}`);
    }
}