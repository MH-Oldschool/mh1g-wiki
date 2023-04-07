ready(function() {
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

	function toggleEverything(toggleOn) {
		window.eachElementByClassName("branch-button", (element) => {
			toggleBranch(element, toggleOn);
		});

		window.eachElementByClassName("weapon-group-container", (element) => {
			element.open = toggleOn;
		});

		window.eachElementByClassName("weapon-class-container", (element) => {
			element.open = toggleOn;
		});
	}
	var toggleEverythingCheck = document.getElementById("toggle-everything")
	toggleEverythingCheck.addEventListener("click", (event) => {
		toggleEverything(toggleEverythingCheck.checked);
	});
	if (toggleEverythingCheck.checked) {
		toggleEverything(true);
	}

	var anchors = document.getElementsByTagName("A");
	for (var i = 0; i < anchors.length; i++) {
		if (anchors[i].dataset.target) {
			anchors[i].addEventListener("click", handleAnchorClick);
		}
	}

	function toggleRangeStat(toggleOn) {
		if (toggleOn) {
			document.body.classList.add("show-range-stat");
		}
		else {
			document.body.classList.remove("show-range-stat");
		}
	}
	var showRangeStat = document.getElementById("show-range-stat");
	showRangeStat.addEventListener("click", (event) => {
		toggleRangeStat(event.target.checked);
	});
	toggleRangeStat(showRangeStat.checked);

	var searchInput = document.getElementById("search");
	function doesWeaponContainTerm(weaponRow, searchTerm) {
		return searchTerm.length === 0 || weaponRow.dataset.name.toLowerCase().indexOf(searchTerm) !== -1;
	}
	var weaponRows = document.getElementsByClassName("weapon-row");
	function filterBySearch() {
		var searchTerm = searchInput.value.toLowerCase();

		for (var i = 0; i < weaponRows.length; i++) {
			weaponRows[i].style.display = doesWeaponContainTerm(weaponRows[i], searchTerm) ? "" : "none";
		}
	}
	searchInput.addEventListener("keyup", (event) => {
		filterBySearch();
	});
	filterBySearch();
});
