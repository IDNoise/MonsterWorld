import { Log } from '../../StalkerModBase';
import { World } from '../World';
import { Skill } from '../Skills/Skill';
import { StatType, StatBonusType, PctStats, MultStats } from '../Configs/Stats';
import { Save, Load } from '../Helpers/StalkerAPI';
import { SumTable } from '../Helpers/Collections';

export abstract class MWObject {
    Skills: Map<string, Skill> = new Map();

    constructor(public id: Id) {
        Log(`Construct ${id}`)
    }

    Initialize(): void{
        Log(`Initialize ${this.SectionId} : ${this.Type}`)
        if (!this.WasInitializedForFirstTime){
            this.OnFirstTimeInitialize();
            this.WasInitializedForFirstTime = true;
        }
        this.OnInitialize()
        Log(`Initialize finished`)
    }

    private get WasInitializedForFirstTime(): boolean { return this.Load("Initialized"); }
    private set WasInitializedForFirstTime(initialized: boolean) { this.Save("Initialized", initialized); }
    protected OnFirstTimeInitialize(): void {
        Log(`OnFirstTimeInitialize: ${this.SectionId}`)
    }
    protected OnInitialize(): void {
        Log(`OnInitialize: ${this.SectionId}`)
        this.SetupSkills();
    }

    get ServerGO(): cse_alife_object { return alife().object(this.id); }
    get GO(): game_object { return level.object_by_id(this.id); }

    get SectionId(): string { return `${this.ServerGO.section_name()}:${this.ServerGO.id}`; }

    get Level(): number { return this.Load("Level"); }
    set Level(level: number) { this.Save("Level", level); }

    get Section(): string { return this.ServerGO.section_name(); }

    get MaxHP(): number { return  math.max(1, this.GetStat(StatType.MaxHP)); }
    get HPRegen(): number { return this.GetStat(StatType.HPRegen); }

    get HP(): number { return this.Load("HP"); }
    set HP(newHp: number) {
        newHp = math.max(0, math.min(newHp, this.MaxHP))
        this.Save("HP", newHp);
        if(this.GO != undefined && newHp <= 0) //Dont set health till it's dead to disable wounded animations 
            this.GO.set_health_ex(newHp);
        if (this.IsDead)
            this.OnDeath();
    }

    get IsDead(): boolean { return this.HP <= 0; }

    protected OnDeath(): void {
        //callstack()
    }

    Update(deltaTime: number){
        this.RegenHP(deltaTime)
    }

    RegenHP(deltaTime: number){
        this.HP = math.min(this.MaxHP, this.HP + this.HPRegen * deltaTime);
    }

    GetStat(stat: StatType): number{ return this.Load<number>(GetStatTotalField(stat), MultStats.includes(stat) ? 1 : 0); }
    GetStatBase(stat: StatType): number { return this.Load<number>(GetStatBaseField(stat), MultStats.includes(stat) ? 1 : 0 ); }
    GetStatDiffWithBase(stat: StatType): number { 
        return MultStats.includes(stat) 
            ? this.GetStat(stat) / this.GetStatBase(stat)
            : this.GetStat(stat) - this.GetStatBase(stat); 
    }

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
        if (bonuses.length() > 0){
            bonuses.delete(source);
            this.Save<LuaTable<string, number>>(field, bonuses);
            this.RecalculateStatTotal(stat); 
        }
    }

    public RemoveStatBonuses(stat: StatType, source: string): void{
        this.RemoveStatBonus(stat, StatBonusType.Flat, source);
        this.RemoveStatBonus(stat, StatBonusType.Pct, source);
        this.RemoveStatBonus(stat, StatBonusType.Mult, source);
    }

    GetTotalFlatBonus(stat: StatType): number{
        let bonuses = this.Load<LuaTable<string, number>>(GetStatBonusField(stat, StatBonusType.Flat), new LuaTable());
        return SumTable(bonuses, (k, v) => v)
    }

    GetTotalPctBonus(stat: StatType): number{
        let bonuses = this.Load<LuaTable<string, number>>(GetStatBonusField(stat, StatBonusType.Pct), new LuaTable());
        return SumTable(bonuses, (k, v) => v)
    }

    GetTotalMultBonus(stat: StatType): number{
        let bonuses = this.Load<LuaTable<string, number>>(GetStatBonusField(stat, StatBonusType.Mult), new LuaTable());
        let value = 1;
        for(let [_, bonusValue] of bonuses){
            value *= bonusValue;
        }
        return value;
    }
   
    RecalculateStatTotal(stat: StatType){
        let base = this.GetStatBase(stat); 
        let flatBonus = this.GetTotalFlatBonus(stat)
        let pctBonus = this.GetTotalPctBonus(stat)
        let multBonus = this.GetTotalMultBonus(stat)

        let total = (base + flatBonus) * (1 + pctBonus / 100) * multBonus;
        this.Save(GetStatTotalField(stat), total)
        this.OnStatChanged(stat, total);
    }

    protected OnStatChanged(stat: StatType, total: number){
        if (stat == StatType.MaxHP){
            this.HP = total;
        }
    }

    SetSkillLevel(skillId: string, level: number): void{ this.Save(`SkillLevel_${skillId}`, level); }
    GetSkillLevel(skillId: string): number{ return this.Load(`SkillLevel_${skillId}`, 0);}

    protected SetupSkills() {
        Log(`SetupSkills: ${this.SectionId}`)
    }

    protected AddSkill(skill: Skill){
        skill.Init();
        this.Skills.set(skill.Id, skill)
    }

    IterateSkills(iterator: (s: Skill) => void, onlyWithLevel: boolean = true){
        for(const [_, skill] of this.Skills){
            if (!onlyWithLevel || skill.Level > 0)
                iterator(skill);
        }
    }

    protected Save<T>(varname: string, val: T): void { Save(this.id, "MW_" + varname, val); };
    protected Load<T>(varname: string, def?: T): T { return Load(this.id, "MW_" + varname, def); }
    
    abstract get Type(): ObjectType;
}

function GetStatBonusField(stat: StatType, bonusType: StatBonusType): string { return `${stat}_${bonusType}_bonuses`; }
function GetStatBaseField(stat: StatType): string { return `${stat}_base`; }
function GetStatTotalField(stat: StatType): string { return `${stat}_total`; }

export enum ObjectType {
    Player,
    Monster,
    Weapon,
    Armor,
    Artefact
}
