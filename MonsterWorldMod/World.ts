import { Log } from '../StalkerModBase';
import * as constants from './Configs/Constants';
import { MonsterWorldMod } from './MonsterWorldMod';
import { MWMonster } from './GameObjects/MWMonster';
import { MWPlayer } from './GameObjects/MWPlayer';
import { MWWeapon } from './GameObjects/MWWeapon';
import { SpawnManager } from './Managers/SpawnManager';
import { UIManager } from './Managers/UIManager';
import { BaseMWObject } from './GameObjects/BaseMWObject';
import { GetDifficultyDamageMult, GetDifficultyDropChanceMult } from './Helpers/Difficulty';
import { GetDropType, HigherLevelDropChancePct, MaxQuality, GetDropQuality, GetStimpack, GetDropParticles, DropType } from './Configs/Loot';
import { StatType } from './Configs/Stats';
import { ObjectOrId, GetId, CreateVector, CreateWorldPositionAtPosWithGO, Save } from './Helpers/StalkerAPI';
import { RandomFromArray } from './Helpers/Collections';
import { IsPctRolled } from './Helpers/Random';
import { TimerManager } from './Managers/TimerManager';

declare global{
    let MonsterWorld: World;
}

export class World {
    private weapons: LuaTable<Id, MWWeapon>
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
        this.weapons = new LuaTable();

        this.SpawnManager = new SpawnManager();
        this.UIManager = new UIManager();
        this.Timers = new TimerManager();

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

    public GetWeapon(item: ObjectOrId): MWWeapon | undefined {
        //Log(`GetWeapon: ${itemId}`)
        let itemId = GetId(item);
        let se_obj = alife_object(itemId);
        let go = level.object_by_id(itemId);
        if (se_obj == null || go == null || !go.is_weapon())
            return undefined;

        if (!this.weapons.has(itemId)){    
            //Log(`GetWeapon crate new: ${itemId}`)
            let weapon = new MWWeapon(itemId);
            weapon.Initialize();
            this.weapons.set(itemId, weapon);
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
                damage *= clamp(weapon.cast_Weapon().RPM(), 0.25, 1.25); //limit on damage multiplier for slow firing enemies (can be overkill)
        }

        damage = math.max(1, damage) * this.enemyDamageMult;
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

                let realDamage = this.DamageMonster(monster, monsterDamage, isCrit);
                this.UIManager.ShowDamage(realDamage, isCrit, monster.IsDead)
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
        let type = GetDropType();

        let sgo: cse_alife_object | undefined = undefined;
        let quality = 1;
        if (type == DropType.Weapon){
            [sgo, quality] = this.GenerateWeaponDropFromMonster(monster);
        }
        else if (type == DropType.Stimpack){
            [sgo, quality] = this.GenerateStimpackDropFromMonster(monster);
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

    GenerateWeaponDrop(dropLevel: number, qualityLevel: number, pos: WorldPosition): cse_alife_object | undefined {
        let typedSections = ini_sys.r_list("mw_drops_by_weapon_type", "sections");
        let selectedTypeSection = RandomFromArray(typedSections);
        let weaponCount = ini_sys.line_count(selectedTypeSection);
        let selectedElement = math.random(0, weaponCount - 1);
        Log(`Selecting base ${selectedElement} from ${weaponCount} in ${selectedTypeSection}`)
        let [_, weaponBaseSection] = ini_sys.r_line_ex(selectedTypeSection, selectedElement)
        let weaponVariants = ini_sys.r_list(weaponBaseSection, "variants")
        let selectedVariant = RandomFromArray(weaponVariants)
        
        if (IsPctRolled(HigherLevelDropChancePct)){
            dropLevel++;
        }

        Log(`Spawning ${selectedVariant}`)
        let sgo = alife_create_item(selectedVariant, pos)// db.actor.position());
        if (!sgo){
            Log(`GenerateWeaponDrop spawn failed`)
            return undefined;
        }

        qualityLevel = math.min(qualityLevel, MaxQuality)

        Save(sgo.id, "MW_SpawnParams", {level: dropLevel, quality: qualityLevel});
        return sgo;
        
    }

    GenerateWeaponDropFromMonster(monster: MWMonster): LuaMultiReturn<[cse_alife_object | undefined, number]> {
        let dropLevel = monster.Level;
        let qualityLevel = GetDropQuality();
    
        if (IsPctRolled(constants.EnemyDropLevelIncreaseChanceByRank[monster.Rank])) dropLevel++;
        if (IsPctRolled(constants.EnemyDropQualityIncreaseChanceByRank[monster.Rank])) qualityLevel++;
        return $multi(this.GenerateWeaponDrop(dropLevel, qualityLevel, CreateWorldPositionAtPosWithGO(CreateVector(0, 0.2, 0), monster.GO)), qualityLevel)
    }

    GenerateStimpackDrop(section: Section, pos: WorldPosition): cse_alife_object | undefined {
        let sgo = alife_create_item(section, pos)
        if (!sgo){
            Log(`GenerateStimpackDrop spawn failed`)
            return undefined;
        }
        return sgo;
    }

    GenerateStimpackDropFromMonster(monster: MWMonster): LuaMultiReturn<[cse_alife_object | undefined, number]> {
        let [stimpackSection, quality] = GetStimpack();
        Log(`Spawning ${stimpackSection}`)
        
        return $multi(this.GenerateStimpackDrop(stimpackSection, CreateWorldPositionAtPosWithGO(CreateVector(0, 0.2, 0), monster.GO)), quality);
    }

    highlightParticles: LuaTable<Id, particles_object> = new LuaTable()
    HighlightDroppedItem(id: Id, type: DropType, quality: number) {
        this.Timers.AddOnObjectSpawn(`${id}_highlight`, id, (obj) => {
            let particles = new particles_object(GetDropParticles(type, quality));
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
}

export type HitInfo = {
    monster: MWMonster,
    weapon: MWWeapon,
    isCritPartHit: boolean,
}

//actor_menu.set_msg(2, `Enemy ${monster.Name} was hit for ${damage}`, 3, GetARGB(255, 240, 20, 20))