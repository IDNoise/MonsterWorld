import { IsPctRolled, Save } from '../StalkerAPI/extensions/basic';
import { BaseMWObject } from './BaseMWObject';
import { MonsterWorld } from './MonsterWorld';
import * as cfg from './MonsterWorldConfig';
import { MonsterSpawnParams, MonsterRank, MonsterType } from './MonsterWorldConfig';

export class MWMonster extends BaseMWObject{
    constructor(public mw: MonsterWorld, public id: Id) {
        super(mw, id);
    }

    override Initialize(): void {
        let spawnConfig = this.Load<MonsterSpawnParams>("SpawnParams")

        this.Type = spawnConfig.type;
        this.Level = spawnConfig.level;
        this.Rank = spawnConfig.rank;

        let enemyHP = this.GetMaxHP(this.Level) * spawnConfig.hpMult;
        let xpReward = this.GetXPReward(this.Level) * spawnConfig.xpMult;
        let enemyDamage = this.GetDamage(this.Level) * spawnConfig.damageMult;

        if (spawnConfig.rank == MonsterRank.Boss){
            enemyHP *= cfg.EnemyBossHPMult;
            xpReward *= cfg.EnemyBossXPRewardMult;
            enemyDamage *= cfg.EnemyBossDamageMult;
        }
        else if (spawnConfig.rank == MonsterRank.Elite){
            enemyHP *= cfg.EnemyEliteHPMult;
            xpReward *= cfg.EnemyEliteXPRewardMult;
            enemyDamage *= cfg.EnemyEliteDamageMult;
        }
        
        this.MaxHP = enemyHP;
        this.HP = enemyHP;
        this.Damage = enemyDamage;
        this.XPReward = xpReward;

        se_save_var(this.id, this.GO.name(), "looted", true)
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
        let xp = cfg.EnemyXpRewardBase * pctMult * expMult;
        return math.floor(xp)
    }

    GetDamage(level: number) {
        return cfg.EnemyDamageBase * math.pow(cfg.EnemyDamageExpPerLevel, level - 1);
    }

    get Name(): string {
        let nameInfo = `${this.Type} L.${this.Level}`
        if (this.Rank == MonsterRank.Boss) nameInfo = "[Boss] " + nameInfo
        else if (this.Rank == MonsterRank.Elite) nameInfo = "[Elite] " + nameInfo
        return nameInfo;
    }

    get DropChance(): number {
        if (this.Rank == MonsterRank.Boss) return cfg.EnemyBossDropChance;
        if (this.Rank == MonsterRank.Elite) return cfg.EnemyEliteDropChance;
        return cfg.EnemyDropChance
    }

    get XPReward(): number { return this.Load("XPReward"); }
    set XPReward(expReward: number) { this.Save("XPReward", expReward); }

    get Damage(): number { return this.Load("DMG"); }
    set Damage(damage: number) { this.Save("DMG", damage); }

    get Rank(): MonsterRank { return this.Load("Rank"); }
    set Rank(rank: MonsterRank) { this.Save("Rank", rank); }

    get Type(): MonsterType { return this.Load("Type"); }
    set Type(type: MonsterType) { this.Save("Type", type); }
}
