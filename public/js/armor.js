ready(() => {
	var currentArmor = {
		headgear: window.armorData.headgear[0],
		torso: window.armorData.torso[0],
		arms: window.armorData.arms[0],
		waist: window.armorData.waist[0],
		legs: window.armorData.legs[0]
	};

	// Find selected armor if reloading page, or set all pieces to None
	(() => {
		var headRadios = document.getElementsByClassName("headgear-radio");
		var armorFound = false;
		for (let i = 0; i < headRadios.length; i++) {
			if (headRadios[i].checked) {
				armorFound = true;
				setHeadgear(window.armorData.headgear[headRadios[i].dataset.index]);
				break;
			}
		}
		if (!armorFound) {
			setHeadgear(currentArmor.headgear);
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

		var armRadios = document.getElementsByClassName("arms-radio");
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

		var legsRadios = document.getElementsByClassName("legs-radio");
		armorFound = false;
		for (let i = 0; i < legsRadios.length; i++) {
			if (legsRadios[i].checked) {
				armorFound = true;
				setLegs(window.armorData.legs[legsRadios[i].dataset.index]);
				break;
			}
		}
		if (!armorFound) {
			setLegs(currentArmor.legs);
		}

		updateArmorStats();
	}).call();

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
		{armor:["","Cephalos Mail","Cephalos Vambraces","","Cephalos Greaves"],skills:["Anti-Heat"]},
		{armor:["","Cephalos Vest","Cephalos Guards","","Cephalos Leggings"],skills:["Anti-Heat"]},
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
		{armor:["King Lobster Helm","King Lobster Mail","King Lobster Vambraces","",""],skills:["Anti-Cold"]},
		{armor:["King Lobster Helm","King Lobster Vest","King Lobster Guards","",""],skills:["Anti-Cold"]},
		{armor:["","Rathian Mail","Rathian Vambraces","","Rathian Greaves"],skills:["Provocation","Health + 20"]},
		{armor:["","Rathian Vest","Rathian Guards","","Rathian Leggings"],skills:["Provocation","Health + 20"]},
		{armor:["Rathalos Helm","Rathalos Mail","Rathalos Vambraces","","Rathalos Greaves"],skills:["Attack Up [big]","Provoke","Dragon - 10"]},
		{armor:["Rathalos Cap","Rathalos Vest","Rathalos Guards","","Rathalos Leggings"],skills:["Attack Up [big]","Provoke","Dragon - 10"]},
		{armor:["","Gravios Mail","Gravios Vambraces","Gravios Tasset","Gravios Greaves"],skills:["Health + 10"]},
		{armor:["","Gravios Vest","Gravios Guards","Gravios Coat","Gravios Leggings"],skills:["Health + 10"]},
		{armor:["Monoblos Helm","Monoblos Mail","Monoblos Vambraces","",""],skills:["Attack Up [big]","Stun Negated","Hunger x 1.5"]},
		{armor:["Monoblos Cap","Monoblos Vest","Monoblos Guards","",""],skills:["Attack Up [big]","Stun Negated","Hunger x 1.5"]},
		{armor:["Diablos Helm","Diablos Mail","Diablos Vambraces","",""],skills:["Anti-Wind"]},
		{armor:["Diablos Cap","Diablos Vest","Diablos Guards","",""],skills:["Anti-Wind"]},
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
		{armor:["King Lobster Helm+","King Lobster Mail+","King Lobster Vambraces+","",""],skills:["Anti-Cold","Faint Halved"]},
		{armor:["King Lobster Helm+","King Lobster Vest+","King Lobster Guard+","",""],skills:["Anti-Cold","Faint Halved"]},
		{armor:["","Rathian Mail+","Rathian Vambraces+","Rathian Tasset+","Rathian Greaves+"],skills:["Provocation","Health + 30","Defense + 10"]},
		{armor:["","Rathian Vest+","Rathian Guard+","Rathian Coat+","Rathian Leggings+"],skills:["Provocation","Health + 30","Defense + 10"]},
		{armor:["","Rathalos Mail+","Rathalos Vambraces+","Rathalos Tasset+","Rathalos Greaves+"],skills:["Attack Up [big]","Provocation","High Speed Damage Recovery"]},
		{armor:["","Rathalos Vest+","Rathalos Guard+","Rathalos Coat+","Rathalos Leggings+"],skills:["Attack Up [big]","Provocation","High Speed Damage Recovery"]},
		{armor:["","Gravios Mail+","Gravios Vambraces+","Gravios Tasset+","Gravios Greaves+"],skills:["Health + 20","Anti-Heat","Hunger x 1.5"]},
		{armor:["","Gravios Vest+","Gravios Guard+","Gravios Coat+","Gravios Leggings+"],skills:["Health + 20","Anti-Heat","Hunger x 1.5"]},
		{armor:["Diablos Helm+","Diablos Mail+","Diablos Vambraces+","",""],skills:["Anti-Wind","Attack Up [small]","Hunger x 1.5"]},
		{armor:["Diablos Cap+","Diablos Vest+","Diablos Guard+","",""],skills:["Anti-Wind","Attack Up [small]","Hunger x 1.5"]},
		{armor:["Dragon Head","Dragon Hide","Dragon Claw","Dragon Wing","Dragon Foot"],skills:["Attack Up [small]","Anti-Wind","High Speed Damage Recovery"]},
		{armor:["Dragon Face","Dragon Skin","Dragon Fist","Dragon Tail","Dragon Legs"],skills:["Attack Up [small]","Anti-Wind","High Speed Damage Recovery"]},
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
		{armor:["King Lobster Helm+","King Lobster Mail+","Plesioth Vambraces+","","Plesioth Greaves+"],skills:["Fire - 10","Water + 25","Sleep Halved"]},
		{armor:["Plesioth Cap+","King Lobster Vest+","King Lobster Guard+","","Plesioth Leggings+"],skills:["Fire - 10","Water + 25","Sleep Halved"]},
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
		{armor:["Skull Face","Dragon Hide","Hunter Vambraces","Velociprey Tasset","Rathalos Greaves"],skills:["Wide-area Power Seed","Wide-area Armor Seed","Sleep x 2"]},
		{armor:["Skull Face","Dragon Skin","Hunter Guards","Velociprey Coat","Rathalos Leggings"],skills:["Wide-area Power Seed","Wide-area Armor Seed","Sleep x 2"]},
		{armor:["Skull Face","Monoblos Mail","Rathian Vambraces","Dragon Wing","Dragon Foot"],skills:["Wide-area Power Seed","Wide-area Armor Seed","Sleep x 2"]},
		{armor:["Skull Face","Monoblos Vest","Rathian Guards","Dragon Tail","Dragon Legs"],skills:["Wide-area Power Seed","Wide-area Armor Seed","Sleep x 2"]},
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

	// Populate skillset popup
	var skillSetRows = SKILL_SETS.map((skillSet, index) => {
		var skillSetArmor = skillSet.armor.filter(el => el.length !== 0);

		return `<tr><td><button class="skill-set-button" style="line-height:${ skillSetArmor.length }" data-index=${ index }>Set ${ index + 1 }</button></td><td>${ skillSetArmor.join("<br/>") }</td><td>${ skillSet.skills.join("<br/>") }</td></tr>`;
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

	function unsetArmor() {
		currentArmor.headgear = armorData.headgear[0];
		currentArmor.torso = armorData.torso[0];
		currentArmor.arms = armorData.arms[0];
		currentArmor.waist = armorData.waist[0];
		currentArmor.legs = armorData.legs[0];

		updateArmorStats();
	}
	document.body.addEventListener("g-toggle", () => {
		unsetArmor();
		closePopup();
	});

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
	builderToggle.addEventListener("click", toggleBuilder);

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
			parseInt(document.getElementsByClassName("fire-res")[0].innerText),
			parseInt(document.getElementsByClassName("water-res")[0].innerText),
			parseInt(document.getElementsByClassName("thunder-res")[0].innerText),
			parseInt(document.getElementsByClassName("dragon-res")[0].innerText)
		];
	}
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
	function getMH1SkillSet(armor) {
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
	function calculateMH1Skills() {
		var armorSkills = getMH1SkillSet(currentArmor);
		if (armorSkills.length === 0) {
			document.getElementById("armor-skills").innerHTML = "";
		}
		else {
			var resistances = getResistances();

			// Handle exceptional cases for stats
			if (armorSkills.includes("Health + 10")) window.eachElementByClassName("health-stat", el => el.innerText = 100 + 10);
			else if (armorSkills.includes("Health + 20")) window.eachElementByClassName("health-stat", el => el.innerText = 100 + 20);
			else if (armorSkills.includes("Health + 30")) window.eachElementByClassName("health-stat", el => el.innerText = 100 + 30);

			if (armorSkills.includes("Defense + 5")) window.eachElementByClassName("defense-stat", el => el.innerText = defense + 5);
			else if (armorSkills.includes("Defense + 10")) window.eachElementByClassName("defense-stat", el => el.innerText = defense + 10);

			// How does Attack Up work?
			// if (armorSkills.includes("Attack Up [small]") window.eachElementByClassName("attack-stat", el => el.innerText = "sm");
			// else if (armorSkills.includes("Attack Up [big]") window.eachElementByClassName("attack-stat", el => el.innerText = "lg");

			if (armorSkills.includes("Fire + 25")) window.eachElementByClassName("fire-res", el => el.innerText = resistances[0] + 25);
			else if (armorSkills.includes("Fire - 10")) window.eachElementByClassName("fire-res", el => el.innerText = resistances[0] - 10);
			if (armorSkills.includes("Water + 25")) window.eachElementByClassName("water-res", el => el.innerText = resistances[1] + 25);
			else if (armorSkills.includes("Water - 10")) window.eachElementByClassName("water-res", el => el.innerText = resistances[1] - 10);
			if (armorSkills.includes("Thunder + 25")) window.eachElementByClassName("thunder-res", el => el.innerText = resistances[2] + 25);
			else if (armorSkills.includes("Thunder - 10")) window.eachElementByClassName("thunder-res", el => el.innerText = resistances[2] - 10);
			if (armorSkills.includes("Dragon + 25")) window.eachElementByClassName("dragon-res", el => el.innerText = resistances[3] + 25);
			else if (armorSkills.includes("Dragon - 10")) window.eachElementByClassName("dragon-res", el => el.innerText = resistances[3] - 10);

			var skillRows = armorSkills.map(skill => "<tr skill-level-1><td>" + skill + "</td></tr>");
			document.getElementById("armor-skills").innerHTML = skillRows.join("");
		}
	}
	function calculateMHGSkills() {
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
							window.eachElementByClassName("health-stat", el => el.innerText = 100 + healthBonus);
							skillName = "Health " + (healthBonus > 0 ? "+" : "-") + healthBonus.toString();
						}
						else if (prop == "Defense") {
							let defenseBonus = SKILL_LEVELS[prop][skillIndex];
							window.eachElementByClassName("defense-stat", el => el.innerText = defense + defenseBonus);
							skillName = "Defense " + (defenseBonus > 0 ? "+" : "-") + defenseBonus.toString();
						}
						else if (prop == "Element Res Up") {
							let elementBonus = SKILL_LEVELS[prop][skillIndex];
							window.eachElementByClassName("fire-res", el => el.innerText = resistances[0] + elementBonus);
							window.eachElementByClassName("water-res", el => el.innerText = resistances[1] + elementBonus);
							window.eachElementByClassName("thunder-res", el => el.innerText = resistances[2] + elementBonus);
							window.eachElementByClassName("dragon-res", el => el.innerText = resistances[3] + elementBonus);
							skillName = "Element Res " + (elementBonus > 0 ? "+" : "-") + elementBonus.toString();
						}
						else if (prop == "Fire Resistance") {
							let elementBonus = SKILL_LEVELS[prop][skillIndex];
							window.eachElementByClassName("fire-res", el => el.innerText = resistances[0] + elementBonus);
							skillName = "Fire Res " + (elementBonus > 0 ? "+" : "-") + elementBonus.toString();
						}
						else if (prop == "Water Resistance") {
							let elementBonus = SKILL_LEVELS[prop][skillIndex];
							window.eachElementByClassName("water-res", el => el.innerText = resistances[1] + elementBonus);
							skillName = "Water Res " + (elementBonus > 0 ? "+" : "-") + elementBonus.toString();
						}
						else if (prop == "Thunder Resistance") {
							let elementBonus = SKILL_LEVELS[prop][skillIndex];
							window.eachElementByClassName("thunder-res", el => el.innerText = resistances[2] + elementBonus);
							skillName = "Thunder Res " + (elementBonus > 0 ? "+" : "-") + elementBonus.toString();
						}
						else if (prop == "Dragon Resistance") {
							let elementBonus = SKILL_LEVELS[prop][skillIndex];
							window.eachElementByClassName("dragon-res", el => el.innerText = resistances[3] + elementBonus);
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

	function updateArmorStats() {
		// Reset health to account for any change to the Health skill
		window.eachElementByClassName("health-stat", el => el.innerText = "100");

		var defense = calculateDefense();
		window.eachElementByClassName("defense-stat", el => el.innerText = defense);

		var resistances = calculateRes();
		window.eachElementByClassName("fire-res", el => el.innerText = resistances[0]);
		window.eachElementByClassName("water-res", el => el.innerText = resistances[1]);
		window.eachElementByClassName("thunder-res", el => el.innerText = resistances[2]);
		window.eachElementByClassName("dragon-res", el => el.innerText = resistances[3]);

		if (isMH1()) {
			calculateMH1Skills();
		}
		else {
			calculateMHGSkills();
		}

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
		window.eachElementByClassName("armor-cost", el => el.innerText = totalCost);

		var materialRows = [];
		var materialsTBody = document.getElementById("armor-materials");
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
		window.eachElementByClassName("gender-mixing-error", el => el.style.display = gendersMixed ? "block" : "" );

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
		window.eachElementByClassName("class-mixing-error", el => el.style.display = classesMixed ? "block" : "" );
	}

	function setHeadgear(headgearData) {
		currentArmor.headgear = headgearData;
		window.eachElementByClassName("headgear-name", el => el.innerText = headgearData.name);
	}
	function setTorso(torsoData) {
		currentArmor.torso = torsoData;
		window.eachElementByClassName("torso-name", el => el.innerText = torsoData.name);
	}
	function setArms(armsData) {
		currentArmor.arms = armsData;
		window.eachElementByClassName("arms-name", el => el.innerText = armsData.name);
	}
	function setWaist(waistData) {
		currentArmor.waist = waistData;
		window.eachElementByClassName("waist-name", el => el.innerText = waistData.name);
	}
	function setLegs(legsData) {
		currentArmor.legs = legsData;
		window.eachElementByClassName("legs-name", el => el.innerText = legsData.name);
	}

	function handleHeadgearClick(event) {
		var index = this.dataset.index;
		setHeadgear(window.armorData.headgear[index]);
		updateArmorStats();
	}
	window.eachElementByClassName("headgear-radio", (el, i) => {
		el.dataset.index = i;
		el.addEventListener("click", handleHeadgearClick);
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

	// Assign full armor sets with skills for MH1
	function handleSkillSetButtonClick(event) {
		var skillSet = SKILL_SETS[event.target.dataset.index];

		if (skillSet.armor[0].length !== 0) {
			for (var i = 0; i < window.armorData.headgear.length; i++) {
				if (window.armorData.headgear[i].name == skillSet.armor[0]) {
					setHeadgear(window.armorData.headgear[i]);
					break;
				}
			}
		}

		if (skillSet.armor[1].length !== 0) {
			for (var i = 0; i < window.armorData.torso.length; i++) {
				if (window.armorData.torso[i].name == skillSet.armor[1]) {
					setTorso(window.armorData.torso[i]);
					break;
				}
			}
		}

		if (skillSet.armor[2].length !== 0) {
			for (var i = 0; i < window.armorData.arms.length; i++) {
				if (window.armorData.arms[i].name == skillSet.armor[2]) {
					setArms(window.armorData.arms[i]);
					break;
				}
			}
		}

		if (skillSet.armor[3].length !== 0) {
			for (var i = 0; i < window.armorData.waist.length; i++) {
				if (window.armorData.waist[i].name == skillSet.armor[3]) {
					setWaist(window.armorData.waist[i]);
					break;
				}
			}
		}

		if (skillSet.armor[4].length !== 0) {
			for (var i = 0; i < window.armorData.legs.length; i++) {
				if (window.armorData.legs[i].name == skillSet.armor[4]) {
					setLegs(window.armorData.legs[i]);
					break;
				}
			}
		}

		updateArmorStats();

		builderContainer.classList.add("expanded");
		closePopup();
	}
	window.eachElementByClassName("skill-set-button", button => button.addEventListener("click", handleSkillSetButtonClick));
});
