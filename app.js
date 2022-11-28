const PORT = process.env.PORT || 8000;
const path = require("path");
const express = require("express");
const app = express();

const fs = require("fs");

// Routing
app.use(express.static(path.join(__dirname, "public")));
// Use HTTP for larger payloads
app.get("/", (req, res) => {
	res.send(res.sendFile(path.join(__dirname, "public/index.html")));
});
app.get("/weapons", (req, res) => {
	res.sendFile(path.join(__dirname, "public/weapons.html"));
});
app.get("/armor", (req, res) => {
	res.sendFile(path.join(__dirname, "public/armor.html"));
});
app.get("/bestiary", (req, res) => {
	res.sendFile(path.join(__dirname, "public/bestiary.html"));
});
app.get("/armor-skills", (req, res) => {
	res.sendFile(path.join(__dirname, "public/armor_skills.html"));
});
app.get("/items", (req, res) => {
	res.sendFile(path.join(__dirname, "public/items.html"));
});
app.get("/quests", (req, res) => {
	res.sendFile(path.join(__dirname, "public/quests.html"));
});
app.get("/maps", (req, res) => {
	res.sendFile(path.join(__dirname, "public/maps.html"));
});
app.get("/miscellany", (req, res) => {
	res.sendFile(path.join(__dirname, "public/miscellany.html"));
});
app.get("/roulette", (req, res) => {
	res.sendFile(path.join(__dirname, "public/roulette.html"));
});

function getJSON(filename, callback) {
	fs.readFile(filename, "utf8", (err, data) => {
		if (err) {
			console.error(`Error reading ${filename}`, err);
		}
		else {
			try {
				callback(JSON.parse(data));
			}
			catch (parseError) {
				console.error(`Error parsing JSON from ${filename}`, parseError);
			}
		}
	});
}

function getMonsterByName(bestiary, name) {
	for (var i = 0; i < bestiary.monsters.length; i++) {
		if (bestiary.monsters[i].name == name) {
			return bestiary.monsters[i];
		}
	}

	return false;
}

function getQuestLists(version, location, callback) {
	getJSON("_views/bestiary.json", (bestiary) => {
		function prepQuest(quest, rankI, index) {
			quest.rank = rankI;
			quest.index = index;

			if (quest.largeMonsters) {
				quest.largeMonsters = quest.largeMonsters.map((monster) => {
					var monsterData = getMonsterByName(bestiary, monster.n);
					if (monsterData.tailCarveCount) {
						monster.t = true;
					}

					return monster;
				});
			}

			return quest
		}

		getJSON("_views/quests.json", (questData) => {
			var questList = {
				ranks:[],
				urgents:[],
				event:{}
			};

			// Village
			if (location == "v") {
				// Delete non-Japanese version quests
				if (version == "mh1") {
					for (var i = questData.mh1.villageQuests.length - 1; i >= 0; i--) {
						if (questData.mh1.villageQuests[i].intOnly) {
							questData.mh1.villageQuests.splice(i, 1);
						}
					}
				}

				// Only pass quests from rank 1-5 into the ranked quests
				for (var rankI = 0; rankI < 5; rankI++) {
					var rank = questData[version].villageQuests[rankI];
					var rankQuests = [];

					// Only get five quests, like in the game
					var usedIndices = [];
					for (var i = 0; i < 5; i++) {
						// Exclude the last quest in each rank, which is the Urgent
						var nonUrgentQuestCount = rank.quests.length - 1;
						var index = parseInt(Math.random() * nonUrgentQuestCount);
						while (usedIndices.includes(index)) {
							index = (index + 1) % nonUrgentQuestCount;
						}

						usedIndices.push(index);
						rankQuests.push(prepQuest(rank.quests[index], rankI, index));
					}

					questList.ranks.push(rankQuests);
				}

				// Get all urgent quests, since they aren't randomized
				questList.urgents = questData[version].villageQuests[5].quests.map((quest, index) => {
					return prepQuest(quest, "u", index);
				});
			}
			// Town
			else {
				// Delete non-Japanese version quests
				if (version == "mh1") {
					for (var i = questData.mh1.townQuests.length - 1; i >= 0; i--) {
						if (questData.mh1.townQuests[i].intOnly) {
							questData.mh1.townQuests.splice(i, 1);
						}
					}
				}

				// Only pass quests from rank 1-6 (8 for MHG) into the ranked quests
				var maxRank = version == "mh1" ? 6 : 8;
				for (var rankI = 0; rankI < maxRank; rankI++) {
					var rank = questData[version].townQuests[rankI];
					var rankQuests = [];

					// Only get 5/8 quests, like in the game
					var usedIndices = [];
					var questCount = version == "mh1" ? 5 : 8;
					for (var i = 0; i < questCount; i++) {
						// Exclude the last quest in each rank, which is the Urgent
						var nonUrgentQuestCount = rank.quests.length - 1;
						var index = parseInt(Math.random() * nonUrgentQuestCount);
						while (usedIndices.includes(index)) {
							index = (index + 1) % nonUrgentQuestCount;
						}

						usedIndices.push(index);
						rankQuests.push(prepQuest(rank.quests[index], rankI, index));
					}

					questList.ranks.push(rankQuests);
				}
				// Get all urgent quests, since they aren't randomized
				questList.urgents = questData[version].townQuests[maxRank].quests.map((quest, index) => {
					return prepQuest(quest, "u", index);
				});
				// TODO: get current event (random event?)
			}

			callback(questList);
		});
	});
}

function getQuestResults(version, locationChar, starRankIndex, questIndex, largeMonsters, luckStage, callback) {
	const LUCK_MOD = [0.25, 0.50, 0.69, 0.81, 0.91];

	var carvedMonsterQuantities = {};
	largeMonsters.split("+").forEach((monster) => {
		if (carvedMonsterQuantities[monster]) {
			carvedMonsterQuantities[monster]++;
		}
		else {
			carvedMonsterQuantities[monster] = 1;
		}
	});

	getJSON("_views/bestiary.json", (bestiary) => {
		getJSON("_views/quests.json", (questData) => {
			var versionChar = version.toUpperCase();
			var versionName = "mh" + version;
			var location = locationChar == "v" ? "villageQuests" : "townQuests";

			if (starRankIndex == "u") {
				starRankIndex = questData[versionName][location].length - 1;
			}
			var quest = questData[versionName][location][starRankIndex].quests[questIndex];

			var rankName = "Low Rank";
			if (locationChar == "t" && starRankIndex > 2) {
				if (version == "1" || starRankIndex < 5) {
					rankName = "High Rank";
				}
				else {
					rankName = "G Rank";
				}
			}

			// First four rewards are guaranteed?
			var rewards = quest.rewards.slice(0, 4);
			// I'd like to sort the rewards by percent, but Array.prototype.sort doesn't work?!
			var luck = LUCK_MOD[parseInt(luckStage) + 2];
			for (var i = 0; i < 6; i++) {
				// Whether you get more rewards is determined by your Luck skill (or default value ??%)
				if (Math.random() < luck) {
					break;
				}

				var item;
				var highestPercent = 0;
				var percent = Math.random() * 100;

				for (var r = 0; r < quest.rewards.length; r++) {
					if (percent < quest.rewards[r].percent) {
						item = quest.rewards[r];
					}

					if (quest.rewards[r].percent > highestPercent) {
						highestPercent = quest.rewards[r].percent;
					}
				}

				if (!item) {
					var items = [];
					for (var r = 0; r < quest.rewards.length; r++) {
						if (quest.rewards[r].percent == highestPercent) {
							items.push(quest.rewards[r]);
						}
					}

					if (items.length !== 1) {
						item = items[parseInt(items.length * Math.random())];
					}
					else {
						item = items[0];
					}
				}

				rewards.push(item);
			}

			var carves = [];
			if (quest.largeMonsters) {
				quest.largeMonsters.forEach((largeMonster) => {
					var monster = getMonsterByName(bestiary, largeMonster.n);

					if (carvedMonsterQuantities[monster.name]) {
						for (var q = 0; q < carvedMonsterQuantities[monster.name]; q++) {
							var carveResults = {
								n: monster.name,
								m: [],
								t: []
							};

							// Exclude large monster carves from capture quests
							if (quest.type != "capture") {
								var monsterCarves = monster["carves" + versionChar].find((carves) => {
									return carves.name == rankName || (locationChar == "v" && carves.name == "Village");
								}).parts;

								for (var i = 0; i < monster.carveCount; i++) {
									var percent = Math.random() * 100;
									// Default to the most common carve (carves are ordered by most common first)
									var item = monsterCarves[0];

									// Check to see if we actually got a rarer carve
									for (var c = 1; c < monsterCarves.length; c++) {
										if (percent < monsterCarves[c].p) {
											item = monsterCarves[c];
										}
									}

									carveResults.m.push(item.n);
								}
							}

							// ...but include tail carves
							if (monster.tailCarveCount) {
								var tailRankName = `${rankName} Tail`;
								var tailCarves = monster["carves" + versionChar].find((carves) => {
									return carves.name == tailRankName || (locationChar == "v" && carves.name == "Village Tail");
								}).parts;

								for (var i = 0; i < monster.tailCarveCount; i++) {
									var percent = Math.random() * 100;
									// Default to the most common carve (carves are ordered by most common first)
									var item = tailCarves[0];

									// Check to see if we actually got a rarer carve
									for (var c = 1; c < tailCarves.length; c++) {
										if (percent < tailCarves[c].p) {
											item = tailCarves[c];
										}
									}

									carveResults.t.push(item.n);
								}
							}

							carves.push(carveResults);
						}
					}
				});
			}

			callback({ "rewards": rewards, "carves": carves });
		});
	});
}

app.get("/quest-list", (req, res) => {
	getQuestLists(req.query["v"], req.query["l"], (questList) => {
		res.send(questList);
	});
});
app.get("/quest-results", (req, res) => {
	getQuestResults(req.query["v"], req.query["l"], req.query["r"], req.query["i"], req.query["m"], req.query["k"], (questResults) => {
		res.send(questResults);
	});
});

var server = app.listen(PORT);
console.log(`Listening on ${ PORT }`);
