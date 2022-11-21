import { IsPctRolled, Load, NumberToCondList, RandomFromArray, Save } from '../StalkerAPI/extensions/basic';
import { Log } from '../StalkerModBase';
import * as cfg from './MonsterWorldConfig';
import { MonsterWorldMod } from './MonsterWorldMod';
import { MWMonster } from './MWMonster';
import { MWPlayer } from './MWPlayer';
import { MWWeapon } from './MWWeapon';
import { MonsterConfig, LevelType, MonsterType, MonsterRank } from './MonsterWorldConfig';
import { MonsterWorldSpawns } from './MonsterWorldSpawns';
import { MonsterWorldUI } from './MonsterWorldUI';

export class MonsterWorld {
    
    private player?: MWPlayer;
    private monsters: LuaTable<Id, MWMonster>
    private weapons: LuaTable<Id, MWWeapon>

    public SpawnManager: MonsterWorldSpawns;
    public UIManager: MonsterWorldUI;

    constructor(public mod: MonsterWorldMod){
        this.monsters = new LuaTable();
        this.weapons = new LuaTable();

        this.SpawnManager = new MonsterWorldSpawns(this);
        this.UIManager = new MonsterWorldUI(this);

        utils_item.get_upgrades_tree = (wpn, _t) => {};
    }

    get Player(): MWPlayer{
        if (this.player == undefined)
            this.player = new MWPlayer(this, 0);
        return this.player;
    }

    GetMonster(monsterId: Id): MWMonster | undefined {
        if (!this.monsters.has(monsterId)){
            this.monsters.set(monsterId, new MWMonster(this, monsterId));
        }
        return this.monsters.get(monsterId);
    }

    DestroyObject(id:Id) {
        this.monsters.delete(id);
        this.weapons.delete(id);
    }

    GetWeapon(itemId: Id): MWWeapon {
        if (!this.weapons.has(itemId) && level.object_by_id(itemId)?.is_weapon()){    
            this.weapons.set(itemId, new MWWeapon(this, itemId));
        }
        return this.weapons.get(itemId);
    }

    public OnPlayerSpawned():void{
        // db.actor.inventory_for_each((item) => {
        //     if (item.is_weapon())
        //         this.GetWeapon(item.id());
        // })
    }

    public Save(data: { [key: string]: any; }) {
        this.SpawnManager.Save(data)
        this.UIManager.Save(data)
    }

    public Load(data: { [key: string]: any; }) {
        this.SpawnManager.Load(data)
        this.UIManager.Load(data)
    }

    public Update() {
        this.UIManager.Update();
    }

    public OnPlayerHit(attackerGO: game_object) {
        if (!attackerGO.is_monster() || !attackerGO.is_stalker())
            return;

        let monster = this.GetMonster(attackerGO.id());
        if (monster == undefined) 
            return;

        this.Player.HP -= monster.Damage;
        Log(`Player [${ this.Player.HP} / ${this.Player.MaxHP}] was hit by ${monster.Name} for ${monster.Damage} damage`);
    }

    public OnMonsterHit(monsterGO: game_object, shit: hit) {
        let monster = this.GetMonster(monsterGO.id());
        if (monster == undefined) 
            return;

        let weapon = this.GetWeapon(shit.weapon_id);
        if (!weapon) 
            return;

        let damage = weapon.DamagePerHit;
        monster.HP -= damage;
        
        //actor_menu.set_msg(2, `Enemy ${monster.Name} was hit for ${damage}`, 3, GetARGB(255, 240, 20, 20))
        Log(`${monster.Name} [${monster.HP} / ${monster.MaxHP}] was hit by player for ${damage} damage`);
    }

    public OnMonsterKilled(monsterGO: game_object) {
        let monster = this.GetMonster(monsterGO.id());
        if (monster == undefined) 
            return;

        let msg = `EXP +${monster.XPReward} for ${monster.Name}`;
        actor_menu.set_msg(1, msg, 3, GetARGB(255, 20, 240, 20))
        this.Player.CurrentXP += monster.XPReward;

        if (IsPctRolled(monster.DropChance)){
            this.GenerateDrop(monster)
        }
    }

    GenerateDrop(monster: MWMonster) {

        let typedSections = ini_sys.r_list("mw_drops_by_weapon_type", "sections");
        let selectedTypeSection = RandomFromArray(typedSections);

        let weaponCount = ini_sys.line_count(selectedTypeSection);
        let [_, weaponBaseSection] = ini_sys.r_line_ex(selectedTypeSection, math.random(0, weaponCount - 1))
        let weaponVariants = ini_sys.r_list(weaponBaseSection, "variants")
        let selectedVariant = RandomFromArray(weaponVariants)

        let sgo = alife_create_item(selectedVariant, db.actor);
        Log(`Dropping loot ${sgo.section_name()}:${sgo.id}`)
        let dropLevel = monster.Level;
        if (IsPctRolled(cfg.HigherLevelDropChancePct)){
            dropLevel++;
        }
            
        let qualityLevel = 1;
        for(let i = 0; i < cfg.QualityDropChance.length; i++){
            if (IsPctRolled(cfg.QualityDropChance[i][0])){
                qualityLevel = cfg.QualityDropChance[i][1]
                break;
            }
        }
    
        if (monster.Rank == MonsterRank.Elite){
            if (IsPctRolled(cfg.EnemyEliteDropLevelIncreaseChance))
                dropLevel++;
            if (IsPctRolled(cfg.EnemyEliteDropQualityIncreaseChance))
                qualityLevel++;
        }
        else if (monster.Rank == MonsterRank.Boss){
            if (IsPctRolled(cfg.EnemyBossDropLevelIncreaseChance))
                dropLevel++;
            if (IsPctRolled(cfg.EnemyBossDropQualityIncreaseChance))
                qualityLevel++;
        }

        Save(sgo.id, "MW_SpawnParams", {level: dropLevel, quality: qualityLevel});
        //this.GetWeapon(sgo.id)
    }
}


// //Log(`Setup configs for smart: ${smart.name()}`)

// if (math.random(1, 100) > 60){
//     smart.respawn_params = {
//         "spawn_section_1": {
//             num: NumberToCondList(3), 
//             squads: ["simulation_dog"]
//         },
//     }
// }
// else {
//     smart.respawn_params = {
//         "spawn_section_1": {
//             num: NumberToCondList(3), 
//             squads: ["simulation_pseudodog", "simulation_mix_dogs"]
//         }
//     } 
// }

// smart.already_spawned = {"spawn_section_1": {num: 0}, "spawn_section_2": {num: 0}}