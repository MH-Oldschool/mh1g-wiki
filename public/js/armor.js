ready(() => {
	function showSuffixes(suffix) {
		if (suffix == "a") {
			document.body.classList.remove("show-suffixes-b");
		}
		else {
			document.body.classList.add("show-suffixes-b");
		}
	}
	function handleSuffixesChange(event) {
		if (event.target.checked) {
			showSuffixes(event.target.value);
			window.localStorage.setItem("suffixes", event.target.value);
		}
	}
	var suffixesARadio = document.getElementById("suffixes-a");
	var suffixesBRadio = document.getElementById("suffixes-b");
	suffixesARadio.addEventListener("change", handleSuffixesChange);
	suffixesBRadio.addEventListener("change", handleSuffixesChange);

	var storedSuffixes = window.localStorage.getItem("suffixes");
	if (storedSuffixes && storedSuffixes == "a") {
		suffixesARadio.checked = true;
	}
	else if (suffixesBRadio.checked) {
		showSuffixes("b");
	}

	var lowRankFilter = document.getElementById("low-rank-filter");
	var highRankFilter = document.getElementById("high-rank-filter");
	var gRankFilter = document.getElementById("g-rank-filter");
	lowRankFilter.addEventListener("change", event => {
		toggleLowRank(event.target.checked);
	});
	highRankFilter.addEventListener("change", event => {
		toggleHighRank(event.target.checked);
	});
	gRankFilter.addEventListener("change", event => {
		toggleGRank(event.target.checked);
	});
	if (!lowRankFilter.checked) toggleLowRank(false);
	if (!highRankFilter.checked) toggleHighRank(false);
	if (!gRankFilter.checked) toggleGRank(false);

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
		var matchesFireRes = (checked["f+"] && resistances[0] > 0) || (checked["f-"] && resistances[0] < 0) || (!checked["f+"] && !checked["f-"]);
		var matchesWaterRes = (checked["w+"] && resistances[1] > 0) || (checked["w-"] && resistances[1] < 0) || (!checked["w+"] && !checked["w-"]);
		var matchesThunderRes = (checked["t+"] && resistances[2] > 0) || (checked["t-"] && resistances[2] < 0) || (!checked["t+"] && !checked["t-"]);
		var matchesDragonRes = (checked["d+"] && resistances[3] > 0) || (checked["d-"] && resistances[3] < 0) || (!checked["d+"] && !checked["d-"]);

		return matchesFireRes && matchesWaterRes && matchesThunderRes && matchesDragonRes;
	}

	var headgear1Rows = document.getElementById("headgear-1-tbody").children;
	var torso1Rows = document.getElementById("torso-1-tbody").children;
	var arms1Rows = document.getElementById("arms-1-tbody").children;
	var waist1Rows = document.getElementById("waist-1-tbody").children;
	var legs1Rows = document.getElementById("legs-1-tbody").children;
	var headgearGRows = document.getElementById("headgear-g-tbody").children;
	var torsoGRows = document.getElementById("torso-g-tbody").children;
	var armsGRows = document.getElementById("arms-g-tbody").children;
	var waistGRows = document.getElementById("waist-g-tbody").children;
	var legsGRows = document.getElementById("legs-g-tbody").children;
	function updateArmorResVisibility() {
		var armorResChecked = {};

		for (var i = 0; i < armorStatCheckboxes.length; i++) {
			armorResChecked[armorStatCheckboxes[i].value] = armorStatCheckboxes[i].checked;
		}

		for (var i = 0; i < headgear1Rows.length; i++) {
			headgear1Rows[i].style.display = shouldShowRow(window.armorData1.headgear[i].res, armorResChecked) ? "" : "none";
		}
		for (var i = 0; i < headgearGRows.length; i++) {
			headgearGRows[i].style.display = shouldShowRow(window.armorDataG.headgear[i].res, armorResChecked) ? "" : "none";
		}

		for (var i = 0; i < torso1Rows.length; i++) {
			torso1Rows[i].style.display = shouldShowRow(window.armorData1.torso[i].res, armorResChecked) ? "" : "none";
		}
		for (var i = 0; i < torsoGRows.length; i++) {
			torsoGRows[i].style.display = shouldShowRow(window.armorDataG.torso[i].res, armorResChecked) ? "" : "none";
		}

		for (var i = 0; i < arms1Rows.length; i++) {
			arms1Rows[i].style.display = shouldShowRow(window.armorData1.arms[i].res, armorResChecked) ? "" : "none";
		}
		for (var i = 0; i < armsGRows.length; i++) {
			armsGRows[i].style.display = shouldShowRow(window.armorDataG.arms[i].res, armorResChecked) ? "" : "none";
		}

		for (var i = 0; i < waist1Rows.length; i++) {
			waist1Rows[i].style.display = shouldShowRow(window.armorData1.waist[i].res, armorResChecked) ? "" : "none";
		}
		for (var i = 0; i < waistGRows.length; i++) {
			waistGRows[i].style.display = shouldShowRow(window.armorDataG.waist[i].res, armorResChecked) ? "" : "none";
		}

		for (var i = 0; i < legs1Rows.length; i++) {
			legs1Rows[i].style.display = shouldShowRow(window.armorData1.legs[i].res, armorResChecked) ? "" : "none";
		}
		for (var i = 0; i < legsGRows.length; i++) {
			legsGRows[i].style.display = shouldShowRow(window.armorDataG.legs[i].res, armorResChecked) ? "" : "none";
		}
	}
	for (var i = 0; i < armorStatCheckboxes.length; i++) {
		armorStatCheckboxes[i].addEventListener("click", updateArmorResVisibility);
	}
	updateArmorResVisibility();

	function toggleEverything(toggleOn) {
		window.eachElementByClassName("armor-class-container", (element) => {
			element.open = toggleOn;
		});
	}

	var toggleEverythingCheck = document.getElementById("toggle-everything");
	toggleEverythingCheck.addEventListener("click", (event) => {
		toggleEverything(toggleEverythingCheck.checked);
	});
	if (toggleEverythingCheck.checked) {
		toggleEverything(true);
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

	document.getElementById("popup-show").addEventListener("click", () => document.body.classList.add("show-popup"));
	window.eachElementByClassName("popup-close", (button) => {
		button.addEventListener("click", window.closePopup);
	});
	document.getElementById("skill-set-popup").addEventListener("click", (event) => {
		if (event.target.id == "skill-set-popup") {
			window.closePopup();
		}
	});

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

	document.body.addEventListener("g-toggle", window.closePopup);

	var armorBuilder1 = new ArmorBuilder("1", builderContainer);
	var armorBuilderG = new ArmorBuilder("g", builderContainer);

	var armorCodeExport = document.getElementById("armor-code-export");
	var armorCodeDialog = document.getElementById("armor-code-dialog");
	function toggleArmorCodeDialog(toggleOn) {
		if (toggleOn) {
			var armorCode = (getMHVersion() == "1") ? armorBuilder1.getArmorCode() : armorBuilderG.getArmorCode();
			armorCodeExport.value = armorCode;
			armorCodeDialog.showModal();
		}
		else {
			armorCodeDialog.close();
		}

		toggleDialogBackdrop(toggleOn);
	}
	function armorCodeIsValid(armorCode) {
		// TODO: indicate what's invalid?
		if (armorCode.length !== 8) {
			return false;
		}
		if (armorCode[0] < 0 || 1 < armorCode[0]) {
			return false;
		}

		return true;
	}
	document.getElementById("import-export-armor-code-button").addEventListener("click", () => {
		toggleArmorCodeDialog(true);
	});
	document.getElementById("armor-code-close").addEventListener("click", () => {
		toggleArmorCodeDialog(false);
	});
	armorCodeDialog.addEventListener("click", (event) => {
		if (event.target == armorCodeDialog) {
			toggleArmorCodeDialog(false);
		}
	});
	document.getElementById("import-code-button").addEventListener("click", () => {
		const armorCodeImport = document.getElementById("armor-code-import");
		var armorCode = armorCodeImport.value.split(",");

		if (armorCodeIsValid(armorCode)) {
			if (armorCode[0] == 0) {
				armorBuilder1.setArmorFromCode(armorCode);
			}
			if (armorCode[0] == 1) {
				armorBuilderG.setArmorFromCode(armorCode);
			}

			toggleArmorCodeDialog(false);
		}
	});
	document.getElementById("copy-code-button").addEventListener("click", () => {
		armorCodeExport.select();
		document.execCommand("copy");
	});

	var searchInput = document.getElementById("search");
	function doesArmorPieceContainTerm(armorData, category, index, searchTerm) {
		return searchTerm.length === 0 || armorData[category][index].name.toLowerCase().indexOf(searchTerm) !== -1;
	}
	function filterBySearch() {
		var searchTerm = searchInput.value.toLowerCase();

		for (var i = 0; i < headgear1Rows.length; i++) {
			headgear1Rows[i].style.display = doesArmorPieceContainTerm(armorData1, "headgear", i, searchTerm) ? "" : "none";
		}
		for (var i = 0; i < torso1Rows.length; i++) {
			torso1Rows[i].style.display = doesArmorPieceContainTerm(armorData1, "torso", i, searchTerm) ? "" : "none";
		}
		for (var i = 0; i < arms1Rows.length; i++) {
			arms1Rows[i].style.display = doesArmorPieceContainTerm(armorData1, "arms", i, searchTerm) ? "" : "none";
		}
		for (var i = 0; i < waist1Rows.length; i++) {
			waist1Rows[i].style.display = doesArmorPieceContainTerm(armorData1, "waist", i, searchTerm) ? "" : "none";
		}
		for (var i = 0; i < legs1Rows.length; i++) {
			legs1Rows[i].style.display = doesArmorPieceContainTerm(armorData1, "legs", i, searchTerm) ? "" : "none";
		}

		for (var i = 0; i < headgearGRows.length; i++) {
			headgearGRows[i].style.display = doesArmorPieceContainTerm(armorDataG, "headgear", i, searchTerm) ? "" : "none";
		}
		for (var i = 0; i < torsoGRows.length; i++) {
			torsoGRows[i].style.display = doesArmorPieceContainTerm(armorDataG, "torso", i, searchTerm) ? "" : "none";
		}
		for (var i = 0; i < armsGRows.length; i++) {
			armsGRows[i].style.display = doesArmorPieceContainTerm(armorDataG, "arms", i, searchTerm) ? "" : "none";
		}
		for (var i = 0; i < waistGRows.length; i++) {
			waistGRows[i].style.display = doesArmorPieceContainTerm(armorDataG, "waist", i, searchTerm) ? "" : "none";
		}
		for (var i = 0; i < legsGRows.length; i++) {
			legsGRows[i].style.display = doesArmorPieceContainTerm(armorDataG, "legs", i, searchTerm) ? "" : "none";
		}
	}
	searchInput.addEventListener("keyup", (event) => {
		filterBySearch();
	});
	filterBySearch();

	// Only for MHG pieces
	function doesArmorPieceHaveSkills(armorCategory, index, skills) {
		// If none are clicked, show all armor
		if (skills.length == 0) return true;

		var armorPiece = armorDataG[armorCategory][index];
		if (armorPiece.skills) {
			for (let i = 0; i < armorPiece.skills.length; i++) {
				if (skills.includes(armorPiece.skills[i].k)) {
					return true;
				}
			}
		}

		return false;
	}
	var skillCheckboxes = document.getElementsByName("armor_skills_g");
	function filterByArmorSkills() {
		var checkedSkills = [];

		for (let i = 0; i < skillCheckboxes.length; i++) {
			if (skillCheckboxes[i].checked) {
				checkedSkills.push(skillCheckboxes[i].value);
			}
		}

		for (var i = 0; i < headgearGRows.length; i++) {
			headgearGRows[i].style.display = doesArmorPieceHaveSkills("headgear", i, checkedSkills) ? "" : "none";
		}
		for (var i = 0; i < torsoGRows.length; i++) {
			torsoGRows[i].style.display = doesArmorPieceHaveSkills("torso", i, checkedSkills) ? "" : "none";
		}
		for (var i = 0; i < armsGRows.length; i++) {
			armsGRows[i].style.display = doesArmorPieceHaveSkills("arms", i, checkedSkills) ? "" : "none";
		}
		for (var i = 0; i < waistGRows.length; i++) {
			waistGRows[i].style.display = doesArmorPieceHaveSkills("waist", i, checkedSkills) ? "" : "none";
		}
		for (var i = 0; i < legsGRows.length; i++) {
			legsGRows[i].style.display = doesArmorPieceHaveSkills("legs", i, checkedSkills) ? "" : "none";
		}
	}
	for (let i = 0; i < skillCheckboxes.length; i++) {
		skillCheckboxes[i].addEventListener("change", filterByArmorSkills);
	}
	filterByArmorSkills();

	function showDownloadButtonForUser() {
		var buttons = {
			"Mac": document.getElementById("apple-download-button").outerHTML,
			"Linux 64": document.getElementById("linux-64-download-button").outerHTML,
			"Linux 32": document.getElementById("linux-32-download-button").outerHTML,
			"Windows 64": document.getElementById("windows-64-download-button").outerHTML,
			"Windows 32": document.getElementById("windows-32-download-button").outerHTML
		};

		var userOS = getUserOS();
		var downloadButtonForUser = "";
		if (buttons[userOS]) {
			downloadButtonForUser = buttons[userOS];
		}
		else if (userOS == "Linux") {
			downloadButtonForUser = buttons["Linux 64"] + buttons["Linux 32"];
		}
		else if (userOS == "Windows") {
			downloadButtonForUser = buttons["Windows 64"] + buttons["Windows 32"];
		}

		if (downloadButtonForUser) {
			document.getElementById("download-button-container").innerHTML = downloadButtonForUser;
		}
	}
	showDownloadButtonForUser();
});
