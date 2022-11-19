import { BaseMWObject } from './BaseMWObject';
import * as cfg from './MonsterWorldConfig';

export class MWMonster extends BaseMWObject{
    constructor(public go: game_object) {
        super(go);
    }

    protected override Initialize(): void {
        let locCfg = cfg.LocationConfigs[level.name()];
        let enemyLvl = locCfg.level || 1;

        let enemyHPPctMult = 1 + cfg.MonsterHPPctPerLevel * (enemyLvl - 1);
        let enemyHPExpMult = math.pow(cfg.MonsterHPExpPerLevel, enemyLvl - 1);
        let enemyHPDeltaMult = 1 + math.random(-cfg.MonsterHpDeltaPct, 30) / 100
        let enemyHP = cfg.MonsterHPBase * enemyHPPctMult * enemyHPExpMult * enemyHPDeltaMult;
        let expReward = cfg.EnemyExpRewardPerLevelBase * enemyLvl;
        let enemyDamage = cfg.MonsterDamageBase * math.pow(cfg.MonsterDamageExpPerLevel, enemyLvl - 1);

        this.MaxHP = enemyHP;
        this.HP = enemyHP;
        this.Damage = enemyDamage;
        this.Level = enemyLvl;
        this.EXPReward = expReward;
    }

    get EXPReward(): number { return this.Load("MW_EXPReward"); }
    set EXPReward(expReward: number) { this.Save("MW_EXPReward", expReward); }

    get Damage(): number { return this.Load("MW_DMG"); }
    set Damage(damage: number) { this.Save("MW_DMG", damage); }
}
