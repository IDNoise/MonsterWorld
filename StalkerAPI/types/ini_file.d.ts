/** @customConstructor ini_file */
declare class ini_file {
    constructor(fname: string);

    line_count(section: Section): boolean;
    section_exist(section: Section): boolean;
    line_exist(section: Section, key: string): boolean;
    remove_line(section: Section, key: string): void;
    r_bool(section: Section, key: string): boolean;
    r_bool_ex(section: Section, key: string, def: boolean): boolean;
    r_float(section: Section, key: string): number;
    r_float_ex(section: Section, key: string, def: number): number;
    r_clsid(section: Section, key: string): ClsId;
    r_s32(section: Section, key: string): number;
    r_line(section: Section, index: number, arg1: string | "", arg2: string | ""): [boolean, string, string | number | any];
    r_line_ex(section: Section, index: number): [boolean, string, string | number | any];
    //r_token(string, string, const token_list&)
    r_vector(section: Section, key: string): vector;
    r_u32(section: Section, key: string): number;
    r_string_wq(section: Section, key: string): string;
    r_string(section: Section, key: string): string;
    r_string_ex(section: Section, key: string, def: string): string;
    r_sec_ex(section: Section, key: string, def: Section): Section;
    r_string_to_condlist(section: Section, key: string, def: Condlist): Condlist;
    r_list(section: Section, key: string, def: any[]): any[];
    r_mult(section: Section, key: string, ...args: any[]): any[];
    section_for_each(iterator: (section: Section) => boolean): void;
}
