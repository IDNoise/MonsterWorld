declare interface IRenderVisual {}

declare interface CGameObject extends DLL_Pure, ISheduled, ICollidable, IRenderable {
    Visual(): IRenderVisual;
    getEnabled(): boolean;
    getVisible(): boolean;
    //net_Import(net_packet&): void;
    //net_Export(net_packet&): void;
    net_Spawn(dc: cse_abstract): boolean;
    use(user: CGameObject): boolean;
}
