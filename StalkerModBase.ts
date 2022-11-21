
type LootTableEntryParams = {count?: number}
type LootTable = {[key: string]: LootTableEntryParams}

export function Log(message: string): void { 
    if ( !StalkerModBase.IsLogEnabled ) 
            return;
        log(`[${StalkerModBase.ModName}:${time_global()}] ${message}`);
}

export class StalkerModBase {
    static ModName: string = "StarlkerModBase";
    static IsLogEnabled: boolean = true;

    //Player
    protected OnBeforeLevelChanging() : void {
        Log("OnBeforeLevelChanging")
    }
    protected OnLevelChanging() : void {
        Log("OnLevelChanging")
    }
    protected OnActorNetDestroy() : void {
        Log("OnActorNetDestroy")
    }
    protected OnActorFirstUpdate() : void {
        Log("OnActorFirstUpdate")
    }
    protected OnActorUpdate() : void {
        //Log("OnActorUpdate")
    }
    protected OnActorBeforeHit(shit: hit, boneId: BoneId): boolean {
        //Log(`OnActorBeforeHit by ${shit.draftsman && shit.draftsman.section()}:${shit.draftsman && shit.draftsman.id()} with type: ${shit.type} and power: ${shit.power} from weapon_id: ${shit.weapon_id || "None"}`)
        return true;
    }
    protected OnActorHit(amount: number, localDirection: vector, attacker: game_object, boneId: BoneId): void {
        //Log(`OnActorHit by ${attacker.section()}:${attacker.id()} for ${amount} in bone ${boneId}`)
    }

    //Monster
    protected OnMonsterNetSpawn(monster: game_object, serverObject: cse_alife_monster_base): void {
        //Log(`OnMonsterNetSpawn ${monster.section()}:${monster.id()} - ${serverObject.id}`)
    }
    protected OnMonsterNetDestroy(monster: game_object): void {
        //Log(`OnMonsterNetDestroy ${monster.section()}:${monster.id()}`)
    }
    protected OnMonsterBeforeHit(monster: game_object, shit: hit, boneId: BoneId): boolean {
        const weapon = level.object_by_id(shit.weapon_id);
        //Log(`OnMonsterBeforeHit ${monster.section()}:${monster.id()} by ${shit.draftsman && shit.draftsman.section()}:${shit.draftsman.id()} with ${weapon && weapon.id() || "'no weapon'"} for ${shit.power} in bone ${boneId}`)
        return true;
    }
    protected OnMonsterHit(monster: game_object, amount: number, localDirection: vector, attacker: game_object, boneId: BoneId): void {
        //Log(`OnMonsterHit ${monster.section()}:${monster.id()} by ${attacker.section()}:${attacker.id()} for ${amount} in bone ${boneId}`)
    }
    protected OnMonsterDeath(monster: game_object, killer: game_object): void {
        //Log(`OnMonsterDeath ${monster.section()}:${monster.id()} by ${killer.section()}:${killer.id()}`)
    }
    protected OnMonsterActorUse(monster: game_object, user: game_object): void {
        //Log(`OnMonsterActorUse ${monster.section()}:${monster.id()} by ${user.section()}:${user.id()}`)
    }
    protected OnMonsterLootInit(monster: game_object, lootTable: LootTable): void {
        //Log(`OnMonsterLootInit ${monster.section()}:${monster.id()}`)
    }

    //NPC
    protected OnNpcNetSpawn(npc: game_object, serverObject: cse_alife_creature_actor): void {
        //Log(`OnNpcNetSpawn ${npc.section()}:${npc.id()} - ${serverObject.id}`)
    }
    protected OnNpcNetDestroy(npc: game_object): void {
        //Log(`OnNpcNetDestroy ${npc.section()}:${npc.id()}`)
    }
    protected OnNPCBeforeHit(npc: game_object, shit: hit, boneId: BoneId): boolean {
        //Log(`OnNPCBeforeHit ${npc.section()}:${npc.id()} by ${shit.draftsman && shit.draftsman.section()}:${shit.draftsman.id()} for ${shit.power} in bone ${boneId}`)
        return true;
    }
    protected OnNPCHit(npc: game_object, amount: number, localDirection: vector, attacker: game_object, boneId: BoneId): void {
        //Log(`OnNPCHit ${npc.section()}:${npc.id()} by ${attacker.section()}:${attacker.id()} for ${amount} in bone ${boneId}`)
    }
    protected OnNPCDeath(npc: game_object, killer: game_object): void {
        //Log(`OnNPCDeath ${npc.section()}:${npc.id()} by ${killer.section()}:${killer.id()}`)
    }

    //Simulation
    protected OnSimulationFillStartPosition(): void{
        Log(`OnSimulationFillStartPosition`)
    }
    protected OnSmartTerrainTryRespawn(smart: SmartTerrain) : boolean{
        //Log(`OnSmartTerrainTryRespawn ${smart.id} ${smart.name()}`)
        return true;
    }

    //Server objects
    protected OnServerEntityRegister(serverObject: cse_alife_object, type: ServerObjectType): void{
        //Log(`OnServerEntityRegister ${type} - ${serverObject.section_name()}:${serverObject.id} ${serverObject.name()}`)
    }
    protected OnServerEntityUnregister(serverObject: cse_alife_object, type: ServerObjectType): void{
        //Log(`OnServerEntityUnregister ${type} - ${serverObject.section_name()}:${serverObject.id} ${serverObject.name()}`)
    }

    //Files
    protected OnSaveState(data: {[key: string]: any}): void {
        Log(`OnSaveState`)
    }

    protected OnLoadState(data: {[key: string]: any}): void {
        Log(`OnLoadState`)
    }

    //Items
    protected OnItemNetSpawn(item: game_object, serverObject: cse_alife_item) {
        Log(`OnItemNetSpawn ${item.name()}`)
    }

    protected OnItemTake(item: game_object) {
        Log(`OnItemTake ${item.name()}`)
    }

    // GUI
    protected OnItemFocusReceive(item: game_object): void{
        Log(`OnItemFocusReceive ${item.section()}:${item.id()}`);
    }

    protected RegisterCallbacks():void{
        Log("Register callbacks");

        //
        //Actor
        //
        RegisterScriptCallback("on_before_level_changing", () => this.OnBeforeLevelChanging());
        RegisterScriptCallback("on_level_changing", () => this.OnLevelChanging());
        RegisterScriptCallback("actor_on_net_destroy", () => this.OnActorNetDestroy());
        RegisterScriptCallback("actor_on_first_update", () => this.OnActorFirstUpdate());
        RegisterScriptCallback("actor_on_update",  () => this.OnActorUpdate());
        RegisterScriptCallback("actor_on_before_hit",  (shit, boneId, flags : CallbackReturnFlags) => {
            flags.ret_value = this.OnActorBeforeHit(shit, boneId)
        });
        RegisterScriptCallback("actor_on_hit_callback",  (amount, localDirection, attacker, boneId) => this.OnActorHit(amount, localDirection, attacker, boneId));
        // actor_on_before_death		            = {}, -- Params: (<number>,<table>)
        // actor_on_weapon_fired		            = {}, -- Params: (<game_object>,<game_object>,<number>,<number>,<number>,<number>)
        // actor_on_weapon_jammed		            = {}, -- Params: (<game_object>)
        // actor_on_weapon_no_ammo		            = {}, -- Params: (<game_object>,<number>)
        // actor_on_weapon_lower		            = {}, -- Params: (<game_object>)
        // actor_on_weapon_raise	         	    = {}, -- Params: (<game_object>)
        // actor_on_weapon_reload		            = {}, -- Params: (<game_object>,<number>)
        // actor_on_weapon_zoom_in		            = {}, -- Params: (<game_object>)
        // actor_on_weapon_zoom_out	            = {}, -- Params: (<game_object>)
        // actor_on_item_take			            = {}, -- Params: (<game_object>)
        // actor_on_item_take_from_box             = {}, -- Params: (<game_object>,<game_object>)
        // actor_on_item_put_in_box 	            = {}, -- Params: (<game_object>,<game_object>)
        // actor_on_item_drop			            = {}, -- Params: (<game_object>)
        // actor_on_item_use			            = {}, -- Params: (<game_object>,<string>)
        // actor_on_item_before_use			    = {}, -- Params: (<game_object>,<table>)
        // actor_on_item_before_pickup				= {}, -- Params: (<game_object>,<table>)
        // actor_item_to_belt			            = {}, -- Params: (<game_object>)
        // actor_item_to_ruck			            = {}, -- Params: (<game_object>)
        // actor_item_to_slot			            = {}, -- Params: (<game_object>)
        // actor_on_trade				            = {}, -- Params: (<game_object>,<?>,<number>)
        // actor_on_init				            = {}, -- Params: (<binder>)
        // actor_on_reinit				            = {}, -- Params: (<binder>)
        // actor_on_info_callback		            = {}, -- Params: (<game_object>,<number>)
        // actor_on_attach_vehicle		            = {}, -- Params: (<game_object>)
        // actor_on_detach_vehicle		            = {}, -- Params: (<game_object>)
        // actor_on_use_vehicle		            = {}, -- Params: (<game_object>)
        // actor_on_hud_animation_play				= {}, -- Params: (<table>,<game_object>)
        // actor_on_hud_animation_end              = {}, -- Params: (<game_object>,<string>,<?>,<?>,<number>)
        // actor_on_hud_animation_mark				= {}, -- Params: (<number>,<string>)
        // actor_on_sleep				            = {}, -- Params: (<number>)
        // actor_on_foot_step			            = {}, -- Params: (<game_object>,<number>,<?>,<?>,<?>)
        // actor_on_interaction		            = {}, -- Params: (<string>,<game_object>,<string>)
        // actor_on_before_hit_belt				= {}, -- Params: (<table>,<number>,<number>)
        // actor_on_weapon_before_fire	            = {}, -- Params: (<table>)
        // actor_on_feeling_anomaly	            = {}, -- Params: (<game_object>,<table>)
        // actor_on_leave_dialog			        = {}, -- Params: (<number>)
        // actor_on_stash_create                   = {}, -- Params: (<table>)
        // actor_on_stash_remove                   = {}, -- Params: (<table>)
        // actor_on_frequency_change               = {}, -- Params: (<number>,<number>)
        // actor_on_achievement_earned		        = {}, -- Params: (<string>,<string>)
        // actor_on_movement_changed				= {}, -- Params: (<number>)
        // actor_on_footstep						= {}, -- Params: (<string>,<number>,<boolean>,<table>)
        // actor_on_jump							= {}, -- Params: ()
        // actor_on_land							= {}, -- Params: (<number>)


        //
        //Monster
        //
        RegisterScriptCallback("monster_on_net_spawn",  (monster, serverObject) => this.OnMonsterNetSpawn(monster, serverObject));
        RegisterScriptCallback("monster_on_net_destroy",  (monster) => this.OnMonsterNetDestroy(monster));
        RegisterScriptCallback("monster_on_before_hit",  (monster, shit, boneId, flags : CallbackReturnFlags) => {
            flags.ret_value = this.OnMonsterBeforeHit(monster, shit, boneId);
        });
        RegisterScriptCallback("monster_on_hit_callback",  (monster, amount, localDirection, attacker, boneId) => this.OnMonsterHit(monster, amount, localDirection, attacker, boneId));
        RegisterScriptCallback("monster_on_death_callback",  (monster, killer) => this.OnMonsterDeath(monster, killer));
        RegisterScriptCallback("monster_on_actor_use_callback",  (monster, actor) => this.OnMonsterActorUse(monster, actor))
        RegisterScriptCallback("monster_on_loot_init", (monster, lootTable) => this.OnMonsterLootInit(monster, lootTable));
        // monster_on_update				        = {}, -- Params: (<game_object>,<table>)
	    // burer_on_before_weapon_drop             = {}, -- Params: (<game_object>,<game_object>)
	
        //
        //NPC
        //
        RegisterScriptCallback("npc_on_net_spawn",  (npc, serverObject) => this.OnNpcNetSpawn(npc, serverObject));
        RegisterScriptCallback("npc_on_net_destroy",  (npc) => this.OnNpcNetDestroy(npc));
        RegisterScriptCallback("npc_on_before_hit",  (npc, shit, boneId, flags : CallbackReturnFlags) => { 
            flags.ret_value = this.OnNPCBeforeHit(npc, shit, boneId)
        });
        RegisterScriptCallback("npc_on_hit_callback",  (npc, amount, localDirection, attacker, boneId) => this.OnNPCHit(npc, amount, localDirection, attacker, boneId));
        RegisterScriptCallback("npc_on_death_callback",  (npc, killer) => this.OnNPCDeath(npc, killer));
        // npc_on_use 					            = {}, -- Params: (<game_object>,<game_object>)
        // npc_on_choose_weapon					= {}, -- Params: (<game_object>,<game_object>,<table>)
        // npc_on_item_take 			            = {}, -- Params: (<game_object>,<game_object>)
        // npc_on_item_take_from_box	            = {}, -- Params: (<game_object>,<game_object>,<game_object>)
        // npc_on_item_drop 			            = {}, -- Params: (<game_object>,<game_object>)
        // npc_on_update				            = {}, -- Params: (<game_object>,<table>)
        // npc_on_fighting_actor		            = {}, -- Params: (<game_object>)
        // npc_on_weapon_strapped		            = {}, -- Params: (<game_object>,<game_object>)
        // npc_on_weapon_unstrapped	            = {}, -- Params: (<game_object>,<game_object>)
        // npc_on_weapon_drop			            = {}, -- Params: (<game_object>,<game_object>)
        // npc_on_hear_callback		            = {}, -- Params: (<game_object>,<number>,<?>,<number>,<number>,<vector>)
        // npc_on_get_all_from_corpse 	            = {}, -- Params: (<game_object>,<game_object>,<game_object>,<boolean>)
        // npc_on_eval_danger 	            		= {}, -- Params: (<game_object>,<table>)
        // anomaly_on_before_activate             	= {}, -- Params: (<game_object>,<game_object>)

        //
        // Squads
        //
        // squad_on_npc_creation		            = {}, -- Params: (<server_object>,<server_object>,<server_object>)
        // squad_on_enter_smart		            = {}, -- Params: (<server_object>,<server_object>)
        // squad_on_leave_smart		            = {}, -- Params: (<server_object>,<server_object>)
        // squad_on_npc_death			            = {}, -- Params: (<server_object>,<server_object>,<server_object>)
        // squad_on_update				            = {}, -- Params: (<server_object>)
        // squad_on_first_update		            = {}, -- Params: (<server_object>)
        // squad_on_add_npc			            = {}, -- Params: (<server_object>,<server_object>,<string>,<vector>,<number>,<number>)
        // // WARNING!!!!!:
        // // the following 2 callbacks will ALWAYS fire on level change/loaded save because the old data isn't saved for compatibility purpose
        // // it's up to the user to check for the case in which old level name/old game vertex is nil in their code if they want to use this
        // squad_on_after_game_vertex_change		= {}, -- Params: (<server_object>,<number>,<number>,<boolean>)
        // squad_on_after_level_change				= {}, -- Params: (<server_object>,<string>,<string>)


        //
        //Simulation
        //
        RegisterScriptCallback("fill_start_position", () => this.OnSimulationFillStartPosition())
        RegisterScriptCallback("on_try_respawn", (smart, flags: CallbackReturnFlags) => {
            flags.disabled = !this.OnSmartTerrainTryRespawn(smart);
        });

        //
        //Server objects
        //
        RegisterScriptCallback("server_entity_on_register", (serverObject, type) => this.OnServerEntityRegister(serverObject, type));
        RegisterScriptCallback("server_entity_on_unregister", (serverObject, type) => this.OnServerEntityUnregister(serverObject, type));
        // se_stalker_on_spawn			            = {}, -- Params: (<server_object>)
        // se_actor_on_STATE_Write		            = {}, -- Params: (<server_object>)
        // se_actor_on_STATE_Read		            = {}, -- Params: (<server_object>)
        
        //
        // Physical objects
        //
        // physic_object_on_hit_callback 	        = {}, -- Params: (<game_object>,<number>,<vector>,<game_object>,<number>)
        // physic_object_on_use_callback 	        = {}, -- Params: (<game_object>,<game_object>)

        //
        // Vehicles
        //
        // heli_on_hit_callback			        = {}, -- Params: (<game_object>,<number>,<nil>,<game_object>,<nil>)
        // vehicle_on_death_callback				        = {}, -- Params: (<number>)

        //
        // GUI
        //
        // ActorMenu_on_before_init_mode			= {}, -- Params: (<string>,<table>,<game_object>)
        // ActorMenu_on_mode_changed			    = {}, -- Params: (<number>,<number>)
        // ActorMenu_on_item_drag_drop		        = {}, -- Params: (<game_object>,<game_object>,<number>,<number>)
        RegisterScriptCallback("ActorMenu_on_item_focus_receive", (item) => this.OnItemFocusReceive(item));
        // ActorMenu_on_item_focus_lost 	        = {}, -- Params: (<game_object>)
        // ActorMenu_on_item_before_move 	        = {}, -- Params: (<table>,<number>,<game_object>,<string>,,<number>)
        // ActorMenu_on_item_after_move 	        = {}, -- Params: (<number>,<game_object>,<string>,,<number>)
        // ActorMenu_on_trade_started				= {}, -- Params: ()
        // ActorMenu_on_trade_closed				= {}, -- Params: ()
        // GUI_on_show                             = {}, -- Params: (<string>,<string>)
        // GUI_on_hide                             = {}, -- Params: (<string>,<string>)
        // map_spot_menu_add_property		        = {}, -- Params: (<CUIWindow>,<number>,<string>,<string>)
        // map_spot_menu_property_clicked 	        = {}, -- Params: (<CUIWindow>,<number>,<string>,<string>)
        // main_menu_on_keyboard		            = {}, -- Params: (<number>,<number>,<CUIScriptWnd>,<boolean>)
        // main_menu_on_init			            = {}, -- Params: (<CUIScriptWnd>)
        // --	main_menu_on_init_callbacks	            = {},
        // main_menu_on_quit			            = {}, -- Params: (<CUIScriptWnd>)
        // on_screen_resolution_changed			= {}, -- Params: ()

        //
        // Technical
        //
        // on_game_load				            = {}, -- Params: (<binder>)
        // on_key_press				            = {}, -- Params: (<number>)
        // on_key_release				            = {}, -- Params: (<number>)
        // on_key_hold					            = {}, -- Params: (<number>)
        // on_before_key_press						= {}, -- Params: (<number>,<number>,<boolean>,<table>)
        // on_option_change                        = {}, -- Params: ()
        // on_localization_change		            = {}, -- Params: ()
        // on_console_execute			            = {}, -- Params: (<string>,<string>,<string>,...) command parts
        // on_before_save_input		        	= {}, -- Params: (<number>,<number>,<table>)
        // on_before_load_input		        	= {}, -- Params: (<number>,<number>,<table>)
	
        //
        //Files
        //
        RegisterScriptCallback("save_state", (data) => this.OnSaveState(data));
        RegisterScriptCallback("load_state", (data) => this.OnLoadState(data));
        // on_pstor_save_all			            = {}, -- Params: (<game_object>,<?>)
	    // on_pstor_load_all			            = {}, -- Params: (<game_object>,<?>)

        //
        // Others
        //
        // on_enemy_eval							= {}, -- Params: (<game_object>,<game_object>,<table>)
        // on_before_surge							= {}, -- Params: (<table>)
        // on_before_psi_storm						= {}, -- Params: (<table>)
        // on_get_item_cost						= {}, -- look at bottom of utils_item.script for detailed explanation

        RegisterScriptCallback("actor_on_item_take", (item: game_object) => this.OnItemTake(item))

        let oldItemNetSpawn = bind_item.item_binder.net_spawn;
        let newItemNetSpawn = (s: any, serverGO: cse_alife_item) => {
            let result = oldItemNetSpawn(s, serverGO);
            Log(`Net iem spawn: ${serverGO.name()}`)
            if (result)
                this.OnItemNetSpawn(s.object, serverGO)
            return result;
        }
        bind_item.item_binder.net_spawn = newItemNetSpawn;
    }
}