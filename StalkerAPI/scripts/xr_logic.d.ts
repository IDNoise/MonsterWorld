type Condlist = any; //TODO
declare namespace xr_logic {
  function parse_condlist(obj: game_object | null, section: string | null, field: string | null, src: string): Condlist;
}
