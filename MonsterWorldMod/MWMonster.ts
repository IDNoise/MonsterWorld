import { IsPctRolled, Save } from '../StalkerAPI/extensions/basic';
import { BaseMWObject } from './BaseMWObject';
import { MonsterWorld } from './MonsterWorld';
import * as cfg from './MonsterWorldConfig';
import { MonsterSpawnParams, MonsterRank, MonsterType, MonsterConfigs, StatType } from './MonsterWorldConfig';

export class MWMonster extends BaseMWObject{
    constructor(public World: MonsterWorld, public id: Id) {
        super(World, id);
    }

    override Initialize(): void {
        let spawnConfig = this.Load<MonsterSpawnParams>("SpawnParams")

        this.Type = spawnConfig.type;
        this.Level = spawnConfig.level;
        this.Rank = spawnConfig.rank;

        let monsterCfg = MonsterConfigs.get(this.Type);

        let enemyHP = this.GetMaxHP(this.Level) * (monsterCfg.hp_mult || 1) * cfg.EnemyHpMultsByRank[this.Rank];
        let xpReward = this.GetXPReward(this.Level) * (monsterCfg.xp_mult || 1) * cfg.EnemyXpMultsByRank[this.Rank];
        let enemyDamage = this.GetDamage(this.Level) * (monsterCfg.damage_mult || 1) * cfg.EnemyDamageMultsByRank[this.Rank];

        this.SetStatBase(StatType.MaxHP, enemyHP)
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
        let pctMult = 1 + cfg.EnemyXpRewardPctPerLevel / 100 * (level - 1);
        let expMult = math.pow(cfg.EnemyXpRewardExpPerLevel, level - 1);
        let xp = cfg.EnemyXpRewardBase * pctMult * expMult;
        return math.floor(xp)
    }

    GetDamage(level: number) {
        let pctMult = 1 + cfg.EnemyDamagePctPerLevel * level / 100;
        let expMult = math.pow(cfg.EnemyDamageExpPerLevel, level - 1)
        return cfg.EnemyDamageBase * pctMult * expMult;
    }

    get Name(): string {
        let nameInfo = `${this.Type} L.${this.Level}`
        if (this.Rank == MonsterRank.Boss) nameInfo = "[Boss] " + nameInfo
        else if (this.Rank == MonsterRank.Elite) nameInfo = "[Elite] " + nameInfo
        return nameInfo;
    }

    get DropChance(): number { return cfg.EnemyDropChanceByRank[this.Rank]; }

    get XPReward(): number { return this.Load("XPReward"); }
    set XPReward(expReward: number) { this.Save("XPReward", expReward); }

    get Damage(): number { return this.Load("DMG"); }
    set Damage(damage: number) { this.Save("DMG", damage); }

    get Rank(): MonsterRank { return this.Load("Rank"); }
    set Rank(rank: MonsterRank) { this.Save("Rank", rank); }

    get Type(): MonsterType { return this.Load("Type"); }
    set Type(type: MonsterType) { this.Save("Type", type); }
}
