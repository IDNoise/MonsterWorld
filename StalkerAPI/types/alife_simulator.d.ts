type LevelId = number;

declare interface alife_simulator {
    level_name(levelId: LevelId): string;
    // create_ammo(alife_simulator*, string, const vector&, number, number, number, number)
    // add_out_restriction(alife_simulator*, cse_alife_monster_abstract*, number)
    set_interactive(id: Id, state: boolean): void;
    // add_in_restriction(alife_simulator*, cse_alife_monster_abstract*, number)
    // remove_in_restriction(alife_simulator*, cse_alife_monster_abstract*, number)
    level_id(): LevelId;
    valid_object_id(id: Id): boolean;
    // remove_out_restriction(alife_simulator*, cse_alife_monster_abstract*, number)
    switch_distance(): number;
    switch_distance(distance: number): void;
    // kill_entity(cse_alife_monster_abstract*, const number&, cse_alife_schedulable*)
    // kill_entity(alife_simulator*, cse_alife_monster_abstract*, const number&)
    // kill_entity(alife_simulator*, cse_alife_monster_abstract*)
    set_switch_online(id: Id, state: boolean): void;
    set_switch_offline(id: Id, state: boolean): void;
    // has_info(const alife_simulator*, const number&, string)
	// dont_has_info(const alife_simulator*, const number&, string)
	// disable_info(const alife_simulator*, const number&, string)
	// give_info(const alife_simulator*, const number&, string)
    // remove_all_restrictions(number, const enum RestrictionSpace::ERestrictorTypes&)
    object(id: Id): cse_alife_object;
    // object(const alife_simulator*, number, boolean)
    actor() : cse_alife_creature_actor;
    story_object(id: Id): cse_alife_object;
    // spawn_id(alife_simulator*, number)
    // release(alife_simulator*, cse_abstract*, boolean)
    // create(alife_simulator*, number)
    create(section: Section, pos: vector, lvid: LevelVertexId, gvid: GameVertexId, targetId?: Id): cse_alife_object;    
	teleport_object(id: Id, gvid: GameVertexId, lvid: LevelVertexId, pos: vector): void // Alundaio: (id,game_vertex_id,level_vertex_id,position)
	// get_children(const alife_simulator*, cse_abstract*)
}