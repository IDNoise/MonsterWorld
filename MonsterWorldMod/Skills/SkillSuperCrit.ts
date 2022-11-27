import { MWMonster } from '../GameObjects/MWMonster';
import { Skill } from './Skill';


export class SkillSuperCrit extends Skill {
    constructor(public CritCount: number, public DamageBonusPctPerLevel: (level: number) => number,
        public PriceFormula?: (level: number) => number, public MaxLevel: number = -1) {
        super(PriceFormula, MaxLevel);
    }

    get Description(): string { return `Every ${this.CritCount}'th crit deals additional ${this.DamageBonusPct}% damage`; }

    get DamageBonusPct(): number { return this.DamageBonusPctPerLevel(this.Level); }

    get CritsInRow(): number { return this.Load("CritsInRow", 0); }
    set CritsInRow(crits: number) { this.Save("CritsInRow", crits); }

    override OnMonsterBeforeHit(monster: MWMonster, isCrit: boolean, damage: number): number {
        if (!isCrit || this.CritsInRow++ < this.CritCount) {
            return super.OnMonsterBeforeHit(monster, isCrit, damage);
        }

        this.CritsInRow = 0;
        return damage * (1 + this.DamageBonusPct / 100);
    }
}
