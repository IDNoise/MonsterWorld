declare type StorageManagerState = {
    diff_game: {type: number},
    diff_eco: {type: number},
}

declare namespace alife_storage_manager {
    function get_state(): StorageManagerState;
}