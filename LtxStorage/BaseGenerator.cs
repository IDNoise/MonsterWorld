namespace LtxStorage;

public abstract class BaseGenerator
{
    protected Storage Storage;
    private string outputDir;
    
    public BaseGenerator(string gameDataPath, string outputDir)
    {
        Storage = new Storage(gameDataPath);
        this.outputDir = outputDir;
    }
    
    public void Generate()
    {
        InternalGenerate();
        Storage.SaveChanges(outputDir);
    }

    protected abstract void InternalGenerate();
}