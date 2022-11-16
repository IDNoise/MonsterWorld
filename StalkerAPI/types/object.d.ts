
declare interface Object {
    bleeding : number;
    health : number;
    morale : number;
    power : number;
    psy_health : number;
    radiation : number;
  
    // All types
    id(): number;
    position(): Vector;
    level_vertex_id(): LevelVertexId;
    game_vertex_id(): GameVertexId;
    section(): string;
    name(): string;
    clsid(): ClsId;
    parent(): Object;
    has_info(info: string): boolean;
    dont_has_info(info: string): boolean;
    give_info_portion(info: string): void;
    disable_info_portion(info: string): void;
    
   //  Testing
      is_entity_alive(): boolean;
      is_inventory_item(): boolean;
      is_inventory_owner(): boolean;
      is_actor(): boolean;
      is_custom_monster(): boolean;
      is_weapon(): boolean;
      is_outfit(): boolean;
      is_scope(): boolean;
      is_silencer(): boolean;
      is_grenade_launcher(): boolean;
      is_weapon_magazined(): boolean;
      is_space_restrictor(): boolean;
      is_stalker(): boolean;
      is_anomaly(): boolean;
      is_monster(): boolean;
      is_trader(): boolean;
      is_hud_item(): boolean;
      is_artefact(): boolean;
      is_ammo(): boolean;
      is_weapon_gl(): boolean;
      is_inventory_box(): boolean;
  
    // Player
      get_actor_max_weight(): number;
      set_actor_max_weight(weight: number): void;
      get_actor_max_walk_weight(): number;
      set_actor_max_walk_weight(weight: number): void;
      get_actor_jump_speed(): number;
      set_actor_jump_speed(speed: number): void;
      get_actor_sprint_koef(): number;
      set_actor_sprint_koef(coef: number): void;
      get_actor_run_coef(): number;
      set_actor_run_coef(coef: number): void;
      get_actor_runback_coef(): number;
      set_actor_runback_coef(coef: number): void;
  }
  