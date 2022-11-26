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
        GenerateArts();
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
        
        var generatedStimpacks = new List<Section>();
        
        foreach (var cfg in configs)
        {
            generatedStimpacks.Add(Storage.MakeSection(cfg.SectionName, mwItems, new List<string>() { cfg.ParentSectionName }, properties: new
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
            }));
        }
        
        Storage.MakeSection($"stimpacks", mwItems, properties: generatedStimpacks.Select(s => s.Name));
    }

    void GenerateArts()
    {
        var junkArtefactsFile = Storage.GetFile("items_artefacts_junk");
        var generatedArts = new List<Section>();

        foreach (var artSection in junkArtefactsFile.Sections)
        {
            generatedArts.Add(Storage.MakeSection($"{artSection.Name}_mw", mwItems, new List<string>() { artSection.Name }, properties: new
            {
                description         = "",
                inv_weight          = 0.000001,
                jump_height	        = 0,
                af_actor_properties = "off",
                actor_properties    = "off",
                tier                = 0,
            }));
        }
        
        Storage.MakeSection($"artefacts", mwItems, properties: generatedArts.Select(s => s.Name));
    }
}