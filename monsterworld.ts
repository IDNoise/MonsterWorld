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

    protected OnMonsterBeforeHit(monster: game_object, shit: hit, boneId: number): boolean{
        super.OnMonsterBeforeHit(monster, shit, boneId);
        // Save(monster, "hitted", Load<number>(monster, "hitted", 0) + 1)
        return true;
    } 

    protected OnNPCBeforeHit(npc: game_object, shit: hit, boneId: number): boolean {
        super.OnNPCBeforeHit(npc, shit, boneId)

        let shitX = new hit(shit)
        let shitY = new hit()
        return true;
    }

    protected OnMonsterDeath(monster: game_object, killer: game_object): void {
        super.OnMonsterDeath(monster, killer);

        // const params = new LuaTable();
        // params.set("ammo", math.random(10, 100));
        // alife_create_item("ammo_357_hp_mag", db.actor, {ammo: math.random(10, 100)})
        // for (let index = 0; index < math.random(1, 20); index++) {
        //     let randomOffset = CreateVector(math.random(-5, 5), math.random(-5, 5), math.random(-5, 5));
        //     let point = CreateWorldPositionAtPosWithGO(monster.position().add(randomOffset), monster);
        //     alife_create_item("ammo_357_hp_mag", point, {ammo: math.random(10, 1000)})
        // }
         
        // alife_create_item("ammo_357_hp_mag", CreateWorldPosition(killer), {ammo: math.random(10, 100))
    }

    protected OnActorFirstUpdate(): void {
        super.OnActorFirstUpdate();
    }

    protected OnActorBeforeHit(hit: hit, boneId: number): boolean {
        super.OnActorBeforeHit(hit, boneId);
        return false;
    }

    protected OnMonsterLootInit(monster: game_object, lootTable: LuaMap<string, LuaMap<string, number>>): void {
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