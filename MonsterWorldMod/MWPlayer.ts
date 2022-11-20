import { BaseMWObject } from './BaseMWObject';
import { MonsterWorld } from './MonsterWorld';
import * as cfg from './MonsterWorldConfig';

export class MWPlayer extends BaseMWObject {
    constructor(public mw: MonsterWorld, public id: Id) {
        super(mw, id);
    }

    override Initialize(): void {
        let baseHP = cfg.PlayerHPBase;

        this.Level = 1;
        this.CurrentXP = 0;
        this.MaxHP = baseHP;
        this.HP = baseHP;
    }

    get CurrentXP(): number { return this.Load("CurrentXP"); }
    set CurrentXP(exp: number) { this.Save("CurrentXP", exp); }
}