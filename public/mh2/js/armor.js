ready(() => {
	function handleArmorGenderChange(event) {
		setArmorGender(this.value);
	}
	function setArmorGender(genderValue) {
		switch (genderValue) {
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
		if (armorGenderRadios[i].checked) {
			setArmorGender(armorGenderRadios[i].value);
		}
	}

	function handleArmorClassChange(event) {
		setArmorClass(this.value);
	}
	function setArmorClass(classValue) {
		switch (classValue) {
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
		if (armorClassRadios[i].checked) {
			setArmorClass(armorClassRadios[i].value);
		}
	}

	// Show/hide armor based on elemental res
	var armorStatCheckboxes = document.getElementsByName("armor-stat");
	function shouldShowRow(resistances, checked) {
		var matchesFireRes = (checked["f+"] && resistances[0] > 0) || (checked["f-"] && resistances[0] < 0) || (!checked["f+"] && !checked["f-"]);
		var matchesWaterRes = (checked["w+"] && resistances[1] > 0) || (checked["w-"] && resistances[1] < 0) || (!checked["w+"] && !checked["w-"]);
		var matchesThunderRes = (checked["t+"] && resistances[2] > 0) || (checked["t-"] && resistances[2] < 0) || (!checked["t+"] && !checked["t-"]);
		var matchesIceRes = (checked["i+"] && resistances[3] > 0) || (checked["i-"] && resistances[3] < 0) || (!checked["i+"] && !checked["i-"]);
		var matchesDragonRes = (checked["d+"] && resistances[4] > 0) || (checked["d-"] && resistances[4] < 0) || (!checked["d+"] && !checked["d-"]);

		return matchesFireRes && matchesWaterRes && matchesThunderRes && matchesIceRes && matchesDragonRes;
	}

	var headgearRows = document.getElementById("helm-tbody").children;
	var torsoRows = document.getElementById("torso-tbody").children;
	var armsRows = document.getElementById("arm-tbody").children;
	var waistRows = document.getElementById("waist-tbody").children;
	var legsRows = document.getElementById("foot-tbody").children;
	function updateArmorResVisibility() {
		var armorResChecked = {};

		for (var i = 0; i < armorStatCheckboxes.length; i++) {
			armorResChecked[armorStatCheckboxes[i].value] = armorStatCheckboxes[i].checked;
		}

		for (var i = 0; i < headgearRows.length; i++) {
			headgearRows[i].style.display = shouldShowRow(window.armorData["Headgear"][i].resistances, armorResChecked) ? "" : "none";
		}

		for (var i = 0; i < torsoRows.length; i++) {
			torsoRows[i].style.display = shouldShowRow(window.armorData["Torso"][i].resistances, armorResChecked) ? "" : "none";
		}

		for (var i = 0; i < armsRows.length; i++) {
			armsRows[i].style.display = shouldShowRow(window.armorData["Arms"][i].resistances, armorResChecked) ? "" : "none";
		}

		for (var i = 0; i < waistRows.length; i++) {
			waistRows[i].style.display = shouldShowRow(window.armorData["Waist"][i].resistances, armorResChecked) ? "" : "none";
		}

		for (var i = 0; i < legsRows.length; i++) {
			legsRows[i].style.display = shouldShowRow(window.armorData["Legs"][i].resistances, armorResChecked) ? "" : "none";
		}
	}
	for (var i = 0; i < armorStatCheckboxes.length; i++) {
		armorStatCheckboxes[i].addEventListener("click", updateArmorResVisibility);
	}
	updateArmorResVisibility();

	var searchInput = document.getElementById("search");
	function doesArmorPieceContainTerm(armorData, category, index, searchTerm) {
		return searchTerm.length === 0 || armorData[category][index].name.toLowerCase().indexOf(searchTerm) !== -1;
	}
	function filterBySearch() {
		var searchTerm = searchInput.value.toLowerCase();

		for (var i = 0; i < headgearRows.length; i++) {
			headgearRows[i].style.display = doesArmorPieceContainTerm(window.armorData, "Headgear", i, searchTerm) ? "" : "none";
		}
		for (var i = 0; i < torsoRows.length; i++) {
			torsoRows[i].style.display = doesArmorPieceContainTerm(window.armorData, "Torso", i, searchTerm) ? "" : "none";
		}
		for (var i = 0; i < armsRows.length; i++) {
			armsRows[i].style.display = doesArmorPieceContainTerm(window.armorData, "Arms", i, searchTerm) ? "" : "none";
		}
		for (var i = 0; i < waistRows.length; i++) {
			waistRows[i].style.display = doesArmorPieceContainTerm(window.armorData, "Waist", i, searchTerm) ? "" : "none";
		}
		for (var i = 0; i < legsRows.length; i++) {
			legsRows[i].style.display = doesArmorPieceContainTerm(window.armorData, "Legs", i, searchTerm) ? "" : "none";
		}
	}
	searchInput.addEventListener("keyup", (event) => {
		filterBySearch();
	});
	filterBySearch();

	function doesArmorPieceHaveSkills(armorCategory, index, skills) {
		var armorPiece = window.armorData[armorCategory][index];
		if (armorPiece.skills) {
			for (let i = 0; i < armorPiece.skills.length; i++) {
				if (skills.includes(armorPiece.skills[i].k)) {
					return true;
				}
			}
		}

		return false;
	}
	var skillCheckboxes = document.getElementsByName("armor_skills");
	function filterByArmorSkills() {
		var checkedSkills = [];

		for (let i = 0; i < skillCheckboxes.length; i++) {
			if (skillCheckboxes[i].checked) {
				checkedSkills.push(skillCheckboxes[i].value);
			}
		}

		var showAll = checkedSkills.length == 0;

		for (var i = 0; i < headgearRows.length; i++) {
			let show = doesArmorPieceHaveSkills("Headgear", i, checkedSkills);
			headgearRows[i].style.display = show || showAll ? "" : "none";

			if (showAll) headgearRows[i].classList.remove("open");
			else if (show) headgearRows[i].classList.add("open");
		}
		for (var i = 0; i < torsoRows.length; i++) {
			let show = doesArmorPieceHaveSkills("Torso", i, checkedSkills);
			torsoRows[i].style.display = show || showAll ? "" : "none";

			if (showAll) torsoRows[i].classList.remove("open");
			else if (show) torsoRows[i].classList.add("open");
		}
		for (var i = 0; i < armsRows.length; i++) {
			let show = doesArmorPieceHaveSkills("Arms", i, checkedSkills);
			armsRows[i].style.display = show || showAll ? "" : "none";

			if (showAll) armsRows[i].classList.remove("open");
			else if (show) armsRows[i].classList.add("open");
		}
		for (var i = 0; i < waistRows.length; i++) {
			let show = doesArmorPieceHaveSkills("Waist", i, checkedSkills);
			waistRows[i].style.display = show || showAll ? "" : "none";

			if (showAll) waistRows[i].classList.remove("open");
			else if (show) waistRows[i].classList.add("open");
		}
		for (var i = 0; i < legsRows.length; i++) {
			let show = doesArmorPieceHaveSkills("Legs", i, checkedSkills);
			legsRows[i].style.display = show || showAll ? "" : "none";

			if (showAll) legsRows[i].classList.remove("open");
			else if (show) legsRows[i].classList.add("open");
		}
	}
	for (let i = 0; i < skillCheckboxes.length; i++) {
		skillCheckboxes[i].addEventListener("change", filterByArmorSkills);
	}
	filterByArmorSkills();

	function toggleEverything(toggleOn) {
		window.eachElementByClassName("armor-class-container", (element) => {
			element.open = toggleOn;
		});
		window.eachElementByClassName("branch-button", (element) => {
			toggleBranch(element);
		});
	}
	var toggleEverythingCheck = document.getElementById("toggle-everything");
	toggleEverythingCheck.addEventListener("click", (event) => {
		toggleEverything(toggleEverythingCheck.checked);
	});
	if (toggleEverythingCheck.checked) {
		toggleEverything(true);
	}

	function toggleBranch(branchButton) {
		// Toggle from the current state
		var open = branchButton.dataset.open != "1";

		branchButton.dataset.open = open ? "1" : "0";

		if (open) branchButton.classList.add("open");
		else branchButton.classList.remove("open");

		var branchRows = document.querySelectorAll(branchButton.dataset.target);
		branchRows.forEach(row => {
			if (open) row.classList.add("open");
			else row.classList.remove("open");
		});
	}
	function handleBranchButtonClick(event) {
		toggleBranch(event.currentTarget);
	}

	document.querySelectorAll(".branch-button").forEach(button => button.addEventListener("click", handleBranchButtonClick));

	new ArmorBuilder();

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

	function toggleTrueValues(toggleOn) {
		if (toggleOn) {
			document.body.classList.add("show-true-values");
		}
		else {
			document.body.classList.remove("show-true-values");
		}
	}
	var trueValuesCheck = document.getElementById("show-true-values");
	trueValuesCheck.addEventListener("change", (event) => {
		toggleTrueValues(event.target.checked);
	});
	toggleTrueValues(trueValuesCheck.checked);
});
