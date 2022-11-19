import { IsPctRolled } from '../StalkerAPI/extensions/basic';
import { Log } from '../StalkerModBase';
import * as cfg from './MonsterWorldConfig';
import { MonsterWorldMod } from './MonsterWorldMod';
import { MWMonster } from './MWMonster';
import { MWPlayer } from './MWPlayer';
import { MWWeapon } from './MWWeapon';

type WeaponDropInfo = {
    level: number;
}

export class MonsterWorld {
    private safeSmarts: LuaSet<Id>
    private player?: MWPlayer;
    private monsters: LuaTable<Id, MWMonster>
    private weapons: LuaTable<Id, MWWeapon>

    private weaponDrops: LuaTable<Id, WeaponDropInfo>

    constructor(public mod: MonsterWorldMod){
        this.safeSmarts = new LuaSet();
        this.monsters = new LuaTable();
        this.weapons = new LuaTable();
        this.weaponDrops = new LuaTable();
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
    
    CreateMonster(monster: game_object) {
        this.monsters.set(monster.id(), new MWMonster(this, monster.id()));
    }
    DestroyObject(id:Id) {
        this.monsters.delete(id);
        this.weapons.delete(id);
        this.weaponDrops.delete(id);
    }

    CreateItem(item: game_object){
        if (!IsWeapon(item))
            return;

        Log(`Create item ${item.section()}:${item.id()}. Drop configs = ${this.weaponDrops.length} `)
        
        let config = this.weaponDrops.get(item.id());
        Log(`Has config: ${config != undefined}`)
        this.weaponDrops.delete(item.id());
        if (this.weapons.has(item.id()))
            return;

        this.weapons.set(item.id(), new MWWeapon(this, item.id(), config?.level || 1));
    }

    public OnPlayerSpawned():void{
        db.actor.inventory_for_each((item) => this.CreateItem(item));
    }

    public Save(data: { [key: string]: any; }) {
        data.safeSmarts = this.safeSmarts;
        data.weaponDrops = this.weaponDrops;
    }

    public Load(data: { [key: string]: any; }) {
        this.safeSmarts = data.safeSmarts || new LuaSet();
        this.weaponDrops = data.weaponDrops || new LuaTable();
    }

    public FillStartPositions(){
        let setting_ini = new ini_file("misc\\simulation.ltx");
        setting_ini.section_for_each((section) => {
            
            let smart = SIMBOARD.smarts_by_names[section];
            if (!smart) {
                Log(`sim_board:fill_start_position incorrect smart by name ${section}`)
                return false;
            }

            //Log(`Iterating on ${section}. Smart: ${smart.id} ${smart.name()}`)

            const lineCount = setting_ini.line_count(section);
            for(let line = 0; line < lineCount; line++){
                let [_res, squad_section, countStr] = setting_ini.r_line(section, line)
                let count = tonumber(countStr) || 1

                let common = ini_sys.r_bool_ex(squad_section,"common", false)
                let faction = ini_sys.r_string_ex(squad_section,"faction")

                if (common){
                    let countMult = is_squad_monster[faction] ? 5 : 1;
                    count = round_idp(count * countMult)
                }
                
                Log(`     ${line + 1}/${lineCount}: ${squad_section} =${count} (${common})`)

                if (common) continue;
                if (!squad_section.includes("trader") && !squad_section.includes("mechanic") && !squad_section.includes("barman")) continue;

                this.safeSmarts.add(smart.id);
                //Log(`Added to safe smarts: ${smart.id}. safe smarts#: ${this.safeSmarts.length}`)

                for (let i = 0; i < count; i++){
                    SIMBOARD.create_squad(smart, squad_section)
                }
            }

            return false;
        });

        SIMBOARD.start_position_filled = true;
    }

    OnTryRespawn(smart: smart_terrain.se_smart_terrain): boolean {
        if (!smart.is_on_actor_level)
            return false;

        if (this.safeSmarts.has(smart.id)) {
            //this.Log(`Smart is safe: ${smart.id} ${smart.name()}`)
            return false;
        }       

        if (smart.respawn_idle == 5)
            return true;

        //super.OnSmartTerrainTryRespawn(smart);
        //Log(`Setup configs for smart: ${smart.name()}`)
        smart.respawn_idle = 5;
        smart.max_population = 5;

        if (math.random(1, 100) > 60){
            smart.respawn_params = {
                "spawn_section_1": {
                    num: xr_logic.parse_condlist(null, null, null, "3"), 
                    squads: ["simulation_snork"]
                },
            }
        }
        else {
            smart.respawn_params = {
                "spawn_section_1": {
                    num: xr_logic.parse_condlist(null, null, null, "3"), 
                    squads: ["simulation_pseudodog", "simulation_mix_dogs"]
                }
            } 
        }

        smart.already_spawned = {"spawn_section_1": {num: 0}, "spawn_section_2": {num: 0}}

        return true;
    }

    public OnPlayerHit(attackerGO: game_object) {
        let monster = this.GetMonster(attackerGO.id());
        if (monster == undefined) 
            return;

        this.Player.HP -= monster.Damage;
        Log(`Player [${ this.Player.HP} / ${this.Player.MaxHP}] was hit by ${monster.Name} for ${monster.Damage} damage`);
    }

    public OnMonsterHit(monsterGO: game_object, attacker: game_object) {
        let monster = this.GetMonster(monsterGO.id());
        if (monster == undefined) 
            return;

        let damage = monster.MaxHP / 3;
        monster.HP -= damage;
        //actor_menu.set_msg(2, `Enemy ${monster.Name} was hit for ${damage}`, 3, GetARGB(255, 240, 20, 20))
        Log(`${monster.Name} [${monster.HP} / ${monster.MaxHP}] was hit by player for ${damage} damage`);
    }

    public OnMonsterKilled(monsterGO: game_object) {
        let monster = this.GetMonster(monsterGO.id());
        if (monster == undefined) 
            return;

        actor_menu.set_msg(1, `EXP +${monster.XPReward} for ${monster.Name}`, 3, GetARGB(255, 20, 240, 20))
        this.Player.Exp += monster.XPReward;

        if (IsPctRolled(cfg.EnemyDropChance)){
            let sgo = alife_create_item("wpn_aps", db.actor);
            Log(`Dropping loot ${sgo.section_name()}:${sgo.id}`)
            this.weaponDrops.set(sgo.id, {level: monster.Level})
        }
    }
}