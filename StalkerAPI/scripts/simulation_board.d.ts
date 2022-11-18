declare class simulation_board {
  start_position_filled: boolean;
  smarts_by_names: {[key: string]: smart_terrain.se_smart_terrain};
  // self.smarts = {}
  // self.simulation_started = true
  // self.squads = {}
  // self.tmp_assigned_squad = {}

  create_squad(smart: smart_terrain.se_smart_terrain, squad_section: Section): void;
}
