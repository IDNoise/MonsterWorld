import { ModScriptBase } from "./StalkerTS/modbase";

class MonsterWorld extends ModScriptBase{
    
    constructor(){
        super("Monster World")
    }

    OnMonsterBeforeHit(monster: Obj, hit: SHit, boneId: number, flags : CallbackReturnFlags): void{
        this.Log("Before hitted: " + monster.id())
    } 

    OnMonsterHit(monster: Obj, amount: number, localDirection: Vector, attacker: Obj, boneId: number): void {
        this.Log("Hitted: " + monster.id())
    }

    OnMonsterDeath(monster: Obj, killer: Obj): void {
        this.Log(killer.id() + " Killed: " + monster.id())
    }

    OnActorFirstUpdate(): void {
        this.Log("FIRST UPDATE")
    }
}

declare var MW : MonsterWorld

export function StartMonsterWorld(){
    MW = new MonsterWorld()
}