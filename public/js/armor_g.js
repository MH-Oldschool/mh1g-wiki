// MHG Stuff
ready(() => {
	var currentArmor = {
		headgear: window.armorDataG.headgear[0],
		torso: window.armorDataG.torso[0],
		arms: window.armorDataG.arms[0],
		waist: window.armorDataG.waist[0],
		legs: window.armorDataG.legs[0]
	};

	var SKILL_LEVELS = {
		"Health": [ -30,-20,-10,10,20,30 ], // Be sure to handle these special cases
		"Defense": [ -20,-15,-10,10,15,20 ], // Be sure to handle these special cases
		"Element Res Up": [ -10,-5,-3,3,5,10 ], // Be sure to handle these special cases
		"Fire Resistance": [ -10,-5,-3,3,5,10 ], // Be sure to handle these special cases
		"Water Resistance": [ -10,-5,-3,3,5,10 ], // Be sure to handle these special cases
		"Thunder Resistance": [ -10,-5,-3,3,5,10 ], // Be sure to handle these special cases
		"Dragon Resistance": [ -10,-5,-3,3,5,10 ], // Be sure to handle these special cases
		"Reload Speed": [ "Reload -3","Reload -2","Reload -1","Reload +1","Reload +2","Reload +3" ],
		"Recovery Speed": [ "Recovery Spd -2","","Recovery Spd -1","Recovery Spd +1","","Recovery Spd +2" ],
		"Combo Rate": [ "Combo Rate -15%","Combo Rate -10%","Combo Rate -5%","Combo Rate +5%","Combo Rate +10%","Combo Rate +15%" ],
		"Poison": [ "Poison Quadrupled","Poison Tripled","Poison Doubled","Poison Halved","Poison Negated","" ],
		"Fate": [ "Disaster","","Bad Luck","Good Luck","Very Good Luck","" ],
		"Hunger": [ "Double Hunger","","Hunger x1.5","Hunger Halved","Hunger Negated","" ],
		"Heat Res": [ "Heat Doubled","","Heat x1.5","Heat Halved","Heat Negated","" ],
		"Cold Res": [ "Cold Doubled","","Cold x1.5","Cold Halved","Cold Negated","" ],
		"Normal S Add": [ "","","","Normal S Add 1","Normal S Add 2","Normal S Add 3" ],
		"Pierce S Add": [ "","","","Pierce S Add 1","Pierce S Add 2","Pierce S Add 3" ],
		"Crag S Add": [ "","","","Crag S Add 1","Crag S Add 2","Crag S Add 3" ],
		"Attack": [ "","","","Attack Up [S]","Attack Up [M]","Attack Up [L]" ],
		"Gluttony": [ "","","","Filled +1","Filled +2","Scavenger" ], // ?? Probably the wrong skill names
		"Guard": [ "","Guard -2","Guard -1","Guard +1","Guard +2","" ],
		"Whim": [ "","Devil's Whim","Spectre's Whim","Spirit's Whim","Divine Whim","" ],
		"Gathering": [ "","Gathering -2","Gathering -1","Gathering +1","Gathering +2","" ],
		"Stun": [ "","","Stun Doubled","Stun Halved","Stun Negated","" ],
		"Sleep": [ "","","Sleep Doubled","Sleep Halved","Sleep Negated","" ],
		"Paralysis": [ "","","Paralysis Doubled","Paralysis Halved","Paralysis Negated","" ],
		"Wind Pressure": [ "","","","Low Wind Pressure","High Wind Pressure","" ],
		"Recoil": [ "","","","Recoil +1","Recoil +2","" ],
		"Psychic": [ "","","","Detect","Autotracker","" ],
		"Wide Area Recovery": [ "","","","Herb Wide Area","Potion Wide Area","" ], // Probably the wrong names
		"Earplugs": [ "","","","Earplugs","Luxury Earplugs","" ],
		"Sharpener": [ "","","Sharpen Speed Halved","Sharpen Speed Increased","","" ], // Sharpening speed, I think
		"Sense": [ "","","Provocation","Stealth","","" ],
		"Recovery": [ "","","Recovery Weakened","Recovery Strengthened","","" ],
		"Blessing": [ "","","Blessing of Evil Spirits","Blessing of Spirits","","" ],
		"Map": [ "","","No Map","Farsight","","" ],
		"Handicraft": [ "","","Sharpness Down","Sharpness Up","","" ],
		"Sharpness": [ "","","Dullness","Razor Sharp","","" ],
		"Fisher": [ "","","","Fishing Master","","" ],
		"Anti-Theft": [ "","","","Anti-Theft","","" ],
		"Alchemy": [ "","","","Alchemy","","" ],
		"Guard Up": [ "","","","Guard Up","","" ],
		"Auto-Guard": [ "","","","Auto-Guard","","" ],
		"Normal S Up": [ "","","","Normal S Up","","" ],
		"Pellet S Up": [ "","","","Pellet S Up","","" ],
		"Pierce S Up": [ "","","","Pierce S Up","","" ],
		"Throw": [ "","","","Throw","","" ],
		"Wide Area Antidote": [ "","","","Wide Area Antidote","","" ],
		"Wide Area Drug": [ "","","","Wide Area Drug","","" ],
		"Pro Transporter": [ "","","","Pro Transporter","","" ],
		"Whistle": [ "","","","Whistle Master","","" ],
		"Bomber": [ "","","","Bomber","","" ],
		"Special Attack": [ "","","","Special Attack","","" ],
		"Bullet Formulation": [ "","","","Bullet Formulation","","" ],
		"Swordsmanship": [ "","","","Swordsmanship","","" ],
		"Rapid Fire": [ "","","","Rapid Fire","","" ]
	}

	var armorStatCheckboxes = document.getElementsByName("armor-stat");
	function shouldShowRow(resistances, checked) {
		var matchesFireRes = (checked["f+"] && resistances[0] >= 0) || (checked["f-"] && resistances[0] <= 0) || (!checked["f+"] && !checked["f-"]);
		var matchesWaterRes = (checked["w+"] && resistances[1] >= 0) || (checked["w-"] && resistances[1] <= 0) || (!checked["w+"] && !checked["w-"]);
		var matchesThunderRes = (checked["t+"] && resistances[2] >= 0) || (checked["t-"] && resistances[2] <= 0) || (!checked["t+"] && !checked["t-"]);
		var matchesDragonRes = (checked["d+"] && resistances[3] >= 0) || (checked["d-"] && resistances[3] <= 0) || (!checked["d+"] && !checked["d-"]);

		return matchesFireRes && matchesWaterRes && matchesThunderRes && matchesDragonRes;
	}

	function isMH1() {
		return document.body.className.indexOf("show-1") !== -1;
	}

	var builderContainer = document.getElementById("armor-builder");
	var builderToggle = document.getElementById("toggle-builder");
	var builderExpanded = false;
	function toggleBuilder() {
		builderExpanded = !builderExpanded;
		if (builderExpanded) {
			builderContainer.classList.add("expanded");
		}
		else {
			builderContainer.classList.remove("expanded");
		}
	}

	function calculateDefense() {
		var defense = 0;
		if (currentArmor.headgear) {
			defense += currentArmor.headgear.def;
		}
		if (currentArmor.torso) {
			defense += currentArmor.torso.def;
		}
		if (currentArmor.arms) {
			defense += currentArmor.arms.def;
		}
		if (currentArmor.waist) {
			defense += currentArmor.waist.def;
		}
		if (currentArmor.legs) {
			defense += currentArmor.legs.def;
		}

		return defense;
	}
	function calculateRes() {
		return [
			currentArmor.headgear.res[0] + currentArmor.torso.res[0] + currentArmor.arms.res[0] + currentArmor.waist.res[0] + currentArmor.legs.res[0],
			currentArmor.headgear.res[1] + currentArmor.torso.res[1] + currentArmor.arms.res[1] + currentArmor.waist.res[1] + currentArmor.legs.res[1],
			currentArmor.headgear.res[2] + currentArmor.torso.res[2] + currentArmor.arms.res[2] + currentArmor.waist.res[2] + currentArmor.legs.res[2],
			currentArmor.headgear.res[3] + currentArmor.torso.res[3] + currentArmor.arms.res[3] + currentArmor.waist.res[3] + currentArmor.legs.res[3]
		];
	}
	function getResistances() {
		return [
			parseInt(document.getElementsByClassName("fire-res-g").innerText),
			parseInt(document.getElementsByClassName("water-res-g").innerText),
			parseInt(document.getElementsByClassName("thunder-res-g").innerText),
			parseInt(document.getElementsByClassName("dragon-res-g").innerText)
		];
	}
	function calculateSkills() {
		// First, we have to calculate the Torso Up modifier by checking all non-torso armor pieces
		var torsoUpModifier = 1;
		function updateTorsoUp(skill) {
			if (skill.k == "Torso Up") {
				torsoUpModifier++;
			}
		}
		currentArmor.headgear.skills.forEach(updateTorsoUp);
		currentArmor.arms.skills.forEach(updateTorsoUp);
		currentArmor.waist.skills.forEach(updateTorsoUp);
		currentArmor.legs.skills.forEach(updateTorsoUp);
		// And now we apply it
		let torsoSkills = [];
		if (torsoUpModifier !== 1 && currentArmor.torso.skills) {
			torsoSkills = currentArmor.torso.skills.map((skill) => {
				return {
					k: skill.k,
					q: skill.q * torsoUpModifier
				};
			});
		}
		else {
			torsoSkills = currentArmor.torso.skills
		}

		var skillsParsed = {};
		function parseSkills(skill) {
			// Skip Torso Up
			if (skill.k != "Torso Up") {
				if (skillsParsed[skill.k]) {
					skillsParsed[skill.k] += skill.q;
				}
				else {
					skillsParsed[skill.k] = skill.q;
				}
			}
		}
		// In case we get MH1-only armor, which has no skill points
		if (currentArmor.headgear.skills) currentArmor.headgear.skills.forEach(parseSkills);
		if (torsoSkills) torsoSkills.forEach(parseSkills);
		if (currentArmor.arms.skills) currentArmor.arms.skills.forEach(parseSkills);
		if (currentArmor.waist.skills) currentArmor.waist.skills.forEach(parseSkills);
		if (currentArmor.legs.skills) currentArmor.legs.skills.forEach(parseSkills);

		var resistances = getResistances();

		var skillRows = [];
		for (var prop in skillsParsed) {
			if (skillsParsed.hasOwnProperty(prop)) {
				var skillLevel = "none";
				var skillName = prop;

				if (SKILL_LEVELS[prop]) {
					var skillIndex = parseInt(skillsParsed[prop] / 5) + (skillsParsed[prop] < 0 ? 4 : 1);

					if (skillsParsed[prop] <= -10 || 10 <= skillsParsed[prop]) {
						if (skillsParsed[prop] >= 10) {
							skillLevel = "positive";
						}
						else if (skillsParsed[prop] <= -10) {
							skillLevel = "negative";
						}
						// Special cases
						if (prop == "Health") {
							let healthBonus = SKILL_LEVELS[prop][skillIndex];
							document.getElementById("health-stat-g").innerText = 100 + healthBonus;
							skillName = "Health " + (healthBonus > 0 ? "+" : "-") + healthBonus.toString();
						}
						else if (prop == "Defense") {
							let defenseBonus = SKILL_LEVELS[prop][skillIndex];
							document.getElementById("defense-stat-g").innerText = defense + defenseBonus;
							skillName = "Defense " + (defenseBonus > 0 ? "+" : "-") + defenseBonus.toString();
						}
						else if (prop == "Element Res Up") {
							let elementBonus = SKILL_LEVELS[prop][skillIndex];
							document.getElementById("fire-res-g").innerText = resistances[0] + elementBonus;
							document.getElementById("water-res-g").innerText = resistances[1] + elementBonus;
							document.getElementById("thunder-res-g").innerText = resistances[2] + elementBonus;
							document.getElementById("dragon-res-g").innerText = resistances[3] + elementBonus;
							skillName = "Element Res " + (elementBonus > 0 ? "+" : "-") + elementBonus.toString();
						}
						else if (prop == "Fire Resistance") {
							let elementBonus = SKILL_LEVELS[prop][skillIndex];
							document.getElementById("fire-res-g").innerText = resistances[0] + elementBonus;
							skillName = "Fire Res " + (elementBonus > 0 ? "+" : "-") + elementBonus.toString();
						}
						else if (prop == "Water Resistance") {
							let elementBonus = SKILL_LEVELS[prop][skillIndex];
							document.getElementById("water-res-g").innerText = resistances[1] + elementBonus;
							skillName = "Water Res " + (elementBonus > 0 ? "+" : "-") + elementBonus.toString();
						}
						else if (prop == "Thunder Resistance") {
							let elementBonus = SKILL_LEVELS[prop][skillIndex];
							document.getElementById("thunder-res-g").innerText = resistances[2] + elementBonus;
							skillName = "Thunder Res " + (elementBonus > 0 ? "+" : "-") + elementBonus.toString();
						}
						else if (prop == "Dragon Resistance") {
							let elementBonus = SKILL_LEVELS[prop][skillIndex];
							document.getElementById("dragon-res-g").innerText = resistances[3] + elementBonus;
							skillName = "Dragon Res " + (elementBonus > 0 ? "+" : "-") + elementBonus.toString();
						}
						else {
							skillName = SKILL_LEVELS[prop][skillIndex];
							while (!skillName && 0 <= skillIndex && skillIndex < 6) {
								if (skillsParsed[prop] < 0) {
									skillName = SKILL_LEVELS[prop][++skillIndex];
								}
								else {
									skillName = SKILL_LEVELS[prop][--skillIndex];
								}
							}
						}
					}
				}
				else {
					console.warn("No such skill:", prop);
				}

				skillRows.push("<tr class=skill-level-" + skillLevel + "><td>" + skillName + "</td><td>" + skillsParsed[prop] + "</td></tr>");
			}
		}
		document.getElementById("armor-skills-g").innerHTML = skillRows.join("");
	}

	function updateArmorStats() {
		// Reset health to account for any change to the Health skill
		document.getElementById("health-stat-g").innerText = "100";

		var defense = calculateDefense();
		document.getElementById("defense-stat-g").innerText = defense;

		var resistances = calculateRes();
		document.getElementById("fire-res-g").innerText = resistances[0];
		document.getElementById("water-res-g").innerText = resistances[1];
		document.getElementById("thunder-res-g").innerText = resistances[2];
		document.getElementById("dragon-res-g").innerText = resistances[3];

		calculateSkills();

		// Sum up zenny cost and all required materials
		var totalCost = 0;
		var allMaterials = {};
		if (currentArmor.headgear.forge) {
			totalCost += currentArmor.headgear.forge;

			currentArmor.headgear.mats.forEach((mat) => {
				if (allMaterials[mat.m]) {
					allMaterials[mat.m] += mat.q;
				}
				else {
					allMaterials[mat.m] = mat.q;
				}
			});
		}
		if (currentArmor.torso.forge) {
			totalCost += currentArmor.torso.forge;

			currentArmor.torso.mats.forEach((mat) => {
				if (allMaterials[mat.m]) {
					allMaterials[mat.m] += mat.q;
				}
				else {
					allMaterials[mat.m] = mat.q;
				}
			});
		}
		if (currentArmor.arms.forge) {
			totalCost += currentArmor.arms.forge;

			currentArmor.arms.mats.forEach((mat) => {
				if (allMaterials[mat.m]) {
					allMaterials[mat.m] += mat.q;
				}
				else {
					allMaterials[mat.m] = mat.q;
				}
			});
		}
		if (currentArmor.waist.forge) {
			totalCost += currentArmor.waist.forge;

			currentArmor.waist.mats.forEach((mat) => {
				if (allMaterials[mat.m]) {
					allMaterials[mat.m] += mat.q;
				}
				else {
					allMaterials[mat.m] = mat.q;
				}
			});
		}
		if (currentArmor.legs.forge) {
			totalCost += currentArmor.legs.forge;

			currentArmor.legs.mats.forEach((mat) => {
				if (allMaterials[mat.m]) {
					allMaterials[mat.m] += mat.q;
				}
				else {
					allMaterials[mat.m] = mat.q;
				}
			});
		}
		document.getElementById("armor-cost-g").innerText = totalCost;

		var materialRows = [];
		var materialsTBody = document.getElementById("armor-materials-g");
		for (var matName in allMaterials) {
			if (allMaterials.hasOwnProperty(matName)) {
				materialRows.push(`<tr><td>${ matName }</td><td class="ta-r">${ allMaterials[matName] }</td></tr>`);
			}
		}
		if (materialRows.length === 0) {
			materialsTBody.innerHTML = "<tr><td class='ta-l'>None</td></tr>";
		}
		else {
			materialsTBody.innerHTML = materialRows.join("");
		}

		// Show an error if mixing gendered pieces
		var femalePartCount = 0;
		var malePartCount = 0;

		if (currentArmor.headgear.gender == "Female") { femalePartCount++ }
		else if (currentArmor.headgear.gender == "Male") { malePartCount++ }
		if (currentArmor.torso.gender == "Female") { femalePartCount++ }
		else if (currentArmor.torso.gender == "Male") { malePartCount++ }
		if (currentArmor.arms.gender == "Female") { femalePartCount++ }
		else if (currentArmor.arms.gender == "Male") { malePartCount++ }
		if (currentArmor.waist.gender == "Female") { femalePartCount++ }
		else if (currentArmor.waist.gender == "Male") { malePartCount++ }
		if (currentArmor.legs.gender == "Female") { femalePartCount++ }
		else if (currentArmor.legs.gender == "Male") { malePartCount++ }

		var gendersMixed = (femalePartCount !== 0) && (malePartCount !== 0);
		document.getElementById("gender-mixing-error-g").style.display = gendersMixed ? "block" : "";

		// Finally, show an error if there is a mix of Blademaster and Gunner armor
		var blademasterPartCount = 0;
		var gunnerPartCount = 0;

		if (currentArmor.headgear.class == "Blademaster") { blademasterPartCount++ }
		else if (currentArmor.headgear.class == "Gunner") { gunnerPartCount++ }
		if (currentArmor.torso.class == "Blademaster") { blademasterPartCount++ }
		else if (currentArmor.torso.class == "Gunner") { gunnerPartCount++ }
		if (currentArmor.arms.class == "Blademaster") { blademasterPartCount++ }
		else if (currentArmor.arms.class == "Gunner") { gunnerPartCount++ }
		if (currentArmor.waist.class == "Blademaster") { blademasterPartCount++ }
		else if (currentArmor.waist.class == "Gunner") { gunnerPartCount++ }
		if (currentArmor.legs.class == "Blademaster") { blademasterPartCount++ }
		else if (currentArmor.legs.class == "Gunner") { gunnerPartCount++ }

		var classesMixed = (blademasterPartCount !== 0) && (gunnerPartCount !== 0);
		document.getElementById("class-mixing-error-g").style.display = classesMixed ? "block" : "";
	}

	function setHeadgear(headgearData) {
		currentArmor.headgear = headgearData;
		document.getElementById("headgear-name-g").innerText = headgearData.name;
	}
	function setTorso(torsoData) {
		currentArmor.torso = torsoData;
		document.getElementById("torso-name-g").innerText = torsoData.name;
	}
	function setArms(armsData) {
		currentArmor.arms = armsData;
		document.getElementById("arms-name-g").innerText = armsData.name;
	}
	function setWaist(waistData) {
		currentArmor.waist = waistData;
		document.getElementById("waist-name-g").innerText = waistData.name;
	}
	function setLegs(legsData) {
		currentArmor.legs = legsData;
		document.getElementById("legs-name-g").innerText = legsData.name;
	}

	var headgearRadios = document.getElementById("headgear-g-tbody").getElementsByClassName("headgear-radio");
	var torsoRadios = document.getElementById("torso-g-tbody").getElementsByClassName("torso-radio");
	var armsRadios = document.getElementById("arms-g-tbody").getElementsByClassName("arms-radio");
	var waistRadios = document.getElementById("waist-g-tbody").getElementsByClassName("waist-radio");
	var legsRadios = document.getElementById("legs-g-tbody").getElementsByClassName("legs-radio");

	function handleHeadgearClick(event) {
		var index = this.dataset.index;
		setHeadgear(window.armorDataG.headgear[index]);
		updateArmorStats();
	}
	for (var i = 0; i < headgearRadios.length; i++) {
		headgearRadios[i].dataset.index = i;
		headgearRadios[i].addEventListener("click", handleHeadgearClick);
	}

	function handleTorsoClick(event) {
		var index = this.dataset.index;
		setTorso(window.armorDataG.torso[index]);
		updateArmorStats();
	}
	for (var i = 0; i < torsoRadios.length; i++) {
		torsoRadios[i].dataset.index = i;
		torsoRadios[i].addEventListener("click", handleTorsoClick);
	}

	function handleArmsClick(event) {
		var index = this.dataset.index;
		setArms(window.armorDataG.arms[index]);
		updateArmorStats();
	}
	for (var i = 0; i < armsRadios.length; i++) {
		armsRadios[i].dataset.index = i;
		armsRadios[i].addEventListener("click", handleArmsClick);
	}

	function handleWaistClick(event) {
		var index = this.dataset.index;
		setWaist(window.armorDataG.waist[index]);
		updateArmorStats();
	}
	for (var i = 0; i < waistRadios.length; i++) {
		waistRadios[i].dataset.index = i;
		waistRadios[i].addEventListener("click", handleWaistClick);
	}

	function handleLegsClick(event) {
		var index = this.dataset.index;
		setLegs(window.armorDataG.legs[index]);
		updateArmorStats();
	}
	for (var i = 0; i < legsRadios.length; i++) {
		legsRadios[i].dataset.index = i;
		legsRadios[i].addEventListener("click", handleLegsClick);
	}

	function updateArmorResVisibility() {
		var armorResChecked = {};

		for (var i = 0; i < armorStatCheckboxes.length; i++) {
			armorResChecked[armorStatCheckboxes[i].value] = armorStatCheckboxes[i].checked;
		}

		var headgearRows = document.getElementById("headgear-g-tbody").children;
		for (var i = 0; i < headgearRows.length; i++) {
			headgearRows[i].style.display = shouldShowRow(window.armorDataG.headgear[i].res, armorResChecked) ? "" : "none";
		}

		var torsoRows = document.getElementById("torso-g-tbody").children;
		for (var i = 0; i < torsoRows.length; i++) {
			torsoRows[i].style.display = shouldShowRow(window.armorDataG.torso[i].res, armorResChecked) ? "" : "none";
		}

		var armsRows = document.getElementById("arms-g-tbody").children;
		for (var i = 0; i < armsRows.length; i++) {
			armsRows[i].style.display = shouldShowRow(window.armorDataG.arms[i].res, armorResChecked) ? "" : "none";
		}

		var waistRows = document.getElementById("waist-g-tbody").children;
		for (var i = 0; i < waistRows.length; i++) {
			waistRows[i].style.display = shouldShowRow(window.armorDataG.waist[i].res, armorResChecked) ? "" : "none";
		}

		var legsRows = document.getElementById("legs-g-tbody").children;
		for (var i = 0; i < legsRows.length; i++) {
			legsRows[i].style.display = shouldShowRow(window.armorDataG.legs[i].res, armorResChecked) ? "" : "none";
		}
	}
	for (var i = 0; i < armorStatCheckboxes.length; i++) {
		armorStatCheckboxes[i].addEventListener("click", updateArmorResVisibility);
	}
	updateArmorResVisibility();

	// Find selected armor if reloading page, or set all pieces to None
	(() => {
		var armorFound = false;
		for (let i = 0; i < headgearRadios.length; i++) {
			if (headgearRadios[i].checked) {
				armorFound = true;
				setHeadgear(window.armorDataG.headgear[headgearRadios[i].dataset.index]);
				break;
			}
		}
		if (!armorFound) {
			setHeadgear(currentArmor.headgear);
		}

		armorFound = false;
		for (let i = 0; i < torsoRadios.length; i++) {
			if (torsoRadios[i].checked) {
				armorFound = true;
				setTorso(window.armorDataG.torso[torsoRadios[i].dataset.index]);
				break;
			}
		}
		if (!armorFound) {
			setTorso(currentArmor.torso);
		}

		armorFound = false;
		for (let i = 0; i < armsRadios.length; i++) {
			if (armsRadios[i].checked) {
				armorFound = true;
				setArms(window.armorDataG.arms[armsRadios[i].dataset.index]);
				break;
			}
		}
		if (!armorFound) {
			setArms(currentArmor.arms);
		}

		armorFound = false;
		for (let i = 0; i < waistRadios.length; i++) {
			if (waistRadios[i].checked) {
				armorFound = true;
				setWaist(window.armorDataG.waist[waistRadios[i].dataset.index]);
				break;
			}
		}
		if (!armorFound) {
			setWaist(currentArmor.waist);
		}

		armorFound = false;
		for (let i = 0; i < legsRadios.length; i++) {
			if (legsRadios[i].checked) {
				armorFound = true;
				setLegs(window.armorDataG.legs[legsRadios[i].dataset.index]);
				break;
			}
		}
		if (!armorFound) {
			setLegs(currentArmor.legs);
		}

		updateArmorStats();
	}).call();
});
