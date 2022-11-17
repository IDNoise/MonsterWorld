var storage = new LtxStorage.Storage("../../../../StalkerScriptReference/AnomalyGameData");
foreach (var s in storage.GetFile("weapon_ammo").Sections)
{
    //Console.WriteLine(s.Path);
}

storage.GetFile("weapon_ammo").Sections.First().SetProperties(new
{
    fuck_me = 3,
    idions = false,
    canttouchthisf = 1.232323f,
    canttouchthisd = 1.232323,
    jackonda = "jackonda"
});
storage.SaveChanges("./TestOutput");