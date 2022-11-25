import { IsPctRolled, Load, NumberToCondList, RandomFromArray, Save, CreateWorldPositionAtGO, CreateVector, CreateWorldPositionAtPosWithGO } from '../StalkerAPI/extensions/basic';
import { Log } from '../StalkerModBase';
import * as cfg from './MonsterWorldConfig';
import { MonsterWorldMod } from './MonsterWorldMod';
import { MWMonster } from './MWMonster';
import { MWPlayer } from './MWPlayer';
import { MWWeapon } from './MWWeapon';
import { MonsterConfig, LevelType, MonsterType, MonsterRank, StatType } from './MonsterWorldConfig';
import { MonsterWorldSpawns } from './MonsterWorldSpawns';
import { MonsterWorldUI } from './MonsterWorldUI';
import { CriticalBones } from './MonsterWorldBones';
import { BaseMWObject } from './BaseMWObject';

export class MonsterWorld {
    private weapons: LuaTable<Id, MWWeapon>
    private enemyDamageMult: number = 1;
    private enemyDropChanceMult: number = 1;

    public Monsters: LuaTable<Id, MWMonster>

    public SpawnManager: MonsterWorldSpawns;
    public UIManager: MonsterWorldUI;
    public DeltaTime: number;

    constructor(public mod: MonsterWorldMod){
        this.Monsters = new LuaTable();
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
        let oldKeepItem = death_manager.keep_item;
        death_manager.keep_item = (npc: game_object, item: game_object) => {
            if (!item) return;
	
            let item_id = item.id()
            let active_item = npc.active_item()
	
	        oldKeepItem(npc, item)

            if (active_item != null && active_item.id() == item_id) {
                npc.transfer_item(item, npc)
            }
        };
    }

    private player?: MWPlayer;
    get Player(): MWPlayer{
        if (this.player == undefined)
            this.player = new MWPlayer(this, 0);
        return this.player;
    }

    public GetMonster(monsterOrId: Id | game_object): MWMonster | undefined {
        //Log(`GetMonster: ${monsterId}`)
        let monsterId = 0;
        if (typeof(monsterOrId) != "number"){
            if (monsterOrId?.id != undefined){
                monsterId = monsterOrId.id();
            }
            else {
                return undefined;
            }
        }
        else {
            monsterId = monsterOrId;
        }

        let se_obj = alife_object(monsterId);
        let go = level.object_by_id(monsterId);
        if (se_obj == null || go == null || !(go.is_monster() || go.is_stalker()))
            return undefined;

        if (!this.Monsters.has(monsterId)){
            //Log(`GetMonster crate new: ${monsterId}`)
            this.Monsters.set(monsterId, new MWMonster(this, monsterId));
        }
        //Log(`GetMonster end: ${monsterId}`)
        return this.Monsters.get(monsterId);
    }

    public GetWeapon(itemOrId: Id | game_object): MWWeapon | undefined {
        let itemId = 0;
        if (typeof(itemOrId) != "number"){
            if (itemOrId?.id != undefined){
                itemId = itemOrId.id();
            }
            else {
                return undefined;
            }
        }
        else {
            itemId = itemOrId;
        }
        //Log(`GetWeapon: ${itemId}`)
        let se_obj = alife_object(itemId);
        let go = level.object_by_id(itemId);
        if (se_obj == null || go == null || !go.is_weapon())
            return undefined;

        if (!this.weapons.has(itemId)){    
            //Log(`GetWeapon crate new: ${itemId}`)
            this.weapons.set(itemId, new MWWeapon(this, itemId));
        }

        //Log(`GetWeapon end: ${itemId}`)
        return this.weapons.get(itemId);
    }

    public DestroyObject(id:Id) {
        this.CleanupItemData(id);
        this.Monsters.delete(id);
        this.weapons.delete(id);
    }

    public OnTakeItem(item: game_object) {
        //Log(`OnTakeItem: ${item.id()}`)
        let weapon = this.GetWeapon(item)
        weapon?.OnWeaponPickedUp();
        this.CleanupItemData(item.id());
    }

    private CleanupItemData(id: Id){
        this.RemoveTTLTimer(id)
        this.RemoveHighlight(id)
        level.map_remove_object_spot(id, SpotType.Body);
        level.map_remove_object_spot(id, SpotType.Friend)
        level.map_remove_object_spot(id, SpotType.Treasure)
    }

    public OnItemUse(item: game_object) {
        //Log(`OnItemUse: ${item.section()}`)
        if (item.section().startsWith("mw_stimpack_")){
            let healPct = ini_sys.r_float_ex(item.section(), "mw_heal_pct", 25);
            this.Player.HP += this.Player.MaxHP * healPct / 100;
        }
    }
    
    public OnWeaponFired(wpn: game_object, ammo_elapsed: number) {
        //Log(`OnWeaponFired: ${wpn.section()}`)
        let weapon = this.GetWeapon(wpn)
        if (weapon != undefined && weapon.Section.endsWith("_mw") && weapon.GO.get_ammo_total() < 500){
            let ammo = ini_sys.r_sec_ex(weapon.Section, "ammo_class")
            alife_create_item(ammo, this.Player.GO, {ammo: 1});
        }
        //Log(`OnWeaponFired END: ${wpn.section()}`)
    }

    public OnPlayerSpawned():void{
        this.enemyDamageMult = cfg.GetDifficultyDamageMult();
        this.enemyDropChanceMult = cfg.GetDifficultyDropChanceMult()
        // db.actor.inventory_for_each((item) => {
        //     if (item.is_weapon())
        //         this.GetWeapon(item.id());
        // })
    }

    public Save(data: { [key: string]: any; }) {
        this.SpawnManager.Save(data)
        this.UIManager?.Save(data)
    }

    public Load(data: { [key: string]: any; }) {
        this.SpawnManager.Load(data)
        this.UIManager?.Load(data)
    }

    public Update(deltaTime: number) {
        this.DeltaTime = deltaTime;
        this.UIManager?.Update();
        this.Player.Update(deltaTime);
        this.Player.IterateSkills((s) => s.Update(deltaTime))
        for(let [_, monster] of this.Monsters){
            monster.Update(deltaTime)
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
                damage *= weapon.cast_Weapon().RPM() * 1.5; //small increase for ranged attacks
        }

        damage = math.max(2, damage) * this.enemyDamageMult;
        this.Player.HP -= damage;

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
            let isCritByWeapon = IsPctRolled(this.GetStat(StatType.CritChancePct, weapon, this.Player))
            let weaponDamage = weapon.DamagePerHit / hits.length;

            for(let i = 0; i < hits.length; i++){
                const [monster, isCritPartHit] = hits[i];
                if (monster.IsDead) continue;

                let monsterDamage = weaponDamage;
                if (monster.GO.is_stalker()){
                    monsterDamage *= 1 + this.GetStat(StatType.DamageToStalkersBonusPct, weapon, this.Player) / 100;
                }
                else if (monster.GO.is_monster()){
                    monsterDamage *= 1 + this.GetStat(StatType.DamageToMutantssBonusPct, weapon, this.Player) / 100;
                }

                let isCrit = isCritPartHit || isCritByWeapon;
                if (isCrit){
                    let critDamageMult = 1 + this.GetStat(StatType.CritDamagePct, weapon, this.Player) / 100;
                    monsterDamage *= critDamageMult
                }

                let realDamage = this.DamageMonster(monster, monsterDamage, isCrit);
                this.UIManager?.ShowDamage(realDamage, isCrit, monster.IsDead)
                this.Player.IterateSkills((s) => s.OnMonsterHit(monster, isCrit))
            }
        }
    }

    DamageMonster(monster: MWMonster, damage: number, isCrit: boolean): number{
        let realDamage = math.min(monster.HP, damage)
        monster.HP -= realDamage;
        
        if (monster.IsDead){
            this.OnMonsterKilled(monster, isCrit)
        }
        return realDamage;
    }

    GetStat(stat: StatType, ...sources: BaseMWObject[]){
        let value = 0;
        for(let i = 0; i < sources.length; i++){
            value += sources[i].GetStat(stat);
        }
        return value;
    }

    public OnMonsterKilled(monster: MWMonster, isCrit: boolean) {
        Log(`OnMonsterKilled. ${monster.Name} (${monster.SectionId})`)

        this.UIManager?.ShowXPReward(monster.XPReward)
        this.Player.CurrentXP += monster.XPReward;

        let dropChance = monster.DropChance * this.enemyDropChanceMult
        if (IsPctRolled(dropChance)){
            this.GenerateDrop(monster)
        }

        this.Player.IterateSkills((s) => s.OnMonsterKill(monster, isCrit))

        this.AddTTLTimer(monster.id, 3);

        Log(`OnMonsterKilled END. ${monster.Name} (${monster.SectionId})`)
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

            //Log(`Highlight drop`)
            this.HighlightDroppedItem(sgo.id, type, quality);
            //Log(`Add ttl timer for drop`)
            this.AddTTLTimer(sgo.id, 300)
            //Log(`Post add ttl timer for drop`)
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
            
        let qualityLevel = cfg.GetDropQuality();
    
        if (IsPctRolled(cfg.EnemyDropLevelIncreaseChanceByRank[monster.Rank])) dropLevel++;
        if (IsPctRolled(cfg.EnemyDropQualityIncreaseChanceByRank[monster.Rank])) qualityLevel++;
        
        Log(`Spawning ${selectedVariant}`)
        let sgo = alife_create_item(selectedVariant, CreateWorldPositionAtPosWithGO(CreateVector(0, 0.2, 0), monster.GO))// db.actor.position());
        if (!sgo){
            Log(`GenerateWeaponDrop spawn failed`)
            return $multi(undefined, 1);
        }

        qualityLevel = math.min(qualityLevel, cfg.MaxQuality)

        Save(sgo.id, "MW_SpawnParams", {level: dropLevel, quality: qualityLevel});
        return $multi(sgo, qualityLevel);
    }

    GenerateStimpackDrop(monster: MWMonster): LuaMultiReturn<[cse_alife_object | undefined, number]> {
        let [stimpackSection, quality] = cfg.GetStimpack();
        Log(`Spawning ${stimpackSection}`)
        let sgo = alife_create_item(stimpackSection, CreateWorldPositionAtPosWithGO(CreateVector(0, 0.2, 0), monster.GO))
        if (!sgo){
            Log(`GenerateStimpackDrop spawn failed`)
            return $multi(undefined, 1);
        }
        return $multi(sgo, quality);
    }

    highlightParticles: LuaTable<Id, particles_object> = new LuaTable()
    HighlightDroppedItem(id: Id, type: cfg.DropType, quality: number) {
        CreateTimeEvent(id, "highlight", 0.3, (): boolean => {
            let obj = level.object_by_id(id);
            if (obj == undefined){
                return false;
            }

            let particles = new particles_object(cfg.GetDropParticles(type, quality));
            this.highlightParticles.set(id, particles)
            let pos = obj.position()
            pos.y -= 0.1;
            particles.play_at_pos(pos)

            let spotType = SpotType.Body;
            if (type == cfg.DropType.Stimpack){
                level.map_add_object_spot_ser(id, SpotType.Friend, "")
            }
            else if (type == cfg.DropType.Weapon){
                if (quality == 3 || quality == 4)
                    spotType = SpotType.Friend;
                if (quality == 5)
                    spotType = SpotType.Treasure;
            }
            level.map_add_object_spot_ser(id, spotType, "")

            return true;
        })
    }

    RemoveHighlight(id: Id){
        //Log(`remove highligh: ${id}`)
        RemoveTimeEvent(id, "highlight"); 
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
        //Log(`add ttl: ${id}`)
        CreateTimeEvent(id, "ttl", time, (id: Id): boolean => {
            let toRelease = alife().object(id)
            if (toRelease != undefined){
                safe_release_manager.release(toRelease);
            }
            return true;
        }, id);
    }

    RemoveTTLTimer(id: Id){ 
        //Log(`remove ttl timer: ${id}`)
        RemoveTimeEvent(id, "ttl"); 
    }
}

export type HitInfo = {
    monster: MWMonster,
    weapon: MWWeapon,
    isCritPartHit: boolean,
}

//actor_menu.set_msg(2, `Enemy ${monster.Name} was hit for ${damage}`, 3, GetARGB(255, 240, 20, 20))