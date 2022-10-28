This started as just a web app that organizes all weapons from Monster Hunter G, but it's now growing into a more complete wiki. [Visit the active app here!](https://mh1g-wiki.herokuapp.com/)

# Current State
I sourced all data from [mmpotato's MHG Analysis](http://infoseek_rip.g.ribbon.to/mmpotato.hp.infoseek.co.jp/codes/MHG/). Since I don't know Japanese very well, I used a plugin to translate everything, and consulted [Monster Hunter Freedom Unite Fandom Wiki](https://monsterhunter.fandom.com/wiki/Monster_Hunter_Freedom_Unite) to correct as many names as I could.

I based Monster Hunter 1 data largely on what has been collected by the Old School Monster Hunter team behind the current MH1 and MHG fan servers.

Feel free to reach out and submit any corrections, but keep the Issues tab purely for technical problems.

# Feature Checklist
- [x] Blademaster Weapons, organized in a tree structure
	- [x] Great Swords
	- [x] Swords and Shields
	- [x] Dual Swords
	- [x] Lances
	- [x] Hammers
	- [x] Raw data with rough translation
	- [x] Correct weapon names
	- [x] Correct material names
- [x] Gunner Weapons
	- [x] Raw data with rough translation
	- [x] Correct weapon names
	- [x] Correct material names
- [x] Checkbox to toggle MH1 and MHG weapons
- [x] Weapon Damage Calculator
	- [x] Blademaster weapon damage
	- [x] Gunner weapon damage
- [ ] Armor List
	- [x] Raw data with rough translation
	- [ ] Correct armor piece names
	- [x] Correct armor skills
	- [x] Correct material names
- [x] Armor Set Builder
- [x] Armor Skills
- [ ] Monster Bestiary
	- [x] General descriptions
	- [ ] Moderate details and recommendations for hunting
	- [ ] All the numbers
- [ ] Items
	- [ ] All items and monster materials with in-game descriptions
	- [x] Shops' stock
	- [x] Item combination list
	- [ ] Veggie Elder trades
- [ ] Locale Maps
	- [ ] Basic maps: zone numbers, hot/cold zones, etc.
	- [ ] Detailed maps: gathering points, monster preference
- [ ] Hunter Ranks with point requirements
- [ ] Quest List
	- [ ] Full list with in-game descriptions/details
	- [ ] Guide to unlocking hidden quests
- [ ] Meal Combinations

# Developing
I've tried to keep this app as simple as possible: mostly static with a little JavaScript for interactivity.

## Requirements
- Node.js 10+

## Setup
1. `npm install` to prepare all necessary packages.
2. `npm run build` to compile all pages with MustacheJS.
3. `node app.js` to start a local Node.js server, hosted on port 8000.

# Resources
- [mmpotato's MHG Analysis](http://infoseek_rip.g.ribbon.to/mmpotato.hp.infoseek.co.jp/codes/MHG/)
- [Monster Hunter Freedom Unite Fandom Wiki](https://monsterhunter.fandom.com/wiki/Monster_Hunter_Freedom_Unite)
