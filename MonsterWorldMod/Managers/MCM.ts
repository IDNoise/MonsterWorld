export class MCM {
    constructor(){
        this.InitProgression();
    }

    GetConfig(): MCMMainGroup{
        return {id: MainGroupId, gr: [
            this.GroupProgression(),
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
        return ui_mcm?.get(`${MainGroupId}/${ProgressionSubGroupId}/${field}`) || this.ProgressionDefaults.get(field)!
    }

    GroupProgression(): MCMSubGroup {
        return this.SubGroup(ProgressionSubGroupId, [
            this.Track("PlayerHPBase", 100, 2500, 10, this.ProgressionDefaults),
            this.Track("PlayerHPPerLevel", 0, 100, 1, this.ProgressionDefaults),
            this.Track("PlayerHPRegenBase", 0, 10, 0.05, this.ProgressionDefaults),
            this.Track("PlayerHPRegenPctPerLevel", 0, 100, 1, this.ProgressionDefaults),
            this.Track("PlayerRunSpeedPctPerLevel", 0, 10, 1, this.ProgressionDefaults),
            this.Track("PlayerDefaultCritDamagePct", 150, 500, 10, this.ProgressionDefaults),
            this.Line(),
            this.Track("PlayerRunSpeedCoeff", 2, 5, 0.1, this.ProgressionDefaults),
            this.Track("PlayerRunBackSpeedCoeff", 1, 5, 0.1, this.ProgressionDefaults),
            this.Track("PlayerSprintSpeedCoeff", 1, 5, 0.1, this.ProgressionDefaults),
            this.Line(),    
            this.Track("PlayerXPForFirstLevel", 100, 1000, 1, this.ProgressionDefaults),
            this.Track("PlayerXPExp", 1, 2, 0.01, this.ProgressionDefaults),
            this.Track("PlayerXPPct", 10, 300, 1, this.ProgressionDefaults),
            this.Track("SkillPointsPerLevelUp", 1, 20, 1, this.ProgressionDefaults),
            this.Line(),    
            this.Track("EnemyHPBase", 10, 500, 5, this.ProgressionDefaults),
            this.Track("EnemyHPExpPerLevel", 1, 2, 0.01, this.ProgressionDefaults),
            this.Track("EnemyHPPctPerLevel", 10, 300, 1, this.ProgressionDefaults),
            this.Track("EnemyHpDeltaPct", 1, 50, 1, this.ProgressionDefaults),
            this.Line(),    
            this.Track("EnemyDamageBase", 1, 100, 1, this.ProgressionDefaults),
            this.Track("EnemyDamageExpPerLevel", 1, 2, 0.01, this.ProgressionDefaults),
            this.Track("EnemyDamagePctPerLevel", 1, 300, 1, this.ProgressionDefaults),
            this.Line(),    
            this.Track("EnemyXpRewardBase", 1, 100, 1, this.ProgressionDefaults),
            this.Track("EnemyXpRewardExpPerLevel", 1, 2, 0.01, this.ProgressionDefaults),
            this.Track("EnemyXpRewardPctPerLevel", 10, 300, 1, this.ProgressionDefaults),
            this.Line(),    
            this.Track("EnemyHigherLevelChance", 1, 100, 1, this.ProgressionDefaults),
            this.Track("EnemyEliteChance", 1, 100, 1, this.ProgressionDefaults),
            this.Track("EnemyBossChance", 1, 100, 1, this.ProgressionDefaults),
            this.Line(),    
            this.Track("WeaponDPSBase", 10, 1000, 1, this.ProgressionDefaults),
            this.Track("WeaponDPSExpPerLevel", 1, 2, 0.01, this.ProgressionDefaults),
            this.Track("WeaponDPSPctPerQuality", 1, 100, 1, this.ProgressionDefaults),
        ])
    }
    
    GroupLocations(): void {
        //Location levels
    }

    GroupEnemies(): void {
        //Enable/disable, setup mults and sizes and sections
    }

    GroupLoot(): void {
        //Quality params (weights, etc)
    }

    GroupMisc(): void {
        //Body/item despawn timer, damage numbers/xp duration, etc.
    }


    // UI HELPERS

    SubGroup(id: string, elements: MCMElement[]): MCMSubGroup{
        return { id: id, sh: true, gr: elements }
    }
    
    private lineNumber = 0;
    Line(): MCMElement {
        return {id: `line_${this.lineNumber++}`, type: MCMElementType.Line}
    }
    
    Title(id: string, text: string, align?: MCMTextAligment, color?: [number, number, number, number]): MCMElement {
        return {id: id, type: MCMElementType.Title, text: text, align: align, clr: color}
    }
    
    Checkbox(id: string, def: boolean): MCMElement {
        return {id: id, type: MCMElementType.Checkbox, val: MCMValueType.Bool, def: def}
    }
    
    InputNumber(id: string, min: number, max: number, def: number): MCMElement {
        return {id: id, type: MCMElementType.Input, val: MCMValueType.Number, def: def, min: min, max: max}
    }
    
    Track(id: string, min: number, max: number, step: number, defSource: Map<string, number>): MCMElement {
        return {id: id, type: MCMElementType.Track, val: MCMValueType.Number, def: defSource.get(id), min: min, max: max, step: step}
    }
}

export function GetProgressionValue(field: ProgressionFieldType):number {
    return MonsterWorld.MCM.GetProgressionValue(field)
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

const MainGroupId = "MonsterWorld"
const ProgressionSubGroupId = "MWProgression"

