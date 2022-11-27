import { MWObject } from '../GameObjects/MWObject';
import { MWMonster } from '../GameObjects/MWMonster';
import { Skill } from './Skill';

export class SkillCriticalDeath extends Skill {
    constructor(public ChancePctPerLevel: (level: number) => number, public HpPctPerLevel: (level: number) => number, public RangePerLevel: (level: number) => number,
        public PriceFormula?: (level: number) => number, public MaxLevel: number = -1) {
        super(PriceFormula, MaxLevel);
    }

    get Description(): string { return `${this.Chance}% chance on critical kill for enemy to explode and damage all enemies in ${this.Range}m radius for ${this.HpPct}% of Max HP`; }

    get Chance(): number { return this.ChancePctPerLevel(this.Level); }
    get HpPct(): number { return this.HpPctPerLevel(this.Level); }
    get Range(): number { return this.RangePerLevel(this.Level); }

    override OnMonsterKill(monster: MWMonster, isCrit: boolean): void {
        if (!isCrit)
            return;

        let monsterPos = monster.GO.position();
        let damage = monster.MaxHP * this.HpPct / 100;

        let hits = 0;
        for (let nearbyMonster of MonsterWorld.GetMonstersInRange(monsterPos, this.Range)){
            MonsterWorld.DamageMonster(nearbyMonster, damage, false);
            hits++;
        }
        
        if (hits > 0) {
            let particles = new particles_object("anomaly2\\body_tear_00");
            particles.play_at_pos(monsterPos);
        }
    }
}


