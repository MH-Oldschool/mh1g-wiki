const fs = require("fs");
const path = require("path");
const mustache = require("mustache");

function readFiles(fileNames, files, callback) {
	if (!files) {
		files = [];
	}

	if (fileNames.length == 0) {
		callback(files);
		return;
	}

	return fs.readFile(fileNames[0], "utf8", (err, data) => {
		if (err) {
			console.error(err);
		}
		else {
			files.push(data.replace(/[\n\r]+/g, "").replace(/\t+/g, ""));
			readFiles(fileNames.slice(1, fileNames.length), files, callback);
		}
	});
}

var versionString = "";
var packageFile = fs.readFileSync("package.json", "utf-8");
try {
	versionString = JSON.parse(packageFile).version;
}
catch (err) {
	console.error("Unable to parse package.json:", err);
}
function renderAndWriteToFile(pageName, template, view, partials) {
	view.versionString = versionString;
	var rendered = mustache.render(template, view, partials);

	fs.writeFile("public/" + pageName + ".html", rendered, {}, (err) => {
		if (err) {
			console.error(err);
		}
		else {
			console.log(pageName, "built successfully!");
		}
	});
}

function generateArmorDataJS() {
	var data = fs.readFileSync("_views/armor.json", "utf8");

	try {
		const VERSIONS = ["1","g"];
		const CATEGORIES = ["headgear","torso","arms","waist","legs"];

		var armorData = {};
		var rawData = JSON.parse(data);

		VERSIONS.forEach((version) => {
			var armorCategory = `armorData${version.toUpperCase()}`;
			armorData[armorCategory] = {};

			CATEGORIES.forEach((category) => {
				var sourceKey = `${category}_${version}`;
				armorData[armorCategory][category] = rawData[sourceKey];
			});
		});

		var formattedData = `window.armorData1=${JSON.stringify(armorData.armorData1)};window.armorDataG=${JSON.stringify(armorData.armorDataG)}`;

		fs.writeFileSync("public/js/armor_data.js", formattedData);

		return armorData;
	}
	catch (e) {
		console.log("Error parsing armor json:", e);
	}
}
function generateWeaponsDataJS() {
	var data = fs.readFileSync("_views/weapons.json", "utf8");

	try {
		const WEAPON_CATEGORIES = ["greatswords","hammers","lances","swords","dualSwords"];
		var weaponData = {};
		var rawData = JSON.parse(data);

		WEAPON_CATEGORIES.forEach((category) => {
			weaponData[category] = {};

			rawData[category].forEach((group) => {
				group.tbody.forEach((tbody) => {
					tbody.weapons.forEach((weapon) => {
						var weaponId = weapon.sharpness;
						// Check if we already have another version of this weapon
						if (weaponData[category][weaponId]) {
							// Only add values that are different per version
							if (weaponData[category][weaponId].rarity1) weaponData[category][weaponId].rarityG = weapon.rarityG;
							else if (weaponData[category][weaponId].rarityG) weaponData[category][weaponId].rarity1 = weapon.rarity1;

							if (weaponData[category][weaponId].damage1) weaponData[category][weaponId].damageG = weapon.damageG;
							else if (weaponData[category][weaponId].damageG) weaponData[category][weaponId].damage1 = weapon.damage1;

							if (weaponData[category][weaponId].attributeValue1) weaponData[category][weaponId].attributeValueG = weapon.attributeValueG;
							else if (weaponData[category][weaponId].attributeValueG) weaponData[category][weaponId].attributeValue1 = weapon.attributeValue1;

							if (weaponData[category][weaponId].price1) weaponData[category][weaponId].priceG = weapon.priceG;
							else if (weaponData[category][weaponId].priceG) weaponData[category][weaponId].price1 = weapon.price1;

							if (weaponData[category][weaponId].forge1) weaponData[category][weaponId].forgeG = weapon.forgeG;
							else if (weaponData[category][weaponId].forgeG) weaponData[category][weaponId].forge1 = weapon.forge1;

							if (weaponData[category][weaponId].upgrade1) weaponData[category][weaponId].upgradeG = weapon.upgradeG;
							else if (weaponData[category][weaponId].upgradeG) weaponData[category][weaponId].upgrade1 = weapon.upgrade1;
						}
						else {
							weaponData[category][weaponId] = weapon;
							// Also trim out excess stuff from the weapon's name
							weaponData[category][weaponId].name = weapon.name.replace(/&lt;(&#x2F)?[^&]+&gt;/g, "");
						}
					});
				});
			});
		});

		// Stats that could differ between game versions
		const BOWGUN_STATS = [
			"reload",
			"recoil",
			"normal",
			"pierce",
			"pellet",
			"crag",
			"clust",
			"recover",
			"poison",
			"stun",
			"sleep",
			"tranq",
			"paint",
			"antidote",
			"demon",
			"dragon"
		];
		// MHG-only stats
		const BOWGUN_STATS_G = ["flame", "water", "thunder"];
		weaponData.bowguns = {};
		["bowguns1","bowgunsG"].forEach((versionBGs) => {
			["lbg","hbg"].forEach((category) => {
				rawData[versionBGs][category].forEach((bowgun) => {
					// Check if we already have another version of this weapon
					if (weaponData.bowguns[bowgun.name]) {
						// Only add values that are different per version (since MH1 comes first, the new one should always be MHG)
						var splitDamage = bowgun.dmg.split(" - ");
						if (weaponData.bowguns[bowgun.name].damage[0] != splitDamage[0] || weaponData.bowguns[bowgun.name][1] != splitDamage[1]) {
							weaponData.bowguns[bowgun.name].damage1 = weaponData.bowguns[bowgun.name].damage;
							weaponData.bowguns[bowgun.name].damageG = splitDamage;

							delete weaponData.bowguns[bowgun.name].damage;
						}

						BOWGUN_STATS.forEach((stat) => {
							if (weaponData.bowguns[bowgun.name][stat] != bowgun[stat]) {
								weaponData.bowguns[bowgun.name][`${stat}1`] = weaponData.bowguns[bowgun.name][stat];
								weaponData.bowguns[bowgun.name][`${stat}G`] = bowgun[stat];

								delete weaponData.bowguns[bowgun.name][stat];
							}
						});
					}
					else {
						weaponData.bowguns[bowgun.name] = {
							icon: category,
							name: bowgun.name.replace(/&lt;(&#x2F)?[^&]+&gt;/g, ""),
							gOnly:bowgun.mhg,
							rarity: bowgun.rarity,
							damage: bowgun.dmg.split(" - "),
							def: bowgun.def,
							reload: bowgun.reload,
							recoil: bowgun.recoil,
							normal: bowgun.normal,
							pierce: bowgun.pierce,
							pellet: bowgun.pellet,
							crag: bowgun.crag,
							clust: bowgun.clust,
							disc: bowgun.disc,
							recover: bowgun.recover,
							poison: bowgun.poison,
							stun: bowgun.stun,
							sleep: bowgun.sleep,
							tranq: bowgun.tranq,
							paint: bowgun.paint,
							antidote: bowgun.antidote,
							demon: bowgun.demon,
							armor: bowgun.armor,
							dragon: bowgun.dragon,
							dung: bowgun.dung,
							flame: bowgun.flame,
							water: bowgun.water,
							thunder: bowgun.thunder,
							price: bowgun.price,
							mats: bowgun.mats
						}
					}

					BOWGUN_STATS_G.forEach((stat) => {
						if (bowgun.hasOwnProperty(stat)) {
							weaponData.bowguns[bowgun.name][stat] = stat;
						}
					});
				});
			});
		});

		var formattedData = WEAPON_CATEGORIES.map((category) => {
			return `window.${category}=${JSON.stringify(weaponData[category])}`;
		}).join(";");
		formattedData += `;window.bowguns=${JSON.stringify(weaponData.bowguns)}`;

		fs.writeFileSync("public/js/weapon_data.js", formattedData);

		return weaponData;
	}
	catch (err) {
		console.error("Unable to parse JSON:", err);
	}
}
function generateItemDataJS(weaponData, armorData) {
	function getWeaponUses(itemName, version) {
		var uses = [];

		var doesMaterialUseItem = (material) => {
			return material.n == itemName;
		}
		var doesBlademasterWeaponUseItem = (weapon) => {
			var itemsFound = [];

			if (weapon.forge) {
				itemsFound = weapon.forge.filter(doesMaterialUseItem);
			}
			else if (weapon.forge1 || weapon.forgeG) {
				if (version == "1" && weapon.forge1) {
					itemsFound = weapon.forge1.filter(doesMaterialUseItem);
				}
				else if (weapon.forgeG) {
					itemsFound = weapon.forgeG.filter(doesMaterialUseItem);
				}
			}
			else if (weapon.upgrade) {
				itemsFound = weapon.upgrade.filter(doesMaterialUseItem);
			}
			else if (weapon.upgrade1 || weapon.upgradeG) {
				if (version == "1" && weapon.upgrade1) {
					itemsFound = weapon.upgrade1.filter(doesMaterialUseItem);
				}
				else if (weapon.upgradeG) {
					itemsFound = weapon.upgradeG.filter(doesMaterialUseItem);
				}
			}

			return itemsFound.length !== 0;
		}
		var getBlademasterWeaponNamesThatUseItem = (weapons) => {
			var weaponNames = [];

			for (var prop in weapons) {
				if (weapons.hasOwnProperty(prop) && (version == "g" || !weapons[prop].gOnly) && doesBlademasterWeaponUseItem(weapons[prop])) {
					weaponNames.push(weapons[prop].name.replace(/ /g, "&nbsp;"));
				}
			}

			return weaponNames.join(", ");
		}

		var doesBowgunUseItem = (bowgun) => {
			if (bowgun.mats) {
				return bowgun.mats.filter((material) => { return material.n == itemName }).length !== 0;
			}

			return false;
		}
		var getBowgunNamesThatUseItem = (bowguns, category) => {
			var weaponNames = [];

			for (var prop in bowguns) {
				if (bowguns.hasOwnProperty(prop) && bowguns[prop].icon == category && (version == "g" || !bowguns[prop].gOnly) && doesBowgunUseItem(bowguns[prop])) {
					weaponNames.push(bowguns[prop].name.replace(/ /g, "&nbsp;"));
				}
			}

			return weaponNames.join(", ");
		}

		var greatswords = getBlademasterWeaponNamesThatUseItem(weaponData.greatswords);
		if (greatswords) uses.push("<b>Great Swords:</b> " + greatswords);
		var hammers = getBlademasterWeaponNamesThatUseItem(weaponData.hammers);
		if (hammers) uses.push("<b>Hammers:</b> " + hammers);
		var lances = getBlademasterWeaponNamesThatUseItem(weaponData.lances);
		if (lances) uses.push("<b>Lances:</b> " + lances);
		var swords = getBlademasterWeaponNamesThatUseItem(weaponData.swords);
		if (swords) uses.push("<b>Swords and Shields:</b> " + swords);
		if (version == "g") {
			var dualSwords = getBlademasterWeaponNamesThatUseItem(weaponData.dualSwords);
			if (dualSwords) uses.push("<b>Dual Swords:</b> " + dualSwords);
		}
		var lightBowguns = getBowgunNamesThatUseItem(weaponData.bowguns, "lbg");
		if (lightBowguns) uses.push("<b>Light Bowguns:</b> " + lightBowguns);
		var heavyBowguns = getBowgunNamesThatUseItem(weaponData.bowguns, "hbg");
		if (heavyBowguns) uses.push("<b>Heavy Bowguns:</b> " + heavyBowguns);

		return uses;
	}
	function getArmorUses(itemName, version) {
		var armorDataVersion = "armorData" + version.toUpperCase();
		var uses = [];

		var doesMaterialUseItem = (material) => {
			return material.m == itemName;
		}
		var doesArmorUseItem = (armor) => {
			var itemsFound = [];

			if (armor.mats) {
				itemsFound = armor.mats.filter(doesMaterialUseItem);
			}

			return itemsFound.length !== 0;
		}
		var getArmorNamesThatUseItem = (armor) => {
			var armorNames = [];

			armor.forEach((armorPiece) => {
				if (doesArmorUseItem(armorPiece)) {
					var armorName = armorPiece.name;
					if (armorPiece.suffA) {
						armorName += armorPiece.suffA;
					}
					armorNames.push(armorName.replace(/ /g, "&nbsp;"));
				}
			});

			return armorNames.join(", ");
		}

		var headgear = getArmorNamesThatUseItem(armorData[armorDataVersion].headgear);
		if (headgear) uses.push("<b>Headgear:</b> " + headgear);
		var torso = getArmorNamesThatUseItem(armorData[armorDataVersion].torso);
		if (torso) uses.push("<b>Torso:</b> " + torso);
		var arms = getArmorNamesThatUseItem(armorData[armorDataVersion].arms);
		if (arms) uses.push("<b>Arms:</b> " + arms);
		var waist = getArmorNamesThatUseItem(armorData[armorDataVersion].waist);
		if (waist) uses.push("<b>Waist:</b> " + waist);
		var legs = getArmorNamesThatUseItem(armorData[armorDataVersion].legs);
		if (legs) uses.push("<b>Legs:</b> " + legs);

		return uses;
	}

	var itemFile = fs.readFileSync("_views/items.json", "utf8");

	try {
		var itemData = JSON.parse(itemFile);

		function formatItemWithIcon(ingredient) {
			return `<span class="${ ingredient.class }"></span><span>${ ingredient.name }</span>`;
		}
		function getComboForItem(itemName, version) {
			var combo = itemData["combos" + version.toUpperCase()].filter((combo) => combo.name == itemName);
			if (combo.length !== 0) {
				return `<tr><td>${ combo[0].ingredients.map(formatItemWithIcon).join("</td><td>") }</td></tr>`;
			}

			return "";
		}
		function getCombosThatUseItem(itemName, version) {
			var combos = itemData["combos" + version.toUpperCase()].filter((combo) => {
				return combo.ingredients[0].name == itemName || combo.ingredients[1].name == itemName;
			});
			var alchemy = [];
			if (version == "g") {
				alchemy = itemData.combosAlchemy.filter((combo) => {
					return combo.ingredients[0].name == itemName || combo.ingredients[1].name == itemName;
				});
			}

			if (combos.length !== 0) {
				var formattedCombos = `<tr>${ combos.map((combo) => {
					return `<td>${ formatItemWithIcon(combo) }</td><td>${ combo.ingredients.map(formatItemWithIcon).join("</td><td>") }</td>`;
				}).join("</tr><tr>") }</tr>`;

				if (version == "g" && alchemy.length !== 0) {
					formattedCombos = `${ formattedCombos }<tr class="requires-alchemy" title="Requires Alchemy">${ alchemy.map((combo) => {
						return `<td>${ formatItemWithIcon(combo) }</td><td>${ combo.ingredients.map(formatItemWithIcon).join("</td><td>") }</td>`;
					}).join("</tr><tr>") }</tr>`;
				}

				return formattedCombos;
			}

			return "";
		}

		function getAlchemyForItem(itemName) {
			var combo = itemData.combosAlchemy.filter((combo) => combo.name == itemName);
			if (combo.length !== 0) {
				return `<tr class="requires-alchemy" title="Requires Alchemy"><td>${ combo[0].ingredients.map(formatItemWithIcon).join("</td><td>") }</td></tr>`;
			}

			return "";
		}

		function getTradesForItem(itemName, version) {
			var tradesForItem = [];
			itemData.trades.forEach((localeTrades) => {
				var localeTradesFound = [];

				localeTrades["mh" + version].forEach((trade) => {
					if (trade.items[1].n == itemName) {
						localeTradesFound.push(trade.items[0].n);
					}
					if (version == "g" && trade.items[2].n == itemName) {
						localeTradesFound.push(trade.items[0].n);
					}
				});

				if (localeTradesFound.length !== 0) {
					tradesForItem.push(`<p><span class="${ localeTrades.color }-icon map-icon"></span> <b>${ localeTrades.name }:</b> ${ localeTradesFound.join(", ") }</p>`);
				}
			});

			return tradesForItem.join("");
		}

		itemData.items.forEach((item) => {
			var weaponUses1 = getWeaponUses(item.name, "1");
			var weaponUsesG = getWeaponUses(item.name, "g");
			var armorUses1 = getArmorUses(item.name, "1");
			var armorUsesG = getArmorUses(item.name, "g");

			if (weaponUses1.length !== 0 || weaponUsesG.length !== 0) {
				item.weaponUses = {};
				if (weaponUses1.length !== 0) item.weaponUses["1"] = `<p>${ weaponUses1.join("</p><p>") }</p>`;
				if (weaponUsesG.length !== 0) item.weaponUses["g"] = `<p>${ weaponUsesG.join("</p><p>") }</p>`;
			}

			if (armorUses1.length !== 0 || armorUsesG.length !== 0) {
				item.armorUses = {};
				if (armorUses1.length !== 0) item.armorUses["1"] = `<p>${ armorUses1.join("</p><p>") }</p>`;
				if (armorUsesG.length !== 0) item.armorUses["g"] = `<p>${ armorUsesG.join("</p><p>") }</p>`;
			}

			var comboForItem1 = getComboForItem(item.name, "1");
			var comboForItemG = getComboForItem(item.name, "g");
			var combosUsingItem1 = getCombosThatUseItem(item.name, "1");
			var combosUsingItemG = getCombosThatUseItem(item.name, "g");

			if (comboForItem1 || comboForItemG) {
				item.comboForItem = {};
				if (comboForItem1) item.comboForItem["1"] = comboForItem1;
				if (comboForItemG) item.comboForItem["g"] = comboForItemG;
			}

			if (combosUsingItem1 || combosUsingItemG) {
				item.combosUsingItem = {};
				if (combosUsingItem1) item.combosUsingItem["1"] = combosUsingItem1;
				if (combosUsingItemG) item.combosUsingItem["g"] = combosUsingItemG;
			}

			var alchemyForItem = getAlchemyForItem(item.name);
			if (alchemyForItem.length !== 0) item.alchemyForItem = alchemyForItem;

			var tradesForItem1 = getTradesForItem(item.name, "1");
			var tradesForItemG = getTradesForItem(item.name, "g");
			if (tradesForItem1 || tradesForItemG) {
				item.tradesForItem = {};
				if (tradesForItem1) item.tradesForItem["1"] = tradesForItem1;
				if (tradesForItemG) item.tradesForItem["g"] = tradesForItemG;
			}

			// This has to be at the end for all the searches to work
			item.name = `${ item.name } <span class="japanese">${ item.japanese }</span>`;
		});
		var formattedData = `window.items=${JSON.stringify(itemData.items)};`;

		fs.writeFileSync("public/js/item_data.js", formattedData, "utf8");
	}
	catch (e) {
		console.error("Unable to parse item file:", e);
	}
}

// Convert weapon data, formatted for mustache to generate detail elements with tables, into manageable objects
function generateWeaponsData2JS() {
	var data = fs.readFileSync("_views/mh2/weapons.json", "utf8");

	try {
		var weaponData = {};
		var rawData = JSON.parse(data);

		rawData.blademasterWeapons.forEach((weaponDetails) => {
			var detailsWeaponClass = weaponDetails.weaponClass;

			weaponDetails.groups.forEach((weaponGroup) => {
				var groupWeaponClass = weaponGroup.weaponClass;

				weaponGroup.tbody.forEach((tbody) => {
					var bodyWeaponClass = tbody.weaponClass;

					tbody.weapons.forEach((weapon) => {
						var currentWeaponClass = detailsWeaponClass;
						if (weapon.weaponClass) currentWeaponClass = weapon.weaponClass;
						else if (bodyWeaponClass) currentWeaponClass = bodyWeaponClass;
						else if (groupWeaponClass) currentWeaponClass = groupWeaponClass;

						weapon.weaponClass = currentWeaponClass;

						if (!weaponData[currentWeaponClass]) {
							weaponData[currentWeaponClass] = {};
						}

						if (weapon.index !== undefined) {
							weaponData[currentWeaponClass][weapon.index.toString()] = weapon;
						}
					});
				});
			});
		});

		weaponData["Light Bowgun"] = {};
		rawData.lightBowguns.weapons.forEach((bowgun) => {
			bowgun.weaponClass = "Light Bowgun";
			weaponData["Light Bowgun"][bowgun.index.toString()] = bowgun;
		});
		weaponData["Heavy Bowgun"] = {};
		rawData.heavyBowguns.weapons.forEach((bowgun) => {
			bowgun.weaponClass = "Heavy Bowgun";
			weaponData["Heavy Bowgun"][bowgun.index.toString()] = bowgun;
		});

		weaponData["Bow"] = {};
		rawData.bows.forEach((bowGroup) => {
			bowGroup.weapons.forEach((bow) => {
				bow.weaponClass = "Bow";
				weaponData["Bow"][bow.index.toString()] = bow;
			});
		});

		var gunlanceShellLevels = {};
		rawData.gunlanceShellLevels.forEach(shellLevel => gunlanceShellLevels[shellLevel.name] = shellLevel.power);
		weaponData.gunlanceShellLevels = gunlanceShellLevels;

		var arrowData = {};
		rawData.arrows.forEach(arrow => {
			if (!arrowData[arrow.name]) {
				arrowData[arrow.name] = Array(4);
			}

			arrowData[arrow.name][arrow.level - 1] = {
				power: arrow.power,
				impacts: arrow.impacts ? arrow.impacts : 1
			};
		});
		weaponData.arrowData = arrowData;

		weaponData.huntingHornMelodies = rawData.huntingHornMelodies;
		weaponData.wyvernfire = rawData.wyvernfire;

		var formattedData = "window.weaponData=" + JSON.stringify(weaponData);

		fs.writeFileSync("public/mh2/js/weapon_data.js", formattedData);

		return weaponData;
	}
	catch (err) {
		console.error("Unable to parse JSON:", err);
	}
}
function generateArmorData2JS() {
	var data = fs.readFileSync("_views/mh2/armor.json", "utf8");
	var armorSkillData = fs.readFileSync("_views/mh2/armor_skills.json", "utf8");

	try {
		var rawData = JSON.parse(data);
		var armorData = {};
		rawData.armorCategories.forEach(armorCategory => {
			armorData[armorCategory.armorCategory] = armorCategory.armor;
		});

		var rawArmorSkills = JSON.parse(armorSkillData);
		var parsedArmorSkills = {};
		rawArmorSkills.armorSkills.forEach(skill => {
			parsedArmorSkills[skill.name] = skill.stages;
		});

		var formattedData = `window.armorData=${JSON.stringify(armorData)};window.armorSkills=${JSON.stringify(parsedArmorSkills)}`;

		fs.writeFileSync("public/mh2/js/armor_data.js", formattedData);

		return armorData;
	}
	catch (e) {
		console.log("Error parsing armor json:", e);
	}
}
function generateItemData2JS(weaponData, armorData) {
	function getWeaponUses(itemName) {
		var uses = [];

		var doesMaterialUseItem = (material) => {
			return material.n == itemName;
		}
		var doesBlademasterWeaponUseItem = (weapon) => {
			var itemsFound = [];

			if (weapon.forge) {
				itemsFound = weapon.forge.filter(doesMaterialUseItem);
			}
			else if (weapon.upgrade) {
				itemsFound = weapon.upgrade.filter(doesMaterialUseItem);
			}

			return itemsFound.length !== 0;
		}
		var getWeaponNamesThatUseItem = (weapons) => {
			var weaponNames = [];

			for (var prop in weapons) {
				if (weapons.hasOwnProperty(prop) && doesBlademasterWeaponUseItem(weapons[prop])) {
					weaponNames.push(weapons[prop].name.replace(/ /g, "&nbsp;"));
				}
			}

			return weaponNames.join(", ");
		}

		// var doesBowgunUseItem = (bowgun) => {
		// 	if (bowgun.mats) {
		// 		return bowgun.mats.filter((material) => { return material.n == itemName }).length !== 0;
		// 	}

		// 	return false;
		// }
		// var getBowgunNamesThatUseItem = (bowguns, category) => {
		// 	var weaponNames = [];

		// 	for (var prop in bowguns) {
		// 		if (bowguns.hasOwnProperty(prop) && bowguns[prop].icon == category && doesBowgunUseItem(bowguns[prop])) {
		// 			weaponNames.push(bowguns[prop].name.replace(/ /g, "&nbsp;"));
		// 		}
		// 	}

		// 	return weaponNames.join(", ");
		// }

		var greatswords = getWeaponNamesThatUseItem(weaponData["Great Sword"]);
		if (greatswords) uses.push("<b>Great Swords:</b> " + greatswords);
		var longswords = getWeaponNamesThatUseItem(weaponData["Longsword"]);
		if (longswords) uses.push("<b>Longswords:</b> " + longswords);

		var hammers = getWeaponNamesThatUseItem(weaponData["Hammer"]);
		if (hammers) uses.push("<b>Hammers:</b> " + hammers);
		var huntingHorns = getWeaponNamesThatUseItem(weaponData["Hunting Horn"]);
		if (huntingHorns) uses.push("<b>Hunting Horns:</b> " + huntingHorns);

		var lances = getWeaponNamesThatUseItem(weaponData["Lance"]);
		if (lances) uses.push("<b>Lances:</b> " + lances);
		var gunlances = getWeaponNamesThatUseItem(weaponData["Gunlance"]);
		if (gunlances) uses.push("<b>Gunlances:</b> " + gunlances);

		var swords = getWeaponNamesThatUseItem(weaponData["Sword and Shield"]);
		if (swords) uses.push("<b>Swords and Shields:</b> " + swords);
		var dualSwords = getWeaponNamesThatUseItem(weaponData["Dual Swords"]);
		if (dualSwords) uses.push("<b>Dual Swords:</b> " + dualSwords);

		var lightBowguns = getWeaponNamesThatUseItem(weaponData["Light Bowgun"]);
		if (lightBowguns) uses.push("<b>Light Bowguns:</b> " + lightBowguns);
		var heavyBowguns = getWeaponNamesThatUseItem(weaponData["Heavy Bowgun"]);
		if (heavyBowguns) uses.push("<b>Heavy Bowguns:</b> " + heavyBowguns);
		var bows = getWeaponNamesThatUseItem(weaponData["Bow"]);
		if (bows) uses.push("<b>Bows:</b> " + bows);

		return uses;
	}
	function getArmorUses(itemName) {
		var uses = [];

		var doesMaterialUseItem = (material) => {
			return material.m == itemName;
		}
		var doesArmorUseItem = (armor) => {
			var itemsFound = [];

			if (armor.forge) {
				itemsFound = armor.forge.filter(doesMaterialUseItem);
			}
			if (armor.upgrade) {
				itemsFound = armor.upgrade.filter(doesMaterialUseItem);
			}

			return itemsFound.length !== 0;
		}
		var getArmorNamesThatUseItem = (armor) => {
			var armorNames = [];

			armor.forEach((armorPiece) => {
				if (doesArmorUseItem(armorPiece)) {
					var armorName = armorPiece.name;
					if (armorPiece.suffA) {
						armorName += armorPiece.suffA;
					}
					armorNames.push(armorName.replace(/ /g, "&nbsp;"));
				}
			});

			return armorNames.join(", ");
		}

		var headgear = getArmorNamesThatUseItem(armorData["Headgear"]);
		if (headgear) uses.push("<b>Headgear:</b> " + headgear);
		var torso = getArmorNamesThatUseItem(armorData["Torso"]);
		if (torso) uses.push("<b>Torso:</b> " + torso);
		var arms = getArmorNamesThatUseItem(armorData["Arms"]);
		if (arms) uses.push("<b>Arms:</b> " + arms);
		var waist = getArmorNamesThatUseItem(armorData["Waist"]);
		if (waist) uses.push("<b>Waist:</b> " + waist);
		var legs = getArmorNamesThatUseItem(armorData["Legs"]);
		if (legs) uses.push("<b>Legs:</b> " + legs);

		return uses;
	}

	var itemFile = fs.readFileSync("_views/mh2/items.json", "utf8");

	try {
		var itemData = JSON.parse(itemFile);

		function formatItemWithIcon(ingredient) {
			return `<span class="${ ingredient.class }"></span><span>${ ingredient.name }</span>`;
		}
		function getComboForItem(itemName, version) {
			var combo = itemData["combos" + version.toUpperCase()].filter((combo) => combo.name == itemName);
			if (combo.length !== 0) {
				return `<tr><td>${ combo[0].ingredients.map(formatItemWithIcon).join("</td><td>") }</td></tr>`;
			}

			return "";
		}
		function getCombosThatUseItem(itemName, version) {
			var combos = itemData["combos" + version.toUpperCase()].filter((combo) => {
				return combo.ingredients[0].name == itemName || combo.ingredients[1].name == itemName;
			});
			var alchemy = [];
			if (version == "g") {
				alchemy = itemData.combosAlchemy.filter((combo) => {
					return combo.ingredients[0].name == itemName || combo.ingredients[1].name == itemName;
				});
			}

			if (combos.length !== 0) {
				var formattedCombos = `<tr>${ combos.map((combo) => {
					return `<td>${ formatItemWithIcon(combo) }</td><td>${ combo.ingredients.map(formatItemWithIcon).join("</td><td>") }</td>`;
				}).join("</tr><tr>") }</tr>`;

				if (version == "g" && alchemy.length !== 0) {
					formattedCombos = `${ formattedCombos }<tr class="requires-alchemy" title="Requires Alchemy">${ alchemy.map((combo) => {
						return `<td>${ formatItemWithIcon(combo) }</td><td>${ combo.ingredients.map(formatItemWithIcon).join("</td><td>") }</td>`;
					}).join("</tr><tr>") }</tr>`;
				}

				return formattedCombos;
			}

			return "";
		}

		function getAlchemyForItem(itemName) {
			var combo = itemData.combosAlchemy.filter((combo) => combo.name == itemName);
			if (combo.length !== 0) {
				return `<tr class="requires-alchemy" title="Requires Alchemy"><td>${ combo[0].ingredients.map(formatItemWithIcon).join("</td><td>") }</td></tr>`;
			}

			return "";
		}

		function getTradesForItem(itemName) {
			var tradesForItem = [];
			itemData.trades.forEach((localeTrades) => {
				var localeTradesFound = [];

				localeTrades.forEach((trade) => {
					if (trade.items[1].n == itemName) {
						localeTradesFound.push(trade.items[0].n);
					}
					if (trade.items[2].n == itemName) {
						localeTradesFound.push(trade.items[0].n);
					}
				});

				if (localeTradesFound.length !== 0) {
					tradesForItem.push(`<p><span class="${ localeTrades.color }-icon map-icon"></span> <b>${ localeTrades.name }:</b> ${ localeTradesFound.join(", ") }</p>`);
				}
			});

			return tradesForItem.join("");
		}

		itemData.items.forEach((item) => {
			var weaponUses = getWeaponUses(item.name);
			var armorUses = getArmorUses(item.name);

			if (weaponUses.length) item.weaponUses = `<p>${ weaponUses.join("</p><p>") }</p>`;
			if (armorUses.length) item.armorUses = `<p>${ armorUses.join("</p><p>") }</p>`;

			// var comboForItem = getComboForItem(item.name);
			// var combosUsingItem = getCombosThatUseItem(item.name);

			// if (comboForItem) item.comboForItem = comboForItem;
			// if (combosUsingItem) item.combosUsingItem = combosUsingItem;

			// var alchemyForItem = getAlchemyForItem(item.name);
			// if (alchemyForItem.length !== 0) item.alchemyForItem = alchemyForItem;

			// var tradesForItem = getTradesForItem(item.name);
			// if (tradesForItem) item.tradesForItem = tradesForItem;

			// This has to be at the end for all the searches to work
			item.name = `${ item.name } <span class="japanese">${ item.japanese }</span>`;
		});
		var formattedData = `window.items=${JSON.stringify(itemData.items)};`;

		fs.writeFileSync("public/mh2/js/item_data.js", formattedData, "utf8");
	}
	catch (e) {
		console.error("Unable to parse item file:", e);
	}
}

function buildPage(pageName, partials) {
	var fileNames = [
		path.join(__dirname, "_partials/head.mustache"),
		path.join(__dirname, "_partials/foot.mustache"),
		path.join(__dirname, "_templates/" + pageName + ".mustache"),
		path.join(__dirname, "_views/" + pageName + ".json")
	];
	if (partials) {
		fileNames = fileNames.concat(partials.map((name) => path.join(__dirname, "_partials", name + ".mustache")));
	}

	readFiles(fileNames, null, (files) => {
		var partialFiles = {
			head: files[0],
			foot: files[1]
		}
		for (var i = 4; i < files.length; i++) {
			partialFiles[partials[i - 4]] = files[i];
		}

		try {
			var view = JSON.parse(files[3]);
			renderAndWriteToFile(pageName, files[2], view, partialFiles);
		}
		catch (err) {
			console.log("Unable to parse JSON:", err);
		}
	});
}
function buildPage2(pageName, partials) {
	var fileNames = [
		path.join(__dirname, "_partials/mh2/head.mustache"),
		path.join(__dirname, "_partials/mh2/foot.mustache"),
		path.join(__dirname, "_templates/" + pageName + ".mustache"),
		path.join(__dirname, "_views/" + pageName + ".json")
	];
	if (partials) {
		fileNames = fileNames.concat(partials.map((name) => path.join(__dirname, "_partials", name + ".mustache")));
	}

	readFiles(fileNames, null, (files) => {
		var partialFiles = {
			head: files[0],
			foot: files[1]
		}
		for (var i = 4; i < files.length; i++) {
			partialFiles[partials[i - 4]] = files[i];
		}

		try {
			var view = JSON.parse(files[3]);
			renderAndWriteToFile(pageName, files[2], view, partialFiles);
		}
		catch (err) {
			console.log("Unable to parse JSON:", err);
		}
	});
}

var armorData = generateArmorDataJS();
var weaponData = generateWeaponsDataJS();
generateItemDataJS(weaponData, armorData);

var weaponData2 = generateWeaponsData2JS();
var armorData2 = generateArmorData2JS();
generateItemData2JS(weaponData2, armorData2);

buildPage("index");
buildPage("weapons", ["material","material_row","blademaster_weapon_group","bowgun_1","bowgun_g","motion_value_rows"]);
buildPage("armor", ["headgear_row","torso_row","arms_row","waist_row","legs_row"]);
buildPage("bestiary");
buildPage("armor_skills");
buildPage("items");
buildPage("quests", ["quest"]);
buildPage("maps");
buildPage("miscellany", ["hotel_room"]);
buildPage("roulette");

buildPage2("mh2/index");
buildPage2("mh2/weapons", ["material","material_row","mh2/bowgun","motion_value_rows"]);
buildPage2("mh2/armor");
buildPage2("mh2/armor_skills");
buildPage2("mh2/items");
buildPage2("mh2/bestiary");
buildPage2("mh2/quests", ["mh2/quest_category"]);
buildPage2("mh2/maps");
