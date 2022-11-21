namespace LtxStorage;

public enum WeaponType
{
    Pistol = 0,
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