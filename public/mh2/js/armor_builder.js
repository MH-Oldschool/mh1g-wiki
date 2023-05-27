function ArmorBuilder() {
	this.armorData = window.armorData;
	this.decorations = window.decorations;

	this.defenseUp = 0;
	this.resistancesUp = [0,0,0,0,0];

	this.currentArmor = {};
	this.weaponDecos = [{}, {}, {}];

	this.decoButtons = {
		headgear: document.querySelectorAll(".headgear-deco"),
		torso: document.querySelectorAll(".torso-deco"),
		arms: document.querySelectorAll(".arms-deco"),
		waist: document.querySelectorAll(".waist-deco"),
		legs: document.querySelectorAll(".legs-deco"),
		weapon: document.querySelectorAll(".weapon-deco")
	};
	this.decoIndices = {
		headgear: document.querySelectorAll(".headgear-deco-index"),
		torso: document.querySelectorAll(".torso-deco-index"),
		arms: document.querySelectorAll(".arms-deco-index"),
		waist: document.querySelectorAll(".waist-deco-index"),
		legs: document.querySelectorAll(".legs-deco-index"),
		weapon: document.querySelectorAll(".weapon-deco-index"),
	};
	this.armorDecosRows = {
		headgear: document.getElementById("headgear-decos-row"),
		torso: document.getElementById("torso-decos-row"),
		arms: document.getElementById("arms-decos-row"),
		waist: document.getElementById("waist-decos-row"),
		legs: document.getElementById("legs-decos-row"),
		weapon: document.getElementById("weapon-decos-row")
	}

	this.armorLevels = {
		headgear: document.getElementById("headgear-level"),
		torso: document.getElementById("torso-level"),
		arms: document.getElementById("arms-level"),
		waist: document.getElementById("waist-level"),
		legs: document.getElementById("legs-level")
	};

	var armorRadios = {
		headgear: document.getElementsByName("helm_armor"),
		torso: document.getElementsByName("torso_armor"),
		arms: document.getElementsByName("arm_armor"),
		waist: document.getElementsByName("waist_armor"),
		legs: document.getElementsByName("foot_armor")
	};
	var decoRadios = document.getElementsByName("decoration");

	// Try to circumvent JavaScript context nonsense
	var self = this;

	function handleArmorDecoClick(event) {
		var index = parseInt(event.target.dataset.index);
		var decoIndex = 0;
		var selectedDeco;
		for (let i = 0; i < decoRadios.length; i++) {
			if (decoRadios[i].checked) {
				decoIndex = decoRadios[i].value;
				if (decoIndex > 0) {
					selectedDeco = self.decorations.find(deco => deco.index == decoIndex);
				}
				break;
			}
		}

		var armorCategory = event.target.dataset.category;
		var slotCount = self.getSlotCount(armorCategory);

		if (decoIndex == 0) {
			var slotIndex = self.getDecoBaseSlotAtIndex(armorCategory, index);
			if (slotIndex != -1) {
				self.unsetDecoInSlot(armorCategory, slotIndex);
				self.updateDecoRows(armorCategory);
				self.updateArmorStats();
			}
		}
		else if (index < slotCount) {
			if (selectedDeco && (index + selectedDeco.slots) <= slotCount) {
				self.unsetDecoInSlot(armorCategory, index);
				self.setDecoInSlot(armorCategory, index, selectedDeco);
				self.updateDecoRows(armorCategory);
				self.updateArmorStats();
			}
		}
	}

	this.resetArmor();

	ArmorBuilder.CATEGORIES.forEach(armorCategory => {
		this.decoButtons[armorCategory].forEach(radio => radio.addEventListener("click", handleArmorDecoClick));

		for (let i = 0; i < armorRadios[armorCategory].length; i++) {
			armorRadios[armorCategory][i].addEventListener("click", (event) => {
				this.setArmorPiece(armorCategory, event.target.value);
				this.updateArmorStats();
			});
		}

		this.armorLevels[armorCategory].addEventListener("change", () => {
			self.unsetAllArmorDecos(armorCategory);
			self.updateArmorStats();
		});

		// Find selected armor if reloading page, or set the piece to None
		var armorFound = false;
		for (let i = 0; i < armorRadios[armorCategory].length; i++) {
			if (armorRadios[armorCategory][i].checked) {
				armorFound = true;
				this.setArmorPiece(armorCategory, armorRadios[armorCategory][i].value);
				// Get slotted decos from hidden inputs
				var hasDecos = false;
				this.decoIndices[armorCategory].forEach((decoIndex, slotIndex) => {
					if (decoIndex.value != 0) {
						hasDecos = true;
						var deco = this.decorations.find(deco => deco.index == decoIndex.value);
						this.setDecoInSlot(armorCategory, slotIndex, deco);
					}
				});

				if (hasDecos) {
					this.updateDecoRows(armorCategory);
				}

				break;
			}
		}
		if (!armorFound) {
			this.setArmorPiece(armorCategory, this.currentArmor[armorCategory].name);
		}
	});

	// Weapon decos
	this.decoButtons.weapon.forEach(radio => radio.addEventListener("click", handleArmorDecoClick));
	var hasDecos = false;
	this.decoIndices.weapon.forEach((decoIndex, slotIndex) => {
		if (decoIndex.value != 0) {
			hasDecos = true;
			var deco = this.decorations.find(deco => deco.index == decoIndex.value);
			this.setDecoInSlot("weapon", slotIndex, deco);
		}
	});
	if (hasDecos) {
		this.updateDecoRows("weapon");
	}

	this.updateArmorStats();
}
ArmorBuilder.CATEGORIES = ["headgear", "torso", "arms", "waist", "legs"];
ArmorBuilder.calculateDamageBlocked = function(defense) {
	return 1 - (80 / (defense + 80));
};
ArmorBuilder.calculateElementBlocked = function(defense, element) {
	return 1 - ((80 / (defense + 80)) * ((100 - element) / 100));
};
ArmorBuilder.prototype.calculateDefense = function() {
	var defense = 0;
	ArmorBuilder.CATEGORIES.forEach(armorCategory => {
		if (this.currentArmor[armorCategory]) {
			defense += this.currentArmor[armorCategory].defense[this.armorLevels[armorCategory].value];
		}
	});

	return defense + this.defenseUp;
};
ArmorBuilder.prototype.calculateRes = function() {
	var resistances = [ 0, 0, 0, 0, 0 ];
	function addResistance(res, index) { resistances[index] += res; }

	ArmorBuilder.CATEGORIES.forEach(armorCategory => {
		if (this.currentArmor[armorCategory].resistances) {
			this.currentArmor[armorCategory].resistances.forEach(addResistance);
		}
	});

	return resistances.map((res, index) => res + this.resistancesUp[index]);
};
ArmorBuilder.prototype.calculateSkills = function() {
	var skillRows = [];

	this.resistancesUp[0] = 0;
	this.resistancesUp[1] = 0;
	this.resistancesUp[2] = 0;
	this.resistancesUp[3] = 0;
	this.resistancesUp[4] = 0;

	// First, we have to calculate the Torso Up modifier by checking all non-torso armor pieces
	var torsoUpModifier = 1;
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
	// Sort armor skills
	var keyedSkills = {};
	if (this.currentArmor.torso.skills) {
		this.currentArmor.torso.skills.forEach(skill => {
			keyedSkills[skill.k] = skill.q;
		});

		// Add deco skills
		for (let i = 0; i < this.getSlotCount("torso"); i++) {
			var deco = this.currentArmor.torso.decos[i];
			if (deco.slots) {
				deco.skills.forEach(skill => {
					if (keyedSkills[skill.k]) {
						keyedSkills[skill.k] += parseInt(skill.q);
					}
					else {
						keyedSkills[skill.k] = parseInt(skill.q);
					}
				});
			}
		}
	}

	// Apply modifier
	for (let prop in keyedSkills) {
		if (keyedSkills.hasOwnProperty(prop)) {
			var quantity = keyedSkills[prop];
			if (torsoUpModifier !== 1) {
				quantity *= torsoUpModifier
			}

			torsoSkills.push({
				k: prop,
				q: quantity
			})
		}
	}

	var skillsParsed = {};
	function parseSkills(skill) {
		if (skillsParsed[skill.k]) {
			skillsParsed[skill.k] += parseInt(skill.q);
		}
		else {
			skillsParsed[skill.k] = parseInt(skill.q);
		}
	}
	function addDecoSkills(deco) {
		if (deco.slots) {
			deco.skills.forEach(parseSkills);
		}
	}

	if (this.currentArmor.headgear.skills) {
		this.currentArmor.headgear.skills.forEach(parseSkills);
		this.currentArmor.headgear.decos.forEach(addDecoSkills);
	}
	if (torsoSkills) torsoSkills.forEach(parseSkills);
	if (this.currentArmor.arms.skills) {
		this.currentArmor.arms.skills.forEach(parseSkills);
		this.currentArmor.arms.decos.forEach(addDecoSkills);
	}
	if (this.currentArmor.waist.skills) {
		this.currentArmor.waist.skills.forEach(parseSkills);
		this.currentArmor.waist.decos.forEach(addDecoSkills);
	}
	if (this.currentArmor.legs.skills) {
		this.currentArmor.legs.skills.forEach(parseSkills);
		this.currentArmor.legs.decos.forEach(addDecoSkills);
	}

	this.weaponDecos.forEach(deco => {
		if (deco.skills) {
			deco.skills.forEach(parseSkills);
		}
	});

	for (let prop in skillsParsed) {
		if (skillsParsed.hasOwnProperty(prop)) {
			let skillLevel = "none";
			let skillName = prop;

			if (window.armorSkills[prop]) {
				// Clamp the skill index to avoid getting "undefined" as a skill name
				let skillIndex = 0;
				if (skillsParsed[prop] <= -20) {
					skillIndex = 0;
				}
				else if (skillsParsed[prop] <= -15) {
					skillIndex = 1;
				}
				else if (skillsParsed[prop] <= -10) {
					skillIndex = 2;
				}
				else if (skillsParsed[prop] >= 25) {
					skillIndex = 6;
				}
				else if (skillsParsed[prop] >= 20) {
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
						this.defenseUp = window.armorSkills[prop][skillIndex];
						// document.getElementById("defense-stat").innerText = defense + defenseBonus;
						skillName = "Defense " + (this.defenseUp > 0 ? "+" : "") + this.defenseUp.toString();
					}
					else if (prop == "Element Res Up") {
						var elementBonus = window.armorSkills[prop][skillIndex];
						this.resistancesUp[0] = elementBonus;
						this.resistancesUp[1] = elementBonus;
						this.resistancesUp[2] = elementBonus;
						this.resistancesUp[3] = elementBonus;
						this.resistancesUp[4] = elementBonus;
						skillName = "Element Res " + (elementBonus > 0 ? "+" : "") + elementBonus.toString();
					}
					else if (prop == "Fire Resistance") {
						var elementBonus = window.armorSkills[prop][skillIndex];
						this.resistancesUp[0] = elementBonus;
						skillName = "Fire Res " + (elementBonus > 0 ? "+" : "") + elementBonus.toString();
					}
					else if (prop == "Water Resistance") {
						var elementBonus = window.armorSkills[prop][skillIndex];
						this.resistancesUp[1] = elementBonus;
						skillName = "Water Res " + (elementBonus > 0 ? "+" : "") + elementBonus.toString();
					}
					else if (prop == "Thunder Resistance") {
						var elementBonus = window.armorSkills[prop][skillIndex];
						this.resistancesUp[2] = elementBonus;
						skillName = "Thunder Res " + (elementBonus > 0 ? "+" : "") + elementBonus.toString();
					}
					else if (prop == "Ice Resistance") {
						var elementBonus = window.armorSkills[prop][skillIndex];
						this.resistancesUp[3] = elementBonus;
						skillName = "Ice Res " + (elementBonus > 0 ? "+" : "") + elementBonus.toString();
					}
					else if (prop == "Dragon Resistance") {
						var elementBonus = window.armorSkills[prop][skillIndex];
						this.resistancesUp[4] = elementBonus;
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

	ArmorBuilder.CATEGORIES.forEach(armorCategory => {
		if (this.currentArmor[armorCategory].gender == "Female") femalePartCount++;
		else if (this.currentArmor[armorCategory].gender == "Male") malePartCount++;
	});

	var gendersMixed = (femalePartCount !== 0) && (malePartCount !== 0);
	genderError.style.display = gendersMixed ? "block" : "";

	return gendersMixed;
};
ArmorBuilder.prototype.checkClassMismatch = function() {
	const classError = document.getElementById("class-mixing-error");

	// Show an error if there is a mix of Blademaster and Gunner armor
	var blademasterPartCount = 0;
	var gunnerPartCount = 0;

	ArmorBuilder.CATEGORIES.forEach(armorCategory => {
		if (this.currentArmor[armorCategory].class == "Blademaster") blademasterPartCount++;
		else if (this.currentArmor[armorCategory].class == "Gunner") gunnerPartCount++;
	});

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
ArmorBuilder.prototype.setArmorPiece = function(armorCategory, armorName) {
	const armorElement = document.getElementById(armorCategory + "-name");
	var armorPiece = this.armorData[armorCategory.substr(0, 1).toUpperCase() + armorCategory.substr(1)].find(armorPiece => armorPiece.name == armorName);

	if (!armorPiece) return false;

	this.currentArmor[armorCategory] = armorPiece;
	this.unsetAllArmorDecos(armorCategory);
	armorElement.innerText = this.currentArmor[armorCategory].name;
};
ArmorBuilder.prototype.resetArmor = function() {
	ArmorBuilder.CATEGORIES.forEach(armorCategory => this.setArmorPiece(armorCategory, "None"));
	this.weaponDecos = [{}, {}, {}];
};
ArmorBuilder.prototype.getOriginArmor = function(armorPiece, armorCategory) {
	var uppercaseArmorCategory = armorCategory[0].toUpperCase() + armorCategory.substring(1);
	return this.armorData[uppercaseArmorCategory].find(armor => {
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
	if (armorPiece.forge) {
		armorPiece.forge.forEach(addMaterial);
		for (var i = 0; i < levelIndex; i++) {
			if (armorPiece.upgradeLevels[i].materials) {
				armorPiece.upgradeLevels[i].materials.forEach(addMaterial);
			}
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
ArmorBuilder.prototype.setPieceDecoCount = function(armorCategory) {
	var slotCount = 0;
	if (this.currentArmor[armorCategory].slots) {
		slotCount = this.getSlotCount(armorCategory);
	}
	this.decoButtons[armorCategory].forEach((deco, index) => {
		var enable = index < slotCount;
		deco.disabled = !enable;
	});
};
ArmorBuilder.prototype.setDecoCounts = function() {
	ArmorBuilder.CATEGORIES.forEach(armorCategory => this.setPieceDecoCount(armorCategory));
};
ArmorBuilder.prototype.getSlotCount = function(armorCategory) {
	if (armorCategory == "weapon") {
		return 3;
	}
	return this.currentArmor[armorCategory].slots[this.armorLevels[armorCategory].value];
};
ArmorBuilder.prototype.getDecoBaseSlotAtIndex = function(armorCategory, slotIndex) {
	var slotCount = this.getSlotCount(armorCategory);
	var decos = armorCategory == "weapon" ? this.weaponDecos : this.currentArmor[armorCategory].decos;

	for (let i = 0; i < slotCount; i++) {
		if (decos[i] && decos[i].slots) {
			var decoSlotCount = decos[i].slots;
			if (i == slotIndex || i + decoSlotCount == slotIndex + 1) {
				return i;
			}
		}
	}

	return -1;
};
ArmorBuilder.prototype.updateDecoRows = function(armorCategory) {
	var armorRows = [];
	var decos = armorCategory == "weapon" ? this.weaponDecos : this.currentArmor[armorCategory].decos;

	decos.forEach(deco => {
		if (deco.slots) {
			var slotIcons = [];
			for (let i = 0; i < deco.slots; i++) {
				slotIcons.push(`<span class=\"deco-icon back-${ deco.color }\"></span>`);
			}

			var skills = deco.skills.map(skillData => {
				return `${ skillData.k } ${ skillData.q }`;
			});

			armorRows.push(`<li><span>${ deco.name }</span> ${ slotIcons.join("") } <span>${ skills.join(", ") }</span></li>`);
		}
	});

	this.armorDecosRows[armorCategory].innerHTML = armorRows.join("");
};
ArmorBuilder.prototype.setDecoInSlot = function(armorCategory, slotIndex, deco) {
	var isWeapon = armorCategory == "weapon";
	var decos = isWeapon ? this.weaponDecos : this.currentArmor[armorCategory].decos;

	// Only slot the deco if it fits
	var slotCount = this.getSlotCount(armorCategory);
	if (slotIndex + deco.slots <= slotCount) {
		// Unslot any gems this would overlap with
		for (let i = 0; i < slotCount; i++) {
			var decoSlots = decos[i].slots;
			if (decoSlots && i <= slotIndex + deco.slots - 1 && i + decoSlots - 1 >= slotIndex) {
				this.unsetDecoInSlot(armorCategory, i);
			}
		}

		if (isWeapon) {
			this.weaponDecos[slotIndex] = deco;
		}
		else {
			this.currentArmor[armorCategory].decos[slotIndex] = deco;
		}

		for (let i = 0; i < deco.slots; i++) {
			this.decoButtons[armorCategory][slotIndex + i].classList.add(deco.color);
		}

		this.decoIndices[armorCategory][slotIndex].value = deco.index;
	}
};
ArmorBuilder.prototype.unsetAllArmorDecos = function(armorCategory) {
	if (!this.currentArmor[armorCategory].decos) {
		this.currentArmor[armorCategory].decos = [{}, {}, {}];
	}

	for (let i = 0; i < this.currentArmor[armorCategory].decos.length; i++) {
		this.unsetDecoInSlot(armorCategory, i);
	}

	this.updateDecoRows(armorCategory);
};
ArmorBuilder.prototype.unsetDecoInSlot = function(armorCategory, slotIndex) {
	var isWeapon = armorCategory == "weapon";
	var decoSlots = isWeapon ? this.weaponDecos[slotIndex].slots : this.currentArmor[armorCategory].decos[slotIndex].slots;
	if (!decoSlots > 0) {
		decoSlots = 1;
	}
	for (let i = 0; i < decoSlots; i++) {
		this.decoButtons[armorCategory][slotIndex + i].classList.remove("blue","cyan","gray","green","purple","red","white","yellow");
		this.decoIndices[armorCategory][slotIndex].value = 0;
	}

	if (isWeapon) {
		this.weaponDecos[slotIndex] = {};
	}
	else {
		this.currentArmor[armorCategory].decos[slotIndex] = {};
	}
};
ArmorBuilder.prototype.sumMaterialsAndZenny = function() {
	// Sum up zenny cost and all required materials
	var totalCost = 0;
	var allMaterials = {};

	ArmorBuilder.CATEGORIES.forEach(armorCategory => {
		if (this.currentArmor[armorCategory].name != "None") {
			totalCost = this.getArmorCost(this.currentArmor[armorCategory], this.armorLevels[armorCategory].value, totalCost);
			allMaterials = this.getArmorMaterials(this.currentArmor[armorCategory], this.armorLevels[armorCategory].value, allMaterials);

			// Get origin armor materials too
			if (this.currentArmor[armorCategory].branch) {
				var originArmor = this.getOriginArmor(this.currentArmor[armorCategory], armorCategory);
				if (originArmor) {
					totalCost = this.getArmorCost(originArmor, originArmor.upgradeLevel, totalCost);
					allMaterials = this.getArmorMaterials(originArmor, originArmor.upgradeLevel, allMaterials);
				}
				else {
					console.warn("Unable to find origin armor for", this.currentArmor[armorCategory].name);
				}
			}

			// Also get deco costs and materials
			this.currentArmor[armorCategory].decos.forEach(deco => {
				if (deco.slots) {
					totalCost += deco.price;

					deco.forge.forEach(mat => {
						if (allMaterials[mat.m]) {
							allMaterials[mat.m] += parseInt(mat.q);
						}
						else {
							allMaterials[mat.m] = parseInt(mat.q);
						}
					});
				}
			});
		}
	});

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
	ArmorBuilder.CATEGORIES.forEach(armorCategory => {
		if (this.currentArmor[armorCategory].name != "None") {
			for (let i = 0; i < this.armorLevels[armorCategory].children.length; i++) {
				var disabled = i >= this.currentArmor[armorCategory].defense.length;
				this.armorLevels[armorCategory].children[i].disabled = disabled;
			}

			if (this.armorLevels[armorCategory].value >= this.currentArmor[armorCategory].defense.length) {
				this.armorLevels[armorCategory].value = this.currentArmor[armorCategory].defense.length - 1;
			}
		}
	});
};
ArmorBuilder.prototype.updateArmorStats = function() {
	// Reset health to account for any change to the Health skill
	document.getElementById("health-stat").innerText = "100";

	this.updateLevelOptions();
	this.calculateSkills();

	var defense = this.calculateDefense();
	document.getElementById("defense-stat").innerText = defense;
	var damageBlocked = ArmorBuilder.calculateDamageBlocked(defense);
	document.getElementById("defense-stat").innerHTML = `<span>${defense}</span><span class="true-value"> (${parseInt(damageBlocked * 100)}%)</span>`;

	var resistances = this.calculateRes();
	var trueResistances = resistances.map(element => ArmorBuilder.calculateElementBlocked(defense, element));
	document.getElementById("fire-res").innerHTML = `<span>${ resistances[0] }</span><span class="true-value"> (${ parseInt(trueResistances[0] * 100) }%)`;
	document.getElementById("water-res").innerHTML = `<span>${ resistances[1] }</span><span class="true-value"> (${ parseInt(trueResistances[1] * 100) }%)`;
	document.getElementById("thunder-res").innerHTML = `<span>${ resistances[2] }</span><span class="true-value"> (${ parseInt(trueResistances[2] * 100) }%)`;
	document.getElementById("ice-res").innerHTML = `<span>${ resistances[3] }</span><span class="true-value"> (${ parseInt(trueResistances[3] * 100) }%)`;
	document.getElementById("dragon-res").innerHTML = `<span>${ resistances[4] }</span><span class="true-value"> (${ parseInt(trueResistances[3] * 100) }%)`;

	this.setDecoCounts();

	this.sumMaterialsAndZenny();
	this.checkGenderMismatch();
	this.checkClassMismatch();
};
ArmorBuilder.prototype.unsetArmor = function() {
	this.resetArmor();
	this.updateArmorStats();
};
