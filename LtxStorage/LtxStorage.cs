namespace LtxStorage;

public class Storage
{
    public string GameDataDirectoryPath { get; }
    public Directory RootDirectory { get; private set; }

    public Storage(string gameDataDirPath)
    {
        GameDataDirectoryPath = gameDataDirPath;
        ParseFileSystem();
    }
    
    public Directory MakeDirectory(string name, Directory? parent)
    {
        var dir = new Directory()
        {
            Name = name,
            Parent = parent,
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
            Parent = directory,
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
            Parent = file
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
    public Directory? Parent { get; set; }
    public string Name { get; set; }
    
    public Dictionary<string, Directory> SubDirectoriesByName = new();
    public Dictionary<string, File> FilesByName = new();
    
    public IEnumerable<Directory> SubDirectories => SubDirectoriesByName.Values;
    public IEnumerable<File> Files => FilesByName.Values;

    public string Path => Parent != null ? Parent.Path + "/" + Name : Name;

    public IEnumerable<File> AllFiles => Files.Union(SubDirectories.SelectMany(d => d.AllFiles));

    public void AddFile(File file)
    {
        FilesByName[file.Name] = file;
    }
}

public class File
{
    public Directory Parent { get; set; }
    public string Name { get; set; }
    public List<string> Includes = new();
    public Dictionary<string, Section> SectionsByName { get; private set; } = new();
    public IEnumerable<Section> Sections => SectionsByName.Values;
    public bool IsDirty => isDirty || Sections.Any(s => s.IsDirty);

    public string Path => Parent.Path + "/" + Name;
    public string PathWithExt => Path + ".ltx";

    public Section this[string sectionName] => SectionsByName[sectionName];

    public File AddSection(Section section, bool isNew = true)
    {
        SectionsByName[section.Name] = section;
        section.Parent = this;
        if (isNew) MarkDirty();
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
}

public class Section
{
    public File Parent { get; set; }
    public string Name { get; set; }
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
    
    public string Path => Parent.Path + "/" + Name;

    private void MakeDirty() => IsDirty = true;
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
        get => stringValue == "true" ? true : false;
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
        Key = key;
        Value = value;
    }

    public override string ToString()
    {
        if (stringValue == null)
        {
            return Key;
        }

        return $"{Key}={stringValue}";
    }
}