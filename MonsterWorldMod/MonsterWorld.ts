import { IsPctRolled, Load, NumberToCondList, RandomFromArray, Save, CreateWorldPositionAtGO, CreateVector, CreateWorldPositionAtPosWithGO } from '../StalkerAPI/extensions/basic';
import { Log } from '../StalkerModBase';
import * as cfg from './MonsterWorldConfig';
import { MonsterWorldMod } from './MonsterWorldMod';
import { MWMonster } from './MWMonster';
import { MWPlayer } from './MWPlayer';
import { MWWeapon } from './MWWeapon';
import { MonsterConfig, LevelType, MonsterType, MonsterRank } from './MonsterWorldConfig';
import { MonsterWorldSpawns } from './MonsterWorldSpawns';
import { MonsterWorldUI } from './MonsterWorldUI';
import { CriticalBones } from './MonsterWorldBones';

export class MonsterWorld {
    private player?: MWPlayer;
    private monsters: LuaTable<Id, MWMonster>
    private weapons: LuaTable<Id, MWWeapon>

    private highlightedItems: LuaSet<Id> = new LuaSet();

    public SpawnManager: MonsterWorldSpawns;
    public UIManager: MonsterWorldUI;

    constructor(public mod: MonsterWorldMod){
        this.monsters = new LuaTable();
        this.weapons = new LuaTable();

        this.SpawnManager = new MonsterWorldSpawns(this);
        this.UIManager = new MonsterWorldUI(this);

        utils_item.get_upgrades_tree = (wpn, _t) => {};
        game_setup.try_spawn_world_item = (ignore: any) => {};
        treasure_manager.init_settings = () => {};
        treasure_manager.try_spawn_treasure = (_ignore: any) => {};
        treasure_manager.create_random_stash = (...args: any[]) => {};
    }

    get Player(): MWPlayer{
        if (this.player == undefined)
            this.player = new MWPlayer(this, 0);
        return this.player;
    }

    GetMonster(monsterId: Id): MWMonster | undefined {
        if (!this.monsters.has(monsterId) && level.object_by_id(monsterId)?.is_monster()){
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

    public OnTakeItem(item: game_object) {
        this.GetWeapon(item.id())
        this.ShowHightlighOnObject(item, false)
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

    public OnMonsterHit(monsterGO: game_object, shit: hit, boneId: BoneId) {
        let monster = this.GetMonster(monsterGO.id());
        if (monster == undefined || monster.IsDead) 
            return;

        let weapon = this.GetWeapon(shit.weapon_id);
        if (!weapon) 
            return;

        let damage = weapon.DamagePerHit;

        let isCrit = CriticalBones[monster.Type]?.includes(boneId) || false;
        if (isCrit){
            damage *= 2.5; //TODO move to player stats
        }

        let realDamage = math.min(monster.HP, damage)
        monster.HP -= realDamage;
        this.UIManager.ShowDamage(realDamage, isCrit, monster.IsDead)
        
        Log(`${monster.Name} [${monster.HP} / ${monster.MaxHP}] was hit by player for ${damage} damage. Is crit: ${isCrit}. Bone: ${boneId}`);
    }

    public OnMonsterKilled(monsterGO: game_object) {
        let monster = this.GetMonster(monsterGO.id());
        if (monster == undefined) 
            return;

        this.UIManager.ShowXPReward(monster.XPReward)
        this.Player.CurrentXP += monster.XPReward;

        if (IsPctRolled(monster.DropChance)){
            this.GenerateDrop(monster)
        }
    }
    // [test_container]:itm_backpack
    // use1_functor                                       = bind_container.access_inventory
    // use1_text                                          = st_open
    // script_binding                                     = bind_container.bind
    // remove_after_use                                   = false

    GenerateDrop(monster: MWMonster) {
        //alife_create_item("box_wood_01", CreateWorldPositionAtPosWithGO(CreateVector(5, 5, 0), monster.GO))
        //let boxSGO = alife_create_item("box_paper", CreateWorldPositionAtPosWithGO(CreateVector(0, 1, 0), monster.GO))

        // CreateTimeEvent(`${boxSGO.name()}`, `${boxSGO.name()}`, 1, (boxId: Id) => {
        //     let go = level.object_by_id(boxId);
        //     if (go == null)
        //         return false;
        //     go.start_particles("weapons\\light_signal", "link")
        //     return true;
        // }, boxSGO.id);

        let typedSections = ini_sys.r_list("mw_drops_by_weapon_type", "sections");
        let selectedTypeSection = RandomFromArray(typedSections);
        let weaponCount = ini_sys.line_count(selectedTypeSection);
        let [_, weaponBaseSection] = ini_sys.r_line_ex(selectedTypeSection, math.random(0, weaponCount - 1))
        let weaponVariants = ini_sys.r_list(weaponBaseSection, "variants")
        let selectedVariant = RandomFromArray(weaponVariants)
        
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
        
        let sgo = alife_create_item(selectedVariant, CreateWorldPositionAtGO(monster.GO))// db.actor.position());
        Save(sgo.id, "MW_SpawnParams", {level: dropLevel, quality: qualityLevel});
        Log(`Dropping loot ${sgo.section_name()}:${sgo.id}`)

        CreateTimeEvent(`${sgo.name()}_add_highlight`, `${sgo.name()}`, 0.1, (boxId: Id) => {
            let go = level.object_by_id(boxId);
            if (go == null){
                return false;
            }

            this.ShowHightlighOnObject(go, true)
            return true;
        }, sgo.id);

        CreateTimeEvent(`${sgo.name()}_auto_remove_highligh`, `${sgo.name()}`, 120, (boxId: Id) => {
            let go = level.object_by_id(boxId);
            if (go != null){
                this.ShowHightlighOnObject(go, false)
            }

            return true;
        }, sgo.id);
    }

    ShowHightlighOnObject(go: game_object, doShow: boolean){
        if (doShow){
            this.highlightedItems.add(go.id())
            go.start_particles("weapons\\light_signal", "wpn_body")
        }
        else {
            if (this.highlightedItems.has(go.id())){
                go.stop_particles("weapons\\light_signal", "wpn_body")
                this.highlightedItems.delete(go.id())
            }
        }
    }
}

//actor_menu.set_msg(2, `Enemy ${monster.Name} was hit for ${damage}`, 3, GetARGB(255, 240, 20, 20))