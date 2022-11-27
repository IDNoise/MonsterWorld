import { Log } from '../StalkerModBase';
import * as constants from './Configs/Constants';
import { MonsterWorldMod } from './MonsterWorldMod';
import { MWMonster } from './GameObjects/MWMonster';
import { MWPlayer } from './GameObjects/MWPlayer';
import { MWWeapon, WeaponType } from './GameObjects/MWWeapon';
import { SpawnManager } from './Managers/SpawnManager';
import { UIManager } from './Managers/UIManager';
import { MWObject, ObjectType } from './GameObjects/MWObject';
import { GetDifficultyDamageMult, GetDifficultyDropChanceMult } from './Helpers/Difficulty';
import { GetDropType, HigherLevelDropChancePct, MaxQuality, GetDropQuality, DropType, GetStimpackByQuality, QualityConfigs } from './Configs/Loot';
import { StatType } from './Configs/Stats';
import { ObjectOrId, GetId, CreateVector, CreateWorldPositionAtPosWithGO, Save } from './Helpers/StalkerAPI';
import { GetRandomFromArray } from './Helpers/Collections';
import { IsPctRolled } from './Helpers/Random';
import { TimerManager } from './Managers/TimerManager';
import { MWItem, ItemSpawnParams } from './GameObjects/MWItem';
import { MWArmor } from './GameObjects/MWArmor';
import { MWArtefact } from './GameObjects/MWArtefact';
import { MonsterRankConfigs } from './Configs/Enemies';
import { MWStimpack } from './GameObjects/MWStimpack';

declare global{
    let MonsterWorld: World;
}

export class World {
    private items: LuaTable<Id, MWItem>
    private enemyDamageMult: number = 1;
    private enemyDropChanceMult: number = 1;

    public Monsters: LuaTable<Id, MWMonster>

    public SpawnManager: SpawnManager;
    public UIManager: UIManager;
    public Timers: TimerManager;

    public DeltaTime: number;

    constructor(public mod: MonsterWorldMod){
        MonsterWorld = this;
        this.Monsters = new LuaTable();
        this.items = new LuaTable();

        this.SpawnManager = new SpawnManager();
        this.UIManager = new UIManager();
        this.Timers = new TimerManager();

        this.DoMonkeyPatch();
        this.ChangeQuickSlotItems();
    }

    private player?: MWPlayer;
    get Player(): MWPlayer{
        if (this.player == undefined){
            this.player = new MWPlayer(0);
            this.player.Initialize();
        }
        return this.player;
    }

    public GetMonster(monster: ObjectOrId): MWMonster | undefined {
        //Log(`GetMonster: ${monsterId}`)
        let monsterId = GetId(monster);
        let se_obj = alife_object(monsterId);
        let go = level.object_by_id(monsterId);
        if (se_obj == null || go == null || !(go.is_monster() || go.is_stalker()))
            return undefined;

        if (!this.Monsters.has(monsterId)){
            //Log(`GetMonster crate new: ${monsterId}`)
            let monster = new MWMonster(monsterId);
            monster.Initialize();
            this.Monsters.set(monsterId, monster);
        }
        //Log(`GetMonster end: ${monsterId}`)
        return this.Monsters.get(monsterId);
    }
    
    public GetItem(item: ObjectOrId): MWItem | undefined {
        let itemId = GetId(item);
        let se_obj = alife()?.object(itemId);
        let go = level.object_by_id(itemId);
        if (se_obj == null || go == null)
            return undefined;

        if (!this.items.has(itemId)){   
            let newItem: MWItem | undefined = undefined;
            if (go.is_weapon()){
                newItem = new MWWeapon(itemId);
            }
            else if (go.is_outfit()){
                newItem = new MWArmor(itemId);
            }
            else if (go.is_artefact()){
                newItem = new MWArtefact(itemId);
            }
            else if (go.section().includes("stimpack")){
                newItem = new MWStimpack(itemId);
            }

            if (newItem != undefined){
                newItem.Initialize();
                this.items.set(itemId, newItem);
            }
        }

        return this.items.get(itemId);
    }

    public GetWeapon(itemOrId: ObjectOrId): MWWeapon | undefined { 
        let item = this.GetItem(itemOrId);
        if(item?.Type == ObjectType.Weapon){
            return <MWWeapon>item;
        }
        return undefined;
    }

    public GetArmor(itemOrId: ObjectOrId): MWArmor | undefined { 
        let item = this.GetItem(itemOrId);
        if(item?.Type == ObjectType.Armor){
            return <MWArmor>item;
        }
        return undefined;
    }

    public GetArtefact(itemOrId: ObjectOrId): MWArtefact | undefined { 
        let item = this.GetItem(itemOrId);
        if(item?.Type == ObjectType.Artefact){
            return <MWArtefact>item;
        }
        return undefined;
    }

    public DestroyObject(id:Id) {
        this.CleanupObjectTimersAndMinimapMarks(id);
        this.Monsters.delete(id);
        this.items.delete(id);
    }

    public OnTakeItem(itemGO: game_object) {
        //Log(`OnTakeItem: ${item.id()}`)
        let item = this.GetItem(itemGO)
        if (item != undefined){
            item.OnItemPickedUp();
            this.CleanupObjectTimersAndMinimapMarks(itemGO.id());
        }
    }

    private CleanupObjectTimersAndMinimapMarks(id: Id){
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

    public OnItemToRuck(itemGO: game_object) {
        let item = this.GetItem(itemGO)
        item?.OnItemUnequipped();
        //Log(`OnItemToRuck: ${item.section()}`)
    }

    public OnItemToSlot(itemGO: game_object) {
        let item = this.GetItem(itemGO)
        item?.OnItemEquipped();
        //Log(`OnItemToRuck: ${item.section()}`)
    }
    
    public OnItemToBelt(itemGO: game_object) {
        let item = this.GetItem(itemGO)
        item?.OnItemEquipped();
        //Log(`OnItemToBelt: ${item.section()}`)
    }
    
    public OnWeaponFired(wpn: game_object, ammo_elapsed: number) {
        let weapon = this.GetWeapon(wpn)
        if (weapon != undefined && weapon.Section.endsWith("_mw") && weapon.GO.get_ammo_total() < 500){
            let ammo = ini_sys.r_sec_ex(weapon.Section, "ammo_class")
            alife_create_item(ammo, this.Player.GO, {ammo: 1});
        }
    }

    public OnPlayerSpawned():void{
        this.enemyDamageMult = GetDifficultyDamageMult();
        this.enemyDropChanceMult = GetDifficultyDropChanceMult()
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
        this.Timers.Update(deltaTime);
        this.UIManager.Update();
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

        let monster = this.GetMonster(attackerGO);
        if (monster == undefined) 
            return;

        let damage = monster.Damage;
        if (attackerGO.is_stalker() && shit.weapon_id != 0 && shit.weapon_id != attackerGO.id()){
            let weapon = level.object_by_id(shit.weapon_id);
            if (weapon?.is_weapon())
                damage *= clamp(weapon.cast_Weapon().RPM(), 0.3, 1.25); //limit on damage multiplier for slow firing enemies (can be overkill)
        }

        damage *= this.enemyDamageMult;
        damage *= (1 - this.Player.GetStat(StatType.DamageResistancePct) / 100)
        damage = math.max(1 + this.Player.Level / 15, damage)
        if (this.Player.HP > this.Player.MaxHP * 0.5 && damage >= this.Player.HP){ //Disable one hit kills if we have 50%+ hp
            damage = this.Player.HP - 1;
        }
        this.Player.HP -= damage;

        if (!this.Player.IsDead){
            this.Player.IterateSkills((s) => s.OnPlayerHit(monster!, damage))
        }

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
            let bonusWeaponDamageMult = 1 + this.Player.GetStat(this.GetDamageBonusStatByWeaponType(weapon.WeaponType)) / 100;
            let weaponDamage = weapon.Damage * bonusWeaponDamageMult / hits.length;

            for(let [monster, isCritPartHit] of hits){
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

                this.Player.IterateSkills((s) => monsterDamage = s.OnMonsterBeforeHit(monster, isCrit, monsterDamage))

                let realDamage = this.DamageMonster(monster, monsterDamage, isCrit);
                this.UIManager.ShowDamage(realDamage, isCrit, monster.IsDead)
                this.Player.IterateSkills((s) => s.OnMonsterHit(monster, isCrit))
            }
        }
    }

    GetDamageBonusStatByWeaponType(type: WeaponType): StatType {
        switch(type){
            case WeaponType.Pistol: return StatType.DamageWithPistolBonusPct;
            case WeaponType.SMG: return StatType.DamageWithSMGBonusPct;
            case WeaponType.Shotgun: return StatType.DamageWithShotgunBonusPct;
            case WeaponType.AssaultRifle: return StatType.DamageWithAssaultRifleBonusPct;
            case WeaponType.MachineGun: return StatType.DamageWithMachingGunBonusPct;
            case WeaponType.SniperRifle: return StatType.DamageWithSniperRifleBonusPct;
        }
    }

    DamageMonster(monster: MWMonster, damage: number, isCrit: boolean): number{
        let realDamage = math.min(monster.HP, damage)
        if (realDamage < monster.HP && (monster.HP - realDamage) < 3){ //Don't leave enemies with 1-2 hp (just not fun :D)
            realDamage = monster.HP;
        }
        monster.HP -= realDamage;

        if (monster.IsDead){
            this.OnMonsterKilled(monster, isCrit)
        }
        return realDamage;
    }

    GetStat(stat: StatType, ...sources: MWObject[]){
        let value = 0;
        for(let source of sources){
            value += source.GetStat(stat);
        }
        return value;
    }

    public OnMonsterKilled(monster: MWMonster, isCrit: boolean) {
        Log(`OnMonsterKilled. ${monster.Name} (${monster.SectionId})`)

        this.UIManager.ShowXPReward(monster.XPReward)
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
        let type = GetDropType(monster.Rank);

        let sgo: cse_alife_object | undefined = undefined;
        let [dropLevel, qualityLevel] = this.GetDropLevelAndQualityFromMonster(monster)
        let dropPos = CreateWorldPositionAtPosWithGO(CreateVector(0, 0.2, 0), monster.GO);
        if (type == DropType.Weapon){
            sgo = this.GenerateWeaponDrop(dropLevel, qualityLevel, dropPos);
        }
        else if (type == DropType.Stimpack){
            sgo = this.GenerateStimpackDrop(dropLevel, qualityLevel, dropPos);
        }
        else if (type == DropType.Armor){
            sgo = this.GenerateArmorDrop(dropLevel, qualityLevel, dropPos);
        }
        else if (type == DropType.Artefact){
            sgo = this.GenerateArtefactDrop(dropLevel, qualityLevel, dropPos);
        }

        if (sgo != undefined){
            Log(`Spawned ${sgo.section_name()}:${sgo.id}`)
            Save<ItemSpawnParams>(sgo.id, "MW_SpawnParams", {Level: dropLevel, Quality: qualityLevel});
            this.HighlightDroppedItem(sgo.id, type, qualityLevel);
            this.AddTTLTimer(sgo.id, 300)
        }
        else {
            Log(`Drop generation failed`)
        }
    }

    GetDropLevelAndQualityFromMonster(monster: MWMonster) : LuaMultiReturn<[number, number]>{
        let dropLevel = monster.Level;
        if (IsPctRolled(HigherLevelDropChancePct)){
            dropLevel++;
        }

        let qualityLevel = GetDropQuality(dropLevel);
        let rankCfg = MonsterRankConfigs[monster.Rank]
    
        if (IsPctRolled(rankCfg.DropLevelIncreaseChance)) dropLevel++;
        if (IsPctRolled(rankCfg.DropQualityIncreaseChance)) qualityLevel++;

        qualityLevel = math.min(qualityLevel, MaxQuality)

        return $multi(dropLevel, qualityLevel)
    }

    GenerateWeaponDrop(dropLevel: number, qualityLevel: number, pos: WorldPosition): cse_alife_object | undefined {
        let typedSections = ini_sys.r_list("mw_drops_by_weapon_type", "sections");
        let selectedTypeSection = GetRandomFromArray(typedSections);
        let weaponCount = ini_sys.line_count(selectedTypeSection);
        let selectedElement = math.random(0, weaponCount - 1);
        //Log(`Selecting base ${selectedElement} from ${weaponCount} in ${selectedTypeSection}`)
        let [_, weaponBaseSection] = ini_sys.r_line_ex(selectedTypeSection, selectedElement)
        let weaponVariants = ini_sys.r_list(weaponBaseSection, "variants")
        let selectedVariant = GetRandomFromArray(weaponVariants)

        return alife_create_item(selectedVariant, pos)
    }

    GenerateStimpackDrop(dropLevel: number, qualityLevel: number, pos: WorldPosition): cse_alife_object | undefined {
        let section = GetStimpackByQuality(qualityLevel);
        return alife_create_item(section, pos)
    }

    GenerateArmorDrop(dropLevel: number, qualityLevel: number, pos: WorldPosition): cse_alife_object | undefined {
        qualityLevel = math.min(qualityLevel, MaxQuality)
        let section = `outfits_ql_${qualityLevel}`;
        let armorCount = ini_sys.line_count(section);
        let selectedElement = math.random(0, armorCount - 1);
        let [_, armorSection] = ini_sys.r_line_ex(section, selectedElement)

        return alife_create_item(armorSection, pos)
    }

    GenerateArtefactDrop(dropLevel: number, qualityLevel: number, pos: WorldPosition): cse_alife_object | undefined {
        qualityLevel = math.min(qualityLevel, MaxQuality)
        let section = `artefacts_mw`;
        let artefactCount = ini_sys.line_count(section);
        let selectedElement = math.random(0, artefactCount - 1);
        let [_, artefactSection] = ini_sys.r_line_ex(section, selectedElement)

        return alife_create_item(artefactSection, pos)
    }

    highlightParticles: LuaTable<Id, particles_object> = new LuaTable()
    HighlightDroppedItem(id: Id, type: DropType, quality: number) {
        this.Timers.AddOnObjectSpawn(`${id}_highlight`, id, (obj) => {
            let particles = new particles_object(QualityConfigs.get(quality).Particles);
            this.highlightParticles.set(id, particles)
            let pos = obj.position()
            pos.y -= 0.1;
            particles.play_at_pos(pos)

            let spotType = SpotType.Body;
            if (type == DropType.Stimpack){
                level.map_add_object_spot_ser(id, SpotType.Friend, "")
            }
            else if (type == DropType.Weapon){
                if (quality == 3 || quality == 4)
                    spotType = SpotType.Friend;
                if (quality == 5)
                    spotType = SpotType.Treasure;
            }
            level.map_add_object_spot_ser(id, spotType, "")
        })
    }

    RemoveHighlight(id: Id){
        //Log(`remove highligh: ${id}`)
        this.Timers.Remove(`${id}_highlight`)
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
        this.Timers.AddOneTime(`${id}_ttl`, time, () => {
            let toRelease = alife().object(id)
            if (toRelease != undefined){
                safe_release_manager.release(toRelease);
            }
        });
    }

    RemoveTTLTimer(id: Id){ this.Timers.Remove(`${id}_ttl`) }

    public GetMonstersInRange(pos: vector, range: number) : MWMonster[] {
        let result: MWMonster[] = [];
        let rangeSqr = range * range
        for (let [_, monster] of MonsterWorld.Monsters) {
            if (monster.GO == undefined || monster.IsDead)
                continue;
            let distanceSqr = monster.GO.position().distance_to_sqr(pos);
            if (distanceSqr <= rangeSqr) {
                result.push(monster)
            }
        }
        return result;
    }

    private DoMonkeyPatch() {
        bind_anomaly_field.dyn_anomalies_refresh = (_force) => {}
        let oldAnomalyRefresh =  bind_anomaly_zone.anomaly_zone_binder.refresh;
        bind_anomaly_zone.anomaly_zone_binder.refresh = (s, from) => { 
            s.disabled = true;
            oldAnomalyRefresh(s, from);
        }
        bind_anomaly_zone.anomaly_zone_binder.turn_on = (s) => {}
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

    private ChangeQuickSlotItems(){
        exec_console_cmd(`slot_0 ${GetStimpackByQuality(0)}`)
        exec_console_cmd(`slot_1 ${GetStimpackByQuality(1)}`)
        exec_console_cmd(`slot_2 ${GetStimpackByQuality(2)}`)
    }
}

export type HitInfo = {
    monster: MWMonster,
    weapon: MWWeapon,
    isCritPartHit: boolean,
}

//actor_menu.set_msg(2, `Enemy ${monster.Name} was hit for ${damage}`, 3, GetARGB(255, 240, 20, 20))