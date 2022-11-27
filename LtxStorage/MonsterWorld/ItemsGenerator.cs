namespace LtxStorage.MonsterWorld;

public class ItemsGenerator : BaseGenerator {
    private readonly File mwItems;

    private readonly Dictionary<int, int> costQuality = new() {
        { 1, 0 },
        { 2, 35000 },
        { 3, 70000 },
        { 4, 120000 },
        { 5, 180000 }
    };

    private readonly Dictionary<int, List<Section>> outfitsByQuality = new() {
        { 1, new List<Section>() },
        { 2, new List<Section>() },
        { 3, new List<Section>() },
        { 4, new List<Section>() },
        { 5, new List<Section>() }
    };

    public ItemsGenerator(string gameDataPath, string outputDir) : base(gameDataPath, outputDir) {
        mwItems = Storage.GetOrCreateFile("items/items/items_xxx_monster_world");
    }

    protected override void InternalGenerate() {
        GenerateStimpacks();
        GenerateArts();
        GenerateArmors();
    }

    private void GenerateStimpacks() {
        var configs = new List<StimpackConfig> {
            new("mw_stimpack_25", "stimpack", 25),
            new("mw_stimpack_50", "stimpack_army", 50),
            new("mw_stimpack_75", "stimpack_scientic", 75)
        };

        var generatedStimpacks = new List<Section>();

        foreach (var cfg in configs)
            generatedStimpacks.Add(Storage.MakeSection(cfg.SectionName, mwItems, new List<string> { cfg.ParentSectionName }, new {
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

        Storage.MakeSection("stimpacks", mwItems, properties: generatedStimpacks.Select(s => s.Name));
    }

    private void GenerateArts() {
        var junkArtefactsFile = Storage.GetFile("items_artefacts_junk");
        var generatedArts = new List<Section>();

        foreach (var artSection in junkArtefactsFile.Sections)
            generatedArts.Add(Storage.MakeSection($"{artSection.Name}_mw", mwItems, new List<string> { artSection.Name }, new {
                description = "",
                inv_weight = 0.000001,
                jump_height = 0,
                af_actor_properties = "off",
                actor_properties = "off",
                tier = 0
            }));

        Storage.MakeSection("artefacts_mw", mwItems, properties: generatedArts.Select(s => s.Name));
    }

    private void GenerateArmors() {
        var allOutfitSections = Storage.GetDirectory("items/outfits")
            .Files.SelectMany(f => f.Sections)
            .Where(s => s.Name != "without_outfit" && s.ParentSectionNames.Contains("outfit_base"));

        var baseParamsSection = Storage.MakeSection("mw_outfit_base", mwItems, properties: new {
            upgrade_scheme = "up_scheme_exo_1",
            default_to_ruck = true,
            can_trade = true,
            sprint_allowed = true,
            helmet_avaliable = true,
            backpack_avaliable = true,
            control_inertion_factor = 1,
            power_loss = 0,
            inv_weight = 0.00001,
            additional_inventory_weight = 0,
            additional_inventory_weight2 = 0,
            hit_fraction_actor = 1,
            upgrades = "",
            installed_upgrades = "",
            ph_mass = 100000
        });

        var i = 1;
        foreach (var s in allOutfitSections) {
            //Console.WriteLine($"[{i++}] {s.Name}");
            var cost = s.GetInt("cost");
            var qualityLevel = 1;
            foreach (var (quality, qualityCostMin) in costQuality)
                if (cost > qualityCostMin && qualityLevel < quality)
                    qualityLevel = quality;

            outfitsByQuality[qualityLevel].Add(Storage.MakeSection($"{s.Name}_mw", mwItems, new List<string> { s.Name, baseParamsSection.Name }, new {
                artefact_count = qualityLevel
            }));
        }

        foreach (var (qualityLevel, outfitSections) in outfitsByQuality) Storage.MakeSection($"outfits_ql_{qualityLevel}", mwItems, properties: outfitSections.Select(s => s.Name));
    }

    public readonly record struct StimpackConfig(string SectionName, string ParentSectionName, float HealPct);
}