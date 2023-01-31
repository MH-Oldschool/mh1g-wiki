ready(() => {
	document.body.addEventListener("g-toggle", () => {
		if (getMHVersion() == "1") {
			// close any open mhg-only branches
			document.querySelectorAll(".mhg.branch.open").forEach((element) => {
				element.classList.remove("open");
			});
		}
		else {
			// open any mhg-only branches that were open before
			document.querySelectorAll(".branch-button.mhg.open").forEach((element) => {
				toggleBranch(element, true);
			});
			// Be sure to toggle the handicraft class on the weapon calculator etc.
			toggleHandicraftSkill(handicraft.checked);
		}

		// Hide the calculator, since some weapons just won't be there in the other version
		calculator.classList.remove("show");

		updateCalcSharpnessMax();
	});

	var rankFilterLabels = document.getElementById("rank-filters").getElementsByClassName("range-label");
	function setRank(rankIndex) {
		toggleHighRank(rankIndex > 0);
		toggleGRank(rankIndex == 2);

		for (var i = 0; i < 3; i++) {
			if (i <= rankIndex) {
				rankFilterLabels[i].classList.add("highlighted");
			}
			else {
				rankFilterLabels[i].classList.remove("highlighted");
			}
		}
	}
	var rankFilter = document.getElementById("rank-filter");
	rankFilter.addEventListener("input", event => {
		setRank(event.target.value);
	});
	setRank(rankFilter.value);

	var meleeWeaponsContainer = document.getElementById("melee-weapons");
	var weaponElementChecks = document.getElementsByName("weapon-element-status");
	var weaponStatusElementAll = document.getElementById("weapon-status-element-all");
	function updateWeaponVisibility() {
		var filterWeapons = false;
		var anyUnchecked = false;

		for (var i = 0; i < weaponElementChecks.length; i++) {
			if (!filterWeapons && weaponElementChecks[i].checked) filterWeapons = true;
			if (!anyUnchecked && !weaponElementChecks[i].checked) anyUnchecked = true;
		}


		if (filterWeapons && anyUnchecked) {
			meleeWeaponsContainer.classList.add("filter-weapons");
			weaponStatusElementAll.checked = false;

			for (var i = 0; i < weaponElementChecks.length; i++) {
				if (weaponElementChecks[i].checked) {
					meleeWeaponsContainer.classList.add(weaponElementChecks[i].value);
				}
				else {
					meleeWeaponsContainer.classList.remove(weaponElementChecks[i].value);
				}
			}
		}
		else {
			meleeWeaponsContainer.classList.remove("filter-weapons");
			weaponStatusElementAll.checked = true;
		}
	}
	for (var i = 0; i < weaponElementChecks.length; i++) {
		weaponElementChecks[i].addEventListener("click", updateWeaponVisibility);
	}
	updateWeaponVisibility();
	weaponStatusElementAll.addEventListener("click", (event) => {
		for (var i = 0; i < weaponElementChecks.length; i++) {
			weaponElementChecks[i].checked = event.target.checked;
		}

		meleeWeaponsContainer.classList.remove("highlight-fire", "highlight-water", "highlight-thunder", "highlight-dragon", "highlight-poison", "highlight-paralysis", "highlight-sleep");

		if (event.target.checked) {
			meleeWeaponsContainer.classList.remove("filter-weapons");
		}
		else {
			meleeWeaponsContainer.classList.add("filter-weapons");
		}
	});

	// Filter Bowguns by Ammo
	var lbg1 = document.getElementById("lbg-1");
	var hbg1 = document.getElementById("hbg-1");
	var ammoAll1 = document.getElementById("ammo-all-1");
	var ammoChecks1 = document.getElementsByName("ammo_1");

	function updateBowgun1Visibility() {
		var filterBowguns = false;
		var anyUnchecked = false;

		for (var i = 0; i < ammoChecks1.length; i++) {
			if (!filterBowguns && ammoChecks1[i].checked) filterBowguns = true;
			if (!anyUnchecked && !ammoChecks1[i].checked) anyUnchecked = true;
		}


		if (filterBowguns && anyUnchecked) {
			lbg1.classList.add("filter-bowguns");
			hbg1.classList.add("filter-bowguns");

			ammoAll1.checked = false;

			for (var i = 0; i < ammoChecks1.length; i++) {
				if (ammoChecks1[i].checked) {
					lbg1.classList.add(ammoChecks1[i].value);
					hbg1.classList.add(ammoChecks1[i].value);
				}
				else {
					lbg1.classList.remove(ammoChecks1[i].value);
					hbg1.classList.remove(ammoChecks1[i].value);
				}
			}
		}
		else {
			lbg1.classList.remove("filter-bowguns");
			hbg1.classList.remove("filter-bowguns");
			ammoAll1.checked = true;
		}
	}
	for (var i = 0; i < ammoChecks1.length; i++) {
		ammoChecks1[i].addEventListener("click", updateBowgun1Visibility);
	}
	updateBowgun1Visibility();
	ammoAll1.addEventListener("click", (event) => {
		for (var i = 0; i < ammoChecks1.length; i++) {
			ammoChecks1[i].checked = event.target.checked;
		}

		lbg1.classList.remove("show-nrm-1", "show-nrm-3", "show-prc-1", "show-prc-2", "show-prc-3", "show-pllt-1", "show-pllt-2", "show-pllt-3", "show-crag-1", "show-crag-2", "show-crag-3", "show-clust-1", "show-clust-2", "show-clust-3", "show-disc", "show-rec-1", "show-rec-2", "show-poi-1", "show-poi-2", "show-stun-1", "show-stun-2", "show-slp-1", "show-slp-2", "show-anti", "show-demon", "show-armor", "show-dragon", "show-dung");
		hbg1.classList.remove("show-nrm-1", "show-nrm-3", "show-prc-1", "show-prc-2", "show-prc-3", "show-pllt-1", "show-pllt-2", "show-pllt-3", "show-crag-1", "show-crag-2", "show-crag-3", "show-clust-1", "show-clust-2", "show-clust-3", "show-disc", "show-rec-1", "show-rec-2", "show-poi-1", "show-poi-2", "show-stun-1", "show-stun-2", "show-slp-1", "show-slp-2", "show-anti", "show-demon", "show-armor", "show-dragon", "show-dung");

		if (event.target.checked) {
			lbg1.classList.remove("filter-bowguns");
			hbg1.classList.remove("filter-bowguns");
		}
		else {
			lbg1.classList.add("filter-bowguns");
			hbg1.classList.add("filter-bowguns");
		}
	});

	var lbgG = document.getElementById("lbg-g");
	var hbgG = document.getElementById("hbg-g");
	var ammoAllG = document.getElementById("ammo-all-g");
	var ammoChecksG = document.getElementsByName("ammo_g");
	function updateGBowgunVisibility() {
		var filterBowguns = false;
		var anyUnchecked = false;

		for (var i = 0; i < ammoChecksG.length; i++) {
			if (!filterBowguns && ammoChecksG[i].checked) filterBowguns = true;
			if (!anyUnchecked && !ammoChecksG[i].checked) anyUnchecked = true;
		}


		if (filterBowguns && anyUnchecked) {
			lbgG.classList.add("filter-bowguns");
			hbgG.classList.add("filter-bowguns");

			ammoAllG.checked = false;

			for (var i = 0; i < ammoChecksG.length; i++) {
				if (ammoChecksG[i].checked) {
					lbgG.classList.add(ammoChecksG[i].value);
					hbgG.classList.add(ammoChecksG[i].value);
				}
				else {
					lbgG.classList.remove(ammoChecksG[i].value);
					hbgG.classList.remove(ammoChecksG[i].value);
				}
			}
		}
		else {
			lbgG.classList.remove("filter-bowguns");
			hbgG.classList.remove("filter-bowguns");
			ammoAllG.checked = true;
		}
	}
	for (var i = 0; i < ammoChecksG.length; i++) {
		ammoChecksG[i].addEventListener("click", updateGBowgunVisibility);
	}
	updateGBowgunVisibility();
	ammoAllG.addEventListener("click", (event) => {
		for (var i = 0; i < ammoChecksG.length; i++) {
			ammoChecksG[i].checked = event.target.checked;
		}

		lbgG.classList.remove("show-nrm-1","show-nrm-3","show-prc-1","show-prc-2","show-prc-3","show-pllt-1","show-pllt-2","show-pllt-3","show-crag-1","show-crag-2","show-crag-3","show-clust-1","show-clust-2","show-clust-3","show-flame","show-water","show-thunder","show-dragon","show-rec-1","show-rec-2","show-poi-1","show-poi-2","show-stun-1","show-stun-2","show-slp-1","show-slp-2","show-anti","show-demon");
		hbgG.classList.remove("show-nrm-1","show-nrm-3","show-prc-1","show-prc-2","show-prc-3","show-pllt-1","show-pllt-2","show-pllt-3","show-crag-1","show-crag-2","show-crag-3","show-clust-1","show-clust-2","show-clust-3","show-flame","show-water","show-thunder","show-dragon","show-rec-1","show-rec-2","show-poi-1","show-poi-2","show-stun-1","show-stun-2","show-slp-1","show-slp-2","show-anti","show-demon");

		if (event.target.checked) {
			lbgG.classList.remove("filter-bowguns");
			hbgG.classList.remove("filter-bowguns");
		}
		else {
			lbgG.classList.add("filter-bowguns");
			hbgG.classList.add("filter-bowguns");
		}
	});

	var toggleBranchButton = (branchButton, open) => {
		if (open) {
			branchButton.classList.add("open");
		}
		else {
			branchButton.classList.remove("open");
		}
		branchButton.dataset.open = open ? "1" : "0";
	}

	var toggleBranchBody = (branchBody, open) => {
		if (open) {
			branchBody.classList.add("open");
		}
		else {
			branchBody.classList.remove("open");
		}

		if (!open && branchBody.dataset.childBranch) {
			if (branchBody.dataset.childBranch[0] === ".") {
				var childBranches = document.getElementsByClassName(branchBody.dataset.childBranch.substring(1));
				for (var i = 0; i < childBranches.length; i++) {
					toggleBranchBody(childBranches[i], false);
				}
			}
			else {
				var childBranch = document.getElementById(branchBody.dataset.childBranch);
				toggleBranchBody(childBranch, false);
			}

			// Also toggle the button state
			var branchButtons = branchBody.getElementsByClassName("branch-button");
			for (var i = 0; i < branchButtons.length; i++) {
				toggleBranchButton(branchButtons[i], false);
			}
		}
	}

	var toggleBranch = (branchButton, open) => {
		toggleBranchButton(branchButton, open);

		if (branchButton.dataset.target[0] == ".") {
			var branchBodies = document.getElementsByClassName(branchButton.dataset.target.substring(1));
			for (var i = 0; i < branchBodies.length; i++) {
				toggleBranchBody(branchBodies[i], open);
			}
		}
		else {
			var branchBody = document.getElementById(branchButton.dataset.target);
			toggleBranchBody(branchBody, open);
		}
	}
	var handleBranchButtonClick = (event) => {
		var open = event.currentTarget.dataset.open !== "1";
		toggleBranch(event.currentTarget, open);
	}

	var branchButtons = document.getElementsByClassName("branch-button");
	for (var i = 0; i < branchButtons.length; i++) {
		branchButtons[i].addEventListener("click", handleBranchButtonClick);
	}

	var openDetailsUpward = (details) => {
		details.open = true;
		if (details.parentElement.tagName == "DETAILS") {
			openDetailsUpward(details.parentElement);
		}
	}

	var handleToggleAllClick = (event) => {
		var isOpen = event.currentTarget.dataset.open == "1";

		var branchContainer = document.getElementById(event.currentTarget.dataset.target);
		var branchButtons = branchContainer.getElementsByClassName("branch-button");
		for (var i = 0; i < branchButtons.length; i++) {
			toggleBranch(branchButtons[i], !isOpen);
		}
		branchContainer.open = !isOpen;

		if (isOpen) {
			event.currentTarget.classList.remove("open");
		}
		else {
			event.currentTarget.classList.add("open");
		}
		event.currentTarget.dataset.open = isOpen ? "0" : "1";
	}
	var toggleAllButtons = document.getElementsByClassName("toggle-all-button");
	for (var i = 0; i < toggleAllButtons.length; i++) {
		toggleAllButtons[i].addEventListener("click", handleToggleAllClick);
	}

	var handleAnchorClick = (event) => {
		event.preventDefault();

		var targetElement = document.getElementById(event.currentTarget.dataset.target);
		if (targetElement) {
			openDetailsUpward(targetElement);
			scrollToElement(targetElement);
		}

		return false;
	}

	function toggleEverything(toggleOn) {
		window.eachElementByClassName("branch-button", (element) => {
			toggleBranch(element, toggleOn);
		});

		window.eachElementByClassName("weapon-group-container", (element) => {
			element.open = toggleOn;
		});

		window.eachElementByClassName("weapon-class-container", (element) => {
			element.open = toggleOn;
		});
	}
	var toggleEverythingCheck = document.getElementById("toggle-everything")
	toggleEverythingCheck.addEventListener("click", (event) => {
		toggleEverything(toggleEverythingCheck.checked);
	});
	if (toggleEverythingCheck.checked) {
		toggleEverything(true);
	}

	var anchors = document.getElementsByTagName("A");
	for (var i = 0; i < anchors.length; i++) {
		if (anchors[i].dataset.target) {
			anchors[i].addEventListener("click", handleAnchorClick);
		}
	}

	function toggleRangeStat(toggleOn) {
		if (toggleOn) {
			document.body.classList.add("show-range-stat");
		}
		else {
			document.body.classList.remove("show-range-stat");
		}
	}
	var showRangeStat = document.getElementById("show-range-stat");
	showRangeStat.addEventListener("click", (event) => {
		toggleRangeStat(event.target.checked);
	});
	toggleRangeStat(showRangeStat.checked);

	// Damage Calculator
	const BLOAT_VALUES = {
		greatswords: 4.8,
		hammers: 5.2,
		lances: 2.3,
		swords: 1.4,
		dualSwords: 1.4,
		bowguns: 1.2
	};
	const SPECIAL_ATTACK_MOD = 1.125;

	const calculator = document.getElementById("damage-calculator");
	const calculatorButton = document.getElementById("toggle-damage-calculator");

	function toggleCalculator() {
		if (calculator.classList.contains("expanded")) {
			calculator.classList.remove("expanded");
		}
		else {
			calculator.classList.add("expanded");
		}
	}
	calculatorButton.addEventListener("click", function() {
		toggleCalculator();
	});

	const weaponAttack = document.getElementById("calc-weapon-attack");
	const weaponElement = document.getElementById("calc-weapon-element");
	const weaponStatus = document.getElementById("calc-weapon-status");

	const handicraft = document.getElementById("calc-handicraft");
	const specialAttack = document.getElementById("calc-special-attack");

	const calcSharpness = document.getElementById("calc-sharpness");
	const calcSharpnessContext = document.getElementById("calc-sharpness-canvas").getContext("2d");
	var currentCategory, currentWeapon;
	function updateCalcSharpnessMax() {
		if (getMHVersion() == "1") {
			calcSharpness.max = "89";
		}
		else {
			calcSharpness.max = "118";
		}
	}
	updateCalcSharpnessMax();

	function getIconColor(rarity) {
		switch (rarity) {
			case 4: return "green";
			case 5: return "red";
			case 6: return "blue";
			case 7: return "orange";
			default: return "white";
		}
	}

	function getSharpnessModifier(type) {
		const SHARPNESS_MODS = {
			"raw": [
				0.5,
				0.75,
				1.0,
				1.125,
				1.25,
				1.5
			],
			"attribute": [
				0.25,
				0.5,
				0.75,
				1.0,
				1.0625,
				1.125
			]
		};
		var sharpnessLevel = getSharpnessAtValue(calcSharpness.value);

		return SHARPNESS_MODS[type][sharpnessLevel];
	}

	var calcSharpnessColor = document.getElementById("calc-sharpness-color");
	function getSharpnessFromColors(red, green, blue, alpha) {
		if (alpha === 0) {
			return -1;
		}
		else if (red === 238) {
			if (green === 0) {
				return 0;
			}
			else if (green === 160) {
				return 1;
			}
			else if (green === 238) {
				return 2;
			}
		}
		else if (red === 0) {
			if (green === 238) {
				return 3;
			}
			else if (green === 0 && blue === 255) {
				return 4;
			}
		}
		else if (red === 255 && green === 255 && blue === 255) {
			return 5;
		}

		return -1;
	}
	function getSharpnessAtValue(value) {
		/*
			Sharpness Colors
			0 Red: #ee0000 (238, 0, 0)
			1 Orange: #eea000 (238, 160, 0)
			2 Yellow: #eeee00 (238, 238, 0)
			3 Green: #00ee00 (0, 238, 0)
			4 Blue: #0000ff (0, 0, 255)
			5 White: #ffffff (255, 255, 255)
		*/
		var version = getMHVersion();
		var yPos = (version == "g" && handicraft.checked) ? 1 : 0;
		var sharpnessData = calcSharpnessContext.getImageData(0, yPos, 120, 1);
		var red = 4 * value;
		var green = red + 1;
		var blue = red + 2;
		var alpha = red + 3;

		var sharpnessLevel = getSharpnessFromColors(sharpnessData.data[red], sharpnessData.data[green], sharpnessData.data[blue], sharpnessData.data[alpha]);
		if (sharpnessLevel === -1) {
			// We're beyond the end of the sharpness range, in the black area
			// so we have to find the last point with a non-black, non-border color
			for (var i = value; i >= 0; i--) {
				if (getSharpnessFromColors(sharpnessData.data[red], sharpnessData.data[green], sharpnessData.data[blue], sharpnessData.data[alpha]) !== -1) {
					// This should be safe?
					return getSharpnessAtValue(i);
				}
				red -= 4;
				green -= 4;
				blue -= 4;
				alpha -= 4;
			}
		}

		return sharpnessLevel;
	}
	function updateSharpnessColor(value) {
		var sharpness = getSharpnessAtValue(value);
		calcSharpnessColor.className = `sharpness-${sharpness}`;
	}

	function setSharpnessHitCounts() {
		const CALC_HIT_COUNTS = document.getElementsByClassName("calc-hit-count");
		var maxHits = (calcSharpness.max / 3) * 10;

		// 10 hits every three pixels
		var sharpnessLevel = 0;
		var hitsPerLevel = [ 0, 0, 0, 0, 0, 0 ];
		var version = getMHVersion();
		var yPos = (version == "g" && handicraft.checked) ? 1 : 0;

		var sharpnessData = calcSharpnessContext.getImageData(0, yPos, 120, 1);
		var red, green, blue;
		for (var i = 0; i < calcSharpness.max; i += 3) {
			red = 4 * i;

			var newLevel = getSharpnessFromColors(sharpnessData.data[red], sharpnessData.data[red + 1], sharpnessData.data[red + 2], sharpnessData.data[red + 3]);
			if (newLevel === -1) {
				break;
			}

			if (newLevel != sharpnessLevel) {
				sharpnessLevel = newLevel;
			}

			hitsPerLevel[sharpnessLevel] += 10;
		}

		for (var i = 0; i < CALC_HIT_COUNTS.length; i++) {
			CALC_HIT_COUNTS[i].style.display = hitsPerLevel[i] === 0 ? "none" : "";
			CALC_HIT_COUNTS[i].style.width = `${100 * hitsPerLevel[i] / maxHits}%`;
			CALC_HIT_COUNTS[i].innerText = hitsPerLevel[i];
		}
	}

	// Calculate damage from motion values
	function updateWeaponDamage() {
		const trueElement = document.getElementById("calc-true-element");
		const trueStatus = document.getElementById("calc-true-status");
		const weaponElementIcon = document.getElementById("calc-weapon-element-icon");
		const weaponStatusIcon = document.getElementById("calc-weapon-status-icon");
		const motionValues = {
			greatswords: {
				raw: document.querySelectorAll(".greatsword-mvs .attack-raw"),
				element: document.querySelectorAll(".greatsword-mvs .attack-element"),
				status: document.querySelectorAll(".greatsword-mvs .attack-status")
			},
			hammers: {
				raw: document.querySelectorAll(".hammer-mvs .attack-raw"),
				element: document.querySelectorAll(".hammer-mvs .attack-element"),
				status: document.querySelectorAll(".hammer-mvs .attack-status")
			},
			lances: {
				raw: document.querySelectorAll(".lance-mvs .attack-raw"),
				element: document.querySelectorAll(".lance-mvs .attack-element"),
				status: document.querySelectorAll(".lance-mvs .attack-status")
			},
			swords: {
				raw: document.querySelectorAll(".sword-mvs .attack-raw"),
				element: document.querySelectorAll(".sword-mvs .attack-element"),
				status: document.querySelectorAll(".sword-mvs .attack-status")
			},
			dualSwords: {
				raw: document.querySelectorAll(".dual-swords-mvs .attack-raw"),
				element: document.querySelectorAll(".dual-swords-mvs .attack-element"),
				status: document.querySelectorAll(".dual-swords-mvs .attack-status")
			}
		};

		const kickAttack = document.getElementById("kick-raw");
		var kickMV = parseFloat(kickAttack.dataset.value);

		const SHOT_UP_MOD = 1.1;

		const bowgunShotRows = document.getElementsByClassName("bowgun-shot-row");
		const bowgunShotPower = document.getElementsByClassName("bowgun-shot-power");
		const bowgunShotAttribute = document.getElementsByClassName("bowgun-shot-attribute");
		const ammoFireAttribute = document.getElementById("ammo-fire-attribute");
		const ammoWaterAttribute = document.getElementById("ammo-water-attribute");
		const ammoThunderAttribute = document.getElementById("ammo-thunder-attribute");
		const BOWGUN_ELEMENT_MODS = {
			fire: 0.4,
			water: 0.1,
			thunder: 0.2
		};

		if (!currentCategory || !currentWeapon) {
			return;
		}

		var attackUpBonus = getAttackUpBonus();
		var bloatedBonus = parseInt(BLOAT_VALUES[currentCategory] * attackUpBonus); // I think decimals get truncated?

		var trueDamage, trueDamage1, trueDamageG;
		if (currentWeapon.damage) {
			trueDamage = getWeaponDamage(currentWeapon.damage, currentCategory);
		}
		if (currentWeapon.damage1) {
			trueDamage1 = getWeaponDamage(currentWeapon.damage1, currentCategory);
		}
		if (currentWeapon.damageG) {
			trueDamageG = getWeaponDamage(currentWeapon.damageG, currentCategory);
		}

		if (currentCategory == "bowguns") {
			weaponElement.parentElement.style.display = "none";
			weaponStatus.parentElement.style.display = "none";

			var damage = currentWeapon.damage;
			if (!currentWeapon.damage) {
				damage = currentWeapon[`damage${getMHVersion().toUpperCase()}`];
			}

			var minDamage = getWeaponDamage(damage[0], "bowguns") + attackUpBonus;
			var maxDamage = getWeaponDamage(damage[1], "bowguns") + attackUpBonus;

			if (bloatedBonus) {
				weaponAttack.innerHTML = `${parseInt(damage[0]) + bloatedBonus}&nbsp;-&nbsp;${parseInt(damage[1]) + bloatedBonus} (+${bloatedBonus}) [${minDamage}&nbsp;-&nbsp;${maxDamage}]`;
			}
			else {
				weaponAttack.innerHTML = `${damage[0]}&nbsp;-&nbsp;${damage[1]} [${minDamage}&nbsp;-&nbsp;${maxDamage}]`;
			}

			var shotMin, shotMax = 0.0;
			for (var i = 0; i < bowgunShotRows.length; i++) {
				var power = bowgunShotRows[i].dataset.power;
				shotMin = minDamage * power;
				shotMax = maxDamage * power;

				// Apply 1.5 critical range modifier for Normal and Pierce shots (first 6)
				if (i < 6) {
					shotMin /= 2;
					shotMax *= 1.5;
				}

				// Apply Shot Up modifiers
				if (i < 3) {
					// Normal Shot
					if (normalShotUp.checked) {
						shotMin *= SHOT_UP_MOD;
						shotMax *= SHOT_UP_MOD;
					}
				}
				else if (i < 6) {
					// Pierce Shot
					if (pierceShotUp.checked) {
						shotMin *= SHOT_UP_MOD;
						shotMax *= SHOT_UP_MOD;
					}
				}
				else if (i < 9) {
					// Pellet Shot
					if (pelletShotUp.checked) {
						shotMin *= SHOT_UP_MOD;
						shotMax *= SHOT_UP_MOD;
					}
				}

				bowgunShotPower[i].innerHTML = power == 0 ? "0" : `${parseInt(shotMin)} - ${parseInt(shotMax)}`;

				if (bowgunShotAttribute[i].dataset.attribute == "poison" || bowgunShotAttribute[i].dataset.attribute == "paralysis" || bowgunShotAttribute[i].dataset.attribute == "sleep") {
					if (specialAttack.checked) {
						bowgunShotAttribute[i].innerHTML = parseInt(bowgunShotAttribute[i].dataset.attributeValue * SPECIAL_ATTACK_MOD);
					}
					else {
						bowgunShotAttribute[i].innerHTML = bowgunShotAttribute[i].dataset.attributeValue;
					}
				}
			}

			ammoFireAttribute.innerHTML = `${parseInt(minDamage * BOWGUN_ELEMENT_MODS.fire)} - ${parseInt(maxDamage * BOWGUN_ELEMENT_MODS.fire)}`;
			ammoWaterAttribute.innerHTML = `${parseInt(minDamage * BOWGUN_ELEMENT_MODS.water)} - ${parseInt(maxDamage * BOWGUN_ELEMENT_MODS.water)}`;
			ammoThunderAttribute.innerHTML = `${parseInt(minDamage * BOWGUN_ELEMENT_MODS.thunder)} - ${parseInt(maxDamage * BOWGUN_ELEMENT_MODS.thunder)}`;

			kickAttack.innerHTML = `${parseInt(minDamage * kickMV)} - ${parseInt(maxDamage * kickMV)}`;
		}
		else {
			if (currentWeapon.damage) {
				if (bloatedBonus) {
					weaponAttack.innerHTML = `${numberWithCommas(commaStringToNumber(currentWeapon.damage) + bloatedBonus)} (+${bloatedBonus}) [${Math.round(trueDamage + attackUpBonus)}]`;
				}
				else {
					weaponAttack.innerHTML = `${currentWeapon.damage} [${Math.round(trueDamage)}]`;
				}

				kickAttack.innerHTML = parseInt(trueDamage * kickMV + attackUpBonus);
			}
			else {
				if (bloatedBonus) {
					weaponAttack.innerHTML = `<span class="mh1">${numberWithCommas(commaStringToNumber(currentWeapon.damage1) + bloatedBonus)} [${Math.round(trueDamage1 + attackUpBonus)}]</span><span class="mhg">${numberWithCommas(commaStringToNumber(currentWeapon.damageG) + bloatedBonus)}</span> (+${bloatedBonus}) [${Math.round(trueDamageG + attackUpBonus)}]`;
				}
				else {
					weaponAttack.innerHTML = `<span class="mh1">${currentWeapon.damage1} [${Math.round(trueDamage1)}]</span><span class="mhg">${currentWeapon.damageG} [${Math.round(trueDamageG)}]</span>`;
				}

				kickAttack.innerHTML = `<span class="mh1">${parseInt(trueDamage1 * kickMV + attackUpBonus)}</span><span class="mhg">${parseInt(trueDamageG * kickMV + attackUpBonus)}</span>`;
			}

			motionValues[currentCategory].raw.forEach(function(element) {
				if (element.dataset.value) {
					if (trueDamage) {
						element.innerHTML = (parseInt((trueDamage + attackUpBonus) * element.dataset.value) / 100).toFixed(0);
					}
					else {
						var motionDamage1 = (parseInt((trueDamage1 + attackUpBonus) * element.dataset.value) / 100).toFixed(0);
						var motionDamageG = (parseInt((trueDamageG + attackUpBonus) * element.dataset.value) / 100).toFixed(0);
						element.innerHTML = `<span class="mh1">${motionDamage1}</span><span class="mhg">${motionDamageG}</span>`;
					}
				}
				else {
					var motionDamage1, motionDamageG;

					if (trueDamage) {
						motionDamage1 = (parseInt((trueDamage + attackUpBonus) * element.dataset["value-1"]) / 100).toFixed(0);
						motionDamageG = (parseInt((trueDamage + attackUpBonus) * element.dataset.valueG) / 100).toFixed(0);
					}
					else {
						motionDamage1 = (parseInt((trueDamage1 + attackUpBonus) * element.dataset["value-1"]) / 100).toFixed(0);
						motionDamageG = (parseInt((trueDamageG + attackUpBonus) * element.dataset.valueG) / 100).toFixed(0);
					}

					element.innerHTML = `<span class="mh1">${motionDamage1}</span><span class="mhg">${motionDamageG}</span>`;
				}
			});

			var hasElement = currentWeapon.attribute == "fire" || currentWeapon.attribute == "water" || currentWeapon.attribute == "thunder" || currentWeapon.attribute == "dragon";
			var hasStatus = currentWeapon.attribute == "poison" || currentWeapon.attribute == "paralysis" || currentWeapon.attribute == "sleep";

			var isMHG = getMHVersion() == "g";
			var attribute = currentWeapon.attributeValue;
			if (!currentWeapon.attributeValue) {
				attribute = isMHG ? currentWeapon.attributeValueG : currentWeapon.attributeValue1;
			}

			var trueAttribute = 0;
			if (attribute) {
				if (hasStatus && getMHVersion() == "g" && specialAttack.checked) {
					attribute *= SPECIAL_ATTACK_MOD;
				}

				trueAttribute = attribute / 10;

				// Sharpness doesn't affect attribute in MH1J, whoops!
				if (getMHVersion() == "g" && hasElement) {
					trueAttribute *= getSharpnessModifier("attribute");
				}
			}

			if (hasElement) {
				weaponElement.innerHTML = parseInt(attribute);
				trueElement.innerText = parseInt(trueAttribute);
				weaponElementIcon.src = `images/attributes/${currentWeapon.attribute}.png`;
				weaponElementIcon.alt = weaponElementIcon.title = currentWeapon.attributeAlt;
			}
			else if (hasStatus) {
				weaponStatus.innerHTML = parseInt(attribute);
				trueStatus.innerText = parseInt(trueAttribute);
				weaponStatusIcon.src = `images/attributes/${currentWeapon.attribute}.png`;
				weaponStatusIcon.alt = weaponStatusIcon.title = currentWeapon.attributeAlt;
			}
			weaponElement.parentElement.style.display = hasElement ? "" : "none";
			weaponStatus.parentElement.style.display = hasStatus ? "" : "none";

			setSharpnessHitCounts();
		}
	}

	const attackUpFoodSmall = document.getElementById("calc-food-attack-up-small");
	const attackUpFoodMedium = document.getElementById("calc-food-attack-up-medium");
	const attackUpFoodLarge = document.getElementById("calc-food-attack-up-large");
	const attackUpFoodExtra = document.getElementById("calc-food-attack-up-extra");
	const attackUpItem = document.getElementById("calc-item-attack-up");

	const attackUpSmall = document.getElementById("calc-attack-up-small");
	const attackUpMedium = document.getElementById("calc-attack-up-medium");
	const attackUpLarge = document.getElementById("calc-attack-up-large");
	const powercharm = document.getElementById("calc-powercharm");
	const powertalon = document.getElementById("calc-powertalon");

	const normalShotUp = document.getElementById("calc-normal-shot-up");
	const pierceShotUp = document.getElementById("calc-pierce-shot-up");
	const pelletShotUp = document.getElementById("calc-pellet-shot-up");

	document.getElementById("calc-food-attack-up-none").addEventListener("change", updateWeaponDamage);
	attackUpFoodSmall.addEventListener("change", updateWeaponDamage);
	attackUpFoodMedium.addEventListener("change", updateWeaponDamage);
	attackUpFoodLarge.addEventListener("change", updateWeaponDamage);
	attackUpFoodExtra.addEventListener("change", updateWeaponDamage);
	attackUpItem.addEventListener("change", updateWeaponDamage);

	document.getElementById("calc-attack-up-none").addEventListener("change", updateWeaponDamage);
	attackUpSmall.addEventListener("change", updateWeaponDamage);
	attackUpMedium.addEventListener("change", updateWeaponDamage);
	attackUpLarge.addEventListener("change", updateWeaponDamage);
	specialAttack.addEventListener("change", updateWeaponDamage);
	powercharm.addEventListener("change", updateWeaponDamage);
	powertalon.addEventListener("change", updateWeaponDamage);

	normalShotUp.addEventListener("change", updateWeaponDamage);
	pierceShotUp.addEventListener("change", updateWeaponDamage);
	pelletShotUp.addEventListener("change", updateWeaponDamage);

	function getAttackUpBonus() {
		var isVersionG = getMHVersion() == "g";
		var bonus = 0;

		if (attackUpFoodSmall.checked) {
			bonus += 3;
		}
		else if (attackUpFoodMedium.checked) {
			bonus += 5;
		}
		else if (attackUpFoodLarge.checked) {
			bonus += isVersionG ? 10 : 5;
		}
		else if (!isVersionG && attackUpFoodExtra.checked) {
			bonus += 10;
		}

		if (attackUpItem.checked) {
			bonus += 10;
		}

		if (attackUpSmall.checked) {
			bonus += 3;
		}
		else if (attackUpMedium.checked) {
			bonus += 5;
		}
		else if (attackUpLarge.checked) {
			bonus += isVersionG ? 10 : 5;
		}

		if (powercharm.checked) {
			bonus += 5;
		}
		if (isVersionG && powertalon.checked) {
			bonus += 10;
		}

		return bonus;
	}
	function getWeaponDamage(attack, category) {
		var damage = commaStringToNumber(attack);

		if (category != "bowguns") {
			damage *= getSharpnessModifier("raw");
		}

		return damage / BLOAT_VALUES[category];
	}

	calcSharpness.addEventListener("input", function(event) {
		window.requestAnimationFrame(function() {
			updateSharpnessColor(event.target.value);
			updateWeaponDamage(currentCategory, currentWeapon);
		});
	});

	function toggleHandicraftSkill(toggleOn) {
		if (toggleOn) {
			calculator.classList.add("handicraft");
		}
		else {
			calculator.classList.remove("handicraft");
		}

		setSharpnessHitCounts();
	}
	handicraft.addEventListener("change", function(event) {
		toggleHandicraftSkill(event.target.checked);
		updateSharpnessColor(calcSharpness.value);
		updateWeaponDamage(currentCategory, currentWeapon);
	});
	toggleHandicraftSkill(handicraft.checked);

	const weaponName = document.getElementById("calc-weapon-name");
	const weaponIcon = document.getElementById("calc-weapon-icon");
	const sidebarContent = document.getElementById("sidebar-content")

	function populateBlademasterCalculator(weaponID, category) {
		const ICON_NAMES = {
			greatswords: "gs",
			hammers: "hammer",
			lances: "lance",
			swords: "sns",
			dualSwords: "duals"
		};
		const calculatorClasses = {
			greatswords: "greatsword",
			hammers: "hammer",
			lances: "lance",
			swords: "sword",
			dualSwords: "dual-swords"
		};

		const weaponSharpness = document.getElementById("calc-sharpness-img");

		sidebarContent.className = calculatorClasses[category];
		currentCategory = category;
		currentWeapon = window[category][weaponID];

		weaponName.innerHTML = currentWeapon.name;
		weaponIcon.className = `${getIconColor(currentWeapon.rarity)}-icon ${ICON_NAMES[category]}-icon`;

		weaponSharpness.addEventListener("load", () => {
			// Draw normal and handicraft sharpness bars
			calcSharpnessContext.drawImage(weaponSharpness, 1, 1, 119, 1, 0, 0, 119, 1);
			calcSharpnessContext.drawImage(weaponSharpness, 1, 10, 119, 1, 0, 1, 119, 1);
			calcSharpness.value = calcSharpness.max;
			updateSharpnessColor(calcSharpness.value);

			updateWeaponDamage();

			if (!calculator.classList.contains("show")) {
				calculator.classList.add("show");
			}
		}, { once: true });

		weaponSharpness.src = `images/${currentWeapon.sharpness}_${getMHVersion().toUpperCase()}.gif`;
	}
	function populateGunnerCalculator(element) {
		var selectedButton = document.querySelector(".weapon-button.selected");
		if (selectedButton) {
			selectedButton.classList.remove("selected");
		}
		element.classList.add("selected");

		var weaponID = element.dataset.id;
		sidebarContent.className = "bowgun";
		currentCategory = "bowguns";
		currentWeapon = window.bowguns[weaponID];

		weaponName.innerHTML = currentWeapon.name;
		weaponIcon.className = `${getIconColor(currentWeapon.rarity)}-icon ${currentWeapon.icon}-icon`;

		updateWeaponDamage();
		var version = getMHVersion().toUpperCase();
		var ammoName = "";

		// Add shot classes for available ammo
		const TWO_LEVEL_AMMO = ["recover","poison","stun","sleep"];
		for (var i = 0; i < 2; i++) {
			for (var ammoIndex = 0; ammoIndex < TWO_LEVEL_AMMO.length; ammoIndex++) {
				ammoName = TWO_LEVEL_AMMO[ammoIndex];
				if (!currentWeapon[ammoName]) {
					ammoName = `${TWO_LEVEL_AMMO[ammoIndex]}${version}`;
				}

				if (currentWeapon[ammoName][i] != 0) {
					sidebarContent.classList.add(`${TWO_LEVEL_AMMO[ammoIndex]}-${i + 1}-shot`);
				}
			}
		}

		const THREE_LEVEL_AMMO = ["normal","pierce","pellet","crag","clust"];
		for (var i = 0; i < 3; i++) {
			for (var ammoIndex = 0; ammoIndex < THREE_LEVEL_AMMO.length; ammoIndex++) {
				ammoName = THREE_LEVEL_AMMO[ammoIndex];
				if (!currentWeapon[ammoName]) {
					ammoName = `${THREE_LEVEL_AMMO[ammoIndex]}${version}`;
				}

				if (currentWeapon[ammoName][i] != 0) {
					sidebarContent.classList.add(`${THREE_LEVEL_AMMO[ammoIndex]}-${i + 1}-shot`);
				}
			}
		}

		const OTHER_AMMO = [
			"disc",
			"flame",
			"water",
			"thunder",
			"dragon",
			"tranq",
			"paint",
			"antidote",
			"demon",
			"armor",
			"dung"
		];
		for (var i = 0; i < OTHER_AMMO.length; i++) {
			ammoName = OTHER_AMMO[i];
			if (!currentWeapon[ammoName]) {
				ammoName = `${OTHER_AMMO[i]}${version}`;
			}

			if (currentWeapon[ammoName] && currentWeapon[ammoName] != 0) {
				sidebarContent.classList.add(`${OTHER_AMMO[i]}-shot`);
			}
		}

		if (!calculator.classList.contains("show")) {
			calculator.classList.add("show");
		}
	}

	function handleGreatswordClick(event) {
		populateBlademasterCalculator(event.target.value, "greatswords");
	}
	document.querySelectorAll("#greatswords input[name=weapon]").forEach(function(element) {
		element.addEventListener("click", handleGreatswordClick);
	});

	function handleHammerClick(event) {
		populateBlademasterCalculator(event.target.value, "hammers");
	}
	document.querySelectorAll("#hammers input[name=weapon]").forEach(function(element) {
		element.addEventListener("click", handleHammerClick);
	});

	function handleLanceClick(event) {
		populateBlademasterCalculator(event.target.value, "lances");
	}
	document.querySelectorAll("#lances input[name=weapon]").forEach(function(element) {
		element.addEventListener("click", handleLanceClick);
	});

	function handleSwordClick(event) {
		populateBlademasterCalculator(event.target.value, "swords");
	}
	document.querySelectorAll("#swords input[name=weapon]").forEach(function(element) {
		element.addEventListener("click", handleSwordClick);
	});

	function handleDualSwordClick(event) {
		populateBlademasterCalculator(event.target.value, "dualSwords");
	}
	document.querySelectorAll("#dual-swords input[name=weapon]").forEach(function(element) {
		element.addEventListener("click", handleDualSwordClick);
	});

	function handleBowgunClick(event) {
		populateGunnerCalculator(event.target);
	}
	document.querySelectorAll("#ranged-weapons input[name=weapon]").forEach(function(element) {
		element.addEventListener("click", handleBowgunClick);
	});


	var searchInput = document.getElementById("search");
	function doesWeaponContainTerm(weaponRow, searchTerm) {
		return searchTerm.length === 0 || weaponRow.dataset.name.toLowerCase().indexOf(searchTerm) !== -1;
	}
	var weaponRows = document.getElementsByClassName("weapon-row");
	function filterBySearch() {
		var searchTerm = searchInput.value.toLowerCase();

		for (var i = 0; i < weaponRows.length; i++) {
			weaponRows[i].style.display = doesWeaponContainTerm(weaponRows[i], searchTerm) ? "" : "none";
		}
	}
	searchInput.addEventListener("keyup", (event) => {
		filterBySearch();
	});
	filterBySearch();
});
