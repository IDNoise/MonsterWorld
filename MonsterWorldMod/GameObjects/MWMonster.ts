import { MWObject, ObjectType } from './MWObject';
import * as constants from '../Configs/Constants'
import * as loot from '../Configs/Loot'
import { MonsterConfigs, MonsterRank, MonsterRankConfigs, MonsterType } from '../Configs/Enemies';
import { StatType } from '../Configs/Stats';
import { GetCurrentLocationType } from '../Configs/Levels';
import { EnemyLocationTypeMults } from '../Configs/Constants';
import { Log } from '../../StalkerModBase';

export class MWMonster extends MWObject{
    get Type(): ObjectType { return ObjectType.Monster }

    override OnFirstTimeInitialize(): void {
        let spawnConfig = this.Load<MonsterSpawnParams>("SpawnParams")

        this.MonsterType = spawnConfig.Type;
        this.Level = spawnConfig.Level;
        this.Rank = spawnConfig.Rank;

        let locationMults = EnemyLocationTypeMults.get(GetCurrentLocationType())
        let monsterCfg = MonsterConfigs.get(this.MonsterType);
        let monsterRankCfg = MonsterRankConfigs[this.Rank]

        let enemyHP = this.GetMaxHP(this.Level) * (monsterCfg.HpMult || 1) * monsterRankCfg.HpMult * locationMults.HpMult;
        let xpReward = this.GetXPReward(this.Level) * (monsterCfg.XpMult || 1) * monsterRankCfg.XpMult * locationMults.XpMult;
        let enemyDamage = this.GetDamage(this.Level) * (monsterCfg.DamageMult || 1) * monsterRankCfg.DamageMult * locationMults.DamageMult;

        this.SetStatBase(StatType.MaxHP, enemyHP)
        this.SetStatBase(StatType.Damage, enemyDamage);
        this.XPReward = xpReward;

        se_save_var(this.id, this.GO.name(), "looted", true)
    }

    GetMaxHP(level: number): number{
        let pctMult = 1 + constants.EnemyHPPctPerLevel / 100 * (level - 1);
        let expMult = math.pow(constants.EnemyHPExpPerLevel, level - 1);
        let deltaMult = 1 + math.random(-constants.EnemyHpDeltaPct, constants.EnemyHpDeltaPct) / 100
        return constants.EnemyHPBase * pctMult * expMult * deltaMult;
    }

    GetXPReward(level: number): number{
        let pctMult = 1 + constants.EnemyXpRewardPctPerLevel / 100 * (level - 1);
        let expMult = math.pow(constants.EnemyXpRewardExpPerLevel, level - 1);
        let xp = constants.EnemyXpRewardBase * pctMult * expMult;
        return math.floor(xp)
    }

    GetDamage(level: number) {
        let pctMult = 1 + constants.EnemyDamagePctPerLevel / 100 * (level - 1);
        let expMult = math.pow(constants.EnemyDamageExpPerLevel, level - 1)
        return constants.EnemyDamageBase * pctMult * expMult;
    }

    get Name(): string {
        let nameInfo = `${this.MonsterType} L.${this.Level}`
        if (this.Rank == MonsterRank.Boss) nameInfo = "[Boss] " + nameInfo
        else if (this.Rank == MonsterRank.Elite) nameInfo = "[Elite] " + nameInfo
        return nameInfo;
    }

    get DropChance(): number { 
        return MonsterRankConfigs[this.Rank].DropChance * EnemyLocationTypeMults.get(GetCurrentLocationType()).DropChanceMult; 
    }

    get XPReward(): number { return this.Load("XPReward"); }
    set XPReward(expReward: number) { this.Save("XPReward", expReward); }

    get Damage(): number { return this.GetStat(StatType.Damage); }

    get Rank(): MonsterRank { return this.Load("Rank"); }
    set Rank(rank: MonsterRank) { this.Save("Rank", rank); }

    get MonsterType(): MonsterType { return this.Load("MonsterType"); }
    set MonsterType(type: MonsterType) { this.Save("MonsterType", type); }
}

export type MonsterSpawnParams = {
    Type: MonsterType,
    Level: number,
    Rank: MonsterRank
};
