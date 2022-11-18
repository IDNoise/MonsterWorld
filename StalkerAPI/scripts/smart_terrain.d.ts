
declare namespace smart_terrain {
  type RespawnParams = { [key: string]: RespawnParam; };
  type RespawnParam = {
    num: Condlist;
    squads: string[];
    helicopter: boolean;
  };

  type AlreadySpawnnParams = { [key: string]: { num: number; }; };

  interface se_smart_terrain {
    ini: any; //TODO
    squad_id: number;
    max_population: number;
    respawn_idle: number;
    id: string;
    m_level_vertex_id: LevelVertexId;
    m_game_vertex_id: GameVertexId;
    position: vector;
    is_on_actor_level: boolean;
    respawn_params: RespawnParams;
    already_spawned: AlreadySpawnnParams;

    name(): string;
  }
}
