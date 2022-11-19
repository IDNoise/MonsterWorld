import { IsPctRolled } from '../StalkerAPI/extensions/basic';
import { BaseMWObject } from './BaseMWObject';
import { MonsterWorld } from './MonsterWorld';
import * as cfg from './MonsterWorldConfig';

export class MWMonster extends BaseMWObject{
    constructor(public mw: MonsterWorld, public id: Id) {
        super(mw, id);
    }

    override Initialize(): void {
        let locCfg = cfg.LocationConfigs[level.name()];
        let enemyLvl = math.max(locCfg.level || 1, this.mw.Player.Level - 3);

        if (IsPctRolled(cfg.EnemyHigherLevelChance))
            enemyLvl++;

        let enemyHP = this.GetMaxHP(enemyLvl);
        let xpReward = this.GetXPReward(enemyLvl);
        let enemyDamage = this.GetDamage(enemyLvl);

        if (IsPctRolled(cfg.EnemyBossChance)){
            enemyHP *= cfg.EnemyBossHPMult;
            xpReward *= cfg.EnemyBossXPRewardMult;
            enemyDamage *= cfg.EnemyBossDamageMult;
            this.IsBoss = true;
        }
        
        this.MaxHP = enemyHP;
        this.HP = enemyHP;
        this.Damage = enemyDamage;
        this.Level = enemyLvl;
        this.XPReward = xpReward;
    }

    GetMaxHP(level: number): number{
        let pctMult = 1 + cfg.EnemyHPPctPerLevel / 100 * (level - 1);
        let expMult = math.pow(cfg.EnemyHPExpPerLevel, level - 1);
        let deltaMult = 1 + math.random(-cfg.EnemyHpDeltaPct, cfg.EnemyHpDeltaPct) / 100
        return cfg.EnemyHPBase * pctMult * expMult * deltaMult;
    }

    GetXPReward(level: number): number{
        let pctMult = 1 + cfg.EnemyXpRewardPctPerLevel * (level - 1);
        let expMult = math.pow(cfg.EnemyXpRewardExpPerLevel, level - 1);
        return cfg.EnemyHPBase * pctMult * expMult;
    }

    GetDamage(level: number) {
        return cfg.EnemyDamageBase * math.pow(cfg.EnemyDamageExpPerLevel, level - 1);
    }

    get XPReward(): number { return this.Load("MW_XPReward"); }
    set XPReward(expReward: number) { this.Save("MW_XPReward", expReward); }

    get Damage(): number { return this.Load("MW_DMG"); }
    set Damage(damage: number) { this.Save("MW_DMG", damage); }

    get IsBoss(): boolean { return this.Load("MW_Boss"); }
    set IsBoss(isBoss: boolean) { this.Save("MW_Boss", isBoss); }
}
