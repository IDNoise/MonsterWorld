var storage = new LtxStorage.Storage("../../../../StalkerScriptReference/AnomalyGameData");

Console.WriteLine("Mutants: ");
int index = 1;
foreach (var s in storage.AllFiles
             .Where(f => f.Name.StartsWith("m_"))
             .SelectMany(f => f.Sections)
             .Where(s => !s.Name.StartsWith("m_phantom") && s.HasParent("monster_base")))
{
    Console.WriteLine($"  [{index++}] {s.Name}");
}

Console.WriteLine();
Console.WriteLine();
Console.WriteLine("Base weapons: ");
index = 1;
foreach (var w in storage.AllFiles.Where(f => f.Name.StartsWith("w_")).SelectMany(f => f.Sections)
             .Where(s => s.Name.StartsWith("wpn_") && (s.HasParent("default_weapon_params", false) 
                                                       || (s.HasProperty("kind", false) && s.HasProperty("weapon_class", false)))))
{
    Console.WriteLine($"  [{index++}] {w.Name}: {w.GetString("kind")} ({w.GetInt("ammo_mag_size", -1)})" );
}


//foreach (var s in storage.GetFile("weapon_ammo").Sections)
    //Console.WriteLine(s.Path);

// storage.GetFile("weapon_ammo").Sections.First().SetProperties(new
// {
//     fuck_me = 3,
//     idions = false,
//     canttouchthisf = 1.232323f,
//     canttouchthisd = 1.232323,
//     jackonda = "jackonda"
// });
// storage.SaveChanges("./TestOutput");

// var section = storage.GetFile("weapon_ammo")["ammo_knife"];
// var parts = section.GetProperty("disassemble_parts");
// Console.WriteLine(parts?.String ?? "Not found");
//
// var explosive = section.GetProperty("explosive", true);
// Console.WriteLine(explosive?.String ?? "Not found");
//
// Console.WriteLine(storage.GetSection("wpn_sig550_luckygun_eot").GetProperty("kind")?.String ?? "Not found");
// Console.WriteLine(string.Join(", ", storage.GetSection("wpn_sig550_luckygun_eot").AllParentSectionNames));


