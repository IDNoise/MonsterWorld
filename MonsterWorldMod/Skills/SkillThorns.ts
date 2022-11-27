import { MWObject } from '../GameObjects/MWObject';
import { MWMonster } from '../GameObjects/MWMonster';
import { Skill } from './Skill';

export class SkillThorns extends Skill {
    constructor(public ReturnPctPerLevel: (level: number) => number,
        public PriceFormula?: (level: number) => number, public MaxLevel: number = -1) {
        super(PriceFormula, MaxLevel);
    }

    get Description(): string { return `return ${this.ReturnPct}% of active weapon DPS on attack`; }

    get ReturnPct(): number { return this.ReturnPctPerLevel(this.Level); }

    override OnPlayerHit(monster: MWMonster, damage: number): void {
        if (monster.IsDead)
            return;

        let weapon = MonsterWorld.Player.ActiveWeapon;
        if (weapon == undefined)
            return;

        let returnDamage = weapon.DPS * this.ReturnPct / 100;
        MonsterWorld.DamageMonster(monster, returnDamage, false);
    }
}
