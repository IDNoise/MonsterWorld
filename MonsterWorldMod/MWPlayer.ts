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

    get RequeiredXP(): number {
        return cfg.PlayerXPForFirstLevel * math.pow(cfg.EnemyXpRewardExpPerLevel, this.Level - 1) * (1 + cfg.PlayerXPPct * (this.Level - 1) / 100)
    }

    get CurrentXP(): number { return this.Load("CurrentXP", 0); }
    set CurrentXP(exp: number) { 
        let required = this.RequeiredXP;
        if (exp >= required){
            this.Level++;
            this.StatPoints += cfg.PlayerPointsPerLevelUp;
            exp -= required;
        }
        this.Save("CurrentXP", exp); 
    }

    get StatPoints(): number { return this.Load("StatPoints", 0); }
    set StatPoints(points: number) { this.Save("StatPoints", points); }
}