/** @customConstructor ini_file_ex */
declare class ini_file_ex {
    fname: string;
    ini: ini_file;

    constructor(fname: string, advanced_mode: boolean);

    save(): void;
    r_value(ection: Section, key: string, type: 0 | 1 | 2, def: string | boolean | number): string | boolean | number;
    w_value(section: Section, key: string, val: any, comment: string): void;
    collect_section(section: Section): { [key: string]: any; };
    get_sections(keytable: boolean): string[] | { [key: Section]: true; };
    remove_line(section: Section, key: string): void;
    section_exist(section: Section): boolean;
    line_exist(section: Section, key: string): boolean;
    r_string_ex(section: Section, key: string): string;
    r_bool_ex(section: Section, key: string, def: boolean): boolean;
    r_string(section: Section, key: string): string;
    r_float_ex(section: Section, key: string): number;
    r_string_to_condlist(section: Section, key: string, def: Condlist): Condlist;
    r_list(section: Section, key: string, def: any[]): any[];
    r_mult(section: Section, key: string, ...args: any[]): any[];
}
