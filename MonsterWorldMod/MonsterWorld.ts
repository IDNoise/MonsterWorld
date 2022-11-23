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
        death_manager.create_release_item = (_ignore: any) => {};
        death_manager.create_item_list = (...args: any[]) => {};
        death_manager.keep_item = (npc: game_object, item: game_object) => {
            if (!item) return;
            let se_obj = alife_object(item.id());
            if (se_obj != undefined){
                alife_release(se_obj)
            }
        };
    }

    get Player(): MWPlayer{
        if (this.player == undefined)
            this.player = new MWPlayer(this, 0);
        return this.player;
    }

    GetMonster(monsterId: Id): MWMonster | undefined {
        if (!this.monsters.has(monsterId) && (level.object_by_id(monsterId)?.is_monster() || level.object_by_id(monsterId)?.is_stalker())){
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
        let weapon = this.GetWeapon(item.id())
        weapon?.OnWeaponPickedUp();

        this.RemoveHighlight(item.id());
        this.RemoveTTLTimer(item.id())
    }

    public OnWeaponFired(wpn: game_object, ammo_elapsed: number) {
        let weapon = this.GetWeapon(wpn.id())
        if (weapon != undefined && weapon.Section.endsWith("_mw") && weapon.GO.get_ammo_total() < 500){
            let ammo = ini_sys.r_sec_ex(weapon.Section, "ammo_class")
            alife_create_item(ammo, this.Player.GO, {ammo: 1});
        }
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

    public OnPlayerHit(shit: hit) {
        let attackerGO = shit.draftsman;
        if (!attackerGO.is_monster() && !attackerGO.is_stalker())
            return;

        let monster = this.GetMonster(attackerGO.id());
        if (monster == undefined) 
            return;

        let damage = monster.Damage;
        if (attackerGO.is_stalker() && shit.weapon_id != 0 && shit.weapon_id != attackerGO.id()){
            let weapon = level.object_by_id(shit.weapon_id);
            if (weapon?.is_weapon())
                damage *= weapon.cast_Weapon().RPM() * 1.2; //small increase for ranged attacks
        }

        this.Player.HP -= damage;

        Log(`Player was hit by ${monster.Name} for ${damage}(${monster.Damage})`)
    }

    public OnMonstersHit(monsterHitsThisFrame: Map<Id, HitInfo>) {
        let hitsByWeapon = new Map<MWWeapon, [MWMonster, boolean][]>();
        for(const [_, hitInfo] of monsterHitsThisFrame){
            let hits = hitsByWeapon.get(hitInfo.weapon) || [];
            hits.push([hitInfo.monster, hitInfo.isCrit])
            hitsByWeapon.set(hitInfo.weapon, hits)
        }

        for(const [weapon, hits] of hitsByWeapon){
            let weaponDamage = weapon.DamagePerHit / hits.length;

            for(let i = 0; i < hits.length; i++){
                const [monster, isCrit] = hits[i];
                let monsterDamage = weaponDamage;
                if (isCrit){
                    monsterDamage *= 2.5; //TODO move to player stats
                }

                let realDamage = math.min(monster.HP, monsterDamage)
                monster.HP -= realDamage;
                this.UIManager.ShowDamage(realDamage, isCrit, monster.IsDead)
            }
        }
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

        let se_obj = alife().object(monsterGO.id())
        this.AddTTLTimer(se_obj.id, 10);
    }

    GenerateDrop(monster: MWMonster) {

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
    
        if (IsPctRolled(cfg.EnemyDropLevelIncreaseChanceByRank[monster.Rank])) dropLevel++;
        if (IsPctRolled(cfg.EnemyDropQualityIncreaseChanceByRank[monster.Rank])) qualityLevel++;
        
        let sgo = alife_create_item(selectedVariant, CreateWorldPositionAtGO(monster.GO))// db.actor.position());
        Save(sgo.id, "MW_SpawnParams", {level: dropLevel, quality: qualityLevel});

        //Log(`Dropping loot ${sgo.section_name()}:${sgo.id}`)

        this.HighlightDroppedItem(sgo.id, qualityLevel);
        this.AddTTLTimer(sgo.id, 120)
    }

    HighlightDroppedItem(id: Id, highlightQuality: number) {
        CreateTimeEvent(id, `add_highlight`, 0.1, (id: Id, quality: number) => {
            let go = level.object_by_id(id);
            if (go == null){
                return false;
            }

            let particles = cfg.ParticlesByQuality[quality]
            if (particles != undefined){
                go.start_particles(particles, this.GetHighlighBone(go))
                Save<string>(id, "highlight_particels", particles);
            }
            return true;
        }, id, highlightQuality);
    }

    RemoveHighlight(id: Id){
        let go = level.object_by_id(id);
        if (go == null){
            return false;
        }

        let particles = Load<string>(id, "highlight_particels");
        if (particles != undefined){
            go.stop_particles(particles, this.GetHighlighBone(go))
        }
    }

    GetHighlighBone(go: game_object): string{
        let bone = "link";
        if (go.is_weapon()) { bone = "wpn_body"; }
        return bone;
    }

    AddTTLTimer(id: Id, time: number){
        CreateTimeEvent(id, "mw_ttl", time, (id: Id): boolean => {
            let toRelease = alife().object(id)
            if (toRelease != undefined){
                safe_release_manager.release(toRelease);
            }
            return true;
        }, id);
    }

    RemoveTTLTimer(id: Id){ RemoveTimeEvent(id, "mw_ttl"); }
}

export type HitInfo = {
    monster: MWMonster,
    weapon: MWWeapon,
    isCrit: boolean,
}

//actor_menu.set_msg(2, `Enemy ${monster.Name} was hit for ${damage}`, 3, GetARGB(255, 240, 20, 20))