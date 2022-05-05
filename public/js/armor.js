ready(() => {
	function getJson(path, callback) {
		var request = new XMLHttpRequest();
		request.open('GET', path, true);

		request.onreadystatechange = function() {
			if (this.readyState === 4) {
				if (this.status >= 200 && this.status < 400) {
					callback(JSON.parse(this.responseText));
				}
				else {
					console.error(this.responseText);
				}
			}
		};

		request.send();
		request = null;
	}

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

	var currentArmor = {};
	// TODO: set a flag after data is loaded
	getJson("/armor-data", (json) => {
		window.armorData = {
			helmets: json.helmets,
			torso: json.torso,
			arms: json.arms,
			waist: json.waist,
			legs: json.legs
		}

		currentArmor.head = armorData.helmets[0];
		currentArmor.torso = armorData.torso[0];
		currentArmor.arms = armorData.arms[0];
		currentArmor.waist = armorData.waist[0];
		currentArmor.legs = armorData.legs[0];

		var helmetRadios = document.getElementsByClassName("headgear-radio");
		var armorFound = false;
		for (let i = 0; i < helmetRadios.length; i++) {
			if (helmetRadios[i].checked) {
				armorFound = true;
				setHelmet(window.armorData.helmets[helmetRadios[i].dataset.index]);
				break;
			}
		}
		if (!armorFound) {
			setHelmet(currentArmor.head);
		}

		var torsoRadios = document.getElementsByClassName("torso-radio");
		armorFound = false;
		for (let i = 0; i < torsoRadios.length; i++) {
			if (torsoRadios[i].checked) {
				armorFound = true;
				setTorso(window.armorData.torso[torsoRadios[i].dataset.index]);
				break;
			}
		}
		if (!armorFound) {
			setTorso(currentArmor.torso);
		}

		var armRadios = document.getElementsByClassName("arm-radio");
		armorFound = false;
		for (let i = 0; i < armRadios.length; i++) {
			if (armRadios[i].checked) {
				armorFound = true;
				setArms(window.armorData.arms[armRadios[i].dataset.index]);
				break;
			}
		}
		if (!armorFound) {
			setArms(currentArmor.arms);
		}

		var waistRadios = document.getElementsByClassName("waist-radio");
		armorFound = false;
		for (let i = 0; i < waistRadios.length; i++) {
			if (waistRadios[i].checked) {
				armorFound = true;
				setWaist(window.armorData.waist[waistRadios[i].dataset.index]);
				break;
			}
		}
		if (!armorFound) {
			setWaist(currentArmor.waist);
		}

		var legRadios = document.getElementsByClassName("leg-radio");
		armorFound = false;
		for (let i = 0; i < legRadios.length; i++) {
			if (legRadios[i].checked) {
				armorFound = true;
				setLegs(window.armorData.legs[legRadios[i].dataset.index]);
				break;
			}
		}
		if (!armorFound) {
			setLegs(currentArmor.legs);
		}

		updateArmorStats();
	});

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
	builderToggle.addEventListener("click", toggleBuilder);

	function calculateDefense() {
		var defense = 0;
		if (currentArmor.head) {
			defense += currentArmor.head.def;
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
			currentArmor.head.res[0] + currentArmor.torso.res[0] + currentArmor.arms.res[0] + currentArmor.waist.res[0] + currentArmor.legs.res[0],
			currentArmor.head.res[1] + currentArmor.torso.res[1] + currentArmor.arms.res[1] + currentArmor.waist.res[1] + currentArmor.legs.res[1],
			currentArmor.head.res[2] + currentArmor.torso.res[2] + currentArmor.arms.res[2] + currentArmor.waist.res[2] + currentArmor.legs.res[2],
			currentArmor.head.res[3] + currentArmor.torso.res[3] + currentArmor.arms.res[3] + currentArmor.waist.res[3] + currentArmor.legs.res[3]
		];
	}
	function updateArmorStats() {
		// Reset health to account for any change to the Health skill
		window.eachElementByClassName("health-stat", (el) => el.innerText = "100");

		var defense = calculateDefense();
		window.eachElementByClassName("defense-stat", (el) => el.innerText = defense);

		var resistances = calculateRes();
		window.eachElementByClassName("fire-res", (el) => el.innerText = resistances[0]);
		window.eachElementByClassName("water-res", (el) => el.innerText = resistances[1]);
		window.eachElementByClassName("thunder-res", (el) => el.innerText = resistances[2]);
		window.eachElementByClassName("dragon-res", (el) => el.innerText = resistances[3]);

		// First, we have to calculate the Torso Up modifier by checking all non-torso armor pieces
		var torsoUpModifier = 1;
		function updateTorsoUp(skill) {
			if (skill.k == "Torso Up") {
				torsoUpModifier++;
			}
		}
		currentArmor.head.skills.forEach(updateTorsoUp);
		currentArmor.arms.skills.forEach(updateTorsoUp);
		currentArmor.waist.skills.forEach(updateTorsoUp);
		currentArmor.legs.skills.forEach(updateTorsoUp);
		// And now we apply it
		let torsoSkills = [];
		if (torsoUpModifier !== 1) {
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
		currentArmor.head.skills.forEach(parseSkills);
		torsoSkills.forEach(parseSkills);
		currentArmor.arms.skills.forEach(parseSkills);
		currentArmor.waist.skills.forEach(parseSkills);
		currentArmor.legs.skills.forEach(parseSkills);

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
							window.eachElementByClassName("health-stat", (el) => el.innerText = 100 + healthBonus);
							skillName = "Health " + (healthBonus > 0 ? "+" : "-") + healthBonus.toString();
						}
						else if (prop == "Defense") {
							let defenseBonus = SKILL_LEVELS[prop][skillIndex];
							window.eachElementByClassName("defense-stat", (el) => el.innerText = defense + defenseBonus);
							skillName = "Defense " + (defenseBonus > 0 ? "+" : "-") + defenseBonus.toString();
						}
						else if (prop == "Element Res Up") {
							let elementBonus = SKILL_LEVELS[prop][skillIndex];
							window.eachElementByClassName("fire-res", (el) => el.innerText = resistances[0] + elementBonus);
							window.eachElementByClassName("water-res", (el) => el.innerText = resistances[1] + elementBonus);
							window.eachElementByClassName("thunder-res", (el) => el.innerText = resistances[2] + elementBonus);
							window.eachElementByClassName("dragon-res", (el) => el.innerText = resistances[3] + elementBonus);
							skillName = "Element Res " + (elementBonus > 0 ? "+" : "-") + elementBonus.toString();
						}
						else if (prop == "Fire Resistance") {
							let elementBonus = SKILL_LEVELS[prop][skillIndex];
							window.eachElementByClassName("fire-res", (el) => el.innerText = resistances[0] + elementBonus);
							skillName = "Fire Res " + (elementBonus > 0 ? "+" : "-") + elementBonus.toString();
						}
						else if (prop == "Water Resistance") {
							let elementBonus = SKILL_LEVELS[prop][skillIndex];
							window.eachElementByClassName("water-res", (el) => el.innerText = resistances[1] + elementBonus);
							skillName = "Water Res " + (elementBonus > 0 ? "+" : "-") + elementBonus.toString();
						}
						else if (prop == "Thunder Resistance") {
							let elementBonus = SKILL_LEVELS[prop][skillIndex];
							window.eachElementByClassName("thunder-res", (el) => el.innerText = resistances[2] + elementBonus);
							skillName = "Thunder Res " + (elementBonus > 0 ? "+" : "-") + elementBonus.toString();
						}
						else if (prop == "Dragon Resistance") {
							let elementBonus = SKILL_LEVELS[prop][skillIndex];
							window.eachElementByClassName("dragon-res", (el) => el.innerText = resistances[3] + elementBonus);
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
		document.getElementById("armor-skills").innerHTML = skillRows.join("");
	}

	function setHelmet(helmetData) {
		currentArmor.head = helmetData;
		window.eachElementByClassName("helmet-name", (el) => el.innerText = helmetData.name);
	}
	function setTorso(torsoData) {
		currentArmor.torso = torsoData;
		window.eachElementByClassName("torso-name", (el) => el.innerText = torsoData.name);
	}
	function setArms(armsData) {
		currentArmor.arms = armsData;
		window.eachElementByClassName("arms-name", (el) => el.innerText = armsData.name);
	}
	function setWaist(waistData) {
		currentArmor.waist = waistData;
		window.eachElementByClassName("waist-name", (el) => el.innerText = waistData.name);
	}
	function setLegs(legsData) {
		currentArmor.legs = legsData;
		window.eachElementByClassName("legs-name", (el) => el.innerText = legsData.name);
	}

	function handleHelmetClick(event) {
		var index = this.dataset.index;
		setHelmet(window.armorData.helmets[index]);
		updateArmorStats();
	}
	window.eachElementByClassName("headgear-radio", (el, i) => {
		el.dataset.index = i;
		el.addEventListener("click", handleHelmetClick);
	});

	function handleTorsoClick(event) {
		var index = this.dataset.index;
		setTorso(window.armorData.torso[index]);
		updateArmorStats();
	}
	window.eachElementByClassName("torso-radio", (el, i) => {
		el.dataset.index = i;
		el.addEventListener("click", handleTorsoClick);
	});

	function handleArmsClick(event) {
		var index = this.dataset.index;
		setArms(window.armorData.arms[index]);
		updateArmorStats();
	}
	window.eachElementByClassName("arms-radio", (el, i) => {
		el.dataset.index = i;
		el.addEventListener("click", handleArmsClick);
	});

	function handleWaistClick(event) {
		var index = this.dataset.index;
		setWaist(window.armorData.waist[index]);
		updateArmorStats();
	}
	window.eachElementByClassName("waist-radio", (el, i) => {
		el.dataset.index = i;
		el.addEventListener("click", handleWaistClick);
	});

	function handleLegsClick(event) {
		var index = this.dataset.index;
		setLegs(window.armorData.legs[index]);
		updateArmorStats();
	}
	window.eachElementByClassName("legs-radio", (el, i) => {
		el.dataset.index = i;
		el.addEventListener("click", handleLegsClick);
	});
});
