import { LocationType } from './Levels';

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
