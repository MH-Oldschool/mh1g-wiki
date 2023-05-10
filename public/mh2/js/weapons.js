ready(function() {
	const LANCE_BLUNT_MOD = 0.72;
	const GUNLANCE_DAMAGE_MOD = 0.95;
	const SWORD_DAMAGE_MOD = 1.2;
	const BOWGUN_UPGRADED_ATTACK = 60;
	const SPECIAL_ATTACK_MOD = 1.125;

	// Pick a random icon for About Weapons sections
	const BLADEMASTER_ICONS = ["hammer","lance","sword","dual-swords","longsword","hunting-horn","gunlance"];
	var blademasterIcon = BLADEMASTER_ICONS[Math.floor(Math.random() * BLADEMASTER_ICONS.length)] + "-icon";
	document.querySelectorAll(".random-blademaster-icon").forEach(iconElement => iconElement.classList.add(blademasterIcon));

	const BOWGUN_ICONS = ["light-bowgun","heavy-bowgun"];
	var bowgunIcon = BOWGUN_ICONS[Math.floor(Math.random() * BOWGUN_ICONS.length)] + "-icon";
	document.querySelectorAll(".random-bowgun-icon").forEach(iconElement => iconElement.classList.add(bowgunIcon));

	var weaponElementChecks = document.getElementsByName("weapon-element-status");
	var weaponStatusElementAll = document.getElementById("weapon-status-element-all");
	function clearWeaponAttributeClasses() {
		document.body.classList.remove("highlight-fire","highlight-water","highlight-thunder","highlight-ice","highlight-dragon","highlight-poison","highlight-paralysis","highlight-sleep");
	}
	function updateWeaponVisibility() {
		var filterWeapons = false;
		var anyUnchecked = false;

		for (var i = 0; i < weaponElementChecks.length; i++) {
			if (!filterWeapons && weaponElementChecks[i].checked) filterWeapons = true;
			if (!anyUnchecked && !weaponElementChecks[i].checked) anyUnchecked = true;
		}


		if (filterWeapons && anyUnchecked) {
			document.body.classList.add("filter-weapons");
			weaponStatusElementAll.checked = false;

			for (var i = 0; i < weaponElementChecks.length; i++) {
				if (weaponElementChecks[i].checked) {
					document.body.classList.add(weaponElementChecks[i].value);
				}
				else {
					document.body.classList.remove(weaponElementChecks[i].value);
				}
			}
		}
		else {
			document.body.classList.remove("filter-weapons");
			clearWeaponAttributeClasses();
			weaponStatusElementAll.checked = true;
		}
	}
	for (var i = 0; i < weaponElementChecks.length; i++) {
		weaponElementChecks[i].addEventListener("click", updateWeaponVisibility);
	}
	updateWeaponVisibility();
	weaponStatusElementAll.addEventListener("click", (event) => {
		if (event.target.checked) {
			for (var i = 0; i < weaponElementChecks.length; i++) {
				weaponElementChecks[i].checked = false;
			}
		}

		clearWeaponAttributeClasses();

		if (event.target.checked) {
			document.body.classList.remove("filter-weapons");
		}
		else {
			document.body.classList.add("filter-weapons");
		}
	});

	// Filter Bowguns by Ammo
	var lbg = document.getElementById("lbg");
	var hbg = document.getElementById("hbg");
	var ammoAll = document.getElementById("ammo-all");
	var ammoChecks = document.getElementsByName("ammo");
	function updateGBowgunVisibility() {
		var filterBowguns = false;
		var anyUnchecked = false;

		for (var i = 0; i < ammoChecks.length; i++) {
			if (!filterBowguns && ammoChecks[i].checked) filterBowguns = true;
			if (!anyUnchecked && !ammoChecks[i].checked) anyUnchecked = true;
		}


		if (filterBowguns && anyUnchecked) {
			lbg.classList.add("filter-bowguns");
			hbg.classList.add("filter-bowguns");

			ammoAll.checked = false;

			for (var i = 0; i < ammoChecks.length; i++) {
				if (ammoChecks[i].checked) {
					lbg.classList.add(ammoChecks[i].value);
					hbg.classList.add(ammoChecks[i].value);
				}
				else {
					lbg.classList.remove(ammoChecks[i].value);
					hbg.classList.remove(ammoChecks[i].value);
				}
			}
		}
		else {
			lbg.classList.remove("filter-bowguns");
			hbg.classList.remove("filter-bowguns");
			ammoAll.checked = true;
		}
	}
	for (var i = 0; i < ammoChecks.length; i++) {
		ammoChecks[i].addEventListener("click", updateGBowgunVisibility);
	}
	updateGBowgunVisibility();
	ammoAll.addEventListener("click", (event) => {
		for (var i = 0; i < ammoChecks.length; i++) {
			ammoChecks[i].checked = event.target.checked;
		}

		lbg.classList.remove("show-nrm-1","show-nrm-3","show-prc-1","show-prc-2","show-prc-3","show-pllt-1","show-pllt-2","show-pllt-3","show-crag-1","show-crag-2","show-crag-3","show-clust-1","show-clust-2","show-clust-3","show-flame","show-water","show-thunder","show-ice","show-dragon","show-rec-1","show-rec-2","show-poi-1","show-poi-2","show-stun-1","show-stun-2","show-slp-1","show-slp-2","show-anti","show-demon");
		hbg.classList.remove("show-nrm-1","show-nrm-3","show-prc-1","show-prc-2","show-prc-3","show-pllt-1","show-pllt-2","show-pllt-3","show-crag-1","show-crag-2","show-crag-3","show-clust-1","show-clust-2","show-clust-3","show-flame","show-water","show-thunder","show-ice","show-dragon","show-rec-1","show-rec-2","show-poi-1","show-poi-2","show-stun-1","show-stun-2","show-slp-1","show-slp-2","show-anti","show-demon");

		if (event.target.checked) {
			lbg.classList.remove("filter-bowguns");
			hbg.classList.remove("filter-bowguns");
		}
		else {
			lbg.classList.add("filter-bowguns");
			hbg.classList.add("filter-bowguns");
		}
	});

	function getIconColor(rarity) {
		switch (rarity) {
			case 4: return "green";
			case 5: return "red";
			case 6: return "blue";
			case 7: return "orange";
			default: return "white";
		}
	}

	const calculator = document.getElementById("damage-calculator");
	const calculatorButton = document.getElementById("toggle-damage-calculator");

	function enableCalculator() {
		calculator.classList.add("show");
	}
	function toggleCalculator() {
		if (calculator.classList.contains("expanded")) {
			calculator.classList.remove("expanded");
			document.body.classList.remove("calculator-expanded");
		}
		else {
			calculator.classList.add("expanded");
			document.body.classList.add("calculator-expanded");
		}
	}
	calculatorButton.addEventListener("click", function() {
		toggleCalculator();
	});

	const CRIT_MULTIPLIER = 1.25;
	const CRIT_PENALTY = 0.5;
	const calcSharpness = document.getElementById("calc-sharpness");
	const calcSharpnessContext = document.getElementById("calc-sharpness-canvas").getContext("2d");
	const BLOAT_VALUES = {
		"Great Sword":  4.8,
		"Longsword": 4.8,
		"Sword and Shield": 1.4,
		"Dual Swords": 1.4,
		"Hammer": 5.2,
		"Hunting Horn": 5.2,
		"Lance": 2.3,
		"Gunlance": 2.3,
		"Light Bowgun": 1.2,
		"Heavy Bowgun": 1.2,
		"Bow": 1.2
	};
	function calculateTrueRawDamage(weapon) {
		return Math.floor(weapon.attack / BLOAT_VALUES[weapon.weaponClass]);
	}
	function getSharpnessModifier(type, sharpnessIndex) {
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

		return SHARPNESS_MODS[type][sharpnessIndex];
	}
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
		else if (red === 0 && green === 238) {
			return 3;
		}
		else if (red === 64 && green === 64 && blue === 255) {
			return 4;
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
		var yPos = handicraft.checked ? 1 : 0;
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
		const calcSharpnessColor = document.getElementById("calc-sharpness-color");
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
	calcSharpness.addEventListener("input", function(event) {
		window.requestAnimationFrame(function() {
			updateSharpnessColor(event.target.value);
			setDamageCalculatorStats();
		});
	});

	const RANGE_MODIFIERS = [0.5, 0.8, 1, 1.5];
	const rangeSlider = document.getElementById("calc-range");
	rangeSlider.addEventListener("input", setDamageCalculatorStats);

	function setCalcAttribute(sharpnessLevel) {
		const ATTRIBUTE_BLOAT_VALUE = 10;

		var hasElement = currentWeapon.attribute == "fire" || currentWeapon.attribute == "water" || currentWeapon.attribute == "thunder" || currentWeapon.attribute == "ice" || currentWeapon.attribute == "dragon";
		var hasStatus = currentWeapon.attribute == "poison" || currentWeapon.attribute == "paralysis" || currentWeapon.attribute == "sleep";

		var trueAttribute = 0;
		if (currentWeapon.attributeValue) {
			trueAttribute = currentWeapon.attributeValue / ATTRIBUTE_BLOAT_VALUE;
			if (hasStatus && specialAttack.checked) {
				trueAttribute *= SPECIAL_ATTACK_MOD;
			}


			if (hasElement) {
				if (sharpnessLevel) {
					trueAttribute *= getSharpnessModifier("attribute", sharpnessLevel);
				}
				weaponElement.innerHTML = parseInt(trueAttribute * ATTRIBUTE_BLOAT_VALUE);
				trueElement.innerText = parseInt(trueAttribute);
				weaponElementIcon.src = `../images/attributes/${currentWeapon.attribute}.png`;
				weaponElementIcon.alt = weaponElementIcon.title = currentWeapon.attributeAlt;
			}
			else if (hasStatus) {
				weaponStatus.innerHTML = parseInt(trueAttribute * ATTRIBUTE_BLOAT_VALUE);
				trueStatus.innerText = parseInt(trueAttribute);
				weaponStatusIcon.src = `../images/attributes/${currentWeapon.attribute}.png`;
				weaponStatusIcon.alt = weaponStatusIcon.title = currentWeapon.attributeAlt;
			}
		}
		weaponElement.parentElement.style.display = hasElement ? "" : "none";
		weaponStatus.parentElement.style.display = hasStatus ? "" : "none";
	}

	const attackUpFoodSmall = document.getElementById("calc-food-attack-up-small");
	const attackUpFoodMedium = document.getElementById("calc-food-attack-up-medium");
	const attackUpFoodLarge = document.getElementById("calc-food-attack-up-large");

	const attackUpSeedFlute = document.getElementById("calc-item-attack-up-seed");
	const attackUpPill = document.getElementById("calc-item-attack-up-pill");

	const attackUpSmall = document.getElementById("calc-attack-up-small");
	const attackUpMedium = document.getElementById("calc-attack-up-medium");
	const attackUpLarge = document.getElementById("calc-attack-up-large");

	const powercharm = document.getElementById("calc-powercharm");
	const powertalon = document.getElementById("calc-powertalon");

	const powerBarrelCheck = document.getElementById("calc-power-barrel");
	const powerCoatingCheck = document.getElementById("calc-power-coating")

	const normalShotUp = document.getElementById("calc-normal-shot-up");
	const pierceShotUp = document.getElementById("calc-pierce-shot-up");
	const pelletShotUp = document.getElementById("calc-pellet-shot-up");

	const handicraft = document.getElementById("calc-handicraft");
	const specialAttack = document.getElementById("calc-special-attack");

	document.getElementById("calc-food-attack-up-none").addEventListener("change", setDamageCalculatorStats);
	attackUpFoodSmall.addEventListener("change", setDamageCalculatorStats);
	attackUpFoodMedium.addEventListener("change", setDamageCalculatorStats);
	attackUpFoodLarge.addEventListener("change", setDamageCalculatorStats);

	document.getElementById("calc-item-attack-up-none").addEventListener("change", setDamageCalculatorStats);
	attackUpSeedFlute.addEventListener("change", setDamageCalculatorStats);
	attackUpPill.addEventListener("change", setDamageCalculatorStats);

	document.getElementById("calc-attack-up-none").addEventListener("change", setDamageCalculatorStats);
	attackUpSmall.addEventListener("change", setDamageCalculatorStats);
	attackUpMedium.addEventListener("change", setDamageCalculatorStats);
	attackUpLarge.addEventListener("change", setDamageCalculatorStats);
	specialAttack.addEventListener("change", setDamageCalculatorStats);
	powercharm.addEventListener("change", setDamageCalculatorStats);
	powertalon.addEventListener("change", setDamageCalculatorStats);

	powerBarrelCheck.addEventListener("change", setDamageCalculatorStats);
	powerCoatingCheck.addEventListener("change", setDamageCalculatorStats);

	normalShotUp.addEventListener("change", setDamageCalculatorStats);
	pierceShotUp.addEventListener("change", setDamageCalculatorStats);
	pelletShotUp.addEventListener("change", setDamageCalculatorStats);

	function getAttackUpBonus() {
		var bonus = 0;

		if (attackUpFoodSmall.checked) {
			bonus += 3;
		}
		else if (attackUpFoodMedium.checked) {
			bonus += 5;
		}
		else if (attackUpFoodLarge.checked) {
			bonus += 10;
		}

		if (attackUpSeedFlute.checked) {
			bonus += 10;
		}
		else if (attackUpPill.checked) {
			bonus += 25;
		}

		if (attackUpSmall.checked) {
			bonus += 3;
		}
		else if (attackUpMedium.checked) {
			bonus += 5;
		}
		else if (attackUpLarge.checked) {
			bonus += 10;
		}

		if (powercharm.checked) {
			bonus += 5;
		}
		if (powertalon.checked) {
			bonus += 10;
		}

		if (currentWeapon.weaponClass == "Heavy Bowgun" && powerBarrelCheck.checked) {
			bonus += 20;
		}

		return bonus;
	}

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
		setDamageCalculatorStats();
	});
	toggleHandicraftSkill(handicraft.checked);

	const weaponElement = document.getElementById("calc-weapon-element");
	const weaponStatus = document.getElementById("calc-weapon-status");
	const trueElement = document.getElementById("calc-true-element");
	const trueStatus = document.getElementById("calc-true-status");
	const weaponElementIcon = document.getElementById("calc-weapon-element-icon");
	const weaponStatusIcon = document.getElementById("calc-weapon-status-icon");
	const sidebarContent = document.getElementById("sidebar-content");
	const kickAttack = document.getElementById("kick-raw");

	var currentWeapon = {};
	function populateDamageCalculator(weapon) {
		const weaponName = document.getElementById("calc-weapon-name");
		const weaponIcon = document.getElementById("calc-weapon-icon");
		const WEAPON_ICON_MAP = {
			"Great Sword":"great-sword",
			"Longsword":"longsword",
			"Sword and Shield":"sword",
			"Dual Swords":"dual-swords",
			"Hammer":"hammer",
			"Hunting Horn":"hunting-horn",
			"Lance":"lance",
			"Gunlance":"gunlance",
			"Light Bowgun":"light-bowgun",
			"Heavy Bowgun":"heavy-bowgun",
			"Bow":"bow"
		};

		currentWeapon = weapon;
		weaponName.innerText = weapon.name;
		weaponIcon.className = `${getIconColor(weapon.rarity)}-icon ${WEAPON_ICON_MAP[weapon.weaponClass]}-icon`;
		sidebarContent.className = WEAPON_ICON_MAP[weapon.weaponClass];

		if (currentWeapon.weaponClass == "Light Bowgun" || currentWeapon.weaponClass == "Heavy Bowgun" || currentWeapon.weaponClass == "Bow") {
			setDamageCalculatorStats();
		}
		else {
			const weaponSharpness = document.getElementById("calc-sharpness-img");
			weaponSharpness.addEventListener("load", () => {
				// Draw normal and handicraft sharpness bars
				calcSharpnessContext.drawImage(weaponSharpness, 1, 1, 119, 1, 0, 0, 119, 1);
				calcSharpnessContext.drawImage(weaponSharpness, 1, 10, 119, 1, 0, 1, 119, 1);
				calcSharpness.value = calcSharpness.max;
				updateSharpnessColor(calcSharpness.value);

				setDamageCalculatorStats();
			}, { once: true });
			weaponSharpness.src = `images/sharpness/sharpness_${currentWeapon.index}.gif`;

			if (weapon.weaponClass == "Hunting Horn") setCalcHuntingHornStats();
			else if (weapon.weaponClass == "Gunlance") setCalcGunlanceStats();
		}
	}
	function setDamageCalculatorStats() {
		var trueRawDamage = calculateTrueRawDamage(currentWeapon);
		var attackUpBonus = getAttackUpBonus();
		currentWeapon.bloatedBonus = parseInt(BLOAT_VALUES[currentWeapon.weaponClass] * attackUpBonus); // I think decimals get truncated?

		currentWeapon.totalAttack = currentWeapon.attack + currentWeapon.bloatedBonus;
		currentWeapon.totalRaw = Math.floor(trueRawDamage + attackUpBonus);

		var isBowgun = currentWeapon.weaponClass == "Light Bowgun" || currentWeapon.weaponClass == "Heavy Bowgun";
		var isBow = currentWeapon.weaponClass == "Bow";
		if (isBowgun || isBow) {
			currentWeapon.rangeMod = RANGE_MODIFIERS[rangeSlider.value];
		}

		if (isBowgun) {
			populateBowgunCalculator(currentWeapon);
		}
		else if (isBow) {
			populateBowCalculator(currentWeapon);
		}
		else {
			updateBlademasterCalculator();
		}

		setCalculatorAttack(currentWeapon.totalAttack, currentWeapon.totalRaw, currentWeapon.bloatedBonus);
	}
	function setCalculatorAttack(totalAttack, totalRaw, bloatedBonus) {
		const weaponAttack = document.getElementById("calc-weapon-attack");

		if (currentWeapon.weaponClass == "Light Bowgun" || currentWeapon.weaponClass == "Heavy Bowgun") {
			totalRaw = `${ totalAttack }&nbsp;-&nbsp;${ totalRaw + BOWGUN_UPGRADED_ATTACK / BLOAT_VALUES["Heavy Bowgun"] }`;
			totalAttack = `${ totalAttack }&nbsp;-&nbsp;${ totalAttack + BOWGUN_UPGRADED_ATTACK }`;
		}

		if (bloatedBonus) {
			weaponAttack.innerHTML = `${numberWithCommas(totalAttack)} (+${bloatedBonus}) [${totalRaw}]`;
		}
		else {
			weaponAttack.innerHTML = `${numberWithCommas(totalAttack)} [${totalRaw}]`;
		}
	}
	function updateBlademasterCalculator() {
		const motionValues = {
			"Great Sword": document.querySelectorAll(".great-sword-mvs .attack-raw"),
			"Longsword": document.querySelectorAll(".longsword-mvs .attack-raw"),
			"Hammer": document.querySelectorAll(".hammer-mvs .attack-raw"),
			"Hunting Horn": document.querySelectorAll(".hunting-horn-mvs .attack-raw"),
			"Lance": document.querySelectorAll(".lance-mvs .attack-raw"),
			"Gunlance": document.querySelectorAll(".gunlance-mvs .attack-raw"),
			"Sword and Shield": document.querySelectorAll(".sword-mvs .attack-raw"),
			"Dual Swords": document.querySelectorAll(".dual-swords-mvs .attack-raw")
		};

		var sharpnessLevel = getSharpnessAtValue(calcSharpness.value);
		var rawSharpnessMod = getSharpnessModifier("raw", sharpnessLevel);
		currentWeapon.totalRaw = Math.floor(currentWeapon.totalRaw * rawSharpnessMod);

		motionValues[currentWeapon.weaponClass].forEach(function(element) {
			var damage = parseInt(currentWeapon.totalRaw * element.dataset.value);
			if (currentWeapon.weaponClass == "Lance") {
				element.innerHTML = `${ damage } (${ (damage * LANCE_BLUNT_MOD).toFixed(0) })`;
			}
			else if (currentWeapon.weaponClass == "Gunlance") {
				element.innerHTML = damage * GUNLANCE_DAMAGE_MOD;
			}
			else if (currentWeapon.weaponClass == "Sword and Shield") {
				element.innerHTML = damage * SWORD_DAMAGE_MOD;
			}
			else {
				element.innerHTML = damage;
			}
		});

		setCalcAttribute(sharpnessLevel);
		setSharpnessHitCounts();

		var kickMV = parseFloat(kickAttack.dataset.value);
		kickAttack.innerHTML = parseInt(currentWeapon.totalRaw * kickMV);
	}
	function showCalculatorBowgunAmmo() {
		var ammoName = "";

		// Add shot classes for available ammo
		const TWO_LEVEL_AMMO = ["recover","poison","para","sleep"];
		for (var i = 0; i < 2; i++) {
			for (var ammoIndex = 0; ammoIndex < TWO_LEVEL_AMMO.length; ammoIndex++) {
				ammoName = TWO_LEVEL_AMMO[ammoIndex];

				if (currentWeapon[ammoName][i] != 0) {
					sidebarContent.classList.add(`${TWO_LEVEL_AMMO[ammoIndex]}-${i + 1}-shot`);
				}
			}
		}

		const THREE_LEVEL_AMMO = ["normal","pierce","pellet","crag","clust"];
		for (var i = 0; i < 3; i++) {
			for (var ammoIndex = 0; ammoIndex < THREE_LEVEL_AMMO.length; ammoIndex++) {
				ammoName = THREE_LEVEL_AMMO[ammoIndex];

				sidebarContent.classList.add(`${THREE_LEVEL_AMMO[ammoIndex]}-${i + 1}-shot`);
				if (!currentWeapon[ammoName][i]) {
					sidebarContent.classList.add(`${THREE_LEVEL_AMMO[ammoIndex]}-${i + 1}-shot-up`);
				}
			}
		}

		const OTHER_AMMO = [
			"disc",
			"flame",
			"water",
			"thunder",
			"ice",
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

			if (currentWeapon[ammoName] && currentWeapon[ammoName] != 0) {
				sidebarContent.classList.add(`${OTHER_AMMO[i]}-shot`);
			}
		}
	}
	function populateBowgunCalculator(weapon) {
		const bowgunShotRows = document.getElementsByClassName("bowgun-shot-row");
		const bowgunShotPower = document.getElementsByClassName("bowgun-shot-power");
		const bowgunShotAttribute = document.getElementsByClassName("bowgun-shot-attribute");
		const ammoFireAttribute = document.getElementById("ammo-fire-attribute");
		const ammoWaterAttribute = document.getElementById("ammo-water-attribute");
		const ammoThunderAttribute = document.getElementById("ammo-thunder-attribute");
		const ammoIceAttribute = document.getElementById("ammo-ice-attribute");

		const SHOT_UP_MOD = 1.1;
		const PELLET_UP_MOD = 1.3;
		const BOWGUN_ELEMENT_MODS = {
			fire: 0.4,
			water: 0.1,
			thunder: 0.2,
			ice: 0.1
		};

		var minAttack = currentWeapon.totalAttack;
		var maxAttack = minAttack + BOWGUN_UPGRADED_ATTACK;

		var shotMin, shotMax = 0.0;
		for (var i = 0; i < bowgunShotRows.length; i++) {
			var power = bowgunShotRows[i].dataset.power;
			shotMin = minAttack * power;
			shotMax = maxAttack * power;

			if (i < 6) {
				shotMin *= currentWeapon.rangeMod;
				shotMax *= currentWeapon.rangeMod;
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
					shotMin *= PELLET_UP_MOD;
					shotMax *= PELLET_UP_MOD;
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

		ammoFireAttribute.innerHTML = `${parseInt(minAttack * BOWGUN_ELEMENT_MODS.fire)} - ${parseInt(maxAttack * BOWGUN_ELEMENT_MODS.fire)}`;
		ammoWaterAttribute.innerHTML = `${parseInt(minAttack * BOWGUN_ELEMENT_MODS.water)} - ${parseInt(maxAttack * BOWGUN_ELEMENT_MODS.water)}`;
		ammoThunderAttribute.innerHTML = `${parseInt(minAttack * BOWGUN_ELEMENT_MODS.thunder)} - ${parseInt(maxAttack * BOWGUN_ELEMENT_MODS.thunder)}`;
		ammoIceAttribute.innerHTML = `${parseInt(minAttack * BOWGUN_ELEMENT_MODS.ice)} - ${parseInt(maxAttack * BOWGUN_ELEMENT_MODS.ice)}`;

		var kickMV = parseFloat(kickAttack.dataset.value);
		kickAttack.innerHTML = `${parseInt(minAttack * kickMV)} - ${parseInt(maxAttack * kickMV)}`;

		weaponElement.parentElement.style.display = "none";
		weaponStatus.parentElement.style.display = "none";

		showCalculatorBowgunAmmo();
	}
	function populateBowCalculator(weapon) {
		const bowCoatings = document.querySelectorAll(".calc-bow-coatings .coating-icon");
		const bowArrows = document.getElementById("calc-bow-arrows");
		const bowMotions = document.querySelectorAll(".bow-mvs .attack-raw");

		const POWER_COATING_MOD = 1.5;
		const BOW_CHARGE_LEVELS = [ 0.4, 1.0, 1.5, 1.5 ];

		bowCoatings[0].style.opacity = currentWeapon.powerCoating ? "" : 0.4;
		bowCoatings[1].style.opacity = currentWeapon.poisonCoating ? "" : 0.4;
		bowCoatings[2].style.opacity = currentWeapon.paraCoating ? "" : 0.4;
		bowCoatings[3].style.opacity = currentWeapon.sleepCoating ? "" : 0.4;

		powerCoatingCheck.disabled = !currentWeapon.powerCoating;
		if (!currentWeapon.powerCoating) {
			powerCoatingCheck.checked = false;
		}

		setCalcAttribute();

		var powerMod = powerCoatingCheck.checked ? 1.5 : 1;

		var arrowRows = currentWeapon.chargeLevels.map((chargeLevel, index) => {
			var arrowType = chargeLevel.type;
			var levelIndex = chargeLevel.level - 1;
			var chargeMod = BOW_CHARGE_LEVELS[index];

			var arrowLevel = window.weaponData.arrowData[arrowType][levelIndex];
			var powerList = arrowLevel.power.map(power => `<span class="comma-separated">${ power }</span>`).join("");
			var damageList = arrowLevel.power.map(power => `<span class="comma-separated">${ Math.floor(currentWeapon.totalRaw * (power / 100) * chargeMod * currentWeapon.rangeMod * powerMod) }</span>`).join("");

			return `<tr><td>${ arrowType } Lv${ chargeLevel.level }</td><td>Release R Stick Down</td><td>${ arrowLevel.impacts }</td><td>${ powerList }</td><td>${ damageList }</td></tr>`;
		});

		bowArrows.innerHTML = arrowRows.join("");

		bowMotions.forEach(element => {
			element.innerHTML = Math.floor(currentWeapon.totalRaw * element.dataset.value);
		});
	}

	function setCalcHuntingHornStats() {
		window.eachElementByClassName("calc-horn-note", (element, index) => {
			element.classList.remove("white-icon","purple-icon","yellow-icon","blue-icon","red-icon","green-icon");
			element.classList.add(currentWeapon.noteIcons[index] + "-icon");
		});

		const songsListContainer = document.getElementById("calc-horn-songs-list");
		var songsList = window.weaponData.huntingHornMelodies.filter(melody => {
			for (var i = 0; i < melody.notes.length; i++) {
				if (!currentWeapon.noteIcons.includes(melody.notes[i])) {
					return false;
				}
			}

			return true;
		}).map(melody => {
			var icons = melody.notes.map(noteIcon => `<span class="${ noteIcon }-icon note-icon" title="${ noteIcon }"></span>`).join("");
			var fullEffects = melody.effects.map(effectData => effectData.effect).join(", ");

			return `<tr title="${ fullEffects }"><td>${ icons }</td><td>${ melody.shortName }</td></tr>`;
		});
		songsListContainer.innerHTML = songsList.join("");
	}
	function setCalcGunlanceStats() {
		var shellCount = 5;
		if (currentWeapon.shellType == "Long") shellCount = 3;
		else if (currentWeapon.shellType == "Wide") shellCount = 2;
		window.eachElementByClassName("calc-gunlance-shell", (element, index) => element.style.display = index < shellCount ? "" : "none");

		const shellLevelElement = document.getElementById("calc-gunlance-shell-level");
		shellLevelElement.innerText = `${ currentWeapon.shellType } Lv${ currentWeapon.shellLevel }`;
	}

	function handleWeaponRadioClick(event) {
		var index = event.target.value;
		var weaponClass = event.target.dataset.weaponClass;
		var weapon = weaponData[weaponClass][index];

		populateDamageCalculator(weapon);
		enableCalculator();
	}
	var weaponRadios = document.getElementsByName("weapon");
	for (var i = 0; i < weaponRadios.length; i++) {
		weaponRadios[i].addEventListener("click", handleWeaponRadioClick);
	}
});
