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

    abstract get Type(): ObjectType;

    get ServerGO(): cse_alife_object { return alife().object(this.id); }
    get GO(): game_object { return level.object_by_id(this.id); }

    get SectionId(): string { return `${this.ServerGO.section_name()}:${this.ServerGO.id}`; }

    get Level(): number { return this.Load("Level"); }
    set Level(level: number) { this.Save("Level", level); }

    get Section(): string { return this.ServerGO.section_name(); }

    get MaxHP(): number { return  math.max(1, this.GetStat(StatType.MaxHP)); }
    get HPRegen(): number { return this.GetStat(StatType.HPRegen); }

    get HP(): number { return this.Load("HP", 0); }
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
        this.UpdateTTLForBonuses(deltaTime)
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

    public AddStatBonus(stat: StatType, bonusType: StatBonusType, bonus: number, source: string, duration?: number): void{
        let field = GetStatBonusField(stat, bonusType);
        Log(`Adding stat bonus to ${this.SectionId} stat: ${stat}, type: ${bonusType} (${field}), bonus: ${bonus}, source: ${source}`)

        if (bonus == 0){
            return;
        }

        if (PctStats.includes(stat) && bonusType != StatBonusType.Flat){
            Log(`ERROR: Adding non flat bonus to % stat: ${stat} from ${source}`)
            return;
        }
        
        let bonuses = this.Load<LuaTable<string, number>>(field, new LuaTable());
        bonuses.set(source, bonus);
        this.Save<LuaTable<string, number>>(field, bonuses);
        this.RecalculateStatTotal(stat); 

        if (duration != undefined){
            this.SetBonusTTL(stat, bonusType, source, duration);
        }
    }

    public RemoveStatBonus(stat: StatType, bonusType: StatBonusType, source: string): void{
        let field = GetStatBonusField(stat, bonusType);
        Log(`Removing stat bonus from ${this.SectionId} stat: ${stat}, type: ${bonusType} (${field}), source: ${source}`)

        let bonuses = this.Load<LuaTable<string, number>>(field, new LuaTable());
        if (bonuses.has(source)){
            bonuses.delete(source);
            this.Save<LuaTable<string, number>>(field, bonuses);
            this.RecalculateStatTotal(stat); 
        }
    }

    public RemoveStatBonuses(stat: StatType, source: string): void{
        this.RemoveStatBonus(stat, StatBonusType.Flat, source);
        this.RemoveStatBonus(stat, StatBonusType.Pct, source);
    }

    GetTotalFlatBonus(stat: StatType): number{
        let bonuses = this.Load<LuaTable<string, number>>(GetStatBonusField(stat, StatBonusType.Flat), new LuaTable());
        return SumTable(bonuses, (k, v) => v)
    }

    GetTotalPctBonus(stat: StatType): number{
        let bonuses = this.Load<LuaTable<string, number>>(GetStatBonusField(stat, StatBonusType.Pct), new LuaTable());
        return SumTable(bonuses, (k, v) => v)
    }
   
    RecalculateStatTotal(stat: StatType){
        let current = this.GetStat(stat)
        let base = this.GetStatBase(stat); 
        let flatBonus = this.GetTotalFlatBonus(stat)
        let pctBonus = this.GetTotalPctBonus(stat)

        let total = (base + flatBonus) * (1 + pctBonus / 100);
        this.Save(GetStatTotalField(stat), total)
        this.OnStatChanged(stat, current, total);
    }

    private SetBonusTTL(stat: StatType, bonusType: StatBonusType, source: string, ttl: number){
        let bonuses = this.Load<LuaSet<BonusTTL>>(BonusesWithTTLField, new LuaSet())
        bonuses.add({Stat: stat, BonusType: bonusType, Source: source, TTL: ttl});
        this.Save<LuaSet<BonusTTL>>(BonusesWithTTLField, bonuses)
    }

    private UpdateTTLForBonuses(deltaTime: number){
        let bonusesToRemove: BonusTTL[] = []

        let bonuses = this.Load<LuaSet<BonusTTL>>(BonusesWithTTLField, new LuaSet())
        for(let bonus of bonuses){
            bonus.TTL -= deltaTime;
            if (bonus.TTL <= 0){
                bonusesToRemove.push(bonus)
            }
        }

        for(let bonusToRemove of bonusesToRemove){
            bonuses.delete(bonusToRemove)
            this.RemoveStatBonus(bonusToRemove.Stat, bonusToRemove.BonusType, bonusToRemove.Source)
        }

        this.Save<LuaSet<BonusTTL>>(BonusesWithTTLField, bonuses)
    }

    protected OnStatChanged(stat: StatType, prev: number, current: number){
        Log(`OnStatChanged ${stat} from ${prev} to ${current}`)
        if (stat == StatType.MaxHP){
            if (current > prev)
                this.HP += (current - prev);
            else 
                this.HP = math.min(this.HP, current)
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
}

function GetStatBonusField(stat: StatType, bonusType: StatBonusType): string { return `${stat}_${bonusType}_bonuses`; }
function GetStatBaseField(stat: StatType): string { return `${stat}_base`; }
function GetStatTotalField(stat: StatType): string { return `${stat}_total`; }

export const enum ObjectType {
    Player = "Player",
    Monster = "Monster",
    Weapon = "Weapon",
    Armor = "Armor",
    Artefact = "Artefact",
    Stimpack = "Stimpack",
}

const BonusesWithTTLField: string = "TimedStatBonuses";
type BonusTTL = {
    Stat: StatType,
    BonusType: StatBonusType,
    Source: string,
    TTL: number
}
