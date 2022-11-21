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
        let expMult = math.pow(cfg.PlayerXPExp, this.Level - 1);
        let pctMult = (1 + cfg.PlayerXPPct * (this.Level - 1) / 100)
        let xp = cfg.PlayerXPForFirstLevel * expMult * pctMult;
        return math.floor(xp)
    }

    get CurrentXP(): number { return this.Load("CurrentXP", 0); }
    set CurrentXP(exp: number) { 
        while (exp >= this.RequeiredXP){
            exp -= this.RequeiredXP;
            this.LevelUp();
        }
        this.Save("CurrentXP", exp); 
    }

    private LevelUp(): void{
        this.Level++;
        this.StatPoints += cfg.PlayerPointsPerLevelUp;
        //TODO lvl up notification
    }

    get StatPoints(): number { return this.Load("StatPoints", 0); }
    set StatPoints(points: number) { this.Save("StatPoints", points); }
}