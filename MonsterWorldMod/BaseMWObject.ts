import { Load, Save } from '../StalkerAPI/extensions/basic';
import { MonsterWorld } from './MonsterWorld';

export abstract class BaseMWObject {
    constructor(public mw: MonsterWorld, public id: Id) {
        log(`Creating [${this.id}] ${this.Name}. Was initialized: ${this.Initialized}`);
        if (!this.Initialized){
            this.Initialize();
            this.Initialized = true;
        }
    }

    get Initialized(): boolean { return this.Load("MW_Initialized"); }
    set Initialized(initialized: boolean) { this.Save("MW_Initialized", initialized); }

    get ServerGO(): cse_alife_object { return alife().object(this.id); }
    get GO(): game_object { return level.object_by_id(this.id); }

    get Name(): string { return `${this.ServerGO.section_name()}:${this.ServerGO.id}`; }

    get HP(): number { return this.Load("MW_HP"); }
    set HP(newHp: number) {
        this.Save("MW_HP", newHp);
        if(this.GO != undefined)
            this.GO.set_health_ex(newHp / this.MaxHP);
    }

    get MaxHP(): number { return this.Load("MW_MaxHP"); }
    set MaxHP(hp: number) { this.Save("MW_MaxHP", hp); }

    get Level(): number { return this.Load("MW_Level"); }
    set Level(level: number) { this.Save("MW_Level", level); }

    get IsDead(): boolean { return this.HP <= 0; }

    protected Save<T>(varname: string, val: T): void { Save(this.id, varname, val); };
    protected Load<T>(varname: string, def?: T): T { return Load(this.id, varname, def); }
    
    protected abstract Initialize(): void;
}
