namespace LtxStorage.MonsterWorld;

public class EnemyGenerator : BaseGenerator
{
    private readonly File mwSquadDescriptions;
    
    public EnemyGenerator(string gameDataPath, string outputDir) : base(gameDataPath, outputDir)
    {
        mwSquadDescriptions = Storage.GetOrCreateFile("misc/squad_descr/squad_descr_monster_world");
    }

    protected override void InternalGenerate()
    {
        GenerateSquadDescriptions();
    }

    void GenerateSquadDescriptions()
    {
        Storage.MakeSection("simulation_monster_world", mwSquadDescriptions, new List<string>() { "online_offline_group" }, properties: new
        {
            faction = "monster",
            npc_random = "dog_normal_red",
            npc_in_squad = 1,
            common = true,
        });
    }
}