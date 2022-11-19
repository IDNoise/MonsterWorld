import { BaseMWObject } from './BaseMWObject';
import { MonsterWorld } from './MonsterWorld';

export class MWWeapon extends BaseMWObject {
    constructor(public mw: MonsterWorld, public id: Id, private spawnLevel?: number) {
        super(mw, id);
    }

    override Initialize(): void {
        this.Level = this.spawnLevel || 1;
        this.GO.set_ammo_elapsed(1000);
    }
}
