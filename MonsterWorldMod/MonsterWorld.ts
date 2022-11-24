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
    public DeltaTime: number;

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

    public GetMonster(monsterId: Id): MWMonster | undefined {
        if (!this.monsters.has(monsterId) && (level.object_by_id(monsterId)?.is_monster() || level.object_by_id(monsterId)?.is_stalker())){
            this.monsters.set(monsterId, new MWMonster(this, monsterId));
        }
        return this.monsters.get(monsterId);
    }

    public GetWeapon(itemId: Id): MWWeapon {
        if (!this.weapons.has(itemId) && alife().object(itemId) != null && level.object_by_id(itemId)?.is_weapon()){    
            this.weapons.set(itemId, new MWWeapon(this, itemId));
        }
        return this.weapons.get(itemId);
    }

    public DestroyObject(id:Id) {
        this.monsters.delete(id);
        this.weapons.delete(id);
    }

    public OnTakeItem(item: game_object) {
        let weapon = this.GetWeapon(item.id())
        weapon?.OnWeaponPickedUp();

        this.RemoveHighlight(item.id());
        this.RemoveTTLTimer(item.id())
    }

    public OnItemUse(item: game_object) {
        //Log(`OnItemUse: ${item.section()}`)
        if (item.section().startsWith("mw_stimpack_")){
            let healPct = ini_sys.r_float_ex(item.section(), "mw_heal_pct", 25);
            this.Player.HP += this.Player.MaxHP * healPct / 100;
        }
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

    public Update(deltaTime: number) {
        this.DeltaTime = deltaTime;
        this.UIManager.Update();
        this.Player.RegenHP(deltaTime)
        for(let [_, monster] of this.monsters){
            monster.RegenHP(deltaTime)
        }
    }

    public OnPlayerHit(shit: hit, boneId: BoneId) {
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

        this.Player.HP -= math.max(1, damage);

        Log(`Player was hit by ${monster.Name} for ${damage}(${monster.Damage}) in ${boneId}`)
    }

    public OnMonstersHit(monsterHitsThisFrame: Map<Id, HitInfo>) {
        Log(`OnMonstersHit`)
        let hitsByWeapon = new Map<MWWeapon, [MWMonster, boolean][]>();
        for(const [_, hitInfo] of monsterHitsThisFrame){
            let hits = hitsByWeapon.get(hitInfo.weapon) || [];
            hits.push([hitInfo.monster, hitInfo.isCritPartHit])
            hitsByWeapon.set(hitInfo.weapon, hits)
            Log(`OnMonstersHit. ${hits.length} with ${hitInfo.weapon.SectionId}`)
        }
        
        for(const [weapon, hits] of hitsByWeapon){
            let isCritByWeapon = IsPctRolled(weapon.CritChance)
            let weaponDamage = weapon.DamagePerHit / hits.length;

            for(let i = 0; i < hits.length; i++){
                const [monster, isCritPartHit] = hits[i];
                let monsterDamage = weaponDamage;
                if (isCritPartHit || isCritByWeapon){
                    monsterDamage *= 2.5; //TODO move to player stats
                }

                let realDamage = math.min(monster.HP, monsterDamage)
                monster.HP -= realDamage;
                this.UIManager.ShowDamage(realDamage, isCritPartHit, monster.IsDead)
            }
        }
    }

    public OnMonsterKilled(monsterGO: game_object) {
        let monster = this.GetMonster(monsterGO.id());
        if (monster == undefined) 
            return;

        Log(`OnMonsterKilled. ${monster.Name} (${monster.SectionId})`)

        this.UIManager.ShowXPReward(monster.XPReward)
        this.Player.CurrentXP += monster.XPReward;

        if (IsPctRolled(monster.DropChance)){
            Log(`Generating loot`)
            this.GenerateDrop(monster)
        }

        Log(`Add ttl timer loot`)
        this.AddTTLTimer(monsterGO.id(), 10);
    }

    GenerateDrop(monster: MWMonster) {
        Log(`GenerateDrop`)
        let type = cfg.GetDropType();

        let sgo: cse_alife_object | undefined = undefined;
        let quality = 1;
        if (type == cfg.DropType.Weapon){
            [sgo, quality] = this.GenerateWeaponDrop(monster);
        }
        else if (type == cfg.DropType.Stimpack){
            [sgo, quality] = this.GenerateStimpackDrop(monster);
        }

        if (sgo != undefined){
            Log(`Spawned ${sgo.section_name()}:${sgo.id}`)

            Log(`Highlight`)
            this.HighlightDroppedItem(sgo.id, type, quality);
            Log(`TTL`)
            this.AddTTLTimer(sgo.id, 300)
        }
        else {
            Log(`Drop generation failed`)
        }
    }

    GenerateWeaponDrop(monster: MWMonster): LuaMultiReturn<[cse_alife_object | undefined, number]> {
        let typedSections = ini_sys.r_list("mw_drops_by_weapon_type", "sections");
        let selectedTypeSection = RandomFromArray(typedSections);
        let weaponCount = ini_sys.line_count(selectedTypeSection);
        let selectedElement = math.random(0, weaponCount - 1);
        Log(`Selecting base ${selectedElement} from ${weaponCount} in ${selectedTypeSection}`)
        let [_, weaponBaseSection] = ini_sys.r_line_ex(selectedTypeSection, selectedElement)
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
        
        Log(`Spawning ${selectedVariant}`)
        let sgo = alife_create_item(selectedVariant, CreateWorldPositionAtGO(monster.GO))// db.actor.position());
        if (!sgo){
            Log(`GenerateWeaponDrop spawn failed`)
            return $multi(undefined, 1);
        }
        Save(sgo.id, "MW_SpawnParams", {level: dropLevel, quality: qualityLevel});
        return $multi(sgo, qualityLevel);
    }

    GenerateStimpackDrop(monster: MWMonster): LuaMultiReturn<[cse_alife_object | undefined, number]> {
        let [stimpackSection, quality] = cfg.GetStimpack();
        Log(`Spawning ${stimpackSection}`)
        let sgo = alife_create_item(stimpackSection, CreateWorldPositionAtGO(monster.GO))
        if (!sgo){
            Log(`GenerateStimpackDrop spawn failed`)
            return $multi(undefined, 1);
        }
        return $multi(sgo, quality);
    }

    highlightParticles: LuaTable<Id, particles_object> = new LuaTable()
    HighlightDroppedItem(id: Id, type: cfg.DropType, quality: number) {
        Log(`add highligh: ${id}`)
        let particles = new particles_object(cfg.GetDropParticles(type, quality));
        this.highlightParticles.set(id, particles)
        let obj = alife().object(id);
        if (!obj) return;
        let pos = obj.position
        pos.y -= 0.2;
        particles.play_at_pos(pos)
    }

    RemoveHighlight(id: Id){
        Log(`remove highligh: ${id}`)
        let particles = this.highlightParticles.get(id)
        particles?.stop();
        this.highlightParticles.delete(id);
    }

    GetHighlighBone(go: game_object): string{
        let bone = "link";
        if (go.is_weapon()) { bone = "wpn_body"; }
        return bone;
    }

    AddTTLTimer(id: Id, time: number){
        Log(`add ttl: ${id}`)
        CreateTimeEvent(id, "mw_ttl", time, (id: Id): boolean => {
            let toRelease = alife().object(id)
            if (toRelease != undefined){
                safe_release_manager.release(toRelease);
            }
            return true;
        }, id);
    }

    RemoveTTLTimer(id: Id){ 
        Log(`remove ttl: ${id}`)
        RemoveTimeEvent(id, "mw_ttl"); 
    }
}

export type HitInfo = {
    monster: MWMonster,
    weapon: MWWeapon,
    isCritPartHit: boolean,
}

//actor_menu.set_msg(2, `Enemy ${monster.Name} was hit for ${damage}`, 3, GetARGB(255, 240, 20, 20))