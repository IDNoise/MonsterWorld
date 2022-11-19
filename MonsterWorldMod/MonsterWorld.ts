import { MonsterWorldMod } from './MonsterWorldMod';
import { MWMonster } from './MWMonster';
import { MWPlayer } from './MWPlayer';

export class MonsterWorld {
    
    private safeSmarts: Id[] = [];

    constructor(public mod: MonsterWorldMod){}

    Log(text: string): void { this.mod.Log(text); }

    GetPlayer() { return new MWPlayer(db.actor); }

    public Save(data: { [key: string]: any; }) {
        data.safeSmarts = this.safeSmarts;
    }

    public Load(data: { [key: string]: any; }) {
        this.safeSmarts = data.safeSmarts || [];
    }

    public FillStartPositions(){
        let setting_ini = new ini_file("misc\\simulation.ltx");
        setting_ini.section_for_each((section) => {
            
            let smart = SIMBOARD.smarts_by_names[section];
            if (!smart) {
                this.Log(`sim_board:fill_start_position incorrect smart by name ${section}`)
                return false;
            }

            this.Log(`Iterating on ${section}. Smart: ${smart.id} ${smart.name()}`)

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
                
                this.Log(`     ${line + 1}/${lineCount}: ${squad_section} =${count} (${common})`)

                if (common) continue;
                if (!squad_section.includes("trader") && !squad_section.includes("mechanic") && !squad_section.includes("barman")) continue;

                this.safeSmarts.push(smart.id);
                this.Log(`Added to safe smarts: ${smart.id}. safe smarts#: ${this.safeSmarts.length}`)

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

        if (this.safeSmarts.indexOf(smart.id) >= 0) {
            //this.Log(`Smart is safe: ${smart.id} ${smart.name()}`)
            return false;
        }       

        if (smart.respawn_idle == 5)
            return true;

        //super.OnSmartTerrainTryRespawn(smart);
        this.Log(`Setup configs for smart: ${smart.name()}`)
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

    public OnPlayerHit(monster: MWMonster) {
        let player = this.GetPlayer();
        player.HP -= monster.Damage;
        this.Log(`Player [${player.HP} / ${player.MaxHP}] was hit by ${monster.Name} for ${monster.Damage} damage`);
    }

    public OnMonsterHit(monster: MWMonster) {
        let damage = monster.MaxHP / 3;
        monster.HP -= damage;
        //actor_menu.set_msg(2, `Enemy ${monster.Name} was hit for ${damage}`, 3, GetARGB(255, 240, 20, 20))
        this.Log(`${monster.Name} [${monster.HP} / ${monster.MaxHP}] was hit by player for ${damage} damage`);
    }

    public OnMonsterKilled(monster: MWMonster) {
        actor_menu.set_msg(1, `EXP +${monster.EXPReward} for ${monster.Name}`, 3, GetARGB(255, 20, 240, 20))
        this.GetPlayer().Exp += monster.EXPReward;
    }
}
