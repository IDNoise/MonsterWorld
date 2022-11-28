import { Log } from '../../StalkerModBase';
import { AllMonsterTypes, MonsterConfig, MonsterConfigs, MonsterType } from '../Configs/Enemies';
export class MCM {
    constructor(){
        this.InitProgression();
        this.InitEnemies();
    }

    GetConfig(): MCMMainGroup{
        return {id: MainGroupId, gr: [
            this.GroupProgression(),
            this.GroupEnemies(),
            // SubGroup("mw_main", [
            //     Title("title", "Monster World"),
            //     Line()
            // ])
        ]}
    }

    //All hp/damage/xp constants
    private ProgressionDefaults: Map<ProgressionFieldType, number> = new Map<ProgressionFieldType, number>();

    private InitProgression() {
        this.ProgressionDefaults
            .set("PlayerHPBase", 100)
            .set("PlayerHPPerLevel", 25)
            .set("PlayerHPRegenBase", 0.25)
            .set("PlayerHPRegenPctPerLevel", 10)
            .set("PlayerRunSpeedPctPerLevel", 1)
            .set("PlayerDefaultCritDamagePct", 250)

            .set("PlayerRunSpeedCoeff", 2.5)
            .set("PlayerRunBackSpeedCoeff", 1.5)
            .set("PlayerSprintSpeedCoeff", 2.2)

            .set("PlayerXPForFirstLevel", 250)
            .set("PlayerXPExp", 1.3)
            .set("PlayerXPPct", 100)
            .set("SkillPointsPerLevelUp", 5)

            .set("EnemyHPBase", 50)
            .set("EnemyHPExpPerLevel", 1.15)
            .set("EnemyHPPctPerLevel", 50)
            .set("EnemyHpDeltaPct", 10)

            .set("EnemyDamageBase", this.ProgressionDefaults.get("PlayerHPBase")! / 25)
            .set("EnemyDamageExpPerLevel", 1.075)
            .set("EnemyDamagePctPerLevel", this.ProgressionDefaults.get("PlayerHPPerLevel")! / this.ProgressionDefaults.get("PlayerHPBase")! * 100)

            .set("EnemyXpRewardBase", this.ProgressionDefaults.get("PlayerXPForFirstLevel")! / 20)
            .set("EnemyXpRewardExpPerLevel", 1.25)
            .set("EnemyXpRewardPctPerLevel", 50)

            .set("EnemyHigherLevelChance", 5)
            .set("EnemyEliteChance", 12)
            .set("EnemyBossChance", 3)

            .set("WeaponDPSBase", this.ProgressionDefaults.get("EnemyHPBase")! / 0.5)
            .set("WeaponDPSExpPerLevel", this.ProgressionDefaults.get("EnemyHPExpPerLevel")!)
            .set("WeaponDPSPctPerQuality", 10)
    }

    GetProgressionValue(field: ProgressionFieldType):number {
        let result = ui_mcm?.get<number>(`${MainGroupId}/${ProgressionSubGroupId}/${field}`);
        if (result == undefined){
            return this.ProgressionDefaults.get(field)!
        }
        return result;
    }

    GroupProgression(): MCMSubGroup {
        return this.SubGroupWithFields(ProgressionSubGroupId, [
            this.TrackWithDefaultsMap("PlayerHPBase", 100, 2500, 10, this.ProgressionDefaults),
            this.TrackWithDefaultsMap("PlayerHPPerLevel", 0, 100, 1, this.ProgressionDefaults),
            this.TrackWithDefaultsMap("PlayerHPRegenBase", 0, 10, 0.05, this.ProgressionDefaults),
            this.TrackWithDefaultsMap("PlayerHPRegenPctPerLevel", 0, 100, 1, this.ProgressionDefaults),
            this.TrackWithDefaultsMap("PlayerRunSpeedPctPerLevel", 0, 10, 1, this.ProgressionDefaults),
            this.TrackWithDefaultsMap("PlayerDefaultCritDamagePct", 150, 500, 10, this.ProgressionDefaults),
            this.Line(),
            this.TrackWithDefaultsMap("PlayerRunSpeedCoeff", 2, 5, 0.1, this.ProgressionDefaults),
            this.TrackWithDefaultsMap("PlayerRunBackSpeedCoeff", 1, 5, 0.1, this.ProgressionDefaults),
            this.TrackWithDefaultsMap("PlayerSprintSpeedCoeff", 1, 5, 0.1, this.ProgressionDefaults),
            this.Line(),    
            this.TrackWithDefaultsMap("PlayerXPForFirstLevel", 100, 1000, 1, this.ProgressionDefaults),
            this.TrackWithDefaultsMap("PlayerXPExp", 1, 2, 0.01, this.ProgressionDefaults),
            this.TrackWithDefaultsMap("PlayerXPPct", 10, 300, 1, this.ProgressionDefaults),
            this.TrackWithDefaultsMap("SkillPointsPerLevelUp", 1, 20, 1, this.ProgressionDefaults),
            this.Line(),    
            this.TrackWithDefaultsMap("EnemyHPBase", 10, 500, 5, this.ProgressionDefaults),
            this.TrackWithDefaultsMap("EnemyHPExpPerLevel", 1, 2, 0.01, this.ProgressionDefaults),
            this.TrackWithDefaultsMap("EnemyHPPctPerLevel", 10, 300, 1, this.ProgressionDefaults),
            this.TrackWithDefaultsMap("EnemyHpDeltaPct", 1, 50, 1, this.ProgressionDefaults),
            this.Line(),    
            this.TrackWithDefaultsMap("EnemyDamageBase", 1, 100, 1, this.ProgressionDefaults),
            this.TrackWithDefaultsMap("EnemyDamageExpPerLevel", 1, 2, 0.01, this.ProgressionDefaults),
            this.TrackWithDefaultsMap("EnemyDamagePctPerLevel", 1, 300, 1, this.ProgressionDefaults),
            this.Line(),    
            this.TrackWithDefaultsMap("EnemyXpRewardBase", 1, 100, 1, this.ProgressionDefaults),
            this.TrackWithDefaultsMap("EnemyXpRewardExpPerLevel", 1, 2, 0.01, this.ProgressionDefaults),
            this.TrackWithDefaultsMap("EnemyXpRewardPctPerLevel", 10, 300, 1, this.ProgressionDefaults),
            this.Line(),    
            this.TrackWithDefaultsMap("EnemyHigherLevelChance", 1, 100, 1, this.ProgressionDefaults),
            this.TrackWithDefaultsMap("EnemyEliteChance", 1, 100, 1, this.ProgressionDefaults),
            this.TrackWithDefaultsMap("EnemyBossChance", 1, 100, 1, this.ProgressionDefaults),
            this.Line(),    
            this.TrackWithDefaultsMap("WeaponDPSBase", 10, 1000, 1, this.ProgressionDefaults),
            this.TrackWithDefaultsMap("WeaponDPSExpPerLevel", 1, 2, 0.01, this.ProgressionDefaults),
            this.TrackWithDefaultsMap("WeaponDPSPctPerQuality", 1, 100, 1, this.ProgressionDefaults),
        ])
    }
    
    GroupLocations(): void {
        //Location levels
    }


    //Enable/disable, setup mults and sizes and sections

    GetMonsterConfig(type: MonsterType): MonsterConfig {
        let getField = <T>(field: string, def: T) => {
            let result = ui_mcm?.get<T>(`${MainGroupId}/${EnemiesSubGroupId}/${type}/${field}`);
            if (result == undefined) return def;
            return result
        }
        return {
            Enabled: getField("Enabled", MonsterConfigs.get(type).Enabled),
            LocationLevelStart: getField("LocationLevelStart", MonsterConfigs.get(type).LocationLevelStart),
            LocationLevelEnd: getField("LocationLevelEnd", MonsterConfigs.get(type).LocationLevelEnd),
            LocationType: MonsterConfigs.get(type).LocationType,

            SquadSizeMin:  getField("SquadSizeMin", MonsterConfigs.get(type).SquadSizeMin),
            SquadSizeMax:  getField("SquadSizeMax", MonsterConfigs.get(type).SquadSizeMax),

            HpMult: getField("HpMult", MonsterConfigs.get(type).HpMult),
            DamageMult: getField("DamageMult", MonsterConfigs.get(type).DamageMult),
            XpMult: getField("XpMult", MonsterConfigs.get(type).XpMult),
            CommonSection: MonsterConfigs.get(type).CommonSection,
            EliteSection: MonsterConfigs.get(type).EliteSection,
            BossSection: MonsterConfigs.get(type).BossSection,
        }
    }

    private EnemyParamsDefaults: Map<EnemyParamsField, number> = new Map<EnemyParamsField, number>();
    private InitEnemies() {
        this.EnemyParamsDefaults
            .set("MaxMonstersOnLocation", 150)
            .set("RespawnInterval", 600)
            .set("MinDistanceFromPlayer", 125)
    }

    GetEnemyParams(field: EnemyParamsField): number {
        let result = ui_mcm?.get<number>(`${MainGroupId}/${EnemiesSubGroupId}/Params/${field}`);
        if (result == undefined){
            return this.EnemyParamsDefaults.get(field)!;
        }
        return result;
    }

    GroupEnemies(): MCMSubGroup {
        let subgroups: MCMSubGroup[] = [];

        subgroups.push(this.SubGroupWithFields("Params", [
            this.TrackWithDefaultsMap("MaxMonstersOnLocation", 50, 300, 1, this.EnemyParamsDefaults),
            this.TrackWithDefaultsMap("RespawnInterval", 100, 36000, 100, this.EnemyParamsDefaults),
            this.TrackWithDefaultsMap("MinDistanceFromPlayer", 50, 300, 1, this.EnemyParamsDefaults),
        ]))
        
        for(let type of AllMonsterTypes){
            let defaultCfg = MonsterConfigs.get(type);
            subgroups.push(this.SubGroupWithFields(type, [
                this.Checkbox("Enabled", defaultCfg.Enabled == true),
                this.TrackWithDefaultsObject("LocationLevelStart", 1, 33, 1, defaultCfg),
                this.TrackWithDefaultsObject("LocationLevelEnd", 0, 33, 1, defaultCfg),
                this.TrackWithDefaultsObject("SquadSizeMin", 1, 15, 1, defaultCfg),
                this.TrackWithDefaultsObject("SquadSizeMax", 1, 30, 1, defaultCfg),
                this.TrackWithDefaultsObject("HpMult", 1, 20, 0.1, defaultCfg),
                this.TrackWithDefaultsObject("DamageMult", 1, 20, 0.1, defaultCfg),
                this.TrackWithDefaultsObject("XpMult", 1, 20, 0.1, defaultCfg),
            ]))
        }

        return this.SubGroupWithGroups(EnemiesSubGroupId, subgroups);
    }

    GroupLoot(): void {
        //Quality params (weights, etc)
    }

    GroupMisc(): void {
        //Body/item despawn timer, damage numbers/xp duration, etc.
    }


    // UI HELPERS

    SubGroupWithFields(id: string, elements: MCMElement[]): MCMSubGroup{
        return { id: id, sh: true, gr: elements }
    }

    SubGroupWithGroups(id: string, elements: MCMSubGroup[]): MCMSubGroup{
        return { id: id, sh: false, gr: elements }
    }
    
    private lineNumber = 0;
    Line(): MCMElement {
        return {id: `line_${this.lineNumber++}`, type: MCMElementType.Line}
    }
    
    Title(elementId: string, text: string, align?: MCMTextAligment, color?: [number, number, number, number]): MCMElement {
        return {id: elementId, type: MCMElementType.Title, text: text, align: align, clr: color}
    }
    
    Checkbox(elementId: string, def: boolean): MCMElement {
        return {id: elementId, type: MCMElementType.Checkbox, val: MCMValueType.Bool, def: def}
    }
    
    InputNumber(elementId: string, min: number, max: number, def: number): MCMElement {
        return {id: elementId, type: MCMElementType.Input, val: MCMValueType.Number, def: def, min: min, max: max}
    }
    
    Track(elementId: string, min: number, max: number, step: number, def: number): MCMElement {
        return {id: elementId, type: MCMElementType.Track, val: MCMValueType.Number, def: def, min: min, max: max, step: step}
    }

    TrackWithDefaultsMap(elementId: string, min: number, max: number, step: number, defSource: Map<string, number>): MCMElement {
        return this.Track(elementId, min, max, step, defSource.get(elementId)!)
    }

    TrackWithDefaultsObject(elementId: string, min: number, max: number, step: number, defSource: any): MCMElement {
        return this.Track(elementId, min, max, step, defSource[elementId])
    }
}

export function GetProgressionValue(field: ProgressionFieldType):number {
    return MonsterWorld.MCM.GetProgressionValue(field)
}

export function GetEnemyParams(field: EnemyParamsField): number {
    return MonsterWorld.MCM.GetEnemyParams(field)
}

export function GetMonsterConfig(type: MonsterType): MonsterConfig {
    return MonsterWorld.MCM.GetMonsterConfig(type)
}

export type ProgressionFieldType = 
    "PlayerHPBase" | 
    "PlayerHPPerLevel" | 
    "PlayerHPRegenBase" | 
    "PlayerHPRegenPctPerLevel" | 
    "PlayerRunSpeedPctPerLevel" | 
    "PlayerDefaultCritDamagePct" | 

    "PlayerRunSpeedCoeff" | 
    "PlayerRunBackSpeedCoeff" | 
    "PlayerSprintSpeedCoeff" | 

    "PlayerXPForFirstLevel" | 
    "PlayerXPExp" | 
    "PlayerXPPct" |
    "SkillPointsPerLevelUp" |

    "EnemyHPBase" |
    "EnemyHPExpPerLevel" |
    "EnemyHPPctPerLevel" |
    "EnemyHpDeltaPct" |

    "EnemyDamageBase" |
    "EnemyDamageExpPerLevel" |
    "EnemyDamagePctPerLevel" |

    "EnemyXpRewardBase" |
    "EnemyXpRewardExpPerLevel" |
    "EnemyXpRewardPctPerLevel" |

    "EnemyHigherLevelChance" |
    "EnemyEliteChance" |
    "EnemyBossChance" |

    "WeaponDPSBase" |
    "WeaponDPSExpPerLevel" |
    "WeaponDPSPctPerQuality"

export type EnemyParamsField = "MaxMonstersOnLocation" | "RespawnInterval" | "MinDistanceFromPlayer";

const MainGroupId = "MonsterWorld"
const ProgressionSubGroupId = "MWProgression"
const EnemiesSubGroupId = "MWEnemies"

