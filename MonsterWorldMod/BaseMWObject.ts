import { Load, Save } from '../StalkerAPI/extensions/basic';
import { Log } from '../StalkerModBase';
import { MonsterWorld } from './MonsterWorld';

export abstract class BaseMWObject {
    constructor(public mw: MonsterWorld, public id: Id) {
        //Log(`Creating [${this.id}] ${this.SectionId}. Was initialized: ${this.Initialized}`);
        if (!this.Initialized){
            this.Initialize();
            this.Initialized = true;
        }
    }

    get Initialized(): boolean { return this.Load("Initialized"); }
    set Initialized(initialized: boolean) { this.Save("Initialized", initialized); }

    get ServerGO(): cse_alife_object { return alife().object(this.id); }
    get GO(): game_object { return level.object_by_id(this.id); }

    get SectionId(): string { return `${this.ServerGO.section_name()}:${this.ServerGO.id}`; }

    get HP(): number { return this.Load("HP"); }
    set HP(newHp: number) {
        newHp = math.floor(newHp);
        this.Save("HP", newHp);
        if(this.GO != undefined)
            this.GO.set_health_ex(newHp / this.MaxHP);
        if (this.IsDead)
            this.OnDeath();
    }

    get MaxHP(): number { return this.Load("MaxHP"); }
    set MaxHP(newMaxHp: number) { 
        newMaxHp = math.floor(newMaxHp);
        this.Save("MaxHP", newMaxHp); 
        this.HP = newMaxHp;
    }

    get Level(): number { return this.Load("Level"); }
    set Level(level: number) { this.Save("Level", level); }

    get IsDead(): boolean { return this.HP <= 0; }

    get Section(): string { return this.ServerGO.section_name(); }

    protected Save<T>(varname: string, val: T): void { Save(this.id, "MW_" + varname, val); };
    protected Load<T>(varname: string, def?: T): T { return Load(this.id, "MW_" + varname, def); }
    
    protected abstract Initialize(): void;

    protected OnDeath(): void {}
}
