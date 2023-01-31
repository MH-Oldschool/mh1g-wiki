const fs = require("fs");
const path = require("path");
const mustache = require("mustache");

function addLastToArrays(obj) {
	if (typeof obj === "object") {
		for (prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				if (Array.isArray(obj[prop]) && obj[prop].length !== 0) {
					obj[prop][obj[prop].length - 1].last = 1;
					obj[prop] = obj[prop].map((element) => {
						if (typeof element === "object") {
							return addLastToArrays(element);
						}
						return element;
					});
				}
			}
		}
	}

	return obj;
}

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

function renderAndWriteToFile(pageName, template, view, partials) {
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
	fs.readFile("_views/armor.json", "utf8", (err, data) => {
		if (err) {
			console.error(err);
		}
		else {
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

				fs.writeFile("public/js/armor_data.js", formattedData, {}, (err) => {
					if (err) {
						console.error("Error trying to write armor_data.js:", err);
					}
					else {
						console.log("Armor Data written to file!");
					}
				});
			}
			catch (e) {
				console.log("Error parsing armor json:", e);
			}
		}
	});
}
function generateWeaponsDataJS() {
	fs.readFile("_views/weapons.json", "utf8", (err, data) => {
		if (err) {
			console.error(err);
		}
		else {
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

				fs.writeFile("public/js/weapon_data.js", formattedData, {}, (err) => {
					if (err) {
						console.error("Error trying to write weapon_data.js:", err);
					}
					else {
						console.log("Weapon Data written to file!");
					}
				});
			}
			catch (e) {
				console.log("Error parsing weapons json:", e);
			}
		}
	});
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

generateArmorDataJS();
generateWeaponsDataJS();

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
