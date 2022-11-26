import { BaseMWObject } from '../BaseMWObject';
import { MWMonster } from '../MWMonster';
import { Skill } from './Skill';



export class SkillCriticalDeath extends Skill {
    constructor(public Id: string, public Owner: BaseMWObject, public ChancePctPerLevel: (level: number) => number, public HpPctPerLevel: (level: number) => number, public RangePerLevel: (level: number) => number,
        public PriceFormula?: (level: number) => number, public MaxLevel: number = -1) {
        super(Id, Owner, PriceFormula, MaxLevel);
    }

    get Description(): string { return `${this.Chance}% chance on critical kill for enemy to explode and damage all enemies in ${this.Range}m radius for ${this.HpPct}% of HP`; }

    get Chance(): number { return this.ChancePctPerLevel(this.Level); }
    get HpPct(): number { return this.HpPctPerLevel(this.Level); }
    get Range(): number { return this.RangePerLevel(this.Level); }

    override OnMonsterKill(monster: MWMonster, isCrit: boolean): void {
        if (!isCrit)
            return;

        let monsterPos = monster.GO.position();
        let rangeSqr = this.Range * this.Range;
        let damage = monster.MaxHP * this.HpPct / 100;

        let hits = 0;
        for (let [_, nearbyMonster] of this.World.Monsters) {
            if (nearbyMonster == monster || nearbyMonster.GO == undefined || nearbyMonster.IsDead)
                continue;
            let distanceSqr = nearbyMonster.GO.position().distance_to_sqr(monsterPos);
            if (distanceSqr <= rangeSqr) {
                this.World.DamageMonster(nearbyMonster, damage, false);
                hits++;
            }
        }

        if (hits > 0) {
            let particles = new particles_object("anomaly2\\body_tear_00");
            particles.play_at_pos(monsterPos);
        }
    }
}
