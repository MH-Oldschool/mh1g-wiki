ready(() => {
	var scrollToElement = (element) => {
		var rect = element.getBoundingClientRect();
		window.scrollTo(0, rect.y);
	}

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
		branchBody.style.display = open ? "table-row-group" : "";

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

	var handleBranchButtonClick = (event) => {
		var open = event.currentTarget.dataset.open !== "1";
		toggleBranchButton(event.currentTarget, open);

		if (event.currentTarget.dataset.target[0] == ".") {
			var branchBodies = document.getElementsByClassName(event.currentTarget.dataset.target.substring(1));
			for (var i = 0; i < branchBodies.length; i++) {
				toggleBranchBody(branchBodies[i], open);
			}
		}
		else {
			var branchBody = document.getElementById(event.currentTarget.dataset.target);
			toggleBranchBody(branchBody, open);
		}
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

	var MOUSE_MOVE_THRESHOLD = { x: 8, y: 8 };
	var mousePos = { x: 0, y: 0 };
	var toggleFullDetails = (cell) => {
		var isFull = cell.dataset.full == "1";

		if (isFull) {
			cell.classList.remove("full-details");
		}
		else {
			cell.classList.add("full-details");
		}

		cell.dataset.full = isFull ? "0" : "1";
	}
	var handleMaterialsMousedown = (event) => {
		mousePos.x = event.screenX;
		mousePos.y = event.screenY;
	}
	var handleMaterialsMouseup = (event) => {
		if (Math.abs(event.screenX - mousePos.x) < MOUSE_MOVE_THRESHOLD.x && Math.abs(event.screenY - mousePos.y) < MOUSE_MOVE_THRESHOLD.y) {
			toggleFullDetails(event.currentTarget);
		}
	}

	var materialCells = document.getElementsByClassName("materials");
	for (var i = 0; i < materialCells.length; i++) {
		materialCells[i].addEventListener("mousedown", handleMaterialsMousedown);
		materialCells[i].addEventListener("mouseup", handleMaterialsMouseup);
	}
});

// TODO: highlight weapons of a given element/status
