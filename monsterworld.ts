import { ModScriptBase } from "./StalkerTS/modbase";

class MonsterWorld extends ModScriptBase{
    
    constructor(){
        super("MonsterWorld");
    }

    protected OnMonsterBeforeHit(monster: Obj, hit: Hit, boneId: number): boolean{
        super.OnMonsterBeforeHit(monster, hit, boneId);
        return true;
    } 

    protected OnMonsterHit(monster: Obj, amount: number, localDirection: Vector, attacker: Obj, boneId: number): void {
        super.OnMonsterHit(monster, amount, localDirection, attacker, boneId);
    }

    protected OnMonsterDeath(monster: Obj, killer: Obj): void {
        super.OnMonsterDeath(monster, killer);
        this.Log(monster.clsid() != ClsId.dog_s ? "Is not dog" : "Is dog")
    }

    protected OnActorFirstUpdate(): void {
        super.OnActorFirstUpdate();
    }

    protected OnActorBeforeHit(hit: Hit, boneId: number): boolean {
        super.OnActorBeforeHit(hit, boneId);
        return false;
    }
}

declare var MW : MonsterWorld;

export function StartMonsterWorld(){
    MW = new MonsterWorld();
}