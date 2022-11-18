
declare namespace item_knife {
  function is_equipped(): boolean;
  function get_condition(): number;
  function can_loot(monster: game_object): boolean;
  function degradate(): void;
  function is_axe(): boolean;
}
