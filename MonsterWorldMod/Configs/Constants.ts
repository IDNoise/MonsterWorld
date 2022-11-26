import { LocationType } from "./Levels";

//Player params
export let PlayerHPBase = 100;
export let PlayerHPPerLevel = 10;
export let PlayerHPRegenBase = 0.2;
export let PlayerHPRegenPctPerLevel = 10;
export let PlayerRunSpeedPctPerLevel = 2;
export let PlayerDefaultCritDamagePct = 250;

export let PlayerRunSpeedCoeff = 2.4;
export let PlayerRunBackSpeedCoeff = 1.4;
export let PlayerSprintSpeedCoeff = 2.1;

export let PlayerXPForFirstLevel = 250;
export let PlayerXPExp = 1.3;
export let PlayerXPPct = 100;

export let SkillPointsPerLevelUp = 5;

//Monster params
export let EnemyHPBase = 50;
export let EnemyHPExpPerLevel = 1.15;
export let EnemyHPPctPerLevel = 75;
export let EnemyHpDeltaPct = 10;

export let EnemyDamageBase = PlayerHPBase / 25;
export let EnemyDamageExpPerLevel = 1.025; //1.1;
export let EnemyDamagePctPerLevel = 10;

export let EnemyXpRewardBase = PlayerXPForFirstLevel / 20;
export let EnemyXpRewardExpPerLevel = 1.25;
export let EnemyXpRewardPctPerLevel = 50;

export let EnemyHigherLevelChance = 5;
export let EnemyEliteChance = 12;
export let EnemyBossChance = 3;

type EnemyLocationConfig = {
    HpMult: number, 
    XpMult: number, 
    DamageMult: number, 
    DropChanceMult: number
}

export let EnemyLocationTypeMults: LuaTable<number, EnemyLocationConfig> = new LuaTable();
EnemyLocationTypeMults.set(LocationType.Open,        {HpMult: 1,   XpMult: 1,   DamageMult: 1,   DropChanceMult: 1});
EnemyLocationTypeMults.set(LocationType.Underground, {HpMult: 1.5, XpMult: 1.5, DamageMult: 1.5, DropChanceMult: 1.25});
EnemyLocationTypeMults.set(LocationType.Lab,         {HpMult: 2.5, XpMult: 2.5, DamageMult: 2.5, DropChanceMult: 2});

//Weapons
export let WeaponDPSBase = EnemyHPBase / 0.5;
export let WeaponDPSExpPerLevel = EnemyHPExpPerLevel - 0.005;
export let WeaponDPSPctPerQuality = 10;