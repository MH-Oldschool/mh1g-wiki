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
});

// TODO: highlight weapons of a given element/status
