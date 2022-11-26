import { MWMonster } from '../MWMonster';
import { MonsterWorld } from '../MonsterWorld';
import { BaseMWObject } from '../BaseMWObject';


export abstract class Skill {
    private level: number = 0;

    public World: MonsterWorld;

    public OnLevelUpHandlers: ((skill: Skill) => void)[] = [];

    constructor(public Id: string, public Owner: BaseMWObject, public PriceFormula?: (level: number) => number, public MaxLevel: number = -1) {
        this.World = this.Owner.World;
    }

    Init(): void {
        this.level = this.Owner.GetSkillLevel(this.Id);
        this.UpdateLevelBonuses();
    }

    get Level(): number { return this.level; }
    set Level(level: number) {
        let oldLevel = this.Level;
        this.level = level;
        if (level > oldLevel) {
            this.OnLevelUp(oldLevel, level);
        }
        this.Owner.SetSkillLevel(this.Id, this.Level)
    }

    Upgrade(): void {
        if (!this.CanBeUpgraded)
            return;

        let player = this.World.Player;
        let price = this.UpgradePrice;

        if (player.SkillPoints >= price) {
            player.SkillPoints -= price;
            this.Level++;
        }
    }

    OnLevelUp(oldLevel: number, newLevel: number): void {
        this.UpdateUI();
        this.UpdateLevelBonuses();
    }

    UpdateLevelBonuses(): void {}

    UpdateUI(): void {
        this.DescriptionText?.SetText(this.Description);
        //this.DescriptionText?.AdjustHeightToText();
        //this.DescriptionText.Get
        this.LevelText?.SetText(`L. ${this.Level}`);
        this.UpdateUpgradeButton();
    }

    get CanBeUpgraded(): boolean { return !this.IsMaxLevelReached && this.PlayerHasMoney; }

    get PlayerHasMoney(): boolean { return this.UpgradePrice <= this.World.Player.SkillPoints; }

    get IsMaxLevelReached(): boolean { return this.MaxLevel != -1 && this.Level >= this.MaxLevel; }

    UpdateUpgradeButton() {
        this.UpgradeButton?.Enable(this.CanBeUpgraded);
        this.UpgradeButton?.TextControl().SetText(!this.IsMaxLevelReached ? `${this.UpgradePrice} SP` : "MAX");
    }

    abstract get Description(): string;
    get UpgradePrice(): number { return this.PriceFormula != undefined ? this.PriceFormula(this.Level + 1) : 0; }

    //UI stuff
    public DescriptionText: CUITextWnd;
    public LevelText: CUITextWnd;
    public UpgradeButton: CUI3tButton;

    //Event handlers
    Update(deltaTime: number) { }
    OnMonsterHit(monster: MWMonster, isCrit: boolean): void { }
    OnMonsterKill(monster: MWMonster, isCrit: boolean): void { }
}


export function PriceFormulaConstant(price: number) {
    return (_level: number) => price;
}

export function PriceFormulaLevel(){ return (level: number) => level; }