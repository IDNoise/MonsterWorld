import { BaseMWObject } from './BaseMWObject';
import * as cfg from './MonsterWorldConfig';

export class MWPlayer extends BaseMWObject {
    constructor(public go: game_object) {
        super(go);
    }

    protected override Initialize(): void {
        let baseHP = cfg.PlayerHPBase;

        this.Level = 1;
        this.Exp = 0;
        this.MaxHP = baseHP;
        this.HP = baseHP;
    }

    get Exp(): number { return this.Load("MW_EXP"); }
    set Exp(exp: number) { this.Save("MW_EXP", exp); }
}
