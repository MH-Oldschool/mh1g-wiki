ready(() => {
	var rankFilterLabels = document.getElementsByClassName("rank-label");
	function setRank(rankIndex) {
		toggleHighRank(rankIndex > 0);
		toggleGRank(rankIndex == 2);

		for (var i = 0; i < 3; i++) {
			if (i <= rankIndex) {
				rankFilterLabels[i].classList.add("highlighted");
			}
			else {
				rankFilterLabels[i].classList.remove("highlighted");
			}
		}
	}
	var rankFilter = document.getElementById("rank-filter");
	rankFilter.addEventListener("input", event => {
		setRank(event.target.value);
	});
	setRank(rankFilter.value);

	var meleeWeaponsContainer = document.getElementById("melee-weapons");
	var weaponElementChecks = document.getElementsByName("weapon-element-status");
	var weaponStatusElementAll = document.getElementById("weapon-status-element-all");
	function updateWeaponVisibility() {
		var filterWeapons = false;
		var anyUnchecked = false;

		for (var i = 0; i < weaponElementChecks.length; i++) {
			if (!filterWeapons && weaponElementChecks[i].checked) filterWeapons = true;
			if (!anyUnchecked && !weaponElementChecks[i].checked) anyUnchecked = true;
		}


		if (filterWeapons && anyUnchecked) {
			meleeWeaponsContainer.classList.add("filter-weapons");
			weaponStatusElementAll.checked = false;

			for (var i = 0; i < weaponElementChecks.length; i++) {
				if (weaponElementChecks[i].checked) {
					meleeWeaponsContainer.classList.add(weaponElementChecks[i].value);
				}
				else {
					meleeWeaponsContainer.classList.remove(weaponElementChecks[i].value);
				}
			}
		}
		else {
			meleeWeaponsContainer.classList.remove("filter-weapons");
			weaponStatusElementAll.checked = true;
		}
	}
	for (var i = 0; i < weaponElementChecks.length; i++) {
		weaponElementChecks[i].addEventListener("click", updateWeaponVisibility);
	}
	updateWeaponVisibility();
	weaponStatusElementAll.addEventListener("click", (event) => {
		for (var i = 0; i < weaponElementChecks.length; i++) {
			weaponElementChecks[i].checked = event.target.checked;
		}

		meleeWeaponsContainer.classList.remove("highlight-fire", "highlight-water", "highlight-thunder", "highlight-dragon", "highlight-poison", "highlight-paralysis", "highlight-sleep");

		if (event.target.checked) {
			meleeWeaponsContainer.classList.remove("filter-weapons");
		}
		else {
			meleeWeaponsContainer.classList.add("filter-weapons");
		}
	});

	// Filter Bowguns by Ammo
	var lbgBase = document.getElementById("lbg-base");
	var hbgBase = document.getElementById("hbg-base");
	var baseAmmoAll = document.getElementById("base-ammo-all");
	var baseAmmoChecks = document.getElementsByName("ammo_base");

	function updateBaseBowgunVisibility() {
		var filterBowguns = false;
		var anyUnchecked = false;

		for (var i = 0; i < baseAmmoChecks.length; i++) {
			if (!filterBowguns && baseAmmoChecks[i].checked) filterBowguns = true;
			if (!anyUnchecked && !baseAmmoChecks[i].checked) anyUnchecked = true;
		}


		if (filterBowguns && anyUnchecked) {
			lbgBase.classList.add("filter-bowguns");
			hbgBase.classList.add("filter-bowguns");

			baseAmmoAll.checked = false;

			for (var i = 0; i < baseAmmoChecks.length; i++) {
				if (baseAmmoChecks[i].checked) {
					lbgBase.classList.add(baseAmmoChecks[i].value);
					hbgBase.classList.add(baseAmmoChecks[i].value);
				}
				else {
					lbgBase.classList.remove(baseAmmoChecks[i].value);
					hbgBase.classList.remove(baseAmmoChecks[i].value);
				}
			}
		}
		else {
			lbgBase.classList.remove("filter-bowguns");
			hbgBase.classList.remove("filter-bowguns");
			baseAmmoAll.checked = true;
		}
	}
	for (var i = 0; i < baseAmmoChecks.length; i++) {
		baseAmmoChecks[i].addEventListener("click", updateBaseBowgunVisibility);
	}
	updateBaseBowgunVisibility();
	baseAmmoAll.addEventListener("click", (event) => {
		for (var i = 0; i < baseAmmoChecks.length; i++) {
			baseAmmoChecks[i].checked = event.target.checked;
		}

		lbgBase.classList.remove("show-nrm-1", "show-nrm-3", "show-prc-1", "show-prc-2", "show-prc-3", "show-pllt-1", "show-pllt-2", "show-pllt-3", "show-crag-1", "show-crag-2", "show-crag-3", "show-clust-1", "show-clust-2", "show-clust-3", "show-disc", "show-rec-1", "show-rec-2", "show-poi-1", "show-poi-2", "show-stun-1", "show-stun-2", "show-slp-1", "show-slp-2", "show-anti", "show-demon", "show-armor", "show-dragon", "show-dung");
		hbgBase.classList.remove("show-nrm-1", "show-nrm-3", "show-prc-1", "show-prc-2", "show-prc-3", "show-pllt-1", "show-pllt-2", "show-pllt-3", "show-crag-1", "show-crag-2", "show-crag-3", "show-clust-1", "show-clust-2", "show-clust-3", "show-disc", "show-rec-1", "show-rec-2", "show-poi-1", "show-poi-2", "show-stun-1", "show-stun-2", "show-slp-1", "show-slp-2", "show-anti", "show-demon", "show-armor", "show-dragon", "show-dung");

		if (event.target.checked) {
			lbgBase.classList.remove("filter-bowguns");
			hbgBase.classList.remove("filter-bowguns");
		}
		else {
			lbgBase.classList.add("filter-bowguns");
			hbgBase.classList.add("filter-bowguns");
		}
	});

	var lbgG = document.getElementById("lbg-g");
	var hbgG = document.getElementById("hbg-g");
	var gAmmoAll = document.getElementById("g-ammo-all");
	var gAmmoChecks = document.getElementsByName("ammo_g");
	function updateGBowgunVisibility() {
		var filterBowguns = false;
		var anyUnchecked = false;

		for (var i = 0; i < gAmmoChecks.length; i++) {
			if (!filterBowguns && gAmmoChecks[i].checked) filterBowguns = true;
			if (!anyUnchecked && !gAmmoChecks[i].checked) anyUnchecked = true;
		}


		if (filterBowguns && anyUnchecked) {
			lbgG.classList.add("filter-bowguns");
			hbgG.classList.add("filter-bowguns");

			gAmmoAll.checked = false;

			for (var i = 0; i < gAmmoChecks.length; i++) {
				if (gAmmoChecks[i].checked) {
					lbgG.classList.add(gAmmoChecks[i].value);
					hbgG.classList.add(gAmmoChecks[i].value);
				}
				else {
					lbgG.classList.remove(gAmmoChecks[i].value);
					hbgG.classList.remove(gAmmoChecks[i].value);
				}
			}
		}
		else {
			lbgG.classList.remove("filter-bowguns");
			hbgG.classList.remove("filter-bowguns");
			gAmmoAll.checked = true;
		}
	}
	for (var i = 0; i < gAmmoChecks.length; i++) {
		gAmmoChecks[i].addEventListener("click", updateGBowgunVisibility);
	}
	updateGBowgunVisibility();
	gAmmoAll.addEventListener("click", (event) => {
		for (var i = 0; i < gAmmoChecks.length; i++) {
			gAmmoChecks[i].checked = event.target.checked;
		}

		lbgG.classList.remove("show-nrm-1","show-nrm-3","show-prc-1","show-prc-2","show-prc-3","show-pllt-1","show-pllt-2","show-pllt-3","show-crag-1","show-crag-2","show-crag-3","show-clust-1","show-clust-2","show-clust-3","show-flame","show-water","show-thunder","show-dragon","show-rec-1","show-rec-2","show-poi-1","show-poi-2","show-stun-1","show-stun-2","show-slp-1","show-slp-2","show-anti","show-demon");
		hbgG.classList.remove("show-nrm-1","show-nrm-3","show-prc-1","show-prc-2","show-prc-3","show-pllt-1","show-pllt-2","show-pllt-3","show-crag-1","show-crag-2","show-crag-3","show-clust-1","show-clust-2","show-clust-3","show-flame","show-water","show-thunder","show-dragon","show-rec-1","show-rec-2","show-poi-1","show-poi-2","show-stun-1","show-stun-2","show-slp-1","show-slp-2","show-anti","show-demon");

		if (event.target.checked) {
			lbgG.classList.remove("filter-bowguns");
			hbgG.classList.remove("filter-bowguns");
		}
		else {
			lbgG.classList.add("filter-bowguns");
			hbgG.classList.add("filter-bowguns");
		}
	});

	var toggleBranchButton = (branchButton, open) => {
		if (open) {
			branchButton.classList.add("open");
		}
		else {
			branchButton.classList.remove("open");
		}
		branchButton.dataset.open = open ? "1" : "0";
	}

	var toggleBranchBody = (branchBody, open) => {
		if (open) {
			branchBody.classList.add("open");
		}
		else {
			branchBody.classList.remove("open");
		}

		if (!open && branchBody.dataset.childBranch) {
			if (branchBody.dataset.childBranch[0] === ".") {
				var childBranches = document.getElementsByClassName(branchBody.dataset.childBranch.substring(1));
				for (var i = 0; i < childBranches.length; i++) {
					toggleBranchBody(childBranches[i], false);
				}
			}
			else {
				var childBranch = document.getElementById(branchBody.dataset.childBranch);
				toggleBranchBody(childBranch, false);
			}

			// Also toggle the button state
			var branchButtons = branchBody.getElementsByClassName("branch-button");
			for (var i = 0; i < branchButtons.length; i++) {
				toggleBranchButton(branchButtons[i], false);
			}
		}
	}

	var toggleBranch = (branchButton, open) => {
		toggleBranchButton(branchButton, open);

		if (branchButton.dataset.target[0] == ".") {
			var branchBodies = document.getElementsByClassName(branchButton.dataset.target.substring(1));
			for (var i = 0; i < branchBodies.length; i++) {
				toggleBranchBody(branchBodies[i], open);
			}
		}
		else {
			var branchBody = document.getElementById(branchButton.dataset.target);
			toggleBranchBody(branchBody, open);
		}
	}
	var handleBranchButtonClick = (event) => {
		var open = event.currentTarget.dataset.open !== "1";
		toggleBranch(event.currentTarget, open);
	}

	var branchButtons = document.getElementsByClassName("branch-button");
	for (var i = 0; i < branchButtons.length; i++) {
		branchButtons[i].addEventListener("click", handleBranchButtonClick);
	}

	var openDetailsUpward = (details) => {
		details.open = true;
		if (details.parentElement.tagName == "DETAILS") {
			openDetailsUpward(details.parentElement);
		}
	}

	var handleToggleAllClick = (event) => {
		var isOpen = event.currentTarget.dataset.open == "1";

		var branchContainer = document.getElementById(event.currentTarget.dataset.target);
		var branchButtons = branchContainer.getElementsByClassName("branch-button");
		for (var i = 0; i < branchButtons.length; i++) {
			toggleBranch(branchButtons[i], !isOpen);
		}
		branchContainer.open = !isOpen;

		if (isOpen) {
			event.currentTarget.classList.remove("open");
		}
		else {
			event.currentTarget.classList.add("open");
		}
		event.currentTarget.dataset.open = isOpen ? "0" : "1";
	}
	var toggleAllButtons = document.getElementsByClassName("toggle-all-button");
	for (var i = 0; i < toggleAllButtons.length; i++) {
		toggleAllButtons[i].addEventListener("click", handleToggleAllClick);
	}

	var handleAnchorClick = (event) => {
		event.preventDefault();

		var targetElement = document.getElementById(event.currentTarget.dataset.target);
		if (targetElement) {
			openDetailsUpward(targetElement);
			scrollToElement(targetElement);
		}

		return false;
	}

	var anchors = document.getElementsByTagName("A");
	for (var i = 0; i < anchors.length; i++) {
		if (anchors[i].dataset.target) {
			anchors[i].addEventListener("click", handleAnchorClick);
		}
	}
});

// TODO: highlight weapons of a given element/status
