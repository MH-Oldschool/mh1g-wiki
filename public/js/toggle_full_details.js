ready(() => {
	var MOUSE_MOVE_THRESHOLD = { x: 8, y: 8 };
	var mousePos = { x: 0, y: 0 };
	var toggleFullDetails = (cell, toggleOn) => {
		if (toggleOn) {
			cell.classList.add("full-details");
		}
		else {
			cell.classList.remove("full-details");
		}

		cell.dataset.full = toggleOn ? "1" : "0";
	}
	var handleMaterialsMousedown = (event) => {
		mousePos.x = event.screenX;
		mousePos.y = event.screenY;
	}
	var handleMaterialsMouseup = (event) => {
		if (Math.abs(event.screenX - mousePos.x) < MOUSE_MOVE_THRESHOLD.x && Math.abs(event.screenY - mousePos.y) < MOUSE_MOVE_THRESHOLD.y) {
			var materialsCell = event.target;
			if (event.target.parentElement.classList.contains("materials")) {
				var materialsCell = event.target.parentElement;
			}

			toggleFullDetails(materialsCell, materialsCell.dataset.full == "0");
		}
	}

	function saveCellStateCookie(state) {
		try {
			document.cookie = "mh1g-wiki-cell-state=" + state + ";SameSite=Lax";
		}
		catch (err) {
			console.warn("Unable to write MH cell state cookie:", err);
		}
	}
	function getCellStateFromCookie() {
		try {
			var cookieIndex = document.cookie.indexOf("mh1g-wiki-cell-state");
			// This will be just a single character;
			// the cookie name is 20 characters long, plus one for the "=" sign
			return document.cookie[cookieIndex + 21];
		}
		catch (err) {
			console.warn("Unable to retrieve MH cell state cookie:", err);
		}

		return "";
	}

	var toggleFullCells = document.getElementById("cells-toggle");
	var toggleOn = false;
	if (toggleFullCells) {
		if (getCellStateFromCookie()) {
			toggleOn = true;
			toggleFullCells.checked = true;
		}

		toggleFullCells.addEventListener("change", event => {
			toggleOn = event.target.checked;
			for (let i = 0; i < materialCells.length; i++) {
				toggleFullDetails(materialCells[i], toggleOn);
			}

			saveCellStateCookie(toggleOn ? "1" : "0");
		});
	}

	var materialCells = document.getElementsByClassName("materials");
	for (var i = 0; i < materialCells.length; i++) {
		materialCells[i].addEventListener("mousedown", handleMaterialsMousedown);
		materialCells[i].addEventListener("mouseup", handleMaterialsMouseup);

		if (toggleOn) {
			toggleFullDetails(materialCells[i], true);
		}
	}
});
