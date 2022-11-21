namespace LtxStorage.MonsterWorld;

public class WeaponsGenerator : BaseGenerator
{
    private readonly File mwWeaponsFile;
    private readonly File mwUpgradesFile;
    private readonly Dictionary<Section, List<Section>> baseWithVariants = new();
    private Section baseParamsSection;
    private Section baseWeaponUpgradeEffectSection;
    private Section baseWeaponUpgradeBonusSection;
    
    public WeaponsGenerator(string gameDataPath, string outputDir) : base(gameDataPath, outputDir)
    {
        mwWeaponsFile = Storage.GetOrCreateFile("items/weapons/w_xxx_monster_world");
        mwUpgradesFile = Storage.GetOrCreateFile("items/weapons/w_xxx_monster_world_upgrades");
    }

    protected override void InternalGenerate()
    {
        PrepareWeaponsData();
        GenerateBaseWeaponParams();
        GenerateWeapons();
    }

    void PrepareWeaponsData()
    {
        var allBaseWeapons = new Dictionary<string, Section>();
        var allVariantWeapons = new Dictionary<string, Section>();
        foreach (var w in Storage.AllFiles.Where(f => f.Name.StartsWith("w_")).SelectMany(f => f.Sections)
                     .Where(s => s.Name.StartsWith("wpn_") && s.AllParentSectionNames.Contains("default_weapon_params")))
        {
            if (!w.HasProperty("kind")) 
                continue;

            if (w.GetInt("ammo_mag_size") < 5)
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

        foreach (var (name, section) in allBaseWeapons)
        {
            if (!baseWithVariants.ContainsKey(section))
                baseWithVariants.Add(section, new List<Section>());
        }
    }
    
    void GenerateBaseWeaponParams()
    {
        // var allUpgrades = rpmUpgrades.Values.Union(dispersionUpgrades.Values).Union(inertionUpgrades.Values)
        //     .Union(recoilUpgrades.Values).Union(fireModeUpgrades.Values).Union(bulletSpeedUpgrades.Values)
        //     .Select(s => s.Name);
        // var allUpgradesString = string.Join(",", allUpgrades);
        
        baseParamsSection = Storage.MakeSection("mw_bwp", mwWeaponsFile, properties: new
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
            inv_weight               = 0.01f,
            hit_impulse              = 300,
            sprint_allowed           = true,
            startup_ammo             = 300,
            
            //upgrades
            upgrades                 = "",//allUpgradesString, //TODO move it to weapon itself with filter on what upgrade types it supports (for base - generate custom section)
            installed_upgrades       = "",//allUpgradesString,
            upgrade_scheme           = "upgrade_scheme_ak74"
        });
    }
    
    void GenerateWeapons()
    {
        var weaponsByType = new Dictionary<WeaponType, List<Section>>();
        int index = 1;
        foreach (var (baseWeapon, variants) in baseWithVariants)
        {
            Console.WriteLine($"Generating [{index++} / {baseWithVariants.Count}]: for {baseWeapon.Name}");
            var type = MonsterWorldHelpers.GetWeaponType(baseWeapon);
            if (type == WeaponType.NotSupported)
            {
                Console.WriteLine($"Not supported: {baseWeapon["kind"]} for {baseWeapon.Name}");
                continue;
            }

            List<string> variantSectionNames = new List<string>();
            
            string weaponName = null;
            List<string> parentSectionNames = new List<string>();

            Dictionary<UpgradeType, List<Section>> upgradesByType = GenerateUpgradesForWeapon(baseWeapon);
            
            Console.WriteLine($"Upgrades for {baseWeapon.Name} = {upgradesByType.Values.Sum(l => l.Count)}");
            
            var upgrades = new
            {
                upgrades = string.Join(",", upgradesByType.Values.SelectMany(u => u).Select(s => s.Name)),
                rpm_upgrades = string.Join(",", upgradesByType[UpgradeType.Rpm].Select(s => s.Name)),
                dispersion_upgrades = string.Join(",", upgradesByType[UpgradeType.Dispersion].Select(s => s.Name)),
                inertion_upgrades = string.Join(",", upgradesByType[UpgradeType.Inertion].Select(s => s.Name)),
                recoil_upgrades = string.Join(",", upgradesByType[UpgradeType.Recoil].Select(s => s.Name)),
                fire_mode_upgrades = string.Join(",", upgradesByType[UpgradeType.FireMode].Select(s => s.Name)),
                bullet_speed_upgrades = string.Join(",", upgradesByType[UpgradeType.BulletSpeed].Select(s => s.Name)),
                mag_size_upgrades = string.Join(",", upgradesByType[UpgradeType.MagSize].Select(s => s.Name)),
                rpm = (int)Math.Min(900, baseWeapon.GetInt("rpm"))
            };

            foreach (var variantWeapon in variants)
            {
                weaponName = $"{variantWeapon.Name}_mw";
                variantSectionNames.Add(weaponName);
                parentSectionNames = new List<string>() { variantWeapon.Name, baseParamsSection.Name };
                Storage.MakeSection(weaponName, mwWeaponsFile, parentSectionNames, upgrades);
            }
            
            weaponName = $"{baseWeapon.Name}_mw";
            parentSectionNames = new List<string>() { baseWeapon.Name, baseParamsSection.Name };
            var newWeaponSection = Storage.MakeSection(weaponName, mwWeaponsFile, parentSectionNames, new
            {
                variants = string.Join(",", variantSectionNames.Prepend(weaponName))
            });
            newWeaponSection.SetProperties(upgrades);
            
            if (!weaponsByType.TryGetValue(type, out var typeSections))
            {
                typeSections = new List<Section>();
                weaponsByType[type] = typeSections;
            }
            typeSections.Add(newWeaponSection);
        }

        foreach (var (type, sections) in weaponsByType)
        {
            Storage.MakeSection(type.ToString().ToLower(), mwWeaponsFile, properties: sections.Select(s => s.Name));
        }

        Storage.MakeSection("mw_drops_by_weapon_type", mwWeaponsFile, properties: new {
            sections = string.Join(",", weaponsByType.Keys.Select(k => k.ToString().ToLower()))
        });
    }

    private Dictionary<UpgradeType, List<Section>> GenerateUpgradesForWeapon(Section weapon)
    {
        var result = new Dictionary<UpgradeType, List<Section>>();
        result.Add(UpgradeType.Dispersion, new List<Section>());
        result.Add(UpgradeType.Inertion, new List<Section>());
        result.Add(UpgradeType.Recoil, new List<Section>());
        result.Add(UpgradeType.Rpm, new List<Section>());
        result.Add(UpgradeType.BulletSpeed, new List<Section>());
        result.Add(UpgradeType.FireMode, new List<Section>());
        result.Add(UpgradeType.MagSize, new List<Section>());
        
        var rpm = weapon.GetInt("rpm");
        if (rpm <= 750)
        {
            var pctMax = 30;
            var pctStep = 5;
            while ((int)(rpm * pctStep / 100f) < 5)
            {
                 pctMax += 25;
                 pctStep += 5;
            }
            for (var pct = pctStep; pct <= pctMax; pct += pctStep)
            {
                int upgradeRpm = (int)(rpm * pct / 100f);
                if (!rpmUpgrades.ContainsKey(upgradeRpm))
                    rpmUpgrades.Add(upgradeRpm, GenerateUpgrade(new { rpm = ToUpgradeValue(upgradeRpm) }));

                result[UpgradeType.Rpm].Add(rpmUpgrades[upgradeRpm]);
            }
        }
        var magSize = weapon.GetInt("ammo_mag_size");
        {
            var pctMax = 100;
            var pctStep = 10;
            while ((int)(magSize * pctStep / 100f) < 1)
            {
                pctMax += 60;
                pctStep += 10;
            }

            for (var pct = pctStep; pct <= pctMax; pct += pctStep)
            {
                int upgradeMagSize = (int)(magSize * pct / 100f);
                if (!magSizeUpgrades.ContainsKey(upgradeMagSize))
                    magSizeUpgrades.Add(upgradeMagSize, GenerateUpgrade(new { ammo_mag_size = ToUpgradeValue(upgradeMagSize) }));

                result[UpgradeType.MagSize].Add(magSizeUpgrades[upgradeMagSize]);
            }
        }

        var bulletSpeed = weapon.GetInt("bullet_speed");
        if (bulletSpeed < 800){
            var pctMax = 30;
            var pctStep = 5;
            for (var pct = pctStep; pct <= pctMax; pct += pctStep)
            {
                int upgradeBulletSpeed = (int)(bulletSpeed * pct / 100f);
                if (!bulletSpeedUpgrades.ContainsKey(upgradeBulletSpeed))
                    bulletSpeedUpgrades.Add(upgradeBulletSpeed, GenerateUpgrade(new
                    {
                        bullet_speed = ToUpgradeValue(upgradeBulletSpeed),
                        fire_distance = ToUpgradeValue(upgradeBulletSpeed)
                    }));

                result[UpgradeType.BulletSpeed].Add(bulletSpeedUpgrades[upgradeBulletSpeed]);
            }
        }
        
        var camDispersion = weapon.GetFloat("cam_dispersion"); // Recoil
        if (camDispersion > 0.3f)
        {
            var pctMax = 30;
            var pctStep = 5;
            for (var pct = pctStep; pct <= pctMax; pct += pctStep)
            {
                float upgradeCamDispersion = -(camDispersion * pct / 100f);
                if (!recoilUpgrades.ContainsKey(upgradeCamDispersion))
                    recoilUpgrades.Add(upgradeCamDispersion, GenerateUpgrade(new
                    {
                        cam_dispersion                           = ToUpgradeValue(upgradeCamDispersion),
                        cam_step_angle_horz                      = ToUpgradeValue(upgradeCamDispersion * 0.75f), 
                        zoom_cam_dispersion                      = ToUpgradeValue(upgradeCamDispersion * 0.9f),
                        zoom_cam_step_angle_horz                 = ToUpgradeValue(upgradeCamDispersion * 0.5f),
                    }));

                result[UpgradeType.Recoil].Add(recoilUpgrades[upgradeCamDispersion]);
            }
        }
        
        {
            var crosshairInertion = weapon.GetFloat("crosshair_inertion"); // Inertion
            var pctMax = 30;
            var pctStep = 5;
            for (var pct = pctStep; pct <= pctMax; pct += pctStep)
            {
                float upgradeCrosshairInertion = -(crosshairInertion * pct / 100f);
                if (!inertionUpgrades.ContainsKey(upgradeCrosshairInertion))
                    inertionUpgrades.Add(upgradeCrosshairInertion, GenerateUpgrade(new
                    {
                        crosshair_inertion                       = ToUpgradeValue(upgradeCrosshairInertion),
                        PDM_disp_base                            = ToUpgradeValue(upgradeCrosshairInertion * 0.1f),
                        PDM_disp_vel_factor                      = ToUpgradeValue(upgradeCrosshairInertion * 0.5f),
                        PDM_disp_accel_factor                    = ToUpgradeValue(upgradeCrosshairInertion * 0.5f),
                    }));

                result[UpgradeType.Inertion].Add(inertionUpgrades[upgradeCrosshairInertion]);
            }
        }
        
        var fireDispersionBase = weapon.GetFloat("fire_dispersion_base"); // Dispersion
        if (fireDispersionBase > 0.2)
        {
            var pctMax = 30;
            var pctStep = 5;
            for (var pct = pctStep; pct <= pctMax; pct += pctStep)
            {
                float upgradeFireDispersionBase = -(fireDispersionBase * pct / 100f);
                if (!dispersionUpgrades.ContainsKey(upgradeFireDispersionBase))
                    dispersionUpgrades.Add(upgradeFireDispersionBase, GenerateUpgrade(new
                    {
                        fire_dispersion_base = ToUpgradeValue(upgradeFireDispersionBase)
                    }));

                result[UpgradeType.Dispersion].Add(dispersionUpgrades[upgradeFireDispersionBase]);
            }
        }
        
        if (rpm >= 100 && magSize >= 10)
        {
            if (fireModeUpgrades.Count == 0)
            {
                fireModeUpgrades.Add(FireModeUpgradeType.OneAuto, GenerateUpgrade(new { fire_modes = "1, -1" }));
                fireModeUpgrades.Add(FireModeUpgradeType.OneThreeAuto, GenerateUpgrade(new { fire_modes = "1, 3, -1" }));
                fireModeUpgrades.Add(FireModeUpgradeType.ThreeAuto, GenerateUpgrade(new { fire_modes = "3, -1" }));
            }
            
            var fireModesString = weapon.GetString("fire_modes");
            if (fireModesString == null)
            {
                result[UpgradeType.FireMode].Add(fireModeUpgrades[FireModeUpgradeType.OneThreeAuto]);
            }
            else
            {
                var fireModes = fireModesString.Replace(" ", "").Split(",", StringSplitOptions.RemoveEmptyEntries);
                if (fireModes.Length < 3 && !fireModes.Contains("-1"))
                {
                    if (fireModes.Contains("3"))
                        result[UpgradeType.FireMode].Add(fireModeUpgrades[FireModeUpgradeType.ThreeAuto]);
                    else
                        result[UpgradeType.FireMode].Add(fireModeUpgrades[FireModeUpgradeType.OneAuto]);
                }
            }
        }

        return result;
    }

    private void GenerateUpgradeBase()
    {
        baseWeaponUpgradeEffectSection = Storage.MakeSection("mwwue", mwUpgradesFile, properties: new
        {
            scheme_index = "0, 0",
            known = 1,
            property = "prop_rpm",
            
            effects = "",

            precondition_functor = "monsterworld_helpers.precondition_functor_a",
            precondition_parameter = "a & b",
            effect_functor = "monsterworld_helpers.effect_functor_a",
            effect_parameter = "",

            prereq_functor = "monsterworld_helpers.prereq_functor_a",
            prereq_tooltip_functor = "monsterworld_helpers.prereq_tooltip_functor_a",
            prereq_params = "",
            name = "",
            description = "",
            icon = "",
        });
        
        baseWeaponUpgradeBonusSection = Storage.MakeSection("mw_wubb", mwUpgradesFile, properties: new
        {
            cost = 1,
            value = "+1"
        });
    }

    private int upgradeIndex = 1;
    private Section GenerateUpgrade(object properties)
    {
        if (baseWeaponUpgradeEffectSection == null)
            GenerateUpgradeBase();
        
        var name = $"mwu{upgradeIndex}";

        var bonusSection = Storage.MakeSection($"mwb{upgradeIndex}", mwUpgradesFile, new List<string>() {baseWeaponUpgradeBonusSection.Name}, properties);
        var elementSection = Storage.MakeSection($"mwe{upgradeIndex}", mwUpgradesFile, new List<string>() { baseWeaponUpgradeEffectSection.Name }, properties: new
        {
            section = bonusSection.Name
        });

        upgradeIndex++;
        
        return Storage.MakeSection(name, mwUpgradesFile, properties: new { elements = elementSection.Name });
    }
    
    enum FireModeUpgradeType
    {
        //OneThree,
        OneAuto,
        OneThreeAuto,
        ThreeAuto
    }

    enum UpgradeType
    {
        Rpm,
        Dispersion,
        Inertion,
        Recoil,
        FireMode,
        BulletSpeed,
        MagSize
    }
    
    private Dictionary<int, Section> rpmUpgrades = new();
    private Dictionary<float, Section> dispersionUpgrades = new();
    private Dictionary<float, Section> inertionUpgrades = new();
    private Dictionary<float, Section> recoilUpgrades = new();
    private Dictionary<FireModeUpgradeType, Section> fireModeUpgrades = new();
    private Dictionary<int, Section> bulletSpeedUpgrades = new();
    private Dictionary<int, Section> magSizeUpgrades = new();
    
    string ToUpgradeValue(float value) => (value > 0 ? "+" : "") + value.ToString(Property.FloatFormat);
    string ToUpgradeValue(int value) => (value > 0 ? "+" : "") + value;

}



    // void GenerateUpgrades()
    // {
    //     
    //
    //     for (var rpm = 1; rpm <= 300; rpm += 3)
    //     {
    //         if (rpm == 0)  continue;
    //         rpmUpgrades.Add(rpm, GenerateUpgrade(new { rpm = ToUpgradeValue(rpm) }));
    //     }
    //     
    //     fireModeUpgrades.Add(FireModeUpgradeType.OneThree, GenerateUpgrade(new { fire_modes = "1, 3" }));
    //     fireModeUpgrades.Add(FireModeUpgradeType.OneAuto, GenerateUpgrade(new { fire_modes = "1, -1" }));
    //     fireModeUpgrades.Add(FireModeUpgradeType.OneThreeAuto, GenerateUpgrade(new { fire_modes = "1, 3, -1" }));
    //     fireModeUpgrades.Add(FireModeUpgradeType.ThreeAuto, GenerateUpgrade(new { fire_modes = "3, -1" }));
    //
    //     for (var dispersion = -1f; dispersion <= 0f; dispersion += 0.05f)
    //     {
    //         if (dispersion == 0)  continue;
    //         dispersionUpgrades.Add(dispersion, GenerateUpgrade(new { fire_dispersion_base = ToUpgradeValue(dispersion) }));
    //     }
    //
    //     for (var bulletSpeed = 0; bulletSpeed <= 300; bulletSpeed += 25)
    //     {
    //         if (bulletSpeed == 0)  continue;
    //         
    //         bulletSpeedUpgrades.Add(bulletSpeed, GenerateUpgrade(new
    //         {
    //             bullet_speed = ToUpgradeValue(bulletSpeed),
    //             fire_distance = ToUpgradeValue(bulletSpeed)
    //         }));
    //     }
    //     
    //     for (var inertion = -10f; inertion <= 0f; inertion += 0.5f)
    //     {
    //         if (inertion == 0)  continue;
    //         
    //         inertionUpgrades.Add(inertion, GenerateUpgrade(new
    //         {
    //             crosshair_inertion                       = ToUpgradeValue(inertion),
    //             PDM_disp_base                            = ToUpgradeValue(inertion * 0.1f),
    //             PDM_disp_vel_factor                      = ToUpgradeValue(inertion * 0.5f),
    //             PDM_disp_accel_factor                    = ToUpgradeValue(inertion * 0.5f),
    //             //fire_dispersion_base = ToUpgradeValue(intertion)
    //         }));
    //     }
    //     
    //     for (var recoil = -4f; recoil <= 1f; recoil += 0.1f)
    //     {
    //         if (recoil == 0)  continue;
    //         
    //         recoilUpgrades.Add(recoil, GenerateUpgrade(new
    //         {
    //             cam_dispersion                           = ToUpgradeValue(recoil),
    //             //cam_dispersion_inc                       = 0.0,
    //             cam_step_angle_horz                      = ToUpgradeValue(recoil * 0.75f), 
    //             zoom_cam_dispersion                      = ToUpgradeValue(recoil * 0.9f),
    //             //zoom_cam_dispersion_inc                  = 0.0,
    //             zoom_cam_step_angle_horz                 = ToUpgradeValue(recoil * 0.5f),
    //             //fire_dispersion_base = ToUpgradeValue(recoil)
    //         }));
    //     }
    //     
    //     for (var magSize = 0; magSize <= 100; magSize += 5)
    //     {
    //         if (magSize == 0)  continue;
    //         magSizeUpgrades.Add(magSize, GenerateUpgrade(new { ammo_mag_size = ToUpgradeValue(magSize) }));
    //     }
    // }