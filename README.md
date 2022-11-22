# MonsterWorld
Stalker Anomaly mod converting game into looter shooter.

It's small free time project without end goal just to see what is stalker modding :) 
LUA is..., not gonna use it, ever, so i've found cool lib [TypeScriptToLua](https://typescripttolua.github.io/docs/getting-started) that can covert typescript to lua and it's possible to write custom declarations for outside api. 
Also stalker has heavy use of ltx files, so additonaly i've made small app to manage it from code: load all storage and then modify\search\create new configs. I've used it to pregenerate a lot of weapon and upgrade configs that are used in mod (~500kb of text). 

Features:
- You are alone vs mutants (no stalkers at all)
- Custom HP/Damage system with exponential progression through levels. (Currently handles only wound\fire_wound damage types) 
- 3 monster level ranks: common, elite, boss (just more hp/damage/xp and better loot)
- Random weapon generation: levels + quality results in different upgrade setups that change damage/fire-rate/mag-size/recoil/accuracy/fire-modes
- Loot drop (weapons) from enemies with simple highlight based on quality 
- Custom UI: level progress, enemy health bar, floating numbers for damage/xp, show weapon stats/bonuses in description
- Auto delete dropped item from inventory, infinite ammo (still requires realoding)
- Start with randomly generated pm. ( Suggestion - do it on Cordon, it's lvl 1 location :) )

Not sure if i'll continue with it. Putting it here in case someone will find typescript declarations for stalker api useful (only partly done)
