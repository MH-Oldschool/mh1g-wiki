function ArmorBuilder() {
	this.armorData = window.armorData;

	this.currentArmor = {};
	this.resetArmor();

	this.headgearRadios = document.getElementsByName("helm_armor");
	this.torsoRadios = document.getElementsByName("torso_armor");
	this.armsRadios = document.getElementsByName("arm_armor");
	this.waistRadios = document.getElementsByName("waist_armor");
	this.legsRadios = document.getElementsByName("foot_armor");

	this.headgearLevel = document.getElementById("headgear-level");
	this.torsoLevel = document.getElementById("torso-level");
	this.armsLevel = document.getElementById("arms-level");
	this.waistLevel = document.getElementById("waist-level");
	this.legsLevel = document.getElementById("legs-level");

	// Try to circumvent JavaScript context nonsense
	var self = this;
	function handleHeadgearClick(event) {
		self.setHeadgear(event.target.value);
		self.updateArmorStats();
	};
	function handleTorsoClick(event) {
		self.setTorso(event.target.value);
		self.updateArmorStats();
	};
	function handleArmsClick(event) {
		self.setArms(event.target.value);
		self.updateArmorStats();
	};
	function handleWaistClick(event) {
		self.setWaist(event.target.value);
		self.updateArmorStats();
	};
	function handleLegsClick(event) {
		self.setLegs(event.target.value);
		self.updateArmorStats();
	};
	for (let i = 0; i < this.headgearRadios.length; i++) {
		this.headgearRadios[i].addEventListener("click", handleHeadgearClick);
	}
	for (let i = 0; i < this.torsoRadios.length; i++) {
		this.torsoRadios[i].addEventListener("click", handleTorsoClick);
	}
	for (let i = 0; i < this.armsRadios.length; i++) {
		this.armsRadios[i].addEventListener("click", handleArmsClick);
	}
	for (let i = 0; i < this.waistRadios.length; i++) {
		this.waistRadios[i].addEventListener("click", handleWaistClick);
	}
	for (let i = 0; i < this.legsRadios.length; i++) {
		this.legsRadios[i].addEventListener("click", handleLegsClick);
	}

	this.headgearLevel.addEventListener("change", () => { self.updateArmorStats(); });
	this.torsoLevel.addEventListener("change", () => { self.updateArmorStats(); });
	this.armsLevel.addEventListener("change", () => { self.updateArmorStats(); });
	this.waistLevel.addEventListener("change", () => { self.updateArmorStats(); });
	this.legsLevel.addEventListener("change", () => { self.updateArmorStats(); });

	// Find selected armor if reloading page, or set all pieces to None
	var armorFound = false;
	for (let i = 0; i < this.headgearRadios.length; i++) {
		if (this.headgearRadios[i].checked) {
			armorFound = true;
			this.setHeadgear(this.headgearRadios[i].value);
			break;
		}
	}
	if (!armorFound) {
		this.setHeadgear(this.currentArmor.headgear.name);
	}

	armorFound = false;
	for (let i = 0; i < this.torsoRadios.length; i++) {
		if (this.torsoRadios[i].checked) {
			armorFound = true;
			this.setTorso(this.torsoRadios[i].value);
			break;
		}
	}
	if (!armorFound) {
		this.setTorso(this.currentArmor.torso.name);
	}

	armorFound = false;
	for (let i = 0; i < this.armsRadios.length; i++) {
		if (this.armsRadios[i].checked) {
			armorFound = true;
			this.setArms(this.armsRadios[i].value);
			break;
		}
	}
	if (!armorFound) {
		this.setArms(this.currentArmor.arms.name);
	}

	armorFound = false;
	for (let i = 0; i < this.waistRadios.length; i++) {
		if (this.waistRadios[i].checked) {
			armorFound = true;
			this.setWaist(this.waistRadios[i].value);
			break;
		}
	}
	if (!armorFound) {
		this.setWaist(this.currentArmor.waist.name);
	}

	armorFound = false;
	for (let i = 0; i < this.legsRadios.length; i++) {
		if (this.legsRadios[i].checked) {
			armorFound = true;
			this.setLegs(this.legsRadios[i].value);
			break;
		}
	}
	if (!armorFound) {
		this.setLegs(this.currentArmor.legs.name);
	}

	this.updateArmorStats();
}
ArmorBuilder.calculateDamageBlocked = function(defense) {
	return 1 - (80 / (defense + 80));
};
ArmorBuilder.prototype.calculateDefense = function() {
	var defense = 0;
	if (this.currentArmor.headgear) {
		defense += this.currentArmor.headgear.defense[this.headgearLevel.value];
	}
	if (this.currentArmor.torso) {
		defense += this.currentArmor.torso.defense[this.torsoLevel.value];
	}
	if (this.currentArmor.arms) {
		defense += this.currentArmor.arms.defense[this.armsLevel.value];
	}
	if (this.currentArmor.waist) {
		defense += this.currentArmor.waist.defense[this.waistLevel.value];
	}
	if (this.currentArmor.legs) {
		defense += this.currentArmor.legs.defense[this.legsLevel.value];
	}

	return defense;
};
ArmorBuilder.prototype.calculateRes = function() {
	var resistances = [ 0, 0, 0, 0, 0 ];
	function addResistance(res, index) { resistances[index] += res; }

	if (this.currentArmor.headgear.res) {
		this.currentArmor.headgear.res.forEach(addResistance);
	}
	if (this.currentArmor.torso.res) {
		this.currentArmor.torso.res.forEach(addResistance);
	}
	if (this.currentArmor.arms.res) {
		this.currentArmor.arms.res.forEach(addResistance);
	}
	if (this.currentArmor.waist.res) {
		this.currentArmor.waist.res.forEach(addResistance);
	}
	if (this.currentArmor.legs.res) {
		this.currentArmor.legs.res.forEach(addResistance);
	}

	return resistances;
};
ArmorBuilder.prototype.calculateSkills = function() {
	var skillRows = [];
	var defense = this.calculateDefense();
	var resistances = this.getResistances();

	// First, we have to calculate the Torso Up modifier by checking all non-torso armor pieces
	var torsoUpModifier = 1;
	var torsoAdd1 = false;
	var torsoAdd2 = false;
	function updateTorsoSkills(skill) {
		if (skill.k == "Torso Up") {
			torsoUpModifier++;
			skill.q = 1;
		}
	}

	if (this.currentArmor.headgear.skills) {
		this.currentArmor.headgear.skills.forEach(updateTorsoSkills);
	}
	if (this.currentArmor.arms.skills) {
		this.currentArmor.arms.skills.forEach(updateTorsoSkills);
	}
	if (this.currentArmor.waist.skills) {
		this.currentArmor.waist.skills.forEach(updateTorsoSkills);
	}
	if (this.currentArmor.legs.skills) {
		this.currentArmor.legs.skills.forEach(updateTorsoSkills);
	}

	// And now we apply it
	var torsoSkills = [];
	if (this.currentArmor.torso.skills && (torsoUpModifier !== 1 || torsoAdd1 || torsoAdd2)) {
		torsoSkills = this.currentArmor.torso.skills.map((skill) => {
			var quantity = skill.q * torsoUpModifier;
			if (torsoAdd1) {
				quantity += 1;
			}
			if (torsoAdd2) {
				quantity += 2;
			}

			return {
				k: skill.k,
				q: quantity
			};
		});
	}
	else {
		torsoSkills = this.currentArmor.torso.skills;
	}

	var skillsParsed = {};
	function parseSkills(skill) {
		if (skillsParsed[skill.k]) {
			skillsParsed[skill.k] += skill.q;
		}
		else {
			skillsParsed[skill.k] = skill.q;
		}
	}
	// In case we get MH1-only armor, which has no skill points
	if (this.currentArmor.headgear.skills) this.currentArmor.headgear.skills.forEach(parseSkills);
	if (torsoSkills) torsoSkills.forEach(parseSkills);
	if (this.currentArmor.arms.skills) this.currentArmor.arms.skills.forEach(parseSkills);
	if (this.currentArmor.waist.skills) this.currentArmor.waist.skills.forEach(parseSkills);
	if (this.currentArmor.legs.skills) this.currentArmor.legs.skills.forEach(parseSkills);

	for (let prop in skillsParsed) {
		if (skillsParsed.hasOwnProperty(prop)) {
			let skillLevel = "none";
			let skillName = prop;

			if (window.armorSkills[prop]) {
				// Clamp the skill index to avoid getting "undefined" as a skill name
				let skillIndex = 0;
				if (skillsParsed[prop] <= -25) {
					skillIndex = 0;
				}
				else if (skillsParsed[prop] <= -15) {
					skillIndex = 1;
				}
				else if (skillsParsed[prop] <= -10) {
					skillIndex = 2;
				}
				else if (skillsParsed[prop] >= 25) {
					skillIndex = 5;
				}
				else if (skillsParsed[prop] >= 15) {
					skillIndex = 4;
				}
				else if (skillsParsed[prop] >= 10) {
					skillIndex = 3;
				}

				if (skillsParsed[prop] <= -10 || 10 <= skillsParsed[prop]) {
					if (skillsParsed[prop] >= 10) {
						skillLevel = "positive";
					}
					else if (skillsParsed[prop] <= -10) {
						skillLevel = "negative";
					}
					// Special cases
					if (prop == "Health") {
						var healthBonus = window.armorSkills[prop][skillIndex];
						document.getElementById("health-stat").innerText = 100 + healthBonus;
						skillName = "Health " + (healthBonus > 0 ? "+" : "") + healthBonus.toString();
					}
					else if (prop == "Defense") {
						var defenseBonus = window.armorSkills[prop][skillIndex];
						document.getElementById("defense-stat").innerText = defense + defenseBonus;
						skillName = "Defense " + (defenseBonus > 0 ? "+" : "") + defenseBonus.toString();
					}
					else if (prop == "Element Res Up") {
						var elementBonus = window.armorSkills[prop][skillIndex];
						document.getElementById("fire-res").innerText = resistances[0] + elementBonus;
						document.getElementById("water-res").innerText = resistances[1] + elementBonus;
						document.getElementById("thunder-res").innerText = resistances[2] + elementBonus;
						document.getElementById("ice-res").innerText = resistances[3] + elementBonus;
						document.getElementById("dragon-res").innerText = resistances[4] + elementBonus;
						skillName = "Element Res " + (elementBonus > 0 ? "+" : "") + elementBonus.toString();
					}
					else if (prop == "Fire Resistance") {
						var elementBonus = window.armorSkills[prop][skillIndex];
						document.getElementById("fire-res").innerText = resistances[0] + elementBonus;
						skillName = "Fire Res " + (elementBonus > 0 ? "+" : "") + elementBonus.toString();
					}
					else if (prop == "Water Resistance") {
						var elementBonus = window.armorSkills[prop][skillIndex];
						document.getElementById("water-res").innerText = resistances[1] + elementBonus;
						skillName = "Water Res " + (elementBonus > 0 ? "+" : "") + elementBonus.toString();
					}
					else if (prop == "Thunder Resistance") {
						var elementBonus = window.armorSkills[prop][skillIndex];
						document.getElementById("thunder-res").innerText = resistances[2] + elementBonus;
						skillName = "Thunder Res " + (elementBonus > 0 ? "+" : "") + elementBonus.toString();
					}
					else if (prop == "Ice Resistance") {
						var elementBonus = window.armorSkills[prop][skillIndex];
						document.getElementById("ice-res").innerText = resistances[3] + elementBonus;
						skillName = "Ice Res " + (elementBonus > 0 ? "+" : "") + elementBonus.toString();
					}
					else if (prop == "Dragon Resistance") {
						var elementBonus = window.armorSkills[prop][skillIndex];
						document.getElementById("dragon-res").innerText = resistances[4] + elementBonus;
						skillName = "Dragon Res " + (elementBonus > 0 ? "+" : "") + elementBonus.toString();
					}
					else {
						skillName = window.armorSkills[prop][skillIndex];
						while (!skillName && 0 <= skillIndex && skillIndex < 6) {
							if (skillsParsed[prop] < 0) {
								skillName = window.armorSkills[prop][++skillIndex];
							}
							else {
								skillName = window.armorSkills[prop][--skillIndex];
							}
						}
					}
				}
			}

			skillRows.push("<tr class=skill-level-" + skillLevel + "><td>" + skillName + "</td><td>" + skillsParsed[prop] + "</td></tr>");
		}
	}
	document.getElementById("armor-skills").innerHTML = skillRows.join("");
};
ArmorBuilder.prototype.checkGenderMismatch = function() {
	const genderError = document.getElementById("gender-mixing-error");

	// Show an error if mixing gendered pieces
	var femalePartCount = 0;
	var malePartCount = 0;

	if (this.currentArmor.headgear.gender == "Female") { femalePartCount++ }
	else if (this.currentArmor.headgear.gender == "Male") { malePartCount++ }
	if (this.currentArmor.torso.gender == "Female") { femalePartCount++ }
	else if (this.currentArmor.torso.gender == "Male") { malePartCount++ }
	if (this.currentArmor.arms.gender == "Female") { femalePartCount++ }
	else if (this.currentArmor.arms.gender == "Male") { malePartCount++ }
	if (this.currentArmor.waist.gender == "Female") { femalePartCount++ }
	else if (this.currentArmor.waist.gender == "Male") { malePartCount++ }
	if (this.currentArmor.legs.gender == "Female") { femalePartCount++ }
	else if (this.currentArmor.legs.gender == "Male") { malePartCount++ }

	var gendersMixed = (femalePartCount !== 0) && (malePartCount !== 0);
	genderError.style.display = gendersMixed ? "block" : "";

	return gendersMixed;
};
ArmorBuilder.prototype.checkClassMismatch = function() {
	const classError = document.getElementById("class-mixing-error");

	// Show an error if there is a mix of Blademaster and Gunner armor
	var blademasterPartCount = 0;
	var gunnerPartCount = 0;

	if (this.currentArmor.headgear.class == "Blademaster") { blademasterPartCount++ }
	else if (this.currentArmor.headgear.class == "Gunner") { gunnerPartCount++ }
	if (this.currentArmor.torso.class == "Blademaster") { blademasterPartCount++ }
	else if (this.currentArmor.torso.class == "Gunner") { gunnerPartCount++ }
	if (this.currentArmor.arms.class == "Blademaster") { blademasterPartCount++ }
	else if (this.currentArmor.arms.class == "Gunner") { gunnerPartCount++ }
	if (this.currentArmor.waist.class == "Blademaster") { blademasterPartCount++ }
	else if (this.currentArmor.waist.class == "Gunner") { gunnerPartCount++ }
	if (this.currentArmor.legs.class == "Blademaster") { blademasterPartCount++ }
	else if (this.currentArmor.legs.class == "Gunner") { gunnerPartCount++ }

	var classesMixed = (blademasterPartCount !== 0) && (gunnerPartCount !== 0);
	classError.style.display = classesMixed ? "block" : "";

	return classesMixed;
};
ArmorBuilder.prototype.getResistances = function() {
	return [
		parseInt(document.getElementById("fire-res").innerText),
		parseInt(document.getElementById("water-res").innerText),
		parseInt(document.getElementById("thunder-res").innerText),
		parseInt(document.getElementById("ice-res").innerText),
		parseInt(document.getElementById("dragon-res").innerText)
	];
};
ArmorBuilder.prototype.setHeadgear = function(headgearName) {
	const armorElement = document.getElementById("headgear-name");
	var armorPiece = this.armorData["Headgear"].find(armorPiece => armorPiece.name == headgearName);

	if (!armorPiece) return false;

	this.currentArmor.headgear = armorPiece;
	armorElement.innerText = this.currentArmor.headgear.name;
};
ArmorBuilder.prototype.setTorso = function(torsoIndex) {
	const armorElement = document.getElementById("torso-name");
	var armorPiece = this.armorData["Torso"].find(armorPiece => armorPiece.name == torsoIndex);

	if (!armorPiece) return false;

	this.currentArmor.torso = armorPiece;
	armorElement.innerText = this.currentArmor.torso.name;
};
ArmorBuilder.prototype.setArms = function(armsIndex) {
	const armorElement = document.getElementById("arms-name");
	var armorPiece = this.armorData["Arms"].find(armorPiece => armorPiece.name == armsIndex);

	if (!armorPiece) return false;

	this.currentArmor.arms = armorPiece;
	armorElement.innerText = this.currentArmor.arms.name;
};
ArmorBuilder.prototype.setWaist = function(waistIndex) {
	const armorElement = document.getElementById("waist-name");
	var armorPiece = this.armorData["Waist"].find(armorPiece => armorPiece.name == waistIndex);

	if (!armorPiece) return false;

	this.currentArmor.waist = armorPiece;
	armorElement.innerText = this.currentArmor.waist.name;
};
ArmorBuilder.prototype.setLegs = function(legsIndex) {
	const armorElement = document.getElementById("legs-name");
	var armorPiece = this.armorData["Legs"].find(armorPiece => armorPiece.name == legsIndex);

	if (!armorPiece) return false;

	this.currentArmor.legs = armorPiece;
	armorElement.innerText = this.currentArmor.legs.name;
};
ArmorBuilder.prototype.resetArmor = function() {
	this.setHeadgear("None");
	this.setTorso("None");
	this.setArms("None");
	this.setWaist("None");
	this.setLegs("None");
};
ArmorBuilder.prototype.getOriginArmor = function(armorPiece, armorCategory) {
	return this.armorData[armorCategory].find(armor => {
		if (armor.branching) {
			return armor.upgradeIndices.includes(armorPiece.index);
		}

		return false;
	});
};
ArmorBuilder.prototype.getArmorMaterials = function(armorPiece, levelIndex, allMaterials) {
	function addMaterial(mat) {
		if (allMaterials[mat.m]) {
			allMaterials[mat.m] += parseInt(mat.q);
		}
		else {
			allMaterials[mat.m] = parseInt(mat.q);
		}
	}
	armorPiece.forge.forEach(addMaterial);
	for (var i = 0; i < levelIndex; i++) {
		if (armorPiece.upgradeLevels[i].materials) {
			armorPiece.upgradeLevels[i].materials.forEach(addMaterial);
		}
	}

	return allMaterials;
};
ArmorBuilder.prototype.getArmorCost = function(armorPiece, levelIndex, totalCost) {
	if (armorPiece.cost) {
		totalCost += armorPiece.cost;
	}

	for (var i = 0; i < levelIndex; i++) {
		totalCost += parseInt(armorPiece.upgradeLevels[i].price);
	}

	return totalCost;
};
ArmorBuilder.prototype.sumMaterialsAndZenny = function() {
	// Sum up zenny cost and all required materials
	var totalCost = 0;
	var allMaterials = {};
	if (this.currentArmor.headgear.name != "None") {
		totalCost = this.getArmorCost(this.currentArmor.headgear, this.headgearLevel.value, totalCost);
		allMaterials = this.getArmorMaterials(this.currentArmor.headgear, this.headgearLevel.value, allMaterials);

		// Get origin armor materials too
		if (this.currentArmor.headgear.branch) {
			var originArmor = this.getOriginArmor(this.currentArmor.headgear, "Headgear");
			if (originArmor) {
				totalCost = this.getArmorCost(originArmor, originArmor.upgradeLevel, totalCost);
				allMaterials = this.getArmorMaterials(originArmor, originArmor.upgradeLevel, allMaterials);
			}
			else {
				console.warn("Unable to find origin armor for", this.currentArmor.headgear.name);
			}
		}
	}

	if (this.currentArmor.torso.name != "None") {
		totalCost = this.getArmorCost(this.currentArmor.torso, this.torsoLevel.value, totalCost);
		allMaterials = this.getArmorMaterials(this.currentArmor.torso, this.torsoLevel.value, allMaterials);

		// Get origin armor materials too
		if (this.currentArmor.torso.branch) {
			var originArmor = this.getOriginArmor(this.currentArmor.torso, "Torso");
			if (originArmor) {
				totalCost = this.getArmorCost(originArmor, originArmor.upgradeLevel, totalCost);
				allMaterials = this.getArmorMaterials(originArmor, originArmor.upgradeLevel, allMaterials);
			}
			else {
				console.warn("Unable to find origin armor for", this.currentArmor.torso.name);
			}
		}
	}

	if (this.currentArmor.arms.name != "None") {
		totalCost = this.getArmorCost(this.currentArmor.arms, this.armsLevel.value, totalCost);
		allMaterials = this.getArmorMaterials(this.currentArmor.arms, this.armsLevel.value, allMaterials);

		// Get origin armor materials too
		if (this.currentArmor.arms.branch) {
			var originArmor = this.getOriginArmor(this.currentArmor.arms, "Arms");
			if (originArmor) {
				totalCost = this.getArmorCost(originArmor, originArmor.upgradeLevel, totalCost);
				allMaterials = this.getArmorMaterials(originArmor, originArmor.upgradeLevel, allMaterials);
			}
			else {
				console.warn("Unable to find origin armor for", this.currentArmor.arms.name);
			}
		}
	}

	if (this.currentArmor.waist.name != "None") {
		totalCost = this.getArmorCost(this.currentArmor.waist, this.waistLevel.value, totalCost);
		allMaterials = this.getArmorMaterials(this.currentArmor.waist, this.waistLevel.value, allMaterials);

		// Get origin armor materials too
		if (this.currentArmor.waist.branch) {
			var originArmor = this.getOriginArmor(this.currentArmor.waist, "Waist");
			if (originArmor) {
				totalCost = this.getArmorCost(originArmor, originArmor.upgradeLevel, totalCost);
				allMaterials = this.getArmorMaterials(originArmor, originArmor.upgradeLevel, allMaterials);
			}
			else {
				console.warn("Unable to find origin armor for", this.currentArmor.waist.name);
			}
		}
	}

	if (this.currentArmor.legs.name != "None") {
		totalCost = this.getArmorCost(this.currentArmor.legs, this.legsLevel.value, totalCost);
		allMaterials = this.getArmorMaterials(this.currentArmor.legs, this.legsLevel.value, allMaterials);

		// Get origin armor materials too
		if (this.currentArmor.legs.branch) {
			var originArmor = this.getOriginArmor(this.currentArmor.legs, "Legs");
			if (originArmor) {
				totalCost = this.getArmorCost(originArmor, originArmor.upgradeLevel, totalCost);
				allMaterials = this.getArmorMaterials(originArmor, originArmor.upgradeLevel, allMaterials);
			}
			else {
				console.warn("Unable to find origin armor for", this.currentArmor.legs.name);
			}
		}
	}
	document.getElementById("armor-cost").innerText = totalCost;

	var materialRows = [];
	var materialsTBody = document.getElementById("armor-materials");
	for (let matName in allMaterials) {
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
};
ArmorBuilder.prototype.updateLevelOptions = function() {
	if (this.currentArmor.headgear.name != "None") {
		for (let i = 0; i < this.headgearLevel.children.length; i++) {
			var disabled = i >= this.currentArmor.headgear.defense.length;
			this.headgearLevel.children[i].disabled = disabled;
		}

		if (this.headgearLevel.value >= this.currentArmor.headgear.defense.length) {
			this.headgearLevel.value = this.currentArmor.headgear.defense.length - 1;
		}
	}

	if (this.currentArmor.torso.name != "None") {
		for (let i = 0; i < this.torsoLevel.children.length; i++) {
			var disabled = i >= this.currentArmor.torso.defense.length;
			this.torsoLevel.children[i].disabled = disabled;
		}

		if (this.torsoLevel.value >= this.currentArmor.torso.defense.length) {
			this.torsoLevel.value = this.currentArmor.torso.defense.length - 1;
		}
	}

	if (this.currentArmor.arms.name != "None") {
		for (let i = 0; i < this.armsLevel.children.length; i++) {
			var disabled = i >= this.currentArmor.arms.defense.length;
			this.armsLevel.children[i].disabled = disabled;
		}

		if (this.armsLevel.value >= this.currentArmor.arms.defense.length) {
			this.armsLevel.value = this.currentArmor.arms.defense.length - 1;
		}
	}

	if (this.currentArmor.waist.name != "None") {
		for (let i = 0; i < this.waistLevel.children.length; i++) {
			var disabled = i >= this.currentArmor.waist.defense.length;
			this.waistLevel.children[i].disabled = disabled;
		}

		if (this.waistLevel.value >= this.currentArmor.waist.defense.length) {
			this.waistLevel.value = this.currentArmor.waist.defense.length - 1;
		}
	}

	if (this.currentArmor.legs.name != "None") {
		for (let i = 0; i < this.legsLevel.children.length; i++) {
			var disabled = i >= this.currentArmor.legs.defense.length;
			this.legsLevel.children[i].disabled = disabled;
		}

		if (this.legsLevel.value >= this.currentArmor.legs.defense.length) {
			this.legsLevel.value = this.currentArmor.legs.defense.length - 1;
		}
	}
};
ArmorBuilder.prototype.updateArmorStats = function() {
	// Reset health to account for any change to the Health skill
	document.getElementById("health-stat").innerText = "100";

	this.updateLevelOptions();

	var defense = this.calculateDefense();
	var damageBlocked = ArmorBuilder.calculateDamageBlocked(defense);
	document.getElementById("defense-stat").innerHTML = `<span>${defense}</span> <span class="true-value">(${parseInt(damageBlocked * 100)}%)</span>`;

	var resistances = this.calculateRes();
	document.getElementById("fire-res").innerText = resistances[0];
	document.getElementById("water-res").innerText = resistances[1];
	document.getElementById("thunder-res").innerText = resistances[2];
	document.getElementById("ice-res").innerText = resistances[3];
	document.getElementById("dragon-res").innerText = resistances[4];

	this.calculateSkills();
	this.sumMaterialsAndZenny();
	this.checkGenderMismatch();
	this.checkClassMismatch();
};
ArmorBuilder.prototype.unsetArmor = function() {
	this.resetArmor();
	this.updateArmorStats();
};
