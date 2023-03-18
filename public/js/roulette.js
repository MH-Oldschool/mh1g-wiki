ready(() => {
	const SPINNER_DELAY = 1200;

	function getJSON(url, callback) {
		var request = new XMLHttpRequest();
		request.open("GET", url);

		request.onreadystatechange = function() {
			if (this.readyState == 4) {
				if (this.status >= 200 && this.status < 400) {
					var data = JSON.parse(this.responseText);
					callback(data);
				}
				else {
					console.error("Error making request");
				}
				request = null;
			}
		}

		request.send();
		request = null;
	}

	const rouletteForm = document.getElementById("roulette-form");

	function generateMonsterCheckbox(name, value) {
		return `
			<label>
				<input class="large-monster" type="checkbox" value="${value}"/>
				<div class="checkbox-icon"></div>
				<span class="va-m">${name}</span>
			</label>`;
	}
	function generateQuestMarkup(quest) {
		var largeMonsterRadios = "";
		if (quest.largeMonsters) {
			largeMonsterRadios = quest.largeMonsters.map((monster) => {
				var monsterName = monster.n;
				var includeCheckbox = true;

				// Include checkboxes for tails if a capture quest
				if (quest.type == "capture") {
					if (monster.t) {
						monsterName += " tail";
					}
					else {
						includeCheckbox = false;
					}
				}

				if (includeCheckbox) {
					if (monster.q) {
						var multipleMonsters = [];

						for (var i = 0; i < monster.q; i++) {
							multipleMonsters.push(generateMonsterCheckbox(monsterName, monster.n));
						}

						return multipleMonsters.join("");
					}

					return generateMonsterCheckbox(monsterName, monster.n);
				}
			}).join("");
		}

		if (largeMonsterRadios.length == 0) {
			largeMonsterRadios = "none";
		}

		return `<details id="quest-details-${quest.rank}-${quest.index}">
			<summary>
				<label>
					<input type="radio" name="quest" data-rank="${quest.rank}" data-index="${quest.index}"/>
					<span class="radio-icon"></span>
					<span class="label-copy">${quest.name}</span>
				</label>
			</summary>

			<section class="quest-body ${quest.type}-quest">
				<div class="quest-head">
					<div class="quest-icon-container">
						<div class="quest-icon ${quest.icon}">
						</div>
					</div>

					<p>
						Locale: ${quest.area}<br/>
						Goal: ${quest.goal}<br/>
					</p>
					<p>
						Fee: ${quest.fee}<br/>
						Reward: ${quest.reward}
					</p>
				</div>

				<h3>Carve Monsters:</h3>
				<div class="large-monsters">
					${largeMonsterRadios}
				</div>
			</section>
		</details>`;
	}

	function getLocation() {
		const locations = document.getElementsByName("location");
		for (var i = 0; i < locations.length; i++) {
			if (locations[i].checked) {
				return locations[i].value;
			}
		}

		return false;
	}

	function populateForm(quests) {
		const questContainers = document.getElementsByClassName("quests");
		const urgentQuestContainer = document.getElementById("urgent-quests");
		const monstersContainer = document.getElementById("monsters");

		for (var i = 0; i < quests.ranks.length; i++) {
			var questRows = [];

			for (var questI = 0; questI < quests.ranks[i].length; questI++) {
				var quest = generateQuestMarkup(quests.ranks[i][questI]);
				questRows.push(quest);
			}

			questContainers[i].innerHTML = questRows.join("");
			questContainers[i].parentElement.style.display = ""; // Make sure this container is visible
		}

		// Hide unused quest containers
		for (var i = quests.ranks.length; i < questContainers.length; i++) {
			questContainers[i].parentElement.style.display = "none";
		}

		var urgentRows = [];
		for (var i = 0; i < quests.urgents.length; i++) {
			var quest = generateQuestMarkup(quests.urgents[i]);
			urgentRows.push(quest);
		}

		urgentQuestContainer.innerHTML = urgentRows.join("");

		rouletteForm.classList.remove("show-spinner");
		rouletteForm.classList.add("show-notice");
		setTimeout(() => {
			rouletteForm.classList.remove("show-notice");
		}, 1200);

		const infoSound = new Audio("sounds/info.ogg");
		infoSound.play();
	}

	function getAndPopulateQuestList() {
		var location = getLocation();
		var version = `mh${getMHVersion()}`;

		rouletteForm.classList.add("show-spinner");

		getJSON(`/quest-list?v=${version}&l=${location}`, (quests) => {
			setTimeout(() => {
				populateForm(quests);
			}, SPINNER_DELAY);
		});
	}

	const refreshButton = document.getElementById("refresh-button");
	refreshButton.addEventListener("click", getAndPopulateQuestList);
	document.body.addEventListener("g-toggle", getAndPopulateQuestList);
	getAndPopulateQuestList();

	// Toggle quest details when clicking label
	document.body.addEventListener("click", (event) => {
		if (event.target.name == "quest") {
			var questDetails = document.getElementById(`quest-details-${event.target.dataset.rank}-${event.target.dataset.index}`);
			questDetails.open = !questDetails.open;
		}
	});

	function getCheckedQuest() {
		var questRadios = document.getElementsByName("quest");
		for (var i = 0; i < questRadios.length; i++) {
			if (questRadios[i].checked) {
				return questRadios[i];
			}
		}

		return false;
	}

	const carveResults = document.getElementById("carve-results");
	const rewardResults = document.getElementById("reward-results");
	function populateResults(results) {
		if (results.carves.length) {
			carveResults.innerHTML = results.carves.map((monsterCarves) => {
				var listItems = monsterCarves.m.map((material) => {
					return `
						<li class="drop-in-container">
							<div class="drop-in-content">- ${material}</div>
						</li>`;
				}).join("");

				var tailCarves = "";
				if (monsterCarves.t.length != 0) {
					tailCarves = "<h3>Tail</h3><ul>" + monsterCarves.t.map((material) => {
						return `
							<li class="drop-in-container">
								<div class="drop-in-content">- ${material}</div>
							</li>`;
					}).join("") + "</ul>";
				}

				return `
					<div class="monster-carves">
						<h3>${monsterCarves.n}</h3>
						<ul>${listItems}</ul>
						${tailCarves}
					</div>`;
			}).join("");
		}
		else {
			carveResults.innerHTML = "none";
		}

		rewardResults.innerHTML = results.rewards.map((reward) => {
			return `
				<li class="drop-in-container">
					<div class="drop-in-content">- ${reward.name} &times; ${reward.quantity}</div>
				</li>`;
		}).join("");

		const BASE_DELAY = 150;
		var delay = BASE_DELAY;
		window.eachElementByClassName("drop-in-container", (element) => {
			var child = element.children[0];

			setTimeout(() => {
				child.classList.add("dropped-in");
			}, delay);

			delay += 100;
		});

		setTimeout(() => {
			const itemGet = new Audio("sounds/item_get.ogg");
			itemGet.play();
		}, BASE_DELAY);
	}
	rouletteForm.addEventListener("submit", (event) => {
		event.preventDefault();

		const resultsContainer = document.getElementById("results-container");
		resultsContainer.classList.add("show-spinner");

		var checkedQuest = getCheckedQuest();
		if (checkedQuest) {
			carveResults.innerHTML = "";
			rewardResults.innerHTML = "";

			var version = getMHVersion();
			var largeMonsters = [];

			var details = document.getElementById(`quest-details-${checkedQuest.dataset.rank}-${checkedQuest.dataset.index}`);
			var largeMonsterChecks = details.getElementsByClassName("large-monster");
			for (var i = 0; i < largeMonsterChecks.length; i++) {
				if (largeMonsterChecks[i].checked) {
					largeMonsters.push(largeMonsterChecks[i].value);
				}
			}

			var luckRadios = document.getElementsByName(`luck_${version}`);
			var luck = 0;
			for (var i = 0; i < luckRadios.length; i++) {
				if (luckRadios[i].checked) {
					luck = luckRadios[i].value;
					break;
				}
			}

			var parameters = [
				"v=" + version,
				"l=" + getLocation(),
				"r=" + checkedQuest.dataset.rank,
				"i=" + checkedQuest.dataset.index,
				"m=" + encodeURIComponent(largeMonsters.join("+")),
				"k=" + luck,
				"p=" + document.getElementById("pet-the-poogie").checked ? "1" : "0"
			];

			getJSON(`/quest-results?${parameters.join("&")}`, (carveResults) => {
				setTimeout(() => {
					resultsContainer.classList.remove("show-spinner");
					populateResults(carveResults);
				}, SPINNER_DELAY);
			});
		}
	});
});
