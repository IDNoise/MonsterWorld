var storage = new LtxStorage.Storage("../../../../StalkerScriptReference/AnomalyGameData");
foreach (var s in storage.GetFile("weapon_ammo").Sections)
{
    Console.WriteLine(s.Path);
}


