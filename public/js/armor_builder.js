function ArmorBuilder(version, builderContainer) {
	this.version = version;
	this.armorData = version == "g" ? window.armorDataG : window.armorData1;
	this.currentArmor = {
		headgear: this.armorData.headgear[0],
		torso: this.armorData.torso[0],
		arms: this.armorData.arms[0],
		waist: this.armorData.waist[0],
		legs: this.armorData.legs[0]
	};

	this.headgearRadios = document.getElementById(`headgear-${ version }-tbody`).getElementsByClassName("headgear-radio");
	this.torsoRadios = document.getElementById(`torso-${ version }-tbody`).getElementsByClassName("torso-radio");
	this.armsRadios = document.getElementById(`arms-${ version }-tbody`).getElementsByClassName("arms-radio");
	this.waistRadios = document.getElementById(`waist-${ version }-tbody`).getElementsByClassName("waist-radio");
	this.legsRadios = document.getElementById(`legs-${ version }-tbody`).getElementsByClassName("legs-radio");

	// Try to circumvent JavaScript context nonsense
	var self = this;
	function handleHeadgearClick(event) {
		self.setHeadgear(self.armorData.headgear[event.target.dataset.index]);
		self.updateArmorStats();
	};
	function handleTorsoClick(event) {
		self.setTorso(self.armorData.torso[event.target.dataset.index]);
		self.updateArmorStats();
	};
	function handleArmsClick(event) {
		self.setArms(self.armorData.arms[event.target.dataset.index]);
		self.updateArmorStats();
	};
	function handleWaistClick(event) {
		self.setWaist(self.armorData.waist[event.target.dataset.index]);
		self.updateArmorStats();
	};
	function handleLegsClick(event) {
		self.setLegs(self.armorData.legs[event.target.dataset.index]);
		self.updateArmorStats();
	};
	for (let i = 0; i < this.headgearRadios.length; i++) {
		this.headgearRadios[i].dataset.index = i;
		this.headgearRadios[i].addEventListener("click", handleHeadgearClick);
	}
	for (let i = 0; i < this.torsoRadios.length; i++) {
		this.torsoRadios[i].dataset.index = i;
		this.torsoRadios[i].addEventListener("click", handleTorsoClick);
	}
	for (let i = 0; i < this.armsRadios.length; i++) {
		this.armsRadios[i].dataset.index = i;
		this.armsRadios[i].addEventListener("click", handleArmsClick);
	}
	for (let i = 0; i < this.waistRadios.length; i++) {
		this.waistRadios[i].dataset.index = i;
		this.waistRadios[i].addEventListener("click", handleWaistClick);
	}
	for (let i = 0; i < this.legsRadios.length; i++) {
		this.legsRadios[i].dataset.index = i;
		this.legsRadios[i].addEventListener("click", handleLegsClick);
	}

	if (version == "1") {
		// Populate skillset popup
		let skillSetRows = ArmorBuilder.SKILL_SETS.map((skillSet, index) => {
			let armorSetRow = `<tr><td><button class="skill-set-button" data-index=${ index }>Equip &rarr;</button></td>`;

			for (let i = 0; i < 5; i++) {
				armorSetRow += `<td>${ skillSet.armor[i] ? skillSet.armor[i] : "-" }</td>`
			}
			for (let i = 0; i < 3; i++) {
				armorSetRow += `<td>${ skillSet.skills[i] ? skillSet.skills[i] : "-" }</td>`;
			}

			armorSetRow += "</tr>";
			return armorSetRow;
		});
		document.getElementById("skill-set-popup-tbody").innerHTML = skillSetRows.join("");

		function handleSkillSetButtonClick(event) {
			// Assign full armor sets with skills for MH1
			var skillSet = ArmorBuilder.SKILL_SETS[event.target.dataset.index];

			if (skillSet.armor[0].length !== 0) {
				for (var i = 0; i < self.armorData.headgear.length; i++) {
					if (self.armorData.headgear[i].name == skillSet.armor[0]) {
						self.setHeadgear(self.armorData.headgear[i]);
						self.headgearRadios[i].checked = true;
						break;
					}
				}
			}

			if (skillSet.armor[1].length !== 0) {
				for (var i = 0; i < self.armorData.torso.length; i++) {
					if (self.armorData.torso[i].name == skillSet.armor[1]) {
						self.setTorso(self.armorData.torso[i]);
						self.torsoRadios[i].checked = true;
						break;
					}
				}
			}

			if (skillSet.armor[2].length !== 0) {
				for (var i = 0; i < self.armorData.arms.length; i++) {
					if (self.armorData.arms[i].name == skillSet.armor[2]) {
						self.setArms(self.armorData.arms[i]);
						self.armsRadios[i].checked = true;
						break;
					}
				}
			}

			if (skillSet.armor[3].length !== 0) {
				for (var i = 0; i < self.armorData.waist.length; i++) {
					if (self.armorData.waist[i].name == skillSet.armor[3]) {
						self.setWaist(self.armorData.waist[i]);
						self.waistRadios[i].checked = true;
						break;
					}
				}
			}

			if (skillSet.armor[4].length !== 0) {
				for (var i = 0; i < self.armorData.legs.length; i++) {
					if (self.armorData.legs[i].name == skillSet.armor[4]) {
						self.setLegs(self.armorData.legs[i]);
						self.legsRadios[i].checked = true;
						break;
					}
				}
			}

			self.updateArmorStats();

			builderContainer.classList.add("expanded");
			window.closePopup();
		}
		window.eachElementByClassName("skill-set-button", button => button.addEventListener("click", handleSkillSetButtonClick));
	}

	// Find selected armor if reloading page, or set all pieces to None
	var armorFound = false;
	for (let i = 0; i < this.headgearRadios.length; i++) {
		if (this.headgearRadios[i].checked) {
			armorFound = true;
			this.setHeadgear(this.armorData.headgear[this.headgearRadios[i].dataset.index]);
			break;
		}
	}
	if (!armorFound) {
		this.setHeadgear(this.currentArmor.headgear);
	}

	armorFound = false;
	for (let i = 0; i < this.torsoRadios.length; i++) {
		if (this.torsoRadios[i].checked) {
			armorFound = true;
			this.setTorso(this.armorData.torso[this.torsoRadios[i].dataset.index]);
			break;
		}
	}
	if (!armorFound) {
		this.setTorso(this.currentArmor.torso);
	}

	armorFound = false;
	for (let i = 0; i < this.armsRadios.length; i++) {
		if (this.armsRadios[i].checked) {
			armorFound = true;
			this.setArms(this.armorData.arms[this.armsRadios[i].dataset.index]);
			break;
		}
	}
	if (!armorFound) {
		this.setArms(this.currentArmor.arms);
	}

	armorFound = false;
	for (let i = 0; i < this.waistRadios.length; i++) {
		if (this.waistRadios[i].checked) {
			armorFound = true;
			this.setWaist(this.armorData.waist[this.waistRadios[i].dataset.index]);
			break;
		}
	}
	if (!armorFound) {
		this.setWaist(this.currentArmor.waist);
	}

	armorFound = false;
	for (let i = 0; i < this.legsRadios.length; i++) {
		if (this.legsRadios[i].checked) {
			armorFound = true;
			this.setLegs(this.armorData.legs[this.legsRadios[i].dataset.index]);
			break;
		}
	}
	if (!armorFound) {
		this.setLegs(this.currentArmor.legs);
	}

	this.updateArmorStats();
}
// Armor names are in this order: [headgear,torso,arms,waist,legs]
ArmorBuilder.SKILL_SETS = [
	{armor:["","Battle Mail","Battle Vambraces","Battle Tasset",""],skills:["Sharpness Restoration + 25%"]},
	{armor:["","Battle Vest","Battle Guards","Battle Coat",""],skills:["Reload + 1"]},
	{armor:["","Bone Mail","Bone Vambraces","","Bone Greaves"],skills:["Provocation","Stealing Negated","Hunger Halved"]},
	{armor:["","Bone Vest","Bone Guards","","Bone Leggings"],skills:["Provocation","Stealing Negated","Hunger Halved"]},
	{armor:["","Velociprey Mail","Velociprey Vambraces","","Velociprey Greaves"],skills:["Faint Negated"]},
	{armor:["","Velociprey Vest","Velociprey Guards","","Velociprey Leggings"],skills:["Faint Negated"]},
	{armor:["","Genprey Mail","Genprey Vambraces","","Genprey Greaves"],skills:["Stun Negated"]},
	{armor:["","Genprey Vest","Genprey Guards","","Genprey Leggings"],skills:["Stun Negated"]},
	{armor:["","Ioprey Mail","Ioprey Vambraces","","Ioprey Greaves"],skills:["Poison Negated"]},
	{armor:["","Ioprey Vest","Ioprey Guards","","Ioprey Leggings"],skills:["Poison Negated"]},
	{armor:["","Vespoid Mail","Vespoid Vambraces","Vespoid Tasset","Vespoid Greaves"],skills:["Sleep Negated"]},
	{armor:["","Vespoid Vest","Vespoid Guards","Vespoid Coat","Vespoid Leggings"],skills:["Sleep Negated"]},
	{armor:["","Hornet Mail","Hornet Vambraces","Hornet Tasset","Hornet Greaves"],skills:["Poison Negated"]},
	{armor:["","Hornet Vest","Hornet Guards","Hornet Coat","Hornet Leggings"],skills:["Poison Negated"]},
	{armor:["","Cephalos Mail","Cephalos Vambraces","","Cephalos Greaves"],skills:["High Speed Damage Recovery", "Sleep Halved"]},
	{armor:["","Cephalos Vest","Cephalos Guards","","Cephalos Leggings"],skills:["High Speed Damage Recovery", "Sleep Halved"]},
	// {armor:["","Steel Mail","Steel Vambraces","Steel Tasset",""],skills:["Item Combination Success + 10%"]}, // Only MH1 US/EU?
	{armor:["","Hi-Metal Mail","Hi-Metal Vambraces","Hi-Metal Tasset","Hi-Metal Greaves"],skills:["Health + 10"]},
	{armor:["","Hi-Metal Vest","Hi-Metal Guards","Hi-Metal Coat","Hi-Metal Leggings"],skills:["Health + 10"]},
	{armor:["","Kut-Ku Mail","Kut-Ku Vambraces","Kut-Ku Tasset",""],skills:["Attack Up [S]"]},
	{armor:["","Kut-Ku Vest","Kut-Ku Guards","Kut-Ku Coat",""],skills:["Attack Up [S]"]},
	{armor:["","Gypceros Mail","Gypceros Vambraces","Gypceros Tasset","Gypceros Greaves"],skills:["Wide Area Antidote","Health + 10"]},
	{armor:["","Gypceros Vest","Gypceros Guards","Gypceros Coat","Gypceros Leggings"],skills:["Wide Area Antidote","Health + 10"]},
	{armor:["","Khezu Mail","Khezu Vambraces","Khezu Tasset","Khezu Greaves"],skills:["High Speed Damage Recovery"]},
	{armor:["","Khezu Vest","Khezu Guards","Khezu Coat","Khezu Leggings"],skills:["High Speed Damage Recovery"]},
	{armor:["Plesioth Helm","Plesioth Mail","Plesioth Vambraces","","Plesioth Greaves"],skills:["Hunger Halved"]},
	{armor:["Plesioth Cap","Plesioth Vest","Plesioth Guards","","Plesioth Leggings"],skills:["Hunger Halved"]},
	{armor:["Lobster Helm","Lobster Mail","Lobster Vambraces","",""],skills:["Anti-Cold"]},
	{armor:["Lobster Helm","Lobster Vest","Lobster Guards","",""],skills:["Anti-Cold"]},
	{armor:["","Rathian Mail","Rathian Vambraces","","Rathian Greaves"],skills:["Provocation","Health + 20"]},
	{armor:["","Rathian Vest","Rathian Guards","","Rathian Leggings"],skills:["Provocation","Health + 20"]},
	{armor:["Rathalos Helm","Rathalos Mail","Rathalos Vambraces","","Rathalos Greaves"],skills:["Attack Up [L]","Provoke","Dragon - 10"]},
	{armor:["Rathalos Cap","Rathalos Vest","Rathalos Guards","","Rathalos Leggings"],skills:["Attack Up [L]","Provoke","Dragon - 10"]},
	{armor:["","Gravios Mail","Gravios Vambraces","Gravios Tasset","Gravios Greaves"],skills:["Health + 10"]},
	{armor:["","Gravios Vest","Gravios Guards","Gravios Coat","Gravios Leggings"],skills:["Health + 10"]},
	{armor:["Monoblos Helm","Monoblos Mail","Monoblos Vambraces","",""],skills:["Attack Up [L]","Stun Negated","Hunger x 1.5"]},
	{armor:["Monoblos Cap","Monoblos Vest","Monoblos Guards","",""],skills:["Attack Up [L]","Stun Negated","Hunger x 1.5"]},
	{armor:["Diablo Helm","Diablo Mail","Diablo Vambraces","",""],skills:["Anti-Wind"]},
	{armor:["Diablo Cap","Diablo Vest","Diablo Guards","",""],skills:["Anti-Wind"]},
	{armor:["","Vespoid Mail+","Vespoid Vambraces+","Vespoid Tasset+","Vespoid Greaves+"],skills:["Sleep Negated","Stun Halved","Poison Halved"]},
	{armor:["","Vespoid Vest+","Vespoid Guard+","Vespoid Coat+","Vespoid Leggings+"],skills:["Sleep Negated","Stun Halved","Poison Halved"]},
	{armor:["","Hornet Mail+","Hornet Vambraces+","Hornet Tasset+","Hornet Greaves+"],skills:["Poison Negated","Stun Negated"]},
	{armor:["","Hornet Vest+","Hornet Guard+","Hornet Coat+","Hornet Leggings+"],skills:["Poison Negated","Stun Negated"]},
	{armor:["","Hi-Metal Mail+","Hi-Metal Vambraces+","Hi-Metal Tasset+","Hi-Metal Greaves+"],skills:["Health + 30","Stealth","Hunger x 1.5"]},
	{armor:["","Hi-Metal Vest+","Hi-Metal Guard+","Hi-Metal Coat+","Hi-Metal Leggings+"],skills:["Health + 30","Stealth","Hunger x 1.5"]},
	{armor:["","Khezu Mail+","Khezu Vambraces+","Khezu Tasset+","Khezu Greaves+"],skills:["Wide Area Potion","Anti-Heat","Faint x 2"]},
	{armor:["","Khezu Vest+","Khezu Guard+","Khezu Coat+","Khezu Leggings+"],skills:["Wide Area Potion","Anti-Heat","Faint x 2"]},
	{armor:["Plesioth Helm+","Plesioth Mail+","Plesioth Vambraces+","","Plesioth Greaves+"],skills:["Hunger Halved","Anti-Heat","Faint x 2"]},
	{armor:["Plesioth Cap+","Plesioth Vest+","Plesioth Guard+","","Plesioth Leggings"],skills:["Hunger Halved","Anti-Heat","Faint x 2"]},
	{armor:["Lobster Helm+","Lobster Mail+","Lobster Vambraces+","",""],skills:["Anti-Cold","Faint Halved"]},
	{armor:["Lobster Helm+","Lobster Vest+","Lobster Guard+","",""],skills:["Anti-Cold","Faint Halved"]},
	{armor:["","Rathian Mail+","Rathian Vambraces+","Rathian Tasset+","Rathian Greaves+"],skills:["Provocation","Health + 30","Defense + 10"]},
	{armor:["","Rathian Vest+","Rathian Guard+","Rathian Coat+","Rathian Leggings+"],skills:["Provocation","Health + 30","Defense + 10"]},
	{armor:["","Rathalos Mail+","Rathalos Vambraces+","Rathalos Tasset+","Rathalos Greaves+"],skills:["Attack Up [L]","Provocation","High Speed Damage Recovery"]},
	{armor:["","Rathalos Vest+","Rathalos Guard+","Rathalos Coat+","Rathalos Leggings+"],skills:["Attack Up [L]","Provocation","High Speed Damage Recovery"]},
	{armor:["","Gravios Mail+","Gravios Vambraces+","Gravios Tasset+","Gravios Greaves+"],skills:["Health + 20","Anti-Heat","Hunger x 1.5"]},
	{armor:["","Gravios Vest+","Gravios Guard+","Gravios Coat+","Gravios Leggings+"],skills:["Health + 20","Anti-Heat","Hunger x 1.5"]},
	{armor:["Diablo Helm+","Diablo Mail+","Diablo Vambraces+","",""],skills:["Anti-Wind","Attack Up [S]","Hunger x 1.5"]},
	{armor:["Diablo Cap+","Diablo Vest+","Diablo Guard+","",""],skills:["Anti-Wind","Attack Up [S]","Hunger x 1.5"]},
	{armor:["Dragonhead","Dragonhide","Dragonclaw","Dragonwings","Dragonfeet"],skills:["Attack Up [S]","Anti-Wind","High Speed Damage Recovery"]},
	{armor:["Dragonface","Dragonskin","Dragonfist","Dragontail","Dragonlegs"],skills:["Attack Up [S]","Anti-Wind","High Speed Damage Recovery"]},
	{armor:["Guild Knight Feather","Guild Knight Suit","Guild Knight Gloves","Guild Knight Coat","Guild Knight Boots"],skills:["Gathering","Divine Toolsaver","Good Fortune"]},
	{armor:["Guild Knight Mask","Guild Knight Vest","Guild Knight Sleeves","Guild Knight Kilt","Guild Knight Tights"],skills:["Gathering","Divine Toolsaver","Good Fortune"]},
	{armor:["Maiden's Hat","Maiden's Vest","Maiden's Sleeves","Maiden's Skirt","Maiden's Stockings"],skills:["Gathering","Divine Toolsaver","Good Fortune"]},
	{armor:["Personal Hat","Personal Vest","Personal Sleeves","Personal Frills","Personal Tights"],skills:["Gathering","Divine Toolsaver","Good Fortune"]},
	{armor:["Auroros Helm","Auroros Torso","Auroros Gauntlets","Auroros Tasset","Auroros Pants"],skills:["High Speed Damage Recovery","Auto-Map","Sharpness Restoration + 50%"]},
	{armor:["Genesis Headpiece","Genesis Torso","Genesis Gauntlets","Genesis Tasset","Genesis Pants"],skills:["High Speed Damage Recovery","Auto-Map","Reload + 2"]},
	{armor:["Borealis Crown","Borealis Chest","Borealis Gauntlets","Borealis Tasset","Borealis Pants"],skills:["High Speed Damage Recovery","Auto-Map","Sharpness Restoration + 50%"]},
	{armor:["Glyph Crown","Glyph Chest","Glyph Gauntlets","Glyph Tasset","Glyph Pants"],skills:["High Speed Damage Recovery","Auto-Map","Reload + 2"]},
	{armor:["Borealis Crown","Borealis Chest","Borealis Gauntlets","Red Borealis Tasset","Red Borealis Pants"],skills:["High Speed Damage Recovery","Auto-Map","Fire + 25"]},
	{armor:["Glyph Crown","Glyph Chest","Glyph Gauntlets","Red Glyph Tasset","Red Glyph Pants"],skills:["High Speed Damage Recovery","Auto-Map","Fire + 25"]},
	{armor:["Shinobi Mask [Sun]","Shinobi Suit [Sun]","Shinobi Kote [Sun]","Shinobi Belt [Sun]","Shinobi Boots [Sun]"],skills:["Hunger Negated","Poison Negated","Stealth"]},
	{armor:["Shinobi Mask [Moon]","Shinobi Suit [Moon]","Shinobi Kote [Moon]","Shinobi Belt [Moon]","Shinobi Boots [Moon]"],skills:["Hunger Negated","Poison Negated","Stealth"]},
	{armor:["Moss Mask","Moss Breastplate","","",""],skills:["Hunger x 1.5"]},
	{armor:["Leather Helm","Leather Armor","Leather Vambraces","Light Belt","Green Pants"],skills:["Toolsaver"]},
	{armor:["","Chain Mail","Hunter Vambraces","","Hunter Greaves"],skills:["Defense + 5","Health + 10"]},
	{armor:["","Chain Mail","Hunter Guards","","Hunter Leggings"],skills:["Defense + 5","Health + 10"]},
	{armor:["Hunter Helm","Battle Mail","Battle Vambraces","Hunter Tasset","Battle Greaves"],skills:["Defense + 10","Health + 10"]},
	{armor:["Hunter Cap","Battle Vest","Battle Guards","Hunter Coat","Battle Leggings"],skills:["Defense + 10","Health + 10"]},
	{armor:["Battle Helm","Battle Mail","Chain Vambraces","Velociprey Tasset","Blue Pants"],skills:["Defense + 10","Health + 10"]},
	{armor:["Battle Cap","Battle Vest","Chain Vambraces","Velociprey Coat","Blue Pants"],skills:["Defense + 10","Health + 10"]},
	{armor:["","Kut-Ku Mail","Kut-Ku Vambraces","Ioprey Tasset","Rathalos Greaves"],skills:["Attack Up [S]","Health + 20","Stun x 2"]},
	{armor:["","Rathalos Vest","Rathalos Guards","Ioprey Coat","Dark Metal Boots"],skills:["Attack Up [S]","High Speed damage recovery","Stun x 2"]},
	{armor:["Rathalos Helm","Rathian Mail","Rathalos Vambraces","Rathalos Tasset","Rathian Greaves"],skills:["Fire + 25","Water - 10","Thunder - 10"]},
	{armor:["Rathalos Cap","Rathian Vest","Rathalos Guards","Rathalos Coat","Rathian Leggings"],skills:["Fire + 25","Water - 10","Thunder - 10"]},
	{armor:["Rathalos Helm","Rathian Mail","Rathalos Vambraces","Rathian Tasset","Rathalos Greaves"],skills:["Fire + 25","Water - 10","Thunder - 10"]},
	{armor:["Rathian Cap","Rathalos Vest","Rathian Guards","Rathalos Coat","Rathian Leggings"],skills:["Fire + 25","Water - 10","Thunder - 10"]},
	{armor:["Lobster Helm+","Lobster Mail+","Plesioth Vambraces+","","Plesioth Greaves+"],skills:["Fire - 10","Water + 25","Sleep Halved"]},
	{armor:["Plesioth Cap+","Lobster Vest+","Lobster Guard+","","Plesioth Leggings+"],skills:["Fire - 10","Water + 25","Sleep Halved"]},
	{armor:["Hi-Metal Helm+","Ioprey Mail","Hi-Metal Vambraces+","Ioprey Tasset","Gypceros Greaves"],skills:["Stun Halved","Water - 10","Thunder + 25"]},
	{armor:["Hi-Metal Cap+","Ioprey Vest","Hi-Metal Guard+","Ioprey Coat","Gypceros Leggings"],skills:["Stun Halved","Water - 10","Thunder + 25"]},
	{armor:["Hi-Metal Helm+","Ioprey Mail","Hi-Metal Vambraces+","Gypceros Tasset","Ioprey Greaves"],skills:["Stun Halved","Water - 10","Thunder + 25"]},
	{armor:["Hi-Metal Cap+","Ioprey Vest","Hi-Metal Guard+","GypcerosCoat","Silver Metal Boots"],skills:["Stun Halved","Water - 10","Thunder + 25"]},
	{armor:["","Khezu Mail+","Gravios Vambraces+","Gravios Tasset+","Khezu Greaves+"],skills:["Anti-Heat","Anti-Cold","Faint x 2"]},
	{armor:["","Khezu Vest+","Gravios Guard+","Gravios Coat+","Khezu Leggings+"],skills:["Anti-Heat","Anti-Cold","Faint x 2"]},
	{armor:["","Gravios Mail+","Gravios Vambraces+","Khezu Tasset+","Khezu Greaves+"],skills:["Anti-Heat","Anti-Cold","Faint x 2"]},
	{armor:["","Gravios Vest+","Gravios Guard+","Khezu Coat+","Khezu Leggings+"],skills:["Anti-Heat","Anti-Cold","Faint x 2"]},
	{armor:["Gypceros Helm","Khezu Mail+","Khezu Vambraces+","Gypceros Tasset","Gypceros Greaves"],skills:["Wide Area Potion","Wide Area Antidote","Bad Luck"]},
	{armor:["Gypceros Cap","Khezu Vest+","Khezu Guard+","Gypceros Coat","Gypceros Leggings"],skills:["Wide Area Potion","Wide Area Antidote","Bad Luck"]},
	{armor:["Khezu Helm+","Gypceros Mail","Gypceros Vambraces","Khezu Tasset+","Khezu Greaves+"],skills:["Wide Area Potion","Wide Area Antidote","Bad Luck"]},
	{armor:["Khezu Cap+","Gypceros Vest","Gypceros Guards","Khezu Coat+","Khezu Leggings+"],skills:["Wide Area Potion","Wide Area Antidote","Bad Luck"]},
	// {armor:["Skull Face","Dragon Hide","Hunter Vambraces","Velociprey Tasset","Rathalos Greaves"],skills:["Wide Area Power Seed","Wide Area Armor Seed","Sleep x 2"]},
	// {armor:["Skull Face","Dragon Skin","Hunter Guards","Velociprey Coat","Rathalos Leggings"],skills:["Wide Area Power Seed","Wide Area Armor Seed","Sleep x 2"]},
	// {armor:["Skull Face","Monoblos Mail","Rathian Vambraces","Dragon Wing","Dragon Foot"],skills:["Wide Area Power Seed","Wide Area Armor Seed","Sleep x 2"]},
	// {armor:["Skull Face","Monoblos Vest","Rathian Guards","Dragon Tail","Dragon Legs"],skills:["Wide Area Power Seed","Wide Area Armor Seed","Sleep x 2"]},
	{armor:["Velociprey Helm","Auroros Mail","Shinobi Vambraces [Sun]","Auroros Tasset","Shinobi Greaves [Sun]"],skills:["Automatic Marking"]},
	{armor:["Velociprey Cap","Genesis Vest","Shinobi Guard [Moon]","Genesis Coat","Shinobi Leggings [Moon]"],skills:["Automatic Marking"]},
	{armor:["Borealis Helm","Shinobi Mail [Sun]","Shinobi Vambraces [Sun]","Ioprey Tasset","Borealis Greaves"],skills:["Automatic Marking"]},
	{armor:["Glyph Cap","Shinobi Vest [Moon]","Shinobi Guard [Moon]","Ioprey Coat","Glyph Leggings"],skills:["Automatic Marking"]},
	{armor:["Gravios Helm+","Velociprey Vest","Hunter Vambraces","Hi-Metal Tasset+","Silver Metal Boots"],skills:["Automatic Marking","Provocation","Poison x 2"]},
	{armor:["Gravios Cap+","Velociprey Vest","Hunter Guards","Hi-Metal Coat+","Silver Metal Boots"],skills:["Automatic Marking","Provocation","Poison x 2"]},
	{armor:["Cephalos Helm","Hi-Metal Mail+","Cephalos Vambraces","Rathian Tasset","Velociprey Greaves"],skills:["Automatic Marking","Provocation","Poison x 2"]},
	{armor:["Cephalos Cap","Hi-Metal Mail+","Cephalos Guards","Rathian Tasset","Velociprey Leggings"],skills:["Automatic Marking","Provocation","Poison x 2"]},
	{armor:["Plesioth Cap+","Cephalos Mail","Khezu Vambraces+","Cephalos Tasset","Khezu Greaves+"],skills:["Health Recovery Items Improved","Faint x 2"]},
	{armor:["Plesioth Helm+","Cephalos Vest","Khezu Guard+","Cephalos Coat","Khezu Leggings+"],skills:["Health Recovery Items Improved","Faint x 2"]},
	{armor:["Velociprey Mask","Mosswine Mail","","Bone Coat",""],skills:["Faint Negated","Good Fortune"]},
	{armor:["Monoblos Helm","Hornet Mail+","Rathian Vambraces","Hi-Metal Tasset+","Rathalos Greaves"],skills:["Good Fortune"]},
	{armor:["Monoblos Helm","Hornet Vest+","Rathian Guards","Hi-Metal Coat+","Rathalos Leggings"],skills:["Good Fortune"]},
	{armor:["","Vespoid Mail+","Hornet Vambraces+","Hornet Tasset+","Vespoid Greaves+"],skills:["Dragon + 25"]},
	{armor:["","Vespoid Mail+","Vespoid Vambraces+","Hornet Tasset+","Hornet Greaves+"],skills:["Dragon + 25"]},
	{armor:["","Vespoid Vest+","Hornet Guard+","Vespoid Coat+","Hornet Leggings+"],skills:["Dragon + 25"]}
];
ArmorBuilder.SKILL_LEVELS = {
	"Health": [ -30,-20,-10,10,20,30 ], // Be sure to handle these special cases
	"Defense": [ -20,-15,-10,10,15,20 ], // Be sure to handle these special cases
	"Element Res Up": [ -10,-5,-3,3,5,10 ], // Be sure to handle these special cases
	"Fire Resistance": [ -10,-5,-3,3,5,10 ], // Be sure to handle these special cases
	"Water Resistance": [ -10,-5,-3,3,5,10 ], // Be sure to handle these special cases
	"Thunder Resistance": [ -10,-5,-3,3,5,10 ], // Be sure to handle these special cases
	"Dragon Resistance": [ -10,-5,-3,3,5,10 ], // Be sure to handle these special cases
	"Reload Speed": [ "Reload -3","Reload -2","Reload -1","Reload +1","Reload +2","Reload +3" ],
	"Recovery Speed": [ "Recovery Spd -2","","Recovery Spd -1","Recovery Spd +1","","Recovery Spd +2" ],
	"Combine Success": [ "Combine Success -15%","Combine Success -10%","Combine Success -5%","Combine Success +5%","Combine Success +10%","Combine Success +20%" ],
	"Poison": [ "Poison Quadrupled","Poison Tripled","Poison Doubled","Poison Halved","Poison Negated","" ],
	"Fate": [ "Disaster","","Bad Luck","Good Luck","Very Good Luck","" ],
	"Hunger": [ "Double Hunger","","Hunger x1.5","Hunger Halved","Hunger Negated","" ],
	"Heat Res": [ "Heat Doubled","","Heat x1.5","Heat Halved","Heat Negated","" ],
	"Cold Res": [ "Cold Doubled","","Cold x1.5","Cold Halved","Cold Negated","" ],
	"Normal S Add": [ "","","","Normal S Add 1","Normal S Add 2","Normal S Add 3" ],
	"Pierce S Add": [ "","","","Pierce S Add 1","Pierce S Add 2","Pierce S Add 3" ],
	"Crag S Add": [ "","","","Crag S Add 1","Crag S Add 2","Crag S Add 3" ],
	"Attack": [ "","","","Attack Up [S]","Attack Up [M]","Attack Up [L]" ],
	"Gluttony": [ "","","","Eating +1","Eating +2","Speed Eater" ], // ?? Probably the wrong skill names
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
	"Earplugs": [ "","","","Earplugs","High Grade Earplugs","" ],
	"Sharpener": [ "","","Sharpen Speed Halved","Sharpen Speed Increased","","" ], // Sharpening speed, I think
	"Sense": [ "","","Provocation","Stealth","","" ],
	"Recovery Items": [ "","","Recovery Items Weakened","Recovery Items Strengthened","","" ],
	"Protection": [ "","","Demonic Protection","Divine Protection","","" ],
	"Map": [ "","","No Map","Farsight","","" ],
	"Handicraft": [ "","","Sharpness Down","Sharpness Up","","" ],
	"Sharpness": [ "","","Blunt","Sharp Sword","","" ],
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
	"Backpacking": [ "","","","Backpacking Expert","","" ],
	"Flute": [ "","","","Flute Master","","" ],
	"Bomber": [ "","","","Bomber","","" ],
	"Status": [ "","","","Status Attack Up","","" ],
	"Bullet Formulation": [ "","","","Bullet Formulation","","" ],
	"Swordsmanship": [ "","","","ESP","","" ],
	"Rapid Fire": [ "","","","Rapid Fire","","" ]
};
ArmorBuilder.doesSkillSetMatch = function(skillset, armor) {
	if (skillset.armor[0] && skillset.armor[0] != armor.headgear.name) {
		return false;
	}
	if (skillset.armor[1] && skillset.armor[1] != armor.torso.name) {
		return false;
	}
	if (skillset.armor[2] && skillset.armor[2] != armor.arms.name) {
		return false;
	}
	if (skillset.armor[3] && skillset.armor[3] != armor.waist.name) {
		return false;
	}
	if (skillset.armor[4] && skillset.armor[4] != armor.legs.name) {
		return false;
	}

	return true;
};
ArmorBuilder.getSkillSet = function(armor) {
	// Filter out skillsets by armor category
	let possibleSkillSets = ArmorBuilder.SKILL_SETS.filter(set => set.armor[0] === "" || set.armor[0] == armor.headgear.name);
	if (possibleSkillSets.length === 1) {
		if (ArmorBuilder.doesSkillSetMatch(possibleSkillSets[0], armor)) {
			return possibleSkillSets[0].skills;
		}
	}
	else if (possibleSkillSets.length != 0) {
		possibleSkillSets = possibleSkillSets.filter(set => set.armor[1] === "" || set.armor[1] == armor.torso.name);
		if (possibleSkillSets.length === 1) {
			if (ArmorBuilder.doesSkillSetMatch(possibleSkillSets[0], armor)) {
				return possibleSkillSets[0].skills;
			}
		}
		else if (possibleSkillSets.length != 0) {
			possibleSkillSets = possibleSkillSets.filter(set => set.armor[2] === "" || set.armor[2] == armor.arms.name);
			if (possibleSkillSets.length === 1) {
				if (ArmorBuilder.doesSkillSetMatch(possibleSkillSets[0], armor)) {
					return possibleSkillSets[0].skills;
				}
			}
			else if (possibleSkillSets.length != 0) {
				possibleSkillSets = possibleSkillSets.filter(set => set.armor[3] === "" || set.armor[3] == armor.waist.name);
				if (possibleSkillSets.length === 1) {
					if (ArmorBuilder.doesSkillSetMatch(possibleSkillSets[0], armor)) {
						return possibleSkillSets[0].skills;
					}
				}
				else if (possibleSkillSets.length != 0) {
					possibleSkillSets = possibleSkillSets.filter(set => set.armor[4] === "" || set.armor[4] == armor.legs.name);
					if (possibleSkillSets.length === 1) {
						if (ArmorBuilder.doesSkillSetMatch(possibleSkillSets[0], armor)) {
							return possibleSkillSets[0].skills;
						}
					}
				}
			}
		}
	}

	return [];
};
ArmorBuilder.calculateDamageBlocked = function(defense) {
	return 1 - (80 / (defense + 80));
};
ArmorBuilder.prototype.calculateDefense = function() {
	let defense = 0;
	if (this.currentArmor.headgear) {
		defense += this.currentArmor.headgear.def;
	}
	if (this.currentArmor.torso) {
		defense += this.currentArmor.torso.def;
	}
	if (this.currentArmor.arms) {
		defense += this.currentArmor.arms.def;
	}
	if (this.currentArmor.waist) {
		defense += this.currentArmor.waist.def;
	}
	if (this.currentArmor.legs) {
		defense += this.currentArmor.legs.def;
	}

	return defense;
};
ArmorBuilder.prototype.calculateRes = function() {
	return [
		this.currentArmor.headgear.res[0] + this.currentArmor.torso.res[0] + this.currentArmor.arms.res[0] + this.currentArmor.waist.res[0] + this.currentArmor.legs.res[0],
		this.currentArmor.headgear.res[1] + this.currentArmor.torso.res[1] + this.currentArmor.arms.res[1] + this.currentArmor.waist.res[1] + this.currentArmor.legs.res[1],
		this.currentArmor.headgear.res[2] + this.currentArmor.torso.res[2] + this.currentArmor.arms.res[2] + this.currentArmor.waist.res[2] + this.currentArmor.legs.res[2],
		this.currentArmor.headgear.res[3] + this.currentArmor.torso.res[3] + this.currentArmor.arms.res[3] + this.currentArmor.waist.res[3] + this.currentArmor.legs.res[3]
	];
};
ArmorBuilder.prototype.calculateSkills = function() {
	let skillRows = [];
	let defense = this.calculateDefense();
	let resistances = this.getResistances();

	if (this.version == "1") {
		let armorSkills = ArmorBuilder.getSkillSet(this.currentArmor);
		if (armorSkills.length === 0) {
			document.getElementById(`armor-skills-${ this.version }`).innerHTML = "";
		}
		else {
			// Handle exceptional cases for stats
			if (armorSkills.includes("Health + 10")) document.getElementById(`health-stat-${ this.version }`).innerText = 100 + 10;
			else if (armorSkills.includes("Health + 20")) document.getElementById(`health-stat-${ this.version }`).innerText = 100 + 20;
			else if (armorSkills.includes("Health + 30")) document.getElementById(`health-stat-${ this.version }`).innerText = 100 + 30;

			if (armorSkills.includes("Defense + 5")) document.getElementById(`defense-stat-${ this.version }`).innerText = defense + 5;
			else if (armorSkills.includes("Defense + 10")) document.getElementById(`defense-stat-${ this.version }`).innerText = defense + 10;

			// How does Attack Up work?
			// if (armorSkills.includes("Attack Up [S]") document.getElementById(`attack-stat-${ this.version }`).innerText = "sm";
			// else if (armorSkills.includes("Attack Up [L]") document.getElementById(`attack-stat-${ this.version }`).innerText = "lg";

			if (armorSkills.includes("Fire + 25")) document.getElementById(`fire-res-${ this.version }`).innerText = resistances[0] + 25;
			else if (armorSkills.includes("Fire - 10")) document.getElementById(`fire-res-${ this.version }`).innerText = resistances[0] - 10;
			if (armorSkills.includes("Water + 25")) document.getElementById(`water-res-${ this.version }`).innerText = resistances[1] + 25;
			else if (armorSkills.includes("Water - 10")) document.getElementById(`water-res-${ this.version }`).innerText = resistances[1] - 10;
			if (armorSkills.includes("Thunder + 25")) document.getElementById(`thunder-res-${ this.version }`).innerText = resistances[2] + 25;
			else if (armorSkills.includes("Thunder - 10")) document.getElementById(`thunder-res-${ this.version }`).innerText = resistances[2] - 10;
			if (armorSkills.includes("Dragon + 25")) document.getElementById(`dragon-res-${ this.version }`).innerText = resistances[3] + 25;
			else if (armorSkills.includes("Dragon - 10")) document.getElementById(`dragon-res-${ this.version }`).innerText = resistances[3] - 10;

			skillRows = armorSkills.map(skill => "<tr skill-level-1><td>" + skill + "</td></tr>");
		}
	}
	else {
		// First, we have to calculate the Torso Up modifier by checking all non-torso armor pieces
		var torsoUpModifier = 1;
		function updateTorsoUp(skill) {
			if (skill.k == "Torso Up") {
				torsoUpModifier++;
			}
		}
		this.currentArmor.headgear.skills.forEach(updateTorsoUp);
		this.currentArmor.arms.skills.forEach(updateTorsoUp);
		this.currentArmor.waist.skills.forEach(updateTorsoUp);
		this.currentArmor.legs.skills.forEach(updateTorsoUp);
		// And now we apply it
		let torsoSkills = [];
		if (torsoUpModifier !== 1 && this.currentArmor.torso.skills) {
			torsoSkills = this.currentArmor.torso.skills.map((skill) => {
				return {
					k: skill.k,
					q: skill.q * torsoUpModifier
				};
			});
		}
		else {
			torsoSkills = this.currentArmor.torso.skills
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
		if (this.currentArmor.headgear.skills) this.currentArmor.headgear.skills.forEach(parseSkills);
		if (torsoSkills) torsoSkills.forEach(parseSkills);
		if (this.currentArmor.arms.skills) this.currentArmor.arms.skills.forEach(parseSkills);
		if (this.currentArmor.waist.skills) this.currentArmor.waist.skills.forEach(parseSkills);
		if (this.currentArmor.legs.skills) this.currentArmor.legs.skills.forEach(parseSkills);

		for (var prop in skillsParsed) {
			if (skillsParsed.hasOwnProperty(prop)) {
				var skillLevel = "none";
				var skillName = prop;

				if (ArmorBuilder.SKILL_LEVELS[prop]) {
					// Clamp the skill index to avoid getting "undefined" as a skill name
					var skillIndex = Math.max(0, Math.min(5, parseInt(skillsParsed[prop] / 5) + (skillsParsed[prop] < 0 ? 4 : 1)));

					if (skillsParsed[prop] <= -10 || 10 <= skillsParsed[prop]) {
						if (skillsParsed[prop] >= 10) {
							skillLevel = "positive";
						}
						else if (skillsParsed[prop] <= -10) {
							skillLevel = "negative";
						}
						// Special cases
						if (prop == "Health") {
							let healthBonus = ArmorBuilder.SKILL_LEVELS[prop][skillIndex];
							document.getElementById(`health-stat-${ this.version }`).innerText = 100 + healthBonus;
							skillName = "Health " + (healthBonus > 0 ? "+" : "") + healthBonus.toString();
						}
						else if (prop == "Defense") {
							let defenseBonus = ArmorBuilder.SKILL_LEVELS[prop][skillIndex];
							document.getElementById(`defense-stat-${ this.version }`).innerText = defense + defenseBonus;
							skillName = "Defense " + (defenseBonus > 0 ? "+" : "") + defenseBonus.toString();
						}
						else if (prop == "Element Res Up") {
							let elementBonus = ArmorBuilder.SKILL_LEVELS[prop][skillIndex];
							document.getElementById(`fire-res-${ this.version }`).innerText = resistances[0] + elementBonus;
							document.getElementById(`water-res-${ this.version }`).innerText = resistances[1] + elementBonus;
							document.getElementById(`thunder-res-${ this.version }`).innerText = resistances[2] + elementBonus;
							document.getElementById(`dragon-res-${ this.version }`).innerText = resistances[3] + elementBonus;
							skillName = "Element Res " + (elementBonus > 0 ? "+" : "") + elementBonus.toString();
						}
						else if (prop == "Fire Resistance") {
							let elementBonus = ArmorBuilder.SKILL_LEVELS[prop][skillIndex];
							document.getElementById(`fire-res-${ this.version }`).innerText = resistances[0] + elementBonus;
							skillName = "Fire Res " + (elementBonus > 0 ? "+" : "") + elementBonus.toString();
						}
						else if (prop == "Water Resistance") {
							let elementBonus = ArmorBuilder.SKILL_LEVELS[prop][skillIndex];
							document.getElementById(`water-res-${ this.version }`).innerText = resistances[1] + elementBonus;
							skillName = "Water Res " + (elementBonus > 0 ? "+" : "") + elementBonus.toString();
						}
						else if (prop == "Thunder Resistance") {
							let elementBonus = ArmorBuilder.SKILL_LEVELS[prop][skillIndex];
							document.getElementById(`thunder-res-${ this.version }`).innerText = resistances[2] + elementBonus;
							skillName = "Thunder Res " + (elementBonus > 0 ? "+" : "") + elementBonus.toString();
						}
						else if (prop == "Dragon Resistance") {
							let elementBonus = ArmorBuilder.SKILL_LEVELS[prop][skillIndex];
							document.getElementById(`dragon-res-${ this.version }`).innerText = resistances[3] + elementBonus;
							skillName = "Dragon Res " + (elementBonus > 0 ? "+" : "") + elementBonus.toString();
						}
						else {
							skillName = ArmorBuilder.SKILL_LEVELS[prop][skillIndex];
							while (!skillName && 0 <= skillIndex && skillIndex < 6) {
								if (skillsParsed[prop] < 0) {
									skillName = ArmorBuilder.SKILL_LEVELS[prop][++skillIndex];
								}
								else {
									skillName = ArmorBuilder.SKILL_LEVELS[prop][--skillIndex];
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
	}
	document.getElementById(`armor-skills-${ this.version }`).innerHTML = skillRows.join("");
};
ArmorBuilder.prototype.checkGenderMismatch = function() {
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
	document.getElementById(`gender-mixing-error-${ this.version }`).style.display = gendersMixed ? "block" : "";
};
ArmorBuilder.prototype.checkClassMismatch = function() {
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
	document.getElementById(`class-mixing-error-${ this.version }`).style.display = classesMixed ? "block" : "";
};
ArmorBuilder.prototype.getResistances = function() {
	return [
		parseInt(document.getElementById(`fire-res-${ this.version }`).innerText),
		parseInt(document.getElementById(`water-res-${ this.version }`).innerText),
		parseInt(document.getElementById(`thunder-res-${ this.version }`).innerText),
		parseInt(document.getElementById(`dragon-res-${ this.version }`).innerText)
	];
};
ArmorBuilder.prototype.setHeadgear = function(headgearData) {
	this.currentArmor.headgear = headgearData;
	document.getElementById(`headgear-name-${ this.version }`).innerText = headgearData.name;
};
ArmorBuilder.prototype.setTorso = function(torsoData) {
	this.currentArmor.torso = torsoData;
	document.getElementById(`torso-name-${ this.version }`).innerText = torsoData.name;
};
ArmorBuilder.prototype.setArms = function(armsData) {
	this.currentArmor.arms = armsData;
	document.getElementById(`arms-name-${ this.version }`).innerText = armsData.name;
};
ArmorBuilder.prototype.setWaist = function(waistData) {
	this.currentArmor.waist = waistData;
	document.getElementById(`waist-name-${ this.version }`).innerText = waistData.name;
};
ArmorBuilder.prototype.setLegs = function(legsData) {
	this.currentArmor.legs = legsData;
	document.getElementById(`legs-name-${ this.version }`).innerText = legsData.name;
};
ArmorBuilder.prototype.sumMaterialsAndZenny = function() {
	// Sum up zenny cost and all required materials
	let totalCost = 0;
	let allMaterials = {};
	if (this.currentArmor.headgear.forge) {
		totalCost += this.currentArmor.headgear.forge;

		this.currentArmor.headgear.mats.forEach((mat) => {
			if (allMaterials[mat.m]) {
				allMaterials[mat.m] += mat.q;
			}
			else {
				allMaterials[mat.m] = mat.q;
			}
		});
	}
	if (this.currentArmor.torso.forge) {
		totalCost += this.currentArmor.torso.forge;

		this.currentArmor.torso.mats.forEach((mat) => {
			if (allMaterials[mat.m]) {
				allMaterials[mat.m] += mat.q;
			}
			else {
				allMaterials[mat.m] = mat.q;
			}
		});
	}
	if (this.currentArmor.arms.forge) {
		totalCost += this.currentArmor.arms.forge;

		this.currentArmor.arms.mats.forEach((mat) => {
			if (allMaterials[mat.m]) {
				allMaterials[mat.m] += mat.q;
			}
			else {
				allMaterials[mat.m] = mat.q;
			}
		});
	}
	if (this.currentArmor.waist.forge) {
		totalCost += this.currentArmor.waist.forge;

		this.currentArmor.waist.mats.forEach((mat) => {
			if (allMaterials[mat.m]) {
				allMaterials[mat.m] += mat.q;
			}
			else {
				allMaterials[mat.m] = mat.q;
			}
		});
	}
	if (this.currentArmor.legs.forge) {
		totalCost += this.currentArmor.legs.forge;

		this.currentArmor.legs.mats.forEach((mat) => {
			if (allMaterials[mat.m]) {
				allMaterials[mat.m] += mat.q;
			}
			else {
				allMaterials[mat.m] = mat.q;
			}
		});
	}
	document.getElementById(`armor-cost-${ this.version }`).innerText = totalCost;

	var materialRows = [];
	var materialsTBody = document.getElementById(`armor-materials-${ this.version }`);
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
};
ArmorBuilder.prototype.updateArmorStats = function() {
	// Reset health to account for any change to the Health skill
	document.getElementById(`health-stat-${ this.version }`).innerText = "100";

	let defense = this.calculateDefense();
	let damageBlocked = ArmorBuilder.calculateDamageBlocked(defense);
	document.getElementById(`defense-stat-${ this.version }`).innerHTML = `<span>${defense}</span> <span class="true-value">(${parseInt(damageBlocked * 100)}%)</span>`;

	let resistances = this.calculateRes();
	document.getElementById(`fire-res-${ this.version }`).innerText = resistances[0];
	document.getElementById(`water-res-${ this.version }`).innerText = resistances[1];
	document.getElementById(`thunder-res-${ this.version }`).innerText = resistances[2];
	document.getElementById(`dragon-res-${ this.version }`).innerText = resistances[3];

	this.calculateSkills();
	this.sumMaterialsAndZenny();
	this.checkGenderMismatch();
	this.checkClassMismatch();
};
ArmorBuilder.prototype.unsetArmor = function() {
	this.currentArmor.headgear = this.armorData.headgear[0];
	this.currentArmor.torso = this.armorData.torso[0];
	this.currentArmor.arms = this.armorData.arms[0];
	this.currentArmor.waist = this.armorData.waist[0];
	this.currentArmor.legs = this.armorData.legs[0];

	this.updateArmorStats();
};
