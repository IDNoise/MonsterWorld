namespace LtxStorage.MonsterWorld;

public class WeaponsGenerator : BaseGenerator {
    private readonly Dictionary<Section, List<Section>> baseWithVariants = new();
    private readonly File mwUpgradesFile;
    private readonly File mwWeaponsFile;

    private readonly Dictionary<WeaponType, AmmoConfig> ammoConfigs = new() {
        { WeaponType.Pistol, new AmmoConfig("ammo_mw_pistol", "ammo_9x18_ap", "Pistol ammo", 30) },
        { WeaponType.SMG, new AmmoConfig("ammo_mw_smg", "ammo_7.62x25_ps", "SMG ammo", 60) },
        { WeaponType.Shotgun, new AmmoConfig("ammo_mw_shotgun", "ammo_12x70_buck", "Shotgun ammo", 20) },
        { WeaponType.AssaultRifle, new AmmoConfig("ammo_mw_assault_rifle", "ammo_5.56x45_ss190", "Assault Rifle ammo", 60) },
        { WeaponType.MachineGun, new AmmoConfig("ammo_mw_machine_gun", "ammo_7.62x54_7h1", "Machine Gun ammo", 90) },
        { WeaponType.SniperRifle, new AmmoConfig("ammo_mw_sniper_rifle", "ammo_50_bmg", "Sniper Rifle ammo", 15) }
    };

    private readonly List<string> ignoredWeapons = new List<string>() {
        // "wpn_saiga12s",
        // "wpn_saiga12s_ps01",
        // "wpn_saiga12s_1p29",
        // "wpn_saiga12s_kobra",
        // "wpn_vepr_ps01",
        // "wpn_vepr_kobra",
        // "wpn_vepr_1p29",
        // "wpn_vepr",
    };

    private Section baseParamsSection;
    private Section baseWeaponUpgradeBonusSection;
    private Section baseWeaponUpgradeEffectSection;

    private readonly Dictionary<FireModeUpgradeType, Section> fireModeUpgrades = new();

    private int upgradeIndex = 1;

    private readonly Dictionary<WeaponType, int> weaponFireDistanceByType = new() {
        { WeaponType.Shotgun, 25 },
        { WeaponType.Pistol, 50 },
        { WeaponType.SMG, 75 },
        { WeaponType.AssaultRifle, 100 },
        { WeaponType.MachineGun, 100 },
        { WeaponType.SniperRifle, 150 }
    };

    public WeaponsGenerator(string gameDataPath, string outputDir) : base(gameDataPath, outputDir) {
        mwWeaponsFile = Storage.GetOrCreateFile("items/weapons/w_xxx_monster_world");
        mwUpgradesFile = Storage.GetOrCreateFile("items/weapons/w_xxx_monster_world_upgrades");
    }

    protected override void InternalGenerate() {
        PrepareWeaponsData();
        GenerateAmmo();
        GenerateBaseWeaponParams();
        GenerateWeapons();
    }

    private void PrepareWeaponsData() {
        var allBaseWeapons = new Dictionary<string, Section>();
        var allVariantWeapons = new Dictionary<string, Section>();
        foreach (var w in Storage.AllFiles.Where(f => f.Name.StartsWith("w_")).SelectMany(f => f.Sections)
                     .Where(s => s.Name.StartsWith("wpn_") && s.AllParentSectionNames.Contains("default_weapon_params"))) {
            
            if (ignoredWeapons.Contains(w.Name))
                continue;
            
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

        foreach (var (vn, vs) in allVariantWeapons) {
            Section bw = null;
            if (allBaseWeapons.ContainsKey(vn))
                bw = vs;
            else
                bw = vs.AllParentSections.Where(s => s.Name.StartsWith("wpn_")).FirstOrDefault(s => allBaseWeapons.ContainsKey(s.Name));

            if (!baseWithVariants.TryGetValue(bw, out var variants)) {
                variants = new List<Section>();
                baseWithVariants[bw] = variants;
            }

            variants.Add(vs);
        }

        foreach (var (name, section) in allBaseWeapons)
            if (!baseWithVariants.ContainsKey(section))
                baseWithVariants.Add(section, new List<Section>());
    }

    private void GenerateAmmo() {
        foreach (var (wType, ammoConfig) in ammoConfigs) {
            var section = Storage.MakeSection(ammoConfig.SectionName, mwWeaponsFile, new List<string> { ammoConfig.ParentSectionName }, new {
                box_size = ammoConfig.BoxSize * 10,
                inv_weight = 0.000001,
                description = "",
                // inv_name = $"\'{ammoConfig.Name}\'",
                // inv_name_short = $"\'{ammoConfig.Name}\'",
                tier = 1,
                cost = 1,
                impair = 1,
                k_air_resistance = 1,
                k_dist = 1,
                k_bullet_speed = 1,
                k_disp = wType == WeaponType.Shotgun ? 17.5 : 1,
                buck_shot = wType == WeaponType.Shotgun ? 25 : 1
            });
        }
    }

    private void GenerateBaseWeaponParams() {
        // var allUpgrades = rpmUpgrades.Values.Union(dispersionUpgrades.Values).Union(inertionUpgrades.Values)
        //     .Union(recoilUpgrades.Values).Union(fireModeUpgrades.Values).Union(bulletSpeedUpgrades.Values)
        //     .Select(s => s.Name);
        // var allUpgradesString = string.Join(",", allUpgrades);

        baseParamsSection = Storage.MakeSection("mw_bwp", mwWeaponsFile, properties: new {
            //misfire and codition
            misfire_probability = 0,
            misfire_start_condition = 0.0001,
            misfire_start_prob = 0,
            misfire_end_condition = 0.00001,
            misfire_end_prob = 0,

            condition_queue_shot_dec = 0,
            condition_shot_dec = 0,

            //other
            description = "",
            inv_weight = 0.00001f,
            hit_impulse = 50,
            sprint_allowed = true,
            startup_ammo = 500,
            ph_mass = 100000,
            //tri_state_reload         = "off",

            //upgrades
            upgrades = "",
            installed_upgrades = "",
            upgrade_scheme = "upgrade_scheme_ak74"
        });
    }

    private void GenerateWeapons() {
        var weaponsByType = new Dictionary<WeaponType, List<Section>>();
        var index = 1;
        foreach (var (baseWeapon, variants) in baseWithVariants) {
            var type = MonsterWorldHelpers.GetWeaponType(baseWeapon);
            if (type is WeaponType.NotSupported or WeaponType.Shotgun) {
                Console.WriteLine($"Not supported: {baseWeapon["kind"]} for {baseWeapon.Name}");
                continue;
            }
            
            Console.WriteLine($"Generating [{index++} / {baseWithVariants.Count}]: for {baseWeapon.Name}");

            var variantSectionNames = new List<string>();

            string weaponName = null;
            var parentSectionNames = new List<string>();

            var upgradesByType = GenerateUpgradesForWeapon(baseWeapon);

            Console.WriteLine($"Upgrades for {baseWeapon.Name} = {upgradesByType.Values.Sum(l => l.Count)}");

            var baseProperties = new {
                upgrades = string.Join(",", upgradesByType.Values.SelectMany(u => u).Select(s => s.Name)),
                rpm_upgrades = string.Join(",", upgradesByType[UpgradeType.Rpm].Select(s => s.Name)),
                dispersion_upgrades = string.Join(",", upgradesByType[UpgradeType.Dispersion].Select(s => s.Name)),
                recoil_upgrades = string.Join(",", upgradesByType[UpgradeType.Recoil].Select(s => s.Name)),
                fire_mode_upgrades = string.Join(",", upgradesByType[UpgradeType.FireMode].Select(s => s.Name)),
                bullet_speed_upgrades = string.Join(",", upgradesByType[UpgradeType.BulletSpeed].Select(s => s.Name)),
                ammo_class = ammoConfigs[type].SectionName,
                fire_distance = weaponFireDistanceByType[type],
                weapon_type = (int)type
            };

            foreach (var variantWeapon in variants) {
                weaponName = $"{variantWeapon.Name}_mw";
                variantSectionNames.Add(weaponName);
                parentSectionNames = new List<string> { variantWeapon.Name, baseParamsSection.Name };
                Storage.MakeSection(weaponName, mwWeaponsFile, parentSectionNames, baseProperties);
            }

            weaponName = $"{baseWeapon.Name}_mw";
            parentSectionNames = new List<string> { baseWeapon.Name, baseParamsSection.Name };
            var newWeaponSection = Storage.MakeSection(weaponName, mwWeaponsFile, parentSectionNames, new {
                variants = string.Join(",", variantSectionNames.Prepend(weaponName))
            });
            newWeaponSection.SetProperties(baseProperties);

            if (!weaponsByType.TryGetValue(type, out var typeSections)) {
                typeSections = new List<Section>();
                weaponsByType[type] = typeSections;
            }

            typeSections.Add(newWeaponSection);
        }

        foreach (var (type, sections) in weaponsByType) 
            if (sections.Count > 0)
                Storage.MakeSection(type.ToString().ToLower(), mwWeaponsFile, properties: sections.Select(s => s.Name));

        Storage.MakeSection("mw_drops_by_weapon_type", mwWeaponsFile, properties: new {
            sections = string.Join(",", weaponsByType.Where(kv => kv.Value.Count > 0).Select(kv => kv.Key.ToString().ToLower()))
        });
    }

    private Dictionary<UpgradeType, List<Section>> GenerateUpgradesForWeapon(Section weapon) {
        var result = new Dictionary<UpgradeType, List<Section>>();
        result.Add(UpgradeType.Dispersion, new List<Section>());
        result.Add(UpgradeType.Recoil, new List<Section>());
        result.Add(UpgradeType.Rpm, new List<Section>());
        result.Add(UpgradeType.BulletSpeed, new List<Section>());
        result.Add(UpgradeType.FireMode, new List<Section>());

        float GetValuePerStep(float currentValue, int pctPerStep, float minValuePerStep = 0) {
            while (currentValue * pctPerStep / 100f < minValuePerStep) pctPerStep += 1;

            return currentValue * pctPerStep / 100f;
        }

        var steps = 20;
        var basePct = 5;

        {
            var rpm = weapon.GetInt("rpm");
            var valuePerStep = (int)GetValuePerStep(rpm, basePct, rpm <= 100 ? 2 : 1);
            for (var i = 0; i < steps; i++) result[UpgradeType.Rpm].Add(GenerateUpgrade(new { rpm = ToUpgradeValue(valuePerStep) }));
        }

        {
            var bulletSpeed = weapon.GetInt("bullet_speed");
            var fireDistance = weaponFireDistanceByType[MonsterWorldHelpers.GetWeaponType(weapon)];
            var valuePerStepBulletSpeed = (int)GetValuePerStep(bulletSpeed, basePct, 1);
            var valuePerStepFireDistance = (int)GetValuePerStep(fireDistance, basePct, 1);
            for (var i = 0; i < steps; i++)
                result[UpgradeType.BulletSpeed].Add(GenerateUpgrade(new {
                    bullet_speed = ToUpgradeValue(valuePerStepBulletSpeed),
                    fire_distance = ToUpgradeValue(valuePerStepFireDistance)
                }));
        }

        { // Recoil
            var crosshair_inertion = weapon.GetFloat("crosshair_inertion");
            var cam_max_angle = weapon.GetFloat("cam_max_angle");
            var cam_max_angle_horz = weapon.GetFloat("cam_max_angle_horz");
            var cam_step_angle_horz = weapon.GetFloat("cam_step_angle_horz");
            var zoom_cam_max_angle = weapon.GetFloat("zoom_cam_max_angle");
            var zoom_cam_max_angle_horz = weapon.GetFloat("zoom_cam_max_angle_horz");
            var zoom_cam_step_angle_horz = weapon.GetFloat("zoom_cam_step_angle_horz");
            if (cam_max_angle > 1f) {
                var valuePerStep_cam_max_angle = -GetValuePerStep(cam_max_angle, basePct);
                var valuePerStep_cam_max_angle_horz = -GetValuePerStep(cam_max_angle_horz, basePct);
                var valuePerStep_cam_step_angle_horz = -GetValuePerStep(cam_step_angle_horz, basePct);
                var valuePerStep_zoom_cam_max_angle = -GetValuePerStep(zoom_cam_max_angle, basePct);
                var valuePerStep_zoom_cam_max_angle_horz = -GetValuePerStep(zoom_cam_max_angle_horz, basePct);
                var valuePerStep_zoom_cam_step_angle_horz = -GetValuePerStep(zoom_cam_step_angle_horz, basePct);
                var valuePerStep_crosshair_intertion = -GetValuePerStep(crosshair_inertion, basePct);

                for (var i = 0; i < steps; i++)
                    result[UpgradeType.Recoil].Add(GenerateUpgrade(new {
                        cam_max_angle = ToUpgradeValue(valuePerStep_cam_max_angle),
                        cam_max_angle_horz = ToUpgradeValue(valuePerStep_cam_max_angle_horz),
                        cam_step_angle_horz = ToUpgradeValue(valuePerStep_cam_step_angle_horz),
                        zoom_cam_max_angle = ToUpgradeValue(valuePerStep_zoom_cam_max_angle),
                        zoom_cam_max_angle_horz = ToUpgradeValue(valuePerStep_zoom_cam_max_angle_horz),
                        zoom_cam_step_angle_horz = ToUpgradeValue(valuePerStep_zoom_cam_step_angle_horz),
                        crosshair_intertion = ToUpgradeValue(valuePerStep_crosshair_intertion)
                    }));
            }
        }

        { // Accuracy
            var fireDispersionBase = weapon.GetFloat("fire_dispersion_base");
            var cam_relax_speed = weapon.GetFloat("cam_relax_speed");
            var zoom_cam_relax_speed = weapon.GetFloat("zoom_cam_relax_speed");
            var cam_dispersion = weapon.GetFloat("cam_dispersion");
            var cam_dispersion_frac = weapon.GetFloat("cam_dispersion_frac");
            var cam_dispersion_inc = weapon.GetFloat("cam_dispersion_inc");
            var zoom_cam_dispersion = weapon.GetFloat("zoom_cam_dispersion");
            var zoom_cam_dispersion_frac = weapon.GetFloat("zoom_cam_dispersion_frac");
            var zoom_cam_dispersion_inc = weapon.GetFloat("zoom_cam_dispersion_inc");
            var PDM_disp_accel_factor = weapon.GetFloat("PDM_disp_accel_factor");
            var PDM_disp_base = weapon.GetFloat("PDM_disp_base");
            var PDM_disp_crouch = weapon.GetFloat("PDM_disp_crouch");
            var PDM_disp_crouch_no_acc = weapon.GetFloat("PDM_disp_crouch_no_acc");
            var PDM_disp_vel_factor = weapon.GetFloat("PDM_disp_vel_factor");

            if (fireDispersionBase > 0.025) {
                var valuePerStep_fire_dispersion_base = -GetValuePerStep(fireDispersionBase, basePct);
                var valuePerStep_cam_relax_speed = GetValuePerStep(cam_relax_speed, basePct);
                var valuePerStep_zoom_cam_relax_speed = GetValuePerStep(zoom_cam_relax_speed, basePct);
                var valuePerStep_cam_dispersion = -GetValuePerStep(cam_dispersion, basePct);
                var valuePerStep_cam_dispersion_frac = -GetValuePerStep(cam_dispersion_frac, basePct);
                var valuePerStep_cam_dispersion_inc = -GetValuePerStep(cam_dispersion_inc, basePct);
                var valuePerStep_zoom_cam_dispersion = -GetValuePerStep(zoom_cam_dispersion, basePct);
                var valuePerStep_zoom_cam_dispersion_frac = -GetValuePerStep(zoom_cam_dispersion_frac, basePct);
                var valuePerStep_zoom_cam_dispersion_inc = -GetValuePerStep(zoom_cam_dispersion_inc, basePct);
                var valuePerStep_PDM_disp_accel_factor = -GetValuePerStep(PDM_disp_accel_factor, basePct);
                var valuePerStep_PDM_disp_base = -GetValuePerStep(PDM_disp_base, basePct);
                var valuePerStep_PDM_disp_crouch = -GetValuePerStep(PDM_disp_crouch, basePct);
                var valuePerStep_PDM_disp_crouch_no_acc = -GetValuePerStep(PDM_disp_crouch_no_acc, basePct);
                var valuePerStep_PDM_disp_vel_factor = -GetValuePerStep(PDM_disp_vel_factor, basePct);

                for (var i = 0; i < steps; i++)
                    result[UpgradeType.Dispersion].Add(GenerateUpgrade(new {
                        fire_dispersion_base = ToUpgradeValue(valuePerStep_fire_dispersion_base),
                        cam_relax_speed = ToUpgradeValue(valuePerStep_cam_relax_speed),
                        zoom_cam_relax_speed = ToUpgradeValue(valuePerStep_zoom_cam_relax_speed),
                        cam_dispersion = ToUpgradeValue(valuePerStep_cam_dispersion),
                        cam_dispersion_frac = ToUpgradeValue(valuePerStep_cam_dispersion_frac),
                        cam_dispersion_inc = ToUpgradeValue(valuePerStep_cam_dispersion_inc),
                        zoom_cam_dispersion = ToUpgradeValue(valuePerStep_zoom_cam_dispersion),
                        zoom_cam_dispersion_frac = ToUpgradeValue(valuePerStep_zoom_cam_dispersion_frac),
                        zoom_cam_dispersion_inc = ToUpgradeValue(valuePerStep_zoom_cam_dispersion_inc),
                        PDM_disp_accel_factor = ToUpgradeValue(valuePerStep_PDM_disp_accel_factor),
                        PDM_disp_base = ToUpgradeValue(valuePerStep_PDM_disp_base),
                        PDM_disp_crouch = ToUpgradeValue(valuePerStep_PDM_disp_crouch),
                        PDM_disp_crouch_no_acc = ToUpgradeValue(valuePerStep_PDM_disp_crouch_no_acc),
                        PDM_disp_vel_factor = ToUpgradeValue(valuePerStep_PDM_disp_vel_factor)
                    }));
            }
        }

        if (weapon.GetInt("rpm") >= 100 && weapon.GetInt("ammo_mag_size") >= 10) {
            if (fireModeUpgrades.Count == 0) {
                fireModeUpgrades.Add(FireModeUpgradeType.OneAuto, GenerateUpgrade(new { fire_modes = "1, -1" }));
                fireModeUpgrades.Add(FireModeUpgradeType.OneThreeAuto, GenerateUpgrade(new { fire_modes = "1, 3, -1" }));
                fireModeUpgrades.Add(FireModeUpgradeType.ThreeAuto, GenerateUpgrade(new { fire_modes = "3, -1" }));
            }

            var fireModesString = weapon.GetString("fire_modes");
            if (fireModesString == null)
                result[UpgradeType.FireMode].Add(fireModeUpgrades[FireModeUpgradeType.OneThreeAuto]);
            else {
                var fireModes = fireModesString.Replace(" ", "").Split(",", StringSplitOptions.RemoveEmptyEntries);
                if (fireModes.Length < 3 && !fireModes.Contains("-1")) {
                    if (fireModes.Contains("3"))
                        result[UpgradeType.FireMode].Add(fireModeUpgrades[FireModeUpgradeType.ThreeAuto]);
                    else
                        result[UpgradeType.FireMode].Add(fireModeUpgrades[FireModeUpgradeType.OneAuto]);
                }
            }
        }

        return result;
    }

    private void GenerateUpgradeBase() {
        baseWeaponUpgradeEffectSection = Storage.MakeSection("mwwue", mwUpgradesFile, properties: new {
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
            icon = ""
        });

        baseWeaponUpgradeBonusSection = Storage.MakeSection("mw_wubb", mwUpgradesFile, properties: new {
            cost = 1,
            value = "+1"
        });
    }

    private Section GenerateUpgrade(object properties) {
        if (baseWeaponUpgradeEffectSection == null)
            GenerateUpgradeBase();

        var name = $"mwu{upgradeIndex}";

        var bonusSection = Storage.MakeSection($"mwb{upgradeIndex}", mwUpgradesFile, new List<string> { baseWeaponUpgradeBonusSection.Name }, properties);
        var elementSection = Storage.MakeSection($"mwe{upgradeIndex}", mwUpgradesFile, new List<string> { baseWeaponUpgradeEffectSection.Name }, new {
            section = bonusSection.Name
        });

        upgradeIndex++;

        return Storage.MakeSection(name, mwUpgradesFile, properties: new { elements = elementSection.Name });
    }

    private string ToUpgradeValue(float value) {
        return (value > 0 ? "+" : "") + value.ToString(Property.FloatFormat);
    }

    private string ToUpgradeValue(int value) {
        return (value > 0 ? "+" : "") + value;
    }

    public readonly record struct AmmoConfig(string SectionName, string ParentSectionName, string Name, int BoxSize);

    private enum FireModeUpgradeType {
        //OneThree,
        OneAuto,
        OneThreeAuto,
        ThreeAuto
    }

    private enum UpgradeType {
        Rpm,
        Dispersion,
        Recoil,
        FireMode,
        BulletSpeed
    }
}