namespace LtxStorage;

public enum WeaponType
{
    Pistol,
    Shotgun,
    SMG,
    AssaultRifle,
    MachineGun,
    SniperRifle,
    NotSupported
}

public static class MonsterWorldHelpers
{
    public static WeaponType GetWeaponType(Section section)
    {
        var kind = section.GetString("kind");
        if (kind == "w_rifle")
        {
            if (section.GetInt("ammo_mag_size") >= 75)
                return WeaponType.MachineGun;
            return WeaponType.AssaultRifle;
        }
        if (kind == "w_shotgun")
            return WeaponType.Shotgun;
        if (kind == "w_pistol")
            return WeaponType.Pistol;
        if (kind == "w_smg")
            return WeaponType.SMG;
        if (kind == "w_sniper")
            return WeaponType.SniperRifle;

        return WeaponType.NotSupported;
    }
}

public class MonsterWorldWeaponsGenerator
{
    private Storage storage;
    private string outputDir;
    
    public MonsterWorldWeaponsGenerator(string gameDataPath, string outputDir)
    {
        storage = new Storage(gameDataPath);
        this.outputDir = outputDir;
    }

    private File mwWeaponsFile;
    private File mwUpgradesFile;
    private Dictionary<Section, List<Section>> baseWithVariants = new();
    private Section baseParamsSection;
    private Section baseWeaponUpgradeSection;
    private Section baseWeaponUpgradeBonusSection;

    public void Generate()
    {
        mwWeaponsFile = storage.GetOrCreateFile("items/weapons/w_xxx_monster_world");
        mwUpgradesFile = storage.GetOrCreateFile("items/weapons/upgrades/w_xxx_monster_world");
        PrepareWeaponsData();
        GenerateUpgrades();
        GenerateBaseWeaponParams();
        GenerateWeapons();
        storage.SaveChanges(outputDir);
    }

    void PrepareWeaponsData()
    {
        var allBaseWeapons = new Dictionary<string, Section>();
        var allVariantWeapons = new Dictionary<string, Section>();
        foreach (var w in storage.AllFiles.Where(f => f.Name.StartsWith("w_")).SelectMany(f => f.Sections)
                     .Where(s => s.Name.StartsWith("wpn_") && s.AllParentSectionNames.Contains("default_weapon_params")))
        {
            if (!w.HasProperty("kind")) 
                continue;

            if (w.HasParent("default_weapon_params", false) || (w.HasProperty("kind", false) && w.HasProperty("weapon_class", false)))
                allBaseWeapons.Add(w.Name, w);
            else 
                allVariantWeapons.Add(w.Name, w);
        }
        
        Console.WriteLine($"Base: {allBaseWeapons.Count}, Variants: {allVariantWeapons.Count}");

        foreach (var (vn, vs) in allVariantWeapons)
        {
            Section bw = null;
            if (allBaseWeapons.ContainsKey(vn))
                bw = vs;
            else
                bw = vs.AllParentSections.Where(s => s.Name.StartsWith("wpn_")).FirstOrDefault(s => allBaseWeapons.ContainsKey(s.Name));

            if (!baseWithVariants.TryGetValue(bw, out var variants))
            {
                variants = new List<Section>();
                baseWithVariants[bw] = variants;
            }
            variants.Add(vs);
        }
    }


    enum FireModeUpgradeType
    {
        OneThree,
        OneAuto,
        OneThreeAuto
    }
    private Dictionary<int, Section> rpmUpgrades = new();
    private Dictionary<float, Section> dispersionUpgrades = new();
    private Dictionary<float, Section> intertionUpgrades = new();
    private Dictionary<float, Section> recoilUpgrades = new();
    private Dictionary<FireModeUpgradeType, Section> fireModeUpgrades = new();
    private Dictionary<int, Section> bulletSpeedUpgrades = new();
    
    string ToUpgradeValue(float value) => (value > 0 ? "+" : "") + value.ToString(Property.FloatFormat);
    string ToUpgradeValue(int value) => (value > 0 ? "+" : "") + value;
    
    void GenerateUpgrades()
    {
        GenerateUpgradeBase();

        var index = 1;
        for (var rpm = -100; rpm <= 300; rpm += 3)
        {
            if (rpm == 0)  continue;
            rpmUpgrades.Add(rpm, GenerateUpgrade("rpm", index++, new { rpm = ToUpgradeValue(rpm) }));
        }

        index = 1;
        fireModeUpgrades.Add(FireModeUpgradeType.OneThree, GenerateUpgrade("fire_mode", index++, new { fire_modes = "1, 3" }));
        fireModeUpgrades.Add(FireModeUpgradeType.OneAuto, GenerateUpgrade("fire_mode", index++, new { fire_modes = "1, -1" }));
        fireModeUpgrades.Add(FireModeUpgradeType.OneThreeAuto, GenerateUpgrade("fire_mode", index++, new { fire_modes = "1, 3, -1" }));
        
        index = 1;
        for (var dispersion = -1f; dispersion <= 0.3f; dispersion += 0.025f)
        {
            if (dispersion == 0)  continue;
            dispersionUpgrades.Add(dispersion, GenerateUpgrade("dispersion", index++, new { fire_dispersion_base = ToUpgradeValue(dispersion) }));
        }
        
        index = 1;
        for (var bulletSpeed = -100; bulletSpeed <= 300; bulletSpeed += 10)
        {
            if (bulletSpeed == 0)  continue;
            
            bulletSpeedUpgrades.Add(bulletSpeed, GenerateUpgrade("bulletSpeed", index++, new
            {
                bullet_speed = ToUpgradeValue(bulletSpeed),
                fire_distance = ToUpgradeValue(bulletSpeed)
            }));
        }
        
        index = 1;
        for (var intertion = -10f; intertion <= 3f; intertion += 0.2f)
        {
            if (intertion == 0)  continue;
            
            dispersionUpgrades.Add(intertion, GenerateUpgrade("intertion", index++, new
            {
                crosshair_inertion                       = ToUpgradeValue(intertion),
                PDM_disp_base                            = ToUpgradeValue(intertion * 0.1f),
                PDM_disp_vel_factor                      = ToUpgradeValue(intertion * 0.5f),
                PDM_disp_accel_factor                    = ToUpgradeValue(intertion * 0.5f),
                //fire_dispersion_base = ToUpgradeValue(intertion)
            }));
        }
        
        index = 1;
        for (var recoil = -4f; recoil <= 1f; recoil += 0.025f)
        {
            if (recoil == 0)  continue;
            
            recoilUpgrades.Add(recoil, GenerateUpgrade("recoil", index++, new
            {
                cam_dispersion                           = ToUpgradeValue(recoil),
                //cam_dispersion_inc                       = 0.0,
                cam_step_angle_horz                      = ToUpgradeValue(recoil * 0.75f), 
                zoom_cam_dispersion                      = ToUpgradeValue(recoil * 0.9f),
                //zoom_cam_dispersion_inc                  = 0.0,
                zoom_cam_step_angle_horz                 = ToUpgradeValue(recoil * 0.5f),
                //fire_dispersion_base = ToUpgradeValue(recoil)
            }));
        }
    }
    
    void GenerateBaseWeaponParams()
    {
        var allUpgrades = rpmUpgrades.Values.Union(dispersionUpgrades.Values).Union(intertionUpgrades.Values)
            .Union(recoilUpgrades.Values).Union(fireModeUpgrades.Values).Union(bulletSpeedUpgrades.Values)
            .Select(s => s.Name);
        var allUpgradesString = string.Join(",", allUpgrades);
        
        baseParamsSection = storage.MakeSection("mw_base_weapon_params", mwWeaponsFile, properties: new
        {
            //misfire and codition
            misfire_probability      = 0,
            misfire_start_condition  = 0.0001,
            misfire_start_prob       = 0,
            misfire_end_condition    = 0.00001,
            misfire_end_prob         = 0,
        
            condition_queue_shot_dec = 0,
            condition_shot_dec       = 0,
            
            //other
            description              = "",
            inv_weight               = 1,
            sprint_allowed           = true,
            startup_ammo             = 300,
            
            //upgrades
            upgrades                 = allUpgradesString, //TODO move it to weapon itself with filter on what upgrade types it supports (for base - generate custom section)
            installed_upgrades       = "",
            upgrade_scheme           = "TODO", //TODO
        });
    }
    
    void GenerateWeapons()
    {
        var weaponsByType = new Dictionary<WeaponType, List<Section>>();
        foreach (var (baseWeapon, variants) in baseWithVariants)
        {
            var type = MonsterWorldHelpers.GetWeaponType(baseWeapon);
            if (type == WeaponType.NotSupported)
                continue;

            List<string> variantSectionNames = new List<string>();
            
            string weaponName = null;
            List<string> parentSectionNames = new List<string>();
            
            foreach (var variantWeapon in variants)
            {
                weaponName = $"{variantWeapon.Name}_mw";
                variantSectionNames.Add(weaponName);
                parentSectionNames = new List<string>() { variantWeapon.Name, baseParamsSection.Name };
                storage.MakeSection(weaponName, mwWeaponsFile, parentSectionNames, new
                {
                });
            }
            
            weaponName = $"{baseWeapon.Name}_mw";
            parentSectionNames = new List<string>() { baseWeapon.Name, baseParamsSection.Name };
            var newWeaponSection = storage.MakeSection(weaponName, mwWeaponsFile, parentSectionNames, new
            {
                variants = string.Join(", ", variantSectionNames.Prepend(weaponName))
            });
            
            if (!weaponsByType.TryGetValue(type, out var typeSections))
            {
                typeSections = new List<Section>();
                weaponsByType[type] = typeSections;
            }
            typeSections.Add(newWeaponSection);
        }

        foreach (var (type, sections) in weaponsByType)
        {
            storage.MakeSection(type.ToString().ToLower(), mwWeaponsFile, properties: sections.Select(s => s.Name));
        }
    }

    private void GenerateUpgradeBase()
    {
        baseWeaponUpgradeSection = storage.MakeSection("mw_wub", mwUpgradesFile, properties: new
        {
            scheme_index = "0, 0",
            known = 1,
            property = "prop_inertion",

            precondition_functor = "monsterworld_helpers.precondition_functor_a", //TODO
            precondition_parameter = "a & b",
            effect_functor = "inventory_upgrades.effect_functor_a",
            effect_parameter = "something_here",

            prereq_functor = "inventory_upgrades.prereq_functor_a", //TODO
            prereq_tooltip_functor = "inventory_upgrades.prereq_tooltip_functor_a",
            prereq_params = "",
            name = "st_up_stk_b2_name",
            description = "st_up_stk_b2_descr",
            icon = "ui_inGame2_upgrade_IL86_2",
        });
        
        baseWeaponUpgradeBonusSection = storage.MakeSection("mw_wubb", mwUpgradesFile, properties: new
        {
            cost = 0,
            value = "+20"
        });
    }

    private Section GenerateUpgrade(string type, int index, object properties)
    {
        var name = $"mw_u_{type}_{index}";
        var bonusSection = storage.MakeSection($"{name}_b", mwUpgradesFile, new List<string>() {baseWeaponUpgradeBonusSection.Name}, properties);
        var elementSection = storage.MakeSection($"{name}_e", mwUpgradesFile, properties: new { elements = name });
        
        return storage.MakeSection(name, mwUpgradesFile, new List<string>() { baseWeaponUpgradeSection.Name }, properties: new
        {
            section = bonusSection.Name,
            effects = elementSection.Name
        });
    }
}
