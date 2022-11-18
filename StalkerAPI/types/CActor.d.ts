
declare interface CActor extends CGameObject {
    conditions(): CActorCondition;
    inventory_disabled(): boolean;
    set_inventory_disabled(disabled: boolean): void;
}
