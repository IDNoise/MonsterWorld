using System.Globalization;
using System.Text;

namespace LtxStorage;

public class Storage
{
    public string GameDataDirectoryPath { get; }
    public Directory RootDirectory { get; private set; }

    public Storage(string gameDataDirPath)
    {
        CultureInfo.CurrentCulture = CultureInfo.InvariantCulture;
        
        GameDataDirectoryPath = gameDataDirPath;
        ParseFileSystem();
    }
    
    public Directory MakeDirectory(string name, Directory? parent)
    {
        var dir = new Directory()
        {
            Name = name,
            ParentDirectory = parent,
        };
        if (parent != null)
            parent.SubDirectoriesByName.Add(dir.Name, dir);

        return dir;
    }
    
    public File MakeFile(string name, Directory directory)
    {
        var file = new File()
        {
            Name = name,
            Directory = directory,
        };
        ParseFile(file);
        
        directory.AddFile(file);
        return file;
    }
    
    public Section MakeSection(string name, File file, List<string>? parentSectionNames = null, object? properties = null, bool isNew = true)
    {
        var section = new Section()
        {
            Name = name,
            File = file
        };

        if (parentSectionNames != null)
            section.ParentSectionNames = parentSectionNames;

        section.SetProperties(properties, isNew);
        file.AddSection(section, isNew);
        return section;
    }

    public IEnumerable<File> AllFiles => RootDirectory.AllFiles;
    public IEnumerable<File> AllChangedFiles => RootDirectory.AllFiles.Where(f => f.IsDirty);
    public IEnumerable<Section> AllSections => RootDirectory.AllFiles.SelectMany(f => f.Sections);

    public File GetFile(string name) => AllFiles.Single(f => f.Name == name);
    public Section GetSection(string name) => AllSections.Single(s => s.Name == name);
    
    public File GetOrCreateFile(string path)
    {
        var dirPath = Path.GetDirectoryName(path);
        var fileName = Path.GetFileNameWithoutExtension(path);
        var dirNames = dirPath.Split("/");
        var currentDir = RootDirectory;
        if (dirNames.Length > 0)
        {
            foreach (var dirName in dirNames)
            {
                if (currentDir.SubDirectoriesByName.ContainsKey(dirName))
                {
                    currentDir = currentDir.SubDirectoriesByName[dirName];
                }
                else
                {
                    currentDir = MakeDirectory(dirName, currentDir);
                }
            }
        }

        if (currentDir.FilesByName.ContainsKey(fileName))
        {
            return currentDir.FilesByName[fileName];
        }

        return MakeFile(fileName, currentDir);
    }

    public void SaveChanges(string outputDir)
    {
        foreach (var file in AllChangedFiles)
        {
            var dirName = outputDir + "/" + file.Directory.Path;
            System.IO.Directory.CreateDirectory(dirName);
            System.IO.File.WriteAllText(outputDir + "/" + file.PathWithExt, file.ToString());
        }
    }
    
    private void ParseFileSystem()
    {
        RootDirectory = MakeDirectory("configs", null);
        var dirsQueue = new Queue<Directory>();
        dirsQueue.Enqueue(RootDirectory);

        while (dirsQueue.Count > 0)
        {
            var dir = dirsQueue.Dequeue();
            var path = GameDataDirectoryPath + "/" + dir.Path;
            foreach (var subDirPath in System.IO.Directory.EnumerateDirectories(path, "*", SearchOption.TopDirectoryOnly))
            {
                var subDir = MakeDirectory(Path.GetFileName(subDirPath), dir);
                dirsQueue.Enqueue(subDir);
            }
            
            foreach (var filePath in System.IO.Directory.EnumerateFiles(path, "*.ltx", SearchOption.TopDirectoryOnly))
            {
                MakeFile(Path.GetFileNameWithoutExtension(filePath), dir);
            }
        }
    }
    
    private void ParseFile(File file)
    {
        var lines = System.IO.File.ReadAllLines(GameDataDirectoryPath + "/" + file.PathWithExt)
            .Select(s =>
            {
                var commentStart = s.IndexOf(';');
                return commentStart >= 0 ? s.Substring(0, commentStart) : s;
            })
            .Select(s => s.Trim())
            .Where(s => !string.IsNullOrEmpty(s))
            .Reverse();

        var linesRead = new List<string>();
        
        foreach (var line in lines)
        {
            if (line.StartsWith("#"))
            {
                file.AddInclude(line.Replace("#include", "").Replace("\"", "").Replace(".ltx", "").Trim(), isNew: false);
            }
            else if (line.StartsWith("["))
            {
                linesRead.Add(line);
                linesRead.Reverse();
                ParseSection(linesRead, file);
                linesRead.Clear();
            }
            else
            {
                linesRead.Add(line);
            }
        }
        
        file.Includes.Reverse();
        file.Sections.Reverse();
    }

    private void ParseSection(List<string> sectionLines, File parent)
    {
        var headerLine = sectionLines[0].Substring(1);
        sectionLines.RemoveAt(0);
        var properties = sectionLines;

        var headerLineParts = headerLine.Split("]", StringSplitOptions.TrimEntries);
        var name = headerLineParts[0];
        var parentSectionNames = headerLineParts.Length > 1 ? headerLineParts[1].Replace(":", "").Split(",").ToList() : null;
        MakeSection(name, parent, parentSectionNames: parentSectionNames, properties: properties, isNew: false);
    }
}

public class Directory
{
    public Directory? ParentDirectory { get; set; }
    public string Name { get; set; }
    public string Path => ParentDirectory != null ? ParentDirectory.Path + "/" + Name : Name;
    
    public Dictionary<string, Directory> SubDirectoriesByName = new();
    public Dictionary<string, File> FilesByName = new();
    
    public IEnumerable<Directory> SubDirectories => SubDirectoriesByName.Values;
    public IEnumerable<File> Files => FilesByName.Values;
    public IEnumerable<File> AllFiles => Files.Union(SubDirectories.SelectMany(d => d.AllFiles));

    public void AddFile(File file)
    {
        FilesByName[file.Name] = file;
    }
}

public class File
{
    public Directory Directory { get; set; }
    public string Name { get; set; }
    public string Path => Directory.Path + "/" + Name;
    public string PathWithExt => Path + ".ltx";
    
    public List<string> Includes { get; } = new();
    public Dictionary<string, Section> SectionsByName { get; } = new();
    public List<Section> Sections { get; } = new();
    public bool IsDirty => isDirty || Sections.Any(s => s.IsDirty);

    public Section this[string sectionName] => SectionsByName[sectionName];

    public File AddSection(Section section, bool isNew = true)
    {
        Sections.Add(section);
        SectionsByName[section.Name] = section;
        section.File = this;
        if (isNew) MarkDirty();
        return this;
    }

    public File RemoveSection(string sectionName)
    {
        if (SectionsByName.TryGetValue(sectionName, out var section))
            RemoveSection(section);
        return this;
    }

    private void RemoveSection(Section section)
    {
        Sections.Remove(section);
        SectionsByName.Remove(section.Name);
        MarkDirty();
    }

    public File RemoveSections(Func<Section, bool>? predicate = null)
    {
        foreach (var section in Sections.Where(s => predicate == null || predicate(s)).ToList())
            RemoveSection(section);
        return this;
    }

    public File AddInclude(string include, bool isNew = true)
    {
        Includes.Add(include);
        if (isNew) MarkDirty();
        return this;
    }

    private bool isDirty = false;
    void MarkDirty() => isDirty = true;

    public override string ToString()
    {
        var sb = new StringBuilder();
        foreach (var include in Includes)
            sb.AppendLine($"#include \"{include}.ltx\"");

        foreach (var section in Sections)
            sb.AppendLine(section.ToString());

        return sb.ToString();
    }
}

public class Section
{
    public File File { get; set; }
    public string Name { get; set; }
    public string Path => File.Path + "/" + Name;
    
    public List<string> ParentSectionNames { get; set; } = new();
    public List<Property> Properties { get; set; } = new();
    public bool IsDirty { get; private set; }
    
    public Property this[string key] => Properties.Where(p => p.Key == key).Single();

    public Section SetProperties(object? properties, bool isNew = true)
    {
        if (properties == null)
        {
            Properties.Clear();
        }
        else
        {
            var newProperties = new List<Property>();
            if (properties is IEnumerable<string> stringCollection)
            {
                newProperties.AddRange(stringCollection.Select(s => new Property(s)));
            }
            else if (properties is Dictionary<string, object> dict)
            {
                newProperties.AddRange(dict.Select(kv => new Property(kv.Key, kv.Value)));
            }
            else
            {
                var type = properties.GetType();
                newProperties.AddRange(type.GetProperties()
                    .Select(p => new Property(p.Name, type.GetProperty(p.Name).GetValue(properties, null))));
            }

            foreach (var newProperty in newProperties)
            {
                var exists = false;
                foreach (var p in Properties)
                {
                    if (p.Key == newProperty.Key)
                    {
                        exists = true;
                        p.Value = newProperty.Value;
                    }
                }

                if (!exists)
                {
                    Properties.Add(newProperty);
                }
            }
        }

        if (isNew) MakeDirty();
        
        return this;
    }

    private void MakeDirty() => IsDirty = true;

    public override string ToString()
    {
        var sb = new StringBuilder();
        var parents = ParentSectionNames.Count > 0 ? $" : {string.Join(", ", ParentSectionNames)}" : "";
        sb.AppendLine($"[{Name}]{parents}");

        foreach (var p in Properties)
            sb.AppendLine(p.ToString());

        sb.AppendLine();

        return sb.ToString();
    }
}

public class Property
{
    public string Key { get; }

    public string String
    {
        get => stringValue;
        set => stringValue = value;
    }

    public float Float
    {
        get => float.Parse(stringValue);
        set => stringValue = value.ToString("0.######");
    }
    
    public int Int
    {
        get => int.Parse(stringValue);
        set => stringValue = value.ToString();
    }
    
    public bool Bool
    {
        get => stringValue == "true";
        set => stringValue = value ? "true" : "false";
    }

    private object? value;
    public object? Value
    {
        get => value;
        set
        {
            if (value is float f)
                Float = f;
            else if (value is double d)
                Float = (float)d;
            else if (value is int i)
                Int = i; 
            else if (value is bool b)
                Bool = b;
            else if (value is string s)
                String = s;
            else
                stringValue = null;
        }
    }
        
    private string? stringValue;

    public Property(string key, object? value = null)
    {
        if (key.Contains("="))
        {
            var parts = key.Split("=");
            Key = parts[0].Trim();
            Value = parts[1].Trim();
        }
        else
        {
            Key = key;
            Value = value;
        }
    }

    public override string ToString()
    {
        if (stringValue == null)
        {
            return Key;
        }

        return $"{Key,-20} = {stringValue}";
    }
}