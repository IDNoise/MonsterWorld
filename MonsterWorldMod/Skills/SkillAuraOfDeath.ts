import { BaseMWObject } from '../GameObjects/BaseMWObject';
import { Skill } from './Skill';


export class SkillAuraOfDeath extends Skill {
    constructor(public Id: string, public Owner: BaseMWObject, public Interval: number, public DpsPctPerLevel: (level: number) => number, public RangePerLevel: (level: number) => number,
        public PriceFormula?: (level: number) => number, public MaxLevel: number = -1) {
        super(Id, Owner, PriceFormula, MaxLevel);
    }

    get Description(): string { return `Every ${this.Interval} ${this.Interval == 1 ? "second" : "seconds"} damage all enemies in ${this.Range}m range for ${this.DpsPct}% of DPS`; }

    get Range(): number { return this.RangePerLevel(this.Level); }
    get DpsPct(): number { return this.DpsPctPerLevel(this.Level); }

    timePassed: number = 0;
    Update(deltaTime: number): void {
        super.Update(deltaTime);
        this.timePassed += deltaTime;
        if (this.timePassed < this.Interval)
            return;

        let weapon = MonsterWorld.Player.Weapon;
        if (weapon == undefined)
            return;

        this.timePassed -= this.Interval;
        let playerPos = MonsterWorld.Player.GO.position();
        let damage = weapon.DPS * this.DpsPct / 100;
        for (let monster of MonsterWorld.GetMonstersInRange(playerPos, this.Range)){
            MonsterWorld.DamageMonster(monster, damage, false);
        }
    }
}
