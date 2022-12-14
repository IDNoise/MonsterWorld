import { MWObject } from "../GameObjects/MWObject";
import { MWMonster } from "../GameObjects/MWMonster";
import { Skill } from "./Skill";


export class SkillHealPlayerOnKill extends Skill {
    constructor(public HpPerLevel: (level: number) => number, public PriceFormula?: (level: number) => number, public MaxLevel: number = -1) {
        super(PriceFormula, MaxLevel);
    }

    get Description(): string { return `+${this.HPOnKill} HP on kill`; }

    OnMonsterKill(monster: MWMonster, isCrit: boolean): void {
        MonsterWorld.Player.HP += this.HPOnKill;
    }

    get HPOnKill(): number { return this.HpPerLevel(this.Level); }
}
