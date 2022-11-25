import { Load, Save } from '../StalkerAPI/extensions/basic';
import { Log } from '../StalkerModBase';
import { MonsterWorld } from './MonsterWorld';
import { PctStats, StatBonusType, StatType } from './MonsterWorldConfig';

export abstract class BaseMWObject {
    constructor(public World: MonsterWorld, public id: Id) {
        //Log(`Construct ${id}`)
        if (!this.Initialized){
            //Log(`Initialize ${id}`)
            this.Initialize();
            this.Initialized = true;
        }
        else {
            //Log(`Reinitialize ${id}`)
            this.Reinit()
        }
        //Log(`Construct ${id} finished`)
    }

    get Initialized(): boolean { return this.Load("Initialized"); }
    set Initialized(initialized: boolean) { this.Save("Initialized", initialized); }

    get ServerGO(): cse_alife_object { return alife().object(this.id); }
    get GO(): game_object { return level.object_by_id(this.id); }

    get SectionId(): string { return `${this.ServerGO.section_name()}:${this.ServerGO.id}`; }

    get HP(): number { return this.Load("HP"); }
    set HP(newHp: number) {
        //Log(`HP change start ${this.id}`)
        newHp = math.max(0, math.min(newHp, this.MaxHP))
        this.Save("HP", newHp);
        if(this.GO != undefined)
            this.GO.set_health_ex(newHp / this.MaxHP);
        if (this.IsDead)
            this.OnDeath();
        //Log(`HP change end ${this.id}`)
    }

    get MaxHP(): number { return  math.max(1, this.GetStat(StatType.MaxHP)); }

    get HPRegen(): number { return this.GetStat(StatType.HPRegen); }

    Update(deltaTime: number){
        this.RegenHP(deltaTime)
    }

    RegenHP(deltaTime: number){
        //Log(`HP Regen start ${this.id}`)
        this.HP = math.min(this.MaxHP, this.HP + this.HPRegen * deltaTime);
        //Log(`HP Regen end ${this.id}`)
    }

    get Level(): number { return this.Load("Level"); }
    set Level(level: number) { this.Save("Level", level); }

    get IsDead(): boolean { return this.HP <= 0; }

    get Section(): string { return this.ServerGO.section_name(); }

    GetStat(stat: StatType): number{ return this.Load<number>(GetStatTotalField(stat), 0); }

    SetStatBase(stat: StatType, baseValue: number): void{ 
        this.Save<number>(GetStatBaseField(stat), baseValue); 
        this.RecalculateStatTotal(stat);
    }

    public AddStatBonus(stat: StatType, bonusType: StatBonusType, bonus: number, source: string): void{

        if (PctStats.includes(stat) && bonusType != StatBonusType.Flat){
            Log(`ERROR: Adding non flat bonus to % stat: ${stat} from ${source}`)
            return;
        }

        let field = GetStatBonusField(stat, bonusType);
        let bonuses = this.Load<LuaTable<string, number>>(field, new LuaTable());
        bonuses.set(source, bonus);
        this.Save<LuaTable<string, number>>(field, bonuses);
        this.RecalculateStatTotal(stat); 
    }

    public RemoveStatBonus(stat: StatType, bonusType: StatBonusType, source: string): void{
        let field = GetStatBonusField(stat, bonusType);
        let bonuses = this.Load<LuaTable<string, number>>(field, new LuaTable());
        bonuses.delete(source);
        this.Save<LuaTable<string, number>>(field, bonuses);
        this.RecalculateStatTotal(stat); 
    }
   
    RecalculateStatTotal(stat: StatType){
        let base = this.Load<number>(GetStatBaseField(stat), 0); 
        let flatBonuses = this.Load<LuaTable<string, number>>(GetStatBonusField(stat, StatBonusType.Flat), new LuaTable());
        let flatBonus = 0;
        for(let [_, value] of flatBonuses){
            flatBonus += value;
        }
        let pctBonuses = this.Load<LuaTable<string, number>>(GetStatBonusField(stat, StatBonusType.Pct), new LuaTable());
        let pctBonus = 0;
        for(let [_, value] of pctBonuses){
            pctBonus += value;
        }
        let multBonuses = this.Load<LuaTable<string, number>>(GetStatBonusField(stat, StatBonusType.Mult), new LuaTable());
        let multBonus = 1;
        for(let [_, value] of multBonuses){
            multBonus *= value;
        }

        let total = (base + flatBonus) * (1 + pctBonus / 100) * multBonus;
        this.Save(GetStatTotalField(stat), total)
        this.OnStatChanged(stat, total);
    }

    protected OnStatChanged(stat: StatType, total: number){
        if (stat == StatType.MaxHP){
            this.HP = total;
        }
    }

    protected Save<T>(varname: string, val: T): void { Save(this.id, "MW_" + varname, val); };
    protected Load<T>(varname: string, def?: T): T { return Load(this.id, "MW_" + varname, def); }
    
    protected abstract Initialize(): void;
    protected Reinit(): void {}

    protected OnDeath(): void {}
}

function GetStatBonusField(stat: StatType, bonusType: StatBonusType): string { return `${stat}_${bonusType}_bonuses`; }
function GetStatBaseField(stat: StatType): string { return `${stat}_base`; }
function GetStatTotalField(stat: StatType): string { return `${stat}_total`; }


