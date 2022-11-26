export function GetDifficultyDamageMult(){
    return 1 + 0.5 * (math.max(1, alife_storage_manager.get_state()?.diff_game.type || 0) - 1)
}

export function GetDifficultyDropChanceMult(){
    return 1 / math.max(1, alife_storage_manager.get_state()?.diff_eco.type || 0)
}