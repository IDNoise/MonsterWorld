import { ModScriptBase } from './StalkerAPI/modbase';

class MonsterWorld extends ModScriptBase{
    
    constructor(){
        super("MonsterWorld");

        item_knife.is_equipped = () => true;
    }

    protected OnMonsterBeforeHit(monster: Object, hit: Hit, boneId: number): boolean{
        super.OnMonsterBeforeHit(monster, hit, boneId);
        se_save_var(monster.id(), monster.name(), "hitted", true)
        return true;
    } 

    protected OnNPCBeforeHit(npc: Object, hit: Hit, boneId: number): boolean {
        super.OnNPCBeforeHit(npc, hit, boneId)
        return true;
    }

    protected OnMonsterDeath(monster: Object, killer: Object): void {
        const params = new LuaTable();
        params.set("ammo", math.random(10, 100));
        alife_create_item("ammo_357_hp_mag", db.actor, params)

        alife_create_item("ammo_357_hp_mag", [monster.position(), monster.level_vertex_id(), monster.game_vertex_id()], params)
        alife_create_item("ammo_357_hp_mag", [killer.position(), killer.level_vertex_id(), killer.game_vertex_id()], params)
        super.OnMonsterDeath(monster, killer);
    }

    protected OnActorFirstUpdate(): void {
        super.OnActorFirstUpdate();
    }

    protected OnActorBeforeHit(hit: Hit, boneId: number): boolean {
        super.OnActorBeforeHit(hit, boneId);
        return false;
    }

    protected OnMonsterLootInit(monster: Object, lootTable: LuaMap<string, LuaMap<string, number>>): void {
        super.OnMonsterLootInit(monster, lootTable)
        const weaponSection = "wpn_ak105";
        const params = new LuaMap<string, number>();
        params.set("count", 1);
        lootTable.set(weaponSection, params);

        log(`Monster Was hitted: ${se_load_var<boolean>(monster.id(),  monster.name(), "hitted") || "NOPE"}`)
    }
}

declare var MW : MonsterWorld;

export function StartMonsterWorld(){
    MW = new MonsterWorld();
}