import { Load, Save } from '../StalkerAPI/extensions/basic';

export abstract class BaseMWObject {
    constructor(public go: game_object) {
        if (this.Initialized)
            return;

        log(`Initializing ${this.Name}`);
        this.Initialize();
        this.Initialized = true;
    }

    get Initialized(): boolean { return this.Load("MW_Initialized"); }
    set Initialized(initialized: boolean) { this.Save("MW_Initialized", initialized); }

    get Name(): string { return `${this.go.section()}:${this.go.id()}`; }

    get HP(): number { return this.Load("MW_HP"); }
    set HP(newHp: number) {
        this.Save("MW_HP", newHp);
        this.go.set_health_ex(newHp / this.MaxHP);
    }

    get MaxHP(): number { return this.Load("MW_MaxHP"); }
    set MaxHP(hp: number) { this.Save("MW_MaxHP", hp); }

    get Level(): number { return this.Load("MW_Level"); }
    set Level(level: number) { this.Save("MW_Level", level); }

    get IsDead(): boolean { return this.HP <= 0; }

    protected Save<T>(varname: string, val: T): void { Save(this.go, varname, val); };
    protected Load<T>(varname: string, def?: T): T { return Load(this.go, varname, def); }

    protected abstract Initialize(): void;
}
