namespace LtxStorage.MonsterWorld;

public class ItemsGenerator : BaseGenerator
{
    private readonly File mwItems;
    
    public ItemsGenerator(string gameDataPath, string outputDir) : base(gameDataPath, outputDir)
    {
        mwItems = Storage.GetOrCreateFile("items/items/items_xxx_monster_world");
    }

    protected override void InternalGenerate()
    {
        GenerateStimpacks();
    }
    
    public readonly record struct StimpackConfig(string SectionName, string ParentSectionName, float HealPct);
    
    void GenerateStimpacks()
    {
        var configs = new List<StimpackConfig>()
        {
            new("mw_stimpack_25", "stimpack", 25),
            new("mw_stimpack_50", "stimpack_army", 50),
            new("mw_stimpack_75", "stimpack_scientic", 75),
        };
        
        foreach (var cfg in configs)
        {
            Storage.MakeSection(cfg.SectionName, mwItems, new List<string>() { cfg.ParentSectionName }, properties: new
            {
                description = "",
                inv_weight = 0.000001,
                boost_time = 5,
                boost_health_restore = cfg.HealPct / 1000f,
                boost_radiation_restore = 0,
                eat_alcohol = 0,
                eat_satiety = 0,
                eat_sleepiness = 0,
                eat_thirstiness = 0,
                mw_heal_pct = cfg.HealPct,
                max_uses = 1
            });
        }
    }
}