ready(() => {
	var currentArmor = {
		headgear: window.armorData1.headgear[0],
		torso: window.armorData1.torso[0],
		arms: window.armorData1.arms[0],
		waist: window.armorData1.waist[0],
		legs: window.armorData1.legs[0]
	};

	function handleArmorGenderChange(event) {
		switch (this.value) {
			case "a":
				document.body.classList.remove("show-female","show-male");
				break;
			case "f":
				document.body.classList.add("show-female");
				document.body.classList.remove("show-male");
				break;
			case "m":
				document.body.classList.add("show-male");
				document.body.classList.remove("show-female");
				break;
		}
	}
	var armorGenderRadios = document.getElementsByName("armor-gender");
	for (let i = 0; i < armorGenderRadios.length; i++) {
		armorGenderRadios[i].addEventListener("click", handleArmorGenderChange);
	}

	function handleArmorClassChange(event) {
		switch (this.value) {
			case "a":
				document.body.classList.remove("show-blade","show-gun","show-either");
				break;
			case "b":
				document.body.classList.add("show-blade");
				document.body.classList.remove("show-gun","show-either");
				break;
			case "g":
				document.body.classList.add("show-gun");
				document.body.classList.remove("show-blade","show-either");
				break;
			case "e":
				document.body.classList.add("show-either");
				document.body.classList.remove("show-blade","show-gun");
				break;
		}
	}
	var armorClassRadios = document.getElementsByName("armor-class");
	for (let i = 0; i < armorClassRadios.length; i++) {
		armorClassRadios[i].addEventListener("click", handleArmorClassChange);
	}

	// Show/hide armor based on elemental res
	var armorStatCheckboxes = document.getElementsByName("armor-stat");
	function shouldShowRow(resistances, checked) {
		var matchesFireRes = (checked["f+"] && resistances[0] >= 0) || (checked["f-"] && resistances[0] <= 0) || (!checked["f+"] && !checked["f-"]);
		var matchesWaterRes = (checked["w+"] && resistances[1] >= 0) || (checked["w-"] && resistances[1] <= 0) || (!checked["w+"] && !checked["w-"]);
		var matchesThunderRes = (checked["t+"] && resistances[2] >= 0) || (checked["t-"] && resistances[2] <= 0) || (!checked["t+"] && !checked["t-"]);
		var matchesDragonRes = (checked["d+"] && resistances[3] >= 0) || (checked["d-"] && resistances[3] <= 0) || (!checked["d+"] && !checked["d-"]);

		return matchesFireRes && matchesWaterRes && matchesThunderRes && matchesDragonRes;
	}

	function unsetArmor() {
		currentArmor.headgear = window.armorDataG.headgear[0];
		currentArmor.torso = window.armorDataG.torso[0];
		currentArmor.arms = window.armorDataG.arms[0];
		currentArmor.waist = window.armorDataG.waist[0];
		currentArmor.legs = window.armorDataG.legs[0];

		updateArmorStats();
	}
	document.body.addEventListener("g-toggle", () => {
		unsetArmor();
		closePopup();
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

	// Armor names are in this order: [headgear,torso,arms,waist,legs]
	var SKILL_SETS = [
		{armor:["","Battle Mail","Battle Vambraces","Battle Tasset",""],skills:["Sharpness Restoration + 25%"]},
		{armor:["","Battle Vest","Battle Guards","Battle Coat",""],skills:["Reload Speed + 1"]},
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
		{armor:["","Cephalos Mail","Cephalos Vambraces","","Cephalos Greaves"],skills:["High-Speed Damage Recovery", "Sleep Halved"]},
		{armor:["","Cephalos Vest","Cephalos Guards","","Cephalos Leggings"],skills:["High-Speed Damage Recovery", "Sleep Halved"]},
		{armor:["","Steel Mail","Steel Vambraces","Steel Tasset",""],skills:["Item Combination Success + 10%"]},
		{armor:["","Hi-Metal Mail","Hi-Metal Vambraces","Hi-Metal Tasset","Hi-Metal Greaves"],skills:["Health + 10"]},
		{armor:["","Hi-Metal Vest","Hi-Metal Guards","Hi-Metal Coat","Hi-Metal Leggings"],skills:["Health + 10"]},
		{armor:["","Kut-Ku Mail","Kut-Ku Vambraces","Kut-Ku Tasset",""],skills:["Attack Up [small]"]},
		{armor:["","Kut-Ku Vest","Kut-Ku Guards","Kut-Ku Coat",""],skills:["Attack Up [small]"]},
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
		{armor:["Rathalos Helm","Rathalos Mail","Rathalos Vambraces","","Rathalos Greaves"],skills:["Attack Up [big]","Provoke","Dragon - 10"]},
		{armor:["Rathalos Cap","Rathalos Vest","Rathalos Guards","","Rathalos Leggings"],skills:["Attack Up [big]","Provoke","Dragon - 10"]},
		{armor:["","Gravios Mail","Gravios Vambraces","Gravios Tasset","Gravios Greaves"],skills:["Health + 10"]},
		{armor:["","Gravios Vest","Gravios Guards","Gravios Coat","Gravios Leggings"],skills:["Health + 10"]},
		{armor:["Monoblos Helm","Monoblos Mail","Monoblos Vambraces","",""],skills:["Attack Up [big]","Stun Negated","Hunger x 1.5"]},
		{armor:["Monoblos Cap","Monoblos Vest","Monoblos Guards","",""],skills:["Attack Up [big]","Stun Negated","Hunger x 1.5"]},
		{armor:["Diablo Helm","Diablo Mail","Diablo Vambraces","",""],skills:["Anti-Wind"]},
		{armor:["Diablo Cap","Diablo Vest","Diablo Guards","",""],skills:["Anti-Wind"]},
		{armor:["","Vespoid Mail+","Vespoid Vambraces+","Vespoid Tasset+","Vespoid Greaves+"],skills:["Sleep Negated","Stun Halved","Poison Halved"]},
		{armor:["","Vespoid Vest+","Vespoid Guard+","Vespoid Coat+","Vespoid Leggings+"],skills:["Sleep Negated","Stun Halved","Poison Halved"]},
		{armor:["","Hornet Mail+","Hornet Vambraces+","Hornet Tasset+","Hornet Greaves+"],skills:["Poison Negated","Stun Negated"]},
		{armor:["","Hornet Vest+","Hornet Guard+","Hornet Coat+","Hornet Leggings+"],skills:["Poison Negated","Stun Negated"]},
		{armor:["","Steel Mail+","Steel Vambraces+","Steel Tasset+",""],skills:["Item Combination Success + 20%"]},
		{armor:["","Hi-Metal Mail+","Hi-Metal Vambraces+","Hi-Metal Tasset+","Hi-Metal Greaves+"],skills:["Health + 30","Stealth","Hunger x 1.5"]},
		{armor:["","Hi-Metal Vest+","Hi-Metal Guard+","Hi-Metal Coat+","Hi-Metal Leggings+"],skills:["Health + 30","Stealth","Hunger x 1.5"]},
		{armor:["","Kut-Ku Mail+","Kut-Ku Vambraces+","Kut-Ku Tasset+",""],skills:["Attack Up [small]","Faint Halved"]},
		{armor:["","Kut-Ku Vest+","Kut-Ku Guard+","Kut-Ku Coat+",""],skills:["Attack Up [small]","Faint Halved"]},
		{armor:["","Khezu Mail+","Khezu Vambraces+","Khezu Tasset+","Khezu Greaves+"],skills:["Wide Area Potion","Anti-Heat","Faint x 2"]},
		{armor:["","Khezu Vest+","Khezu Guard+","Khezu Coat+","Khezu Leggings+"],skills:["Wide Area Potion","Anti-Heat","Faint x 2"]},
		{armor:["Plesioth Helm+","Plesioth Mail+","Plesioth Vambraces+","","Plesioth Greaves+"],skills:["Hunger Halved","Anti-Heat","Faint x 2"]},
		{armor:["Plesioth Cap+","Plesioth Vest+","Plesioth Guard+","","Plesioth Leggings"],skills:["Hunger Halved","Anti-Heat","Faint x 2"]},
		{armor:["Lobster Helm+","Lobster Mail+","Lobster Vambraces+","",""],skills:["Anti-Cold","Faint Halved"]},
		{armor:["Lobster Helm+","Lobster Vest+","Lobster Guard+","",""],skills:["Anti-Cold","Faint Halved"]},
		{armor:["","Rathian Mail+","Rathian Vambraces+","Rathian Tasset+","Rathian Greaves+"],skills:["Provocation","Health + 30","Defense + 10"]},
		{armor:["","Rathian Vest+","Rathian Guard+","Rathian Coat+","Rathian Leggings+"],skills:["Provocation","Health + 30","Defense + 10"]},
		{armor:["","Rathalos Mail+","Rathalos Vambraces+","Rathalos Tasset+","Rathalos Greaves+"],skills:["Attack Up [big]","Provocation","High Speed Damage Recovery"]},
		{armor:["","Rathalos Vest+","Rathalos Guard+","Rathalos Coat+","Rathalos Leggings+"],skills:["Attack Up [big]","Provocation","High Speed Damage Recovery"]},
		{armor:["","Gravios Mail+","Gravios Vambraces+","Gravios Tasset+","Gravios Greaves+"],skills:["Health + 20","Anti-Heat","Hunger x 1.5"]},
		{armor:["","Gravios Vest+","Gravios Guard+","Gravios Coat+","Gravios Leggings+"],skills:["Health + 20","Anti-Heat","Hunger x 1.5"]},
		{armor:["Diablo Helm+","Diablo Mail+","Diablo Vambraces+","",""],skills:["Anti-Wind","Attack Up [small]","Hunger x 1.5"]},
		{armor:["Diablo Cap+","Diablo Vest+","Diablo Guard+","",""],skills:["Anti-Wind","Attack Up [small]","Hunger x 1.5"]},
		{armor:["Dragonhead","Dragonhide","Dragon Claw","Dragon Wing","Dragon Foot"],skills:["Attack Up [small]","Anti-Wind","High Speed Damage Recovery"]},
		{armor:["Dragonface","Dragonskin","Dragon Fist","Dragon Tail","Dragon Legs"],skills:["Attack Up [small]","Anti-Wind","High Speed Damage Recovery"]},
		{armor:["Guild Knight Helm","Guild Knight Mail","Guild Knight Vambraces","Guild Knight Tasset","Guild Knight Greaves"],skills:["Gathering","Divine Toolsaver","Good Fortune"]},
		{armor:["Guild Knight Cap","Guild Knight Vest","Guild Knight Guards","Guild Knight Coat","Guild Knight Leggings"],skills:["Gathering","Divine Toolsaver","Good Fortune"]},
		{armor:["Maid Helm","Maid Mail","Maid Vambraces","Maid Tasset","Maid Greaves"],skills:["Gathering","Divine Toolsaver","Good Fortune"]},
		{armor:["Maid Cap","Maid Vest","Maid Guards","Maid Coat","Maid Leggings"],skills:["Gathering","Divine Toolsaver","Good Fortune"]},
		{armor:["Auroros Helm","Auroros Mail","Auroros Vambraces","Auroros Tasset","Auroros Greaves"],skills:["High Speed Damage Recovery","Auto-Map","Weapon Restoration + 50%"]},
		{armor:["Genesis Cap","Genesis Vest","Genesis Guards","Genesis Coat","Genesis Leggings"],skills:["High Speed Damage Recovery","Auto-Map","Reload + 2"]},
		{armor:["Borealis Helm","Borealis Mail","Borealis Vambraces","Borealis Tasset","Borealis Greaves"],skills:["High Speed Damage Recovery","Auto-Map","Weapon Restoration + 50%"]},
		{armor:["Glyph Cap","Glyph Vest","Glyph Guards","Glyph Coat","Glyph Leggings"],skills:["High Speed Damage Recovery","Auto-Map","Reload + 2"]},
		{armor:["Borealis Helm","Borealis Mail","Borealis Vambraces","Borealis Crimson Tasset","Borealis Crimson Greaves"],skills:["High Speed Damage Recovery","Auto-Map","Fire + 25"]},
		{armor:["Glyph Cap","Glyph Vest","Glyph Guards","Glyph Crimson Coat","Glyph Crimson Leggings"],skills:["High Speed Damage Recovery","Auto-Map","Fire + 25"]},
		{armor:["Shinobi Helm [Sun]","Shinobi Mail [Sun]","Shinobi Vambraces [Sun]","Shinobi Tasset [Sun]","Sninobi Greaves [Sun]"],skills:["Hunger Negated","Poison Negated","Stealth"]},
		{armor:["Shinobi Cap [Moon]","Shinobi Vest [Moon]","Shinobi Guard [Moon]","Shinobi Coat [Moon]","Sninobi Leggings [Moon]"],skills:["Hunger Negated","Poison Negated","Stealth"]},
		{armor:["Mosswine Helm","Mosswine Mail","","",""],skills:["Hunger x 1.5"]},
		{armor:["Leather Helm","Leather Vest","Leather Vambraces","Light Belt","Green Pants"],skills:["Toolsaver"]},
		{armor:["","Chain Mail","Hunter Vambraces","","Hunter Greaves"],skills:["Defense + 5","Health + 10"]},
		{armor:["","Chain Mail","Hunter Guards","","Hunter Leggings"],skills:["Defense + 5","Health + 10"]},
		{armor:["Hunter Helm","Battle Mail","Battle Vambraces","Hunter Tasset","Battle Greaves"],skills:["Defense + 10","Health + 10"]},
		{armor:["Hunter Cap","Battle Vest","Battle Guards","Hunter Coat","Battle Leggings"],skills:["Defense + 10","Health + 10"]},
		{armor:["Battle Helm","Battle Mail","Chain Vambraces","Velociprey Tasset","Blue Pants"],skills:["Defense + 10","Health + 10"]},
		{armor:["Battle Cap","Battle Vest","Chain Vambraces","Velociprey Coat","Blue Pants"],skills:["Defense + 10","Health + 10"]},
		{armor:["","Kut-Ku Mail","Kut-Ku Vambraces","Ioprey Tasset","Rathalos Greaves"],skills:["Attack Up (small)","Health + 20","Stun x 2"]},
		{armor:["","Rathalos Vest","Rathalos Guards","Ioprey Coat","Dark Metal Boots"],skills:["Attack Up (small)","High-speed damage recovery","Stun x 2"]},
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
		{armor:["Gypceros Helm","Khezu Mail+","Khezu Vambraces+","Gypceros Tasset","Gypceros Greaves"],skills:["Wide-area Potion","Wide-area Antidote","Bad luck"]},
		{armor:["Gypceros Cap","Khezu Vest+","Khezu Guard+","Gypceros Coat","Gypceros Leggings"],skills:["Wide-area Potion","Wide-area Antidote","Bad luck"]},
		{armor:["Khezu Helm+","Gypceros Mail","Gypceros Vambraces","Khezu Tasset+","Khezu Greaves+"],skills:["Wide-area Potion","Wide-area Antidote","Bad luck"]},
		{armor:["Khezu Cap+","Gypceros Vest","Gypceros Guards","Khezu Coat+","Khezu Leggings+"],skills:["Wide-area Potion","Wide-area Antidote","Bad luck"]},
		// {armor:["Skull Face","Dragon Hide","Hunter Vambraces","Velociprey Tasset","Rathalos Greaves"],skills:["Wide-area Power Seed","Wide-area Armor Seed","Sleep x 2"]},
		// {armor:["Skull Face","Dragon Skin","Hunter Guards","Velociprey Coat","Rathalos Leggings"],skills:["Wide-area Power Seed","Wide-area Armor Seed","Sleep x 2"]},
		// {armor:["Skull Face","Monoblos Mail","Rathian Vambraces","Dragon Wing","Dragon Foot"],skills:["Wide-area Power Seed","Wide-area Armor Seed","Sleep x 2"]},
		// {armor:["Skull Face","Monoblos Vest","Rathian Guards","Dragon Tail","Dragon Legs"],skills:["Wide-area Power Seed","Wide-area Armor Seed","Sleep x 2"]},
		{armor:["Velociprey Helm","Auroros Mail","Shinobi Vambraces (Sun)","Auroros Tasset","Shinobi Greaves (Sun)"],skills:["Automatic Marking"]},
		{armor:["Velociprey Cap","Genesis Vest","Shinobi Guard (Moon)","Genesis Coat","Shinobi Leggings (Moon)"],skills:["Automatic Marking"]},
		{armor:["Borealis Helm","Shinobi Mail (Sun)","Shinobi Vambraces (Sun)","Ioprey Tasset","Borealis Greaves"],skills:["Automatic Marking"]},
		{armor:["Glyph Cap","Shinobi Vest (Moon)","Shinobi Guard (Moon)","Ioprey Coat","Glyph Leggings"],skills:["Automatic Marking"]},
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

	// Populate skillset popup
	var skillSetRows = SKILL_SETS.map((skillSet, index) => {
		var armorSetRow = `<tr><td><button class="skill-set-button" data-index=${ index }>Equip &rarr;</button></td>`;

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

	function closePopup() {
		document.body.classList.remove("show-popup");
	}
	document.getElementById("popup-show").addEventListener("click", () => document.body.classList.add("show-popup"));
	window.eachElementByClassName("popup-close", (button) => {
		button.addEventListener("click", closePopup);
	});
	document.getElementById("skill-set-popup").addEventListener("click", (event) => {
		if (event.target.id == "skill-set-popup") {
			closePopup();
		}
	});

	function doesSkillSetMatch(skillset, armor) {
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
	}
	function getSkillSet(armor) {
		// Filter out skillsets by armor category
		var possibleSkillSets = SKILL_SETS.filter(set => set.armor[0] === "" || set.armor[0] == armor.headgear.name);
		if (possibleSkillSets.length === 1) {
			if (doesSkillSetMatch(possibleSkillSets[0], armor)) {
				return possibleSkillSets[0].skills;
			}
		}
		else if (possibleSkillSets.length != 0) {
			possibleSkillSets = possibleSkillSets.filter(set => set.armor[1] === "" || set.armor[1] == armor.torso.name);
			if (possibleSkillSets.length === 1) {
				if (doesSkillSetMatch(possibleSkillSets[0], armor)) {
					return possibleSkillSets[0].skills;
				}
			}
			else if (possibleSkillSets.length != 0) {
				possibleSkillSets = possibleSkillSets.filter(set => set.armor[2] === "" || set.armor[2] == armor.arms.name);
				if (possibleSkillSets.length === 1) {
					if (doesSkillSetMatch(possibleSkillSets[0], armor)) {
						return possibleSkillSets[0].skills;
					}
				}
				else if (possibleSkillSets.length != 0) {
					possibleSkillSets = possibleSkillSets.filter(set => set.armor[3] === "" || set.armor[3] == armor.waist.name);
					if (possibleSkillSets.length === 1) {
						if (doesSkillSetMatch(possibleSkillSets[0], armor)) {
							return possibleSkillSets[0].skills;
						}
					}
					else if (possibleSkillSets.length != 0) {
						possibleSkillSets = possibleSkillSets.filter(set => set.armor[4] === "" || set.armor[4] == armor.legs.name);
						if (possibleSkillSets.length === 1) {
							if (doesSkillSetMatch(possibleSkillSets[0], armor)) {
								return possibleSkillSets[0].skills;
							}
						}
					}
				}
			}
		}

		return [];
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
			parseInt(document.getElementsByClassName("fire-res-1").innerText),
			parseInt(document.getElementsByClassName("water-res-1").innerText),
			parseInt(document.getElementsByClassName("thunder-res-1").innerText),
			parseInt(document.getElementsByClassName("dragon-res-1").innerText)
		];
	}
	function calculateSkills() {
		var armorSkills = getSkillSet(currentArmor);
		if (armorSkills.length === 0) {
			document.getElementById("armor-skills-1").innerHTML = "";
		}
		else {
			var resistances = getResistances();

			// Handle exceptional cases for stats
			if (armorSkills.includes("Health + 10")) document.getElementById("health-stat-1").innerText = 100 + 10;
			else if (armorSkills.includes("Health + 20")) document.getElementById("health-stat-1").innerText = 100 + 20;
			else if (armorSkills.includes("Health + 30")) document.getElementById("health-stat-1").innerText = 100 + 30;

			if (armorSkills.includes("Defense + 5")) document.getElementById("defense-stat-1").innerText = defense + 5;
			else if (armorSkills.includes("Defense + 10")) document.getElementById("defense-stat-1").innerText = defense + 10;

			// How does Attack Up work?
			// if (armorSkills.includes("Attack Up [small]") document.getElementById("attack-stat-1").innerText = "sm";
			// else if (armorSkills.includes("Attack Up [big]") document.getElementById("attack-stat-1").innerText = "lg";

			if (armorSkills.includes("Fire + 25")) document.getElementById("fire-res-1").innerText = resistances[0] + 25;
			else if (armorSkills.includes("Fire - 10")) document.getElementById("fire-res-1").innerText = resistances[0] - 10;
			if (armorSkills.includes("Water + 25")) document.getElementById("water-res-1").innerText = resistances[1] + 25;
			else if (armorSkills.includes("Water - 10")) document.getElementById("water-res-1").innerText = resistances[1] - 10;
			if (armorSkills.includes("Thunder + 25")) document.getElementById("thunder-res-1").innerText = resistances[2] + 25;
			else if (armorSkills.includes("Thunder - 10")) document.getElementById("thunder-res-1").innerText = resistances[2] - 10;
			if (armorSkills.includes("Dragon + 25")) document.getElementById("dragon-res-1").innerText = resistances[3] + 25;
			else if (armorSkills.includes("Dragon - 10")) document.getElementById("dragon-res-1").innerText = resistances[3] - 10;

			var skillRows = armorSkills.map(skill => "<tr skill-level-1><td>" + skill + "</td></tr>");
			document.getElementById("armor-skills-1").innerHTML = skillRows.join("");
		}
	}

	function setHeadgear(headgearData) {
		currentArmor.headgear = headgearData;
		document.getElementById("headgear-name-1").innerText = headgearData.name;
	}
	function setTorso(torsoData) {
		currentArmor.torso = torsoData;
		document.getElementById("torso-name-1").innerText = torsoData.name;
	}
	function setArms(armsData) {
		currentArmor.arms = armsData;
		document.getElementById("arms-name-1").innerText = armsData.name;
	}
	function setWaist(waistData) {
		currentArmor.waist = waistData;
		document.getElementById("waist-name-1").innerText = waistData.name;
	}
	function setLegs(legsData) {
		currentArmor.legs = legsData;
		document.getElementById("legs-name-1").innerText = legsData.name;
	}

	var headgearRadios = document.getElementById("headgear-1-tbody").getElementsByClassName("headgear-radio");
	var torsoRadios = document.getElementById("torso-1-tbody").getElementsByClassName("torso-radio");
	var armsRadios = document.getElementById("arms-1-tbody").getElementsByClassName("arms-radio");
	var waistRadios = document.getElementById("waist-1-tbody").getElementsByClassName("waist-radio");
	var legsRadios = document.getElementById("legs-1-tbody").getElementsByClassName("legs-radio");

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

	function updateArmorStats() {
		// Reset health to account for any change to the Health skill
		document.getElementById("health-stat-1").innerText = "100";

		var defense = calculateDefense();
		document.getElementById("defense-stat-1").innerText = defense;

		var resistances = calculateRes();
		document.getElementById("fire-res-1").innerText = resistances[0];
		document.getElementById("water-res-1").innerText = resistances[1];
		document.getElementById("thunder-res-1").innerText = resistances[2];
		document.getElementById("dragon-res-1").innerText = resistances[3];

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
		document.getElementById("armor-cost-1").innerText = totalCost;

		var materialRows = [];
		var materialsTBody = document.getElementById("armor-materials-1");
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
		document.getElementById("gender-mixing-error-1").style.display = gendersMixed ? "block" : "";

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
		document.getElementById("class-mixing-error-1").style.display = classesMixed ? "block" : "";
	}

	// Assign full armor sets with skills for MH1
	function handleSkillSetButtonClick(event) {
		var skillSet = SKILL_SETS[event.target.dataset.index];

		if (skillSet.armor[0].length !== 0) {
			for (var i = 0; i < window.armorData1.headgear.length; i++) {
				if (window.armorData1.headgear[i].name == skillSet.armor[0]) {
					setHeadgear(window.armorData1.headgear[i]);
					break;
				}
			}
		}

		if (skillSet.armor[1].length !== 0) {
			for (var i = 0; i < window.armorData1.torso.length; i++) {
				if (window.armorData1.torso[i].name == skillSet.armor[1]) {
					setTorso(window.armorData1.torso[i]);
					break;
				}
			}
		}

		if (skillSet.armor[2].length !== 0) {
			for (var i = 0; i < window.armorData1.arms.length; i++) {
				if (window.armorData1.arms[i].name == skillSet.armor[2]) {
					setArms(window.armorData1.arms[i]);
					break;
				}
			}
		}

		if (skillSet.armor[3].length !== 0) {
			for (var i = 0; i < window.armorData1.waist.length; i++) {
				if (window.armorData1.waist[i].name == skillSet.armor[3]) {
					setWaist(window.armorData1.waist[i]);
					break;
				}
			}
		}

		if (skillSet.armor[4].length !== 0) {
			for (var i = 0; i < window.armorData1.legs.length; i++) {
				if (window.armorData1.legs[i].name == skillSet.armor[4]) {
					setLegs(window.armorData1.legs[i]);
					break;
				}
			}
		}

		updateArmorStats();

		builderContainer.classList.add("expanded");
		closePopup();
	}
	window.eachElementByClassName("skill-set-button", button => button.addEventListener("click", handleSkillSetButtonClick));

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
