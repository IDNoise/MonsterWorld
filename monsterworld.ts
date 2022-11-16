import { ModScriptBase } from './StalkerAPI/modbase';

class MonsterWorld extends ModScriptBase{
    
    constructor(){
        super("MonsterWorld");

        item_knife.is_equipped = () => true;
        item_knife.get_condition = () => 1;
        item_knife.degradate = () => {};
        item_knife.can_loot = (monster) => true;
        item_knife.is_axe = () => false;

        const oldCreateNpc = sim_squad_scripted.sim_squad_scripted.create_npc;
        sim_squad_scripted.sim_squad_scripted.create_npc = (...args) => {
            this.Log(`FUCK YEAH sim_squad_scripted ${args.length}`);
            oldCreateNpc(...args);
        };
    }

    protected OnMonsterBeforeHit(monster: Obj, hit: Hit, boneId: number): boolean{
        super.OnMonsterBeforeHit(monster, hit, boneId);
        // Save(monster, "hitted", Load<number>(monster, "hitted", 0) + 1)
        return true;
    } 

    protected OnNPCBeforeHit(npc: Obj, hit: Hit, boneId: number): boolean {
        super.OnNPCBeforeHit(npc, hit, boneId)
        return true;
    }

    protected OnMonsterDeath(monster: Obj, killer: Obj): void {
        super.OnMonsterDeath(monster, killer);

        const params = new LuaTable();
        // params.set("ammo", math.random(10, 100));
        // alife_create_item("ammo_357_hp_mag", db.actor, {ammo: math.random(10, 100)})
        // alife_create_item("ammo_357_hp_mag", CreateWorldPosition(monster), params)
        // alife_create_item("ammo_357_hp_mag", CreateWorldPosition(killer), params)
    }

    protected OnActorFirstUpdate(): void {
        super.OnActorFirstUpdate();
    }

    protected OnActorBeforeHit(hit: Hit, boneId: number): boolean {
        super.OnActorBeforeHit(hit, boneId);
        return false;
    }

    protected OnMonsterLootInit(monster: Obj, lootTable: LuaMap<string, LuaMap<string, number>>): void {
        super.OnMonsterLootInit(monster, lootTable)

        // const weaponSection = "wpn_ak105";
        // const params = new LuaMap<string, number>();
        // params.set("count", 1);
        // lootTable.set(weaponSection, params);

        // log(`Monster Was hitted: ${Load<number>(monster, "hitted", 0)} times`)
    }
}

declare var MW : MonsterWorld;

export function StartMonsterWorld(){
    MW = new MonsterWorld();
}