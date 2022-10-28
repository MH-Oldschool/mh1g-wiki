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
				document.getElementById(element.dataset.target).classList.add("open");
			});
		}

		// Hide the calculator, since some weapons just won't be there in the other version
		var damageCalculator = document.getElementById("damage-calculator");
		damageCalculator.className = "";
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
	var lbgBase = document.getElementById("lbg-base");
	var hbgBase = document.getElementById("hbg-base");
	var baseAmmoAll = document.getElementById("base-ammo-all");
	var baseAmmoChecks = document.getElementsByName("ammo_base");

	function updateBaseBowgunVisibility() {
		var filterBowguns = false;
		var anyUnchecked = false;

		for (var i = 0; i < baseAmmoChecks.length; i++) {
			if (!filterBowguns && baseAmmoChecks[i].checked) filterBowguns = true;
			if (!anyUnchecked && !baseAmmoChecks[i].checked) anyUnchecked = true;
		}


		if (filterBowguns && anyUnchecked) {
			lbgBase.classList.add("filter-bowguns");
			hbgBase.classList.add("filter-bowguns");

			baseAmmoAll.checked = false;

			for (var i = 0; i < baseAmmoChecks.length; i++) {
				if (baseAmmoChecks[i].checked) {
					lbgBase.classList.add(baseAmmoChecks[i].value);
					hbgBase.classList.add(baseAmmoChecks[i].value);
				}
				else {
					lbgBase.classList.remove(baseAmmoChecks[i].value);
					hbgBase.classList.remove(baseAmmoChecks[i].value);
				}
			}
		}
		else {
			lbgBase.classList.remove("filter-bowguns");
			hbgBase.classList.remove("filter-bowguns");
			baseAmmoAll.checked = true;
		}
	}
	for (var i = 0; i < baseAmmoChecks.length; i++) {
		baseAmmoChecks[i].addEventListener("click", updateBaseBowgunVisibility);
	}
	updateBaseBowgunVisibility();
	baseAmmoAll.addEventListener("click", (event) => {
		for (var i = 0; i < baseAmmoChecks.length; i++) {
			baseAmmoChecks[i].checked = event.target.checked;
		}

		lbgBase.classList.remove("show-nrm-1", "show-nrm-3", "show-prc-1", "show-prc-2", "show-prc-3", "show-pllt-1", "show-pllt-2", "show-pllt-3", "show-crag-1", "show-crag-2", "show-crag-3", "show-clust-1", "show-clust-2", "show-clust-3", "show-disc", "show-rec-1", "show-rec-2", "show-poi-1", "show-poi-2", "show-stun-1", "show-stun-2", "show-slp-1", "show-slp-2", "show-anti", "show-demon", "show-armor", "show-dragon", "show-dung");
		hbgBase.classList.remove("show-nrm-1", "show-nrm-3", "show-prc-1", "show-prc-2", "show-prc-3", "show-pllt-1", "show-pllt-2", "show-pllt-3", "show-crag-1", "show-crag-2", "show-crag-3", "show-clust-1", "show-clust-2", "show-clust-3", "show-disc", "show-rec-1", "show-rec-2", "show-poi-1", "show-poi-2", "show-stun-1", "show-stun-2", "show-slp-1", "show-slp-2", "show-anti", "show-demon", "show-armor", "show-dragon", "show-dung");

		if (event.target.checked) {
			lbgBase.classList.remove("filter-bowguns");
			hbgBase.classList.remove("filter-bowguns");
		}
		else {
			lbgBase.classList.add("filter-bowguns");
			hbgBase.classList.add("filter-bowguns");
		}
	});

	var lbgG = document.getElementById("lbg-g");
	var hbgG = document.getElementById("hbg-g");
	var gAmmoAll = document.getElementById("g-ammo-all");
	var gAmmoChecks = document.getElementsByName("ammo_g");
	function updateGBowgunVisibility() {
		var filterBowguns = false;
		var anyUnchecked = false;

		for (var i = 0; i < gAmmoChecks.length; i++) {
			if (!filterBowguns && gAmmoChecks[i].checked) filterBowguns = true;
			if (!anyUnchecked && !gAmmoChecks[i].checked) anyUnchecked = true;
		}


		if (filterBowguns && anyUnchecked) {
			lbgG.classList.add("filter-bowguns");
			hbgG.classList.add("filter-bowguns");

			gAmmoAll.checked = false;

			for (var i = 0; i < gAmmoChecks.length; i++) {
				if (gAmmoChecks[i].checked) {
					lbgG.classList.add(gAmmoChecks[i].value);
					hbgG.classList.add(gAmmoChecks[i].value);
				}
				else {
					lbgG.classList.remove(gAmmoChecks[i].value);
					hbgG.classList.remove(gAmmoChecks[i].value);
				}
			}
		}
		else {
			lbgG.classList.remove("filter-bowguns");
			hbgG.classList.remove("filter-bowguns");
			gAmmoAll.checked = true;
		}
	}
	for (var i = 0; i < gAmmoChecks.length; i++) {
		gAmmoChecks[i].addEventListener("click", updateGBowgunVisibility);
	}
	updateGBowgunVisibility();
	gAmmoAll.addEventListener("click", (event) => {
		for (var i = 0; i < gAmmoChecks.length; i++) {
			gAmmoChecks[i].checked = event.target.checked;
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

	var anchors = document.getElementsByTagName("A");
	for (var i = 0; i < anchors.length; i++) {
		if (anchors[i].dataset.target) {
			anchors[i].addEventListener("click", handleAnchorClick);
		}
	}

	// Damage Calculator
	const BLOAT_VALUES = {
		greatswords: 4.8,
		hammers: 5.2,
		lances: 2.3,
		swords: 1.4,
		dualSwords: 1.4,
		bowguns: 1.2
	};

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

	function getIconColor(rare) {
		switch (rare) {
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

		// Transparent
		if (sharpnessData.data[blue + 1] === 0) {
			return;
		}

		if (sharpnessData.data[red] === 238) {
			if (sharpnessData.data[green] === 0) {
				return 0;
			}
			else if (sharpnessData.data[green] === 160) {
				return 1;
			}
			else if (sharpnessData.data[green] === 238) {
				return 2;
			}
		}
		else if (sharpnessData.data[red] === 0) {
			if (sharpnessData.data[green] === 238) {
				return 3;
			}
			else if (sharpnessData.data[green] === 0 && sharpnessData.data[blue] === 255) {
				return 4;
			}
			else {
				// TODO: set range max to current weapon's max sharpness?
				// We're beyond the end of the sharpness range, in the black area
				// so we have to find the last point with a non-black color
				for (var i = value; i >= 0; i--) {
					if (sharpnessData.data[red] !== 0 || sharpnessData.data[green] !== 0 || sharpnessData.data[blue] !== 0) {
						// This should be safe?
						return getSharpnessAtValue(i);
					}
					red -= 4;
					green -= 4;
					blue -= 4;
				}
			}
		}

		return 5;
	}
	function updateSharpnessColor(value) {
		var sharpness = getSharpnessAtValue(value);
		calcSharpnessColor.className = `sharpness-${sharpness}`;
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

		const bowgunShotRows = document.getElementsByClassName("bowgun-shot-row");
		const bowgunShotPower = document.getElementsByClassName("bowgun-shot-power");
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

		var trueDamage, trueBaseDamage, trueGDamage;
		if (currentWeapon.damage) {
			trueDamage = getWeaponDamage(currentWeapon.damage, currentCategory);
		}
		if (currentWeapon.baseDamage) {
			trueBaseDamage = getWeaponDamage(currentWeapon.baseDamage, currentCategory);
		}
		if (currentWeapon.gDamage) {
			trueGDamage = getWeaponDamage(currentWeapon.gDamage, currentCategory);
		}

		if (currentCategory == "bowguns") {
			weaponElement.parentElement.style.display = "none";
			weaponStatus.parentElement.style.display = "none";

			var splitDamage = currentWeapon.damage.match(/(^\d+) ?- ?(\d+)/);
			var minDamage = getWeaponDamage(splitDamage[1], "bowguns") + attackUpBonus;
			var maxDamage = getWeaponDamage(splitDamage[2], "bowguns") + attackUpBonus;

			if (bloatedBonus) {
				weaponAttack.innerHTML = `${parseInt(splitDamage[1]) + bloatedBonus} - ${parseInt(splitDamage[2]) + bloatedBonus} (+${bloatedBonus})`;
			}
			else {
				weaponAttack.innerHTML = currentWeapon.damage;
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

				bowgunShotPower[i].innerHTML = power == 0 ? "0" : `${parseInt(shotMin)} - ${parseInt(shotMax)}`;
			}

			ammoFireAttribute.innerHTML = `${parseInt(minDamage * BOWGUN_ELEMENT_MODS.fire)} - ${parseInt(maxDamage * BOWGUN_ELEMENT_MODS.fire)}`;
			ammoWaterAttribute.innerHTML = `${parseInt(minDamage * BOWGUN_ELEMENT_MODS.water)} - ${parseInt(maxDamage * BOWGUN_ELEMENT_MODS.water)}`;
			ammoThunderAttribute.innerHTML = `${parseInt(minDamage * BOWGUN_ELEMENT_MODS.thunder)} - ${parseInt(maxDamage * BOWGUN_ELEMENT_MODS.thunder)}`;
		}
		else {
			if (currentWeapon.damage) {
				if (bloatedBonus) {
					weaponAttack.innerHTML = `${numberWithCommas(commaStringToNumber(currentWeapon.damage) + bloatedBonus)} (+${bloatedBonus})`;
				}
				else {
					weaponAttack.innerHTML = currentWeapon.damage;
				}
			}
			else {
				if (bloatedBonus) {
					weaponAttack.innerHTML = `<span class="mh1">${numberWithCommas(commaStringToNumber(currentWeapon.baseDamage) + bloatedBonus)}</span><span class="mhg">${numberWithCommas(commaStringToNumber(currentWeapon.gDamage) + bloatedBonus)}</span> (+${bloatedBonus})`;
				}
				else {
					weaponAttack.innerHTML = `<span class="mh1">${currentWeapon.baseDamage}</span><span class="mhg">${currentWeapon.gDamage}</span>`;
				}
			}

			motionValues[currentCategory].raw.forEach(function(element) {
				if (element.dataset.value) {
					if (trueDamage) {
						element.innerHTML = (parseInt((trueDamage + attackUpBonus) * element.dataset.value) / 100).toFixed(0);
					}
					else {
						var baseMotionDamage = (parseInt((trueBaseDamage + attackUpBonus) * element.dataset.value) / 100).toFixed(0);
						var gMotionDamage = (parseInt((trueGDamage + attackUpBonus) * element.dataset.value) / 100).toFixed(0);
						element.innerHTML = `<span class="mh1">${baseMotionDamage}</span><span class="mhg">${gMotionDamage}</span>`;
					}
				}
				else {
					if (trueDamage) {
						element.innerHTML = (parseInt((trueDamage + attackUpBonus) * element.dataset.value) / 100).toFixed(0);
					}
					else {
						var baseMotionDamage = (parseInt((trueBaseDamage + attackUpBonus) * element.dataset.value1) / 100).toFixed(0);
						var gMotionDamage = (parseInt((trueGDamage + attackUpBonus) * element.dataset.valueG) / 100).toFixed(0);
						element.innerHTML = `<span class="mh1">${baseMotionDamage}</span><span class="mhg">${gMotionDamage}</span>`;
					}
				}
			});

			var hasElement = currentWeapon.attribute == "fire" || currentWeapon.attribute == "water" || currentWeapon.attribute == "thunder" || currentWeapon.attribute == "dragon";
			var hasStatus = currentWeapon.attribute == "poison" || currentWeapon.attribute == "paralysis" || currentWeapon.attribute == "sleep";

			var isMHG = getMHVersion() == "g";
			var attribute = currentWeapon.attributeValue;
			if (!currentWeapon.attributeValue) {
				attribute = isMHG ? currentWeapon.gAttribute : currentWeapon.baseAttribute;
			}

			var trueAttribute = 0;
			if (attribute) {
				if (hasStatus && getMHVersion() == "g" && specialAttack.checked) {
					attribute *= 1.125;
				}
				trueAttribute = getSharpnessModifier("attribute") * attribute / 10;
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
		}
	}

	const attackUpItemSmall = document.getElementById("calc-item-attack-up-small");
	const attackUpItemMedium = document.getElementById("calc-item-attack-up-medium");
	const attackUpItemLarge = document.getElementById("calc-item-attack-up-large");
	const attackUpItemExtra = document.getElementById("calc-item-attack-up-extra");

	const attackUpSmall = document.getElementById("calc-attack-up-small");
	const attackUpMedium = document.getElementById("calc-attack-up-medium");
	const attackUpLarge = document.getElementById("calc-attack-up-large");
	const powercharm = document.getElementById("calc-powercharm");
	const powertalon = document.getElementById("calc-powertalon");

	document.getElementById("calc-item-attack-up-none").addEventListener("change", updateWeaponDamage);
	attackUpItemSmall.addEventListener("change", updateWeaponDamage);
	attackUpItemMedium.addEventListener("change", updateWeaponDamage);
	attackUpItemLarge.addEventListener("change", updateWeaponDamage);
	attackUpItemExtra.addEventListener("change", updateWeaponDamage);

	document.getElementById("calc-attack-up-none").addEventListener("change", updateWeaponDamage);
	attackUpSmall.addEventListener("change", updateWeaponDamage);
	attackUpMedium.addEventListener("change", updateWeaponDamage);
	attackUpLarge.addEventListener("change", updateWeaponDamage);
	specialAttack.addEventListener("change", updateWeaponDamage);
	powercharm.addEventListener("change", updateWeaponDamage);
	powertalon.addEventListener("change", updateWeaponDamage);

	function getAttackUpBonus() {
		var isVersionG = getMHVersion() == "g";
		var bonus = 0;

		if (attackUpItemSmall.checked) {
			bonus = 3;
		}
		else if (attackUpItemMedium.checked) {
			bonus = 5;
		}
		else if (attackUpItemLarge.checked) {
			bonus = isVersionG ? 10 : 5;
		}
		else if (!isVersionG && attackUpItemExtra.checked) {
			bonus = 10;
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
		var damage = parseInt(attack);

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

	function populateBlademasterCalculator(element, category) {
		var selectedButton = document.querySelector(".weapon-button.selected");
		if (selectedButton) {
			selectedButton.classList.remove("selected");
		}
		element.classList.add("selected");

		var weaponID = element.dataset.id;

		const ICON_NAMES = {
			greatswords: "gs",
			hammers: "hammer",
			lances: "lance",
			swords: "sns",
			dualSwords: "duals"
			// bowguns: "hbg"
			/* "lightBowguns": "lbg" maybe? */
		};
		const calculatorClasses = {
			greatswords: "greatsword",
			hammers: "hammer",
			lances: "lance",
			swords: "sword",
			dualSwords: "dual-swords"
			// bowguns: "bowgun"
		};

		const weaponSharpness = document.getElementById("calc-sharpness-img");

		sidebarContent.className = calculatorClasses[category];
		currentCategory = category;
		currentWeapon = window[category][weaponID];

		weaponName.innerHTML = currentWeapon.name.replace(/&lt;(&#x2F)?[^&]+&gt;/g, "");
		weaponIcon.className = `${getIconColor(currentWeapon.rare)}-icon ${ICON_NAMES[category]}-icon`;

		weaponSharpness.src = `images/${currentWeapon.sharpness}.gif`;
		// Draw normal and handicraft sharpness bars
		calcSharpnessContext.drawImage(weaponSharpness, 1, 1, 119, 1, 0, 0, 119, 1);
		calcSharpnessContext.drawImage(weaponSharpness, 1, 10, 119, 1, 0, 1, 119, 1);
		calcSharpness.value = calcSharpness.max;
		updateSharpnessColor(calcSharpness.value);

		updateWeaponDamage();

		if (!calculator.classList.contains("show")) {
			calculator.classList.add("show");
		}
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

		weaponName.innerHTML = currentWeapon.name.replace(/&lt;(&#x2F)?[^&]+&gt;/g, "");
		weaponIcon.className = `${getIconColor(currentWeapon.rare)}-icon hbg-icon`;

		updateWeaponDamage();

		// Add shot classes for available ammo
		const TWO_LEVEL_AMMO = ["recover","poison","stun","sleep"];
		for (var i = 0; i < 2; i++) {
			for (var ammoIndex = 0; ammoIndex < TWO_LEVEL_AMMO.length; ammoIndex++) {
				if (currentWeapon[TWO_LEVEL_AMMO[ammoIndex]][i] != 0) {
					sidebarContent.classList.add(`${TWO_LEVEL_AMMO[ammoIndex]}-${i + 1}-shot`);
				}
			}
		}

		const THREE_LEVEL_AMMO = ["normal","pierce","pellet","crag","clust"];
		for (var i = 0; i < 3; i++) {
			for (var ammoIndex = 0; ammoIndex < THREE_LEVEL_AMMO.length; ammoIndex++) {
				if (currentWeapon[THREE_LEVEL_AMMO[ammoIndex]][i] != 0) {
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
			if (currentWeapon[OTHER_AMMO[i]] != 0) {
				sidebarContent.classList.add(`${OTHER_AMMO[i]}-shot`);
			}
		}

		/*

		"normal":[6,6,""],"pierce":[3,"",""],"pellet":["","",""],"crag":[1,"",""],"clust":["","",""],
		"disc":"","recover":[3,3],"poison":[3,1],"stun":[3,1],"sleep":[3,1],
		"tranq":3,"paint":2,"antidote":3,
		"demon":"","armor":"","dragon":"","dung":1,
		"normal":[" 6 "," 6 ","(9)"],"pierce":[" 1 ","(1)","(1)"],"pellet":["(1)","(1)","(1)"],"crag":[" 1 ","(1)","(1)"],"clust":["(1)","(1)","(1)"],
		"flame":"","water":"","thunder":"","dragon":"",
		"recover":[" 3 "," 3 "],"poison":["3 ",""],"stun":[" 3 ",""],"sleep":[" 3 ",""],
		"tranq":2,"paint":2,"demon":"","antidote":"",

		.normal-1-shot
		.normal-2-shot
		.normal-3-shot
		.pierce-1-shot
		.pierce-2-shot
		.pierce-3-shot
		.pellet-1-shot
		.pellet-2-shot
		.pellet-3-shot
		.crag-1-shot
		.crag-2-shot
		.crag-3-shot
		.clust-1-shot
		.clust-2-shot
		.clust-3-shot
		.flame-shot
		.water-shot
		.thunder-shot
		.dragon-shot
		.disc-shot
		.recover-1-shot
		.recover-2-shot
		.poison-1-shot
		.poison-2-shot
		.stun-1-shot
		.stun-2-shot
		.sleep-1-shot
		.sleep-2-shot
		.tranq-shot
		.paint-shot
		.dung-shot
		.demon-shot
		.armor-shot
		*/

		if (!calculator.classList.contains("show")) {
			calculator.classList.add("show");
		}
	}

	function handleGreatswordClick(event) {
		populateBlademasterCalculator(event.target, "greatswords");
	}
	document.querySelectorAll("#greatswords .weapon-button").forEach(function(element) {
		element.addEventListener("click", handleGreatswordClick);
	});

	function handleHammerClick(event) {
		populateBlademasterCalculator(event.target, "hammers");
	}
	document.querySelectorAll("#hammers .weapon-button").forEach(function(element) {
		element.addEventListener("click", handleHammerClick);
	});

	function handleLanceClick(event) {
		populateBlademasterCalculator(event.target, "lances");
	}
	document.querySelectorAll("#lances .weapon-button").forEach(function(element) {
		element.addEventListener("click", handleLanceClick);
	});

	function handleSwordClick(event) {
		populateBlademasterCalculator(event.target, "swords");
	}
	document.querySelectorAll("#swords .weapon-button").forEach(function(element) {
		element.addEventListener("click", handleSwordClick);
	});

	function handleDualSwordClick(event) {
		populateBlademasterCalculator(event.target, "dualSwords");
	}
	document.querySelectorAll("#dual-swords .weapon-button").forEach(function(element) {
		element.addEventListener("click", handleDualSwordClick);
	});

	function handleBowgunClick(event) {
		populateGunnerCalculator(event.target);
	}
	document.querySelectorAll("#ranged-weapons .weapon-button").forEach(function(element) {
		element.addEventListener("click", handleBowgunClick);
	});
});
