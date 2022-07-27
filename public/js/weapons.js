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

		for (var i = 0; i < weaponElementChecks.length; i++) {
			if (!filterWeapons && weaponElementChecks[i].checked) filterWeapons = true;
			if (weaponElementChecks[i].checked) {
				meleeWeaponsContainer.classList.add(weaponElementChecks[i].value);
			}
			else {
				meleeWeaponsContainer.classList.remove(weaponElementChecks[i].value);
			}

			// window.eachElementByClassName(weaponElementChecks[i].dataset.element, (element) => {
			// 	if (weaponElementChecks[i].checked) {
			// 		element.classList.addClass("show");
			// 	}
			// 	else {
			// 		element.classList.removeClass("show");
			// 	}
			// });
		}

		if (filterWeapons) {
			meleeWeaponsContainer.classList.add("filter-weapons");
			weaponStatusElementAll.checked = false;
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
		if (event.target.checked) {
			for (var i = 0; i < weaponElementChecks.length; i++) {
				weaponElementChecks[i].checked = true;
			}
			meleeWeaponsContainer.classList.remove("filter-weapons");
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
