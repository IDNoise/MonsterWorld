var storage = new LtxStorage.Storage("../../../../StalkerScriptReference/AnomalyGameData");
foreach (var s in storage.GetFile("weapon_ammo").Sections)
{
    //Console.WriteLine(s.Path);
}

// storage.GetFile("weapon_ammo").Sections.First().SetProperties(new
// {
//     fuck_me = 3,
//     idions = false,
//     canttouchthisf = 1.232323f,
//     canttouchthisd = 1.232323,
//     jackonda = "jackonda"
// });
// storage.SaveChanges("./TestOutput");

var section = storage.GetFile("weapon_ammo")["ammo_knife"];
var parts = section.GetProperty("disassemble_parts");
Console.WriteLine(parts?.String ?? "Not found");

var explosive = section.GetProperty("explosive", true);
Console.WriteLine(explosive?.String ?? "Not found");

Console.WriteLine(storage.GetSection("wpn_sig550_luckygun_eot").GetProperty("kind")?.String ?? "Not found");
Console.WriteLine(string.Join(", ", storage.GetSection("wpn_sig550_luckygun_eot").AllParentSectionNames));
