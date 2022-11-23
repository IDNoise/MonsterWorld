declare namespace death_manager{
    function create_release_item(npc: game_object): void;
    function keep_item(npc: game_object, item: game_object): void;
    function create_item_list(npc: game_object, npc_comm: Community, npc_rank: Rank, is_private: boolean, to_save: boolean): void;
}