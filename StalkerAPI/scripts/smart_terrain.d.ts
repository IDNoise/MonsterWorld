
declare namespace smart_terrain {
  type RespawnParams = { [key: string]: RespawnParam; };
  type RespawnParam = {
    num: Condlist;
    squads: string[];
    helicopter?: boolean;
  };

  type AlreadySpawnnParams = { [key: string]: { num: number; }; };

  interface se_smart_terrain {
    id: Id;
    ini: ini_file;
    squad_id: number;
    max_population: number;
    respawn_idle: number;
    m_level_vertex_id: LevelVertexId;
    m_game_vertex_id: GameVertexId;
    position: vector;
    is_on_actor_level: boolean;
    respawn_params: RespawnParams;
    already_spawned: AlreadySpawnnParams;
    faction: string;
    respawn_radius: number;

    name(): string;
  }
}

declare type SmartTerrain = smart_terrain.se_smart_terrain