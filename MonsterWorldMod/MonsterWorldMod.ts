import { EnableMutantLootingWithoutKnife } from '../StalkerAPI/extensions/basic';
import { StalkerModBase } from '../StalkerModBase';
import { MonsterWorld } from './MonsterWorld';
import { MWMonster } from './MWMonster';
import { MWPlayer } from './MWPlayer';

export class MonsterWorldMod extends StalkerModBase {
    private world: MonsterWorld;
    //private lastEnemySpawnTime: number = 0;
    
    constructor(){
        super("MonsterWorldMod");
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