import { MonsterType } from './MonsterWorldConfig';

let dogBones = [15]
let bloodsuckerBones = [14]
let chimeraBones = [25, 26, 27, 28, 29, 30, 31, 34, 34]

export let CriticalBones: {[key in MonsterType]: number[]} = {
    [MonsterType.Dog]: dogBones,
    [MonsterType.Boar]: [20],
    [MonsterType.Cat]: [13],
    [MonsterType.PseudoDog]: dogBones,
    [MonsterType.Bloodsucker]: bloodsuckerBones,
    [MonsterType.Fracture]: [13],
    [MonsterType.Snork]: [4],
    [MonsterType.Lurker]: chimeraBones,
    [MonsterType.Flesh]: [13],
    [MonsterType.Chimera]: chimeraBones,
    [MonsterType.Burer]: [39, 40, 41, 42, 44, 45, 47, 48],
    [MonsterType.Controller]: [31],
    [MonsterType.Psysucker]: bloodsuckerBones,
    [MonsterType.Giant]:  [1, 2, 3, 4, 5],
} 

//CriticalBones.set(MonsterType.Zombie, [12])
//CriticalBones.set(MonsterType.Karlik, [15])
//CriticalBones.set(MonsterType.PsyDog, dogBones)


// local human = {
// 	[15] = {"bip01_head", critical_damage}, 
// 	[16] = {"eye_left", critical_damage}, 
// 	[17] = {"eye_right", critical_damage}, 
// 	[18] = {"eyelid_1", critical_damage}, 
// 	[19] = {"jaw_1", critical_damage}, 
// }