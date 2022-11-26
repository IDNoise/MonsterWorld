import { MonsterRank } from "./Enemies";

export let Qualities: {[key: number]: string} = {
    1: "Common",
    2: "Uncommon",
    3: "Rare",
    4: "Epic",
    5: "Legendary",
};

export let QualityColors: {[key: number]: ARGBColor} = {
    1: GetARGB(255,230,230,230), //greish
    2: GetARGB(255,20,20,230), //blue
    3: GetARGB(255,20,230,20),  //green
    4: GetARGB(255,230,20,20),  //red
    5: GetARGB(255,240,165,5),   //orange
};

export let MonsterRankColors: {[key in MonsterRank]: ARGBColor} = {
    0: GetARGB(255,120,250,30),
    1: GetARGB(255,20,20,240), 
    2: GetARGB(255,240,20,20),
};

export let EndColorTag: string = "%c[default]"