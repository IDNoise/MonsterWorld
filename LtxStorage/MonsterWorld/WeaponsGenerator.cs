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
        GenerateAmmo();
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
            if (w.GetProperty("tri_state_reload")?.String == "on") 
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

    public readonly record struct AmmoConfig(string SectionName, string ParentSectionName, string Name, int BoxSize);
    
    Dictionary<WeaponType, AmmoConfig> ammoConfigs = new Dictionary<WeaponType, AmmoConfig>()
    {
        { WeaponType.Pistol, new AmmoConfig("ammo_mw_pistol", "ammo_9x18_ap", "Pistol ammo", 30)  },
        { WeaponType.SMG, new AmmoConfig("ammo_mw_smg", "ammo_7.62x25_ps", "SMG ammo", 60) },
        { WeaponType.Shotgun, new AmmoConfig("ammo_mw_shotgun", "ammo_12x70_buck", "Shotgun ammo", 20) },
        { WeaponType.AssaultRifle, new AmmoConfig("ammo_mw_assault_rifle", "ammo_5.56x45_ss190", "Assault Rifle ammo", 60) },
        { WeaponType.MachineGun, new AmmoConfig("ammo_mw_machine_gun", "ammo_7.62x54_7h1", "Machine Gun ammo", 90) },
        { WeaponType.SniperRifle, new AmmoConfig("ammo_mw_sniper_rifle", "ammo_50_bmg", "Sniper Rifle ammo", 15) },
    };
    
    void GenerateAmmo()
    {
        foreach (var (wType, ammoConfig) in ammoConfigs)
        {
            var section = Storage.MakeSection(ammoConfig.SectionName, mwWeaponsFile, new List<string>() { ammoConfig.ParentSectionName }, properties: new
            {
                box_size = ammoConfig.BoxSize * 10,
                inv_weight = 0.000001,
                description = "",
                // inv_name = $"\'{ammoConfig.Name}\'",
                // inv_name_short = $"\'{ammoConfig.Name}\'",
                tier = 1,
                cost = 1,
            });
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
            inv_weight               = 0.00001f,
            hit_impulse              = 50,
            sprint_allowed           = true,
            startup_ammo             = 500,
            ph_mass                  = 100000,
            //tri_state_reload         = "off",
            
            //upgrades
            upgrades                 = "",
            installed_upgrades       = "",
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
            
            var baseProperties = new
            {
                upgrades = string.Join(",", upgradesByType.Values.SelectMany(u => u).Select(s => s.Name)),
                rpm_upgrades = string.Join(",", upgradesByType[UpgradeType.Rpm].Select(s => s.Name)),
                dispersion_upgrades = string.Join(",", upgradesByType[UpgradeType.Dispersion].Select(s => s.Name)),
                inertion_upgrades = string.Join(",", upgradesByType[UpgradeType.Inertion].Select(s => s.Name)),
                recoil_upgrades = string.Join(",", upgradesByType[UpgradeType.Recoil].Select(s => s.Name)),
                fire_mode_upgrades = string.Join(",", upgradesByType[UpgradeType.FireMode].Select(s => s.Name)),
                bullet_speed_upgrades = string.Join(",", upgradesByType[UpgradeType.BulletSpeed].Select(s => s.Name)),
                mag_size_upgrades = string.Join(",", upgradesByType[UpgradeType.MagSize].Select(s => s.Name)),
                rpm = (int)Math.Min(900, baseWeapon.GetInt("rpm")),
                ammo_class = ammoConfigs[type].SectionName
            };

            foreach (var variantWeapon in variants)
            {
                weaponName = $"{variantWeapon.Name}_mw";
                variantSectionNames.Add(weaponName);
                parentSectionNames = new List<string>() { variantWeapon.Name, baseParamsSection.Name };
                Storage.MakeSection(weaponName, mwWeaponsFile, parentSectionNames, baseProperties);
            }
            
            weaponName = $"{baseWeapon.Name}_mw";
            parentSectionNames = new List<string>() { baseWeapon.Name, baseParamsSection.Name };
            var newWeaponSection = Storage.MakeSection(weaponName, mwWeaponsFile, parentSectionNames, new
            {
                variants = string.Join(",", variantSectionNames.Prepend(weaponName))
            });
            newWeaponSection.SetProperties(baseProperties);
            
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
        
        float GetValuePerStep(float currentValue, int pctPerStep, float minValuePerStep = 0) 
        {
            while (currentValue * pctPerStep / 100f < minValuePerStep) {
                pctPerStep += 1;
            }

            return currentValue * pctPerStep / 100f;
        }
        
        int steps = 20;
        
        {
            var rpm = weapon.GetInt("rpm");
            int valuePerStep = (int)GetValuePerStep(rpm, 5, rpm <= 100 ? 2 : 1);
            for (int i = 0; i < steps; i++) {
                result[UpgradeType.Rpm].Add(GenerateUpgrade(new { rpm = ToUpgradeValue(valuePerStep) }));
            }
        }
        
        {
            var magSize = weapon.GetInt("ammo_mag_size");
            int valuePerStep = (int)GetValuePerStep(magSize, 10, 1);
            for (int i = 0; i < steps; i++) {
                result[UpgradeType.MagSize].Add(GenerateUpgrade(new { ammo_mag_size = ToUpgradeValue(valuePerStep) }));
            }
        }
        
        
        {
            var bulletSpeed = weapon.GetInt("bullet_speed");
            int valuePerStep = (int)GetValuePerStep(bulletSpeed, 5, 1);
            for (int i = 0; i < steps; i++) {
                result[UpgradeType.BulletSpeed].Add(GenerateUpgrade(new {
                    bullet_speed = ToUpgradeValue(valuePerStep),
                    fire_distance = ToUpgradeValue(valuePerStep)
                }));
            }
        }
        {
            var camDispersion = weapon.GetFloat("cam_dispersion"); // Recoil
            if (camDispersion > 0.2f) {
                float valuePerStep = -GetValuePerStep(camDispersion, 5);
                for (int i = 0; i < steps; i++) {
                    result[UpgradeType.Recoil].Add(GenerateUpgrade(new {
                        cam_dispersion = ToUpgradeValue(valuePerStep),
                        cam_step_angle_horz = ToUpgradeValue(valuePerStep * 0.75f),
                        zoom_cam_dispersion = ToUpgradeValue(valuePerStep * 0.9f),
                        zoom_cam_step_angle_horz = ToUpgradeValue(valuePerStep * 0.5f),
                    }));
                }
            }
        }

        {
            var crosshairInertion = weapon.GetFloat("crosshair_inertion"); // Inertion
            if (crosshairInertion > 0.1)
            {
                float valuePerStep = -GetValuePerStep(crosshairInertion, 5);
                for (int i = 0; i < steps; i++)
                {
                    result[UpgradeType.Inertion].Add(GenerateUpgrade(new
                    {
                        crosshair_inertion = ToUpgradeValue(valuePerStep),
                        PDM_disp_base = ToUpgradeValue(valuePerStep * 0.1f),
                        PDM_disp_vel_factor = ToUpgradeValue(valuePerStep * 0.5f),
                        PDM_disp_accel_factor = ToUpgradeValue(valuePerStep * 0.5f),
                    }));
                }
            }
        }

        {
            var fireDispersionBase = weapon.GetFloat("fire_dispersion_base"); // Dispersion
            if (fireDispersionBase > 0.1) {
                float valuePerStep = -GetValuePerStep(fireDispersionBase, 5);
                for (int i = 0; i < steps; i++) {
                    result[UpgradeType.Dispersion].Add(GenerateUpgrade(new {
                        fire_dispersion_base = ToUpgradeValue(valuePerStep)
                    }));
                }
            }
        }

        if (weapon.GetInt("rpm") >= 100 && weapon.GetInt("ammo_mag_size") >= 10) {
            if (fireModeUpgrades.Count == 0) {
                fireModeUpgrades.Add(FireModeUpgradeType.OneAuto, GenerateUpgrade(new { fire_modes = "1, -1" }));
                fireModeUpgrades.Add(FireModeUpgradeType.OneThreeAuto, GenerateUpgrade(new { fire_modes = "1, 3, -1" }));
                fireModeUpgrades.Add(FireModeUpgradeType.ThreeAuto, GenerateUpgrade(new { fire_modes = "3, -1" }));
            }
            
            var fireModesString = weapon.GetString("fire_modes");
            if (fireModesString == null) {
                result[UpgradeType.FireMode].Add(fireModeUpgrades[FireModeUpgradeType.OneThreeAuto]);
            }
            else {
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

    private Dictionary<FireModeUpgradeType, Section> fireModeUpgrades = new();

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