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

export let EnemyHpMultsByRank: number[] = [1, 3, 10];
export let EnemyXpMultsByRank: number[] = [1, 3, 10];
export let EnemyDamageMultsByRank: number[] = [1, 1.5, 3];
export let EnemyDropLevelIncreaseChanceByRank: number[] = [1, 20, 50];
export let EnemyDropQualityIncreaseChanceByRank: number[] = [1, 20, 50];

//Weapons
export let WeaponDPSBase = EnemyHPBase / 0.5;
export let WeaponDPSExpPerLevel = EnemyHPExpPerLevel - 0.005;
export let WeaponDPSPctPerQuality = 10;