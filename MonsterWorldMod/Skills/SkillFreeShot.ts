import { MWWeapon } from '../GameObjects/MWWeapon';
import { IsPctRolled } from '../Helpers/Random';
import { Skill } from './Skill';


export class SkillFreeShot extends Skill {
    constructor(public FreeShotChancePctPerLevel: (level: number) => number,
        public PriceFormula?: (level: number) => number, public MaxLevel: number = -1) {
        super(PriceFormula, MaxLevel);
    }

    get Description(): string { return `%${this.FreeShotChancePct}% chance to not spend a bullet`; }

    get FreeShotChancePct(): number { return this.FreeShotChancePctPerLevel(this.Level); }

    override OnWeaponFired(weapon: MWWeapon): void {
        super.OnWeaponFired(weapon);
        if (weapon.AmmoLeft > 0 && IsPctRolled(this.FreeShotChancePct)) {
            weapon.GO.cast_Weapon().SetAmmoElapsed(weapon.AmmoLeft + 1);
        }
    }
}
