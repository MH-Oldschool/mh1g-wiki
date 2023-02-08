ready(() => {
	function getExpandableCell(element) {
		if (element.classList.contains("expandable")) {
			return element;
		}

		return getExpandableCell(element.parentElement);
	}

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
	var handleExpandableMousedown = (event) => {
		// Only handle primary click (usually left mouse button)
		if (event.button == 0) {
			mousePos.x = event.screenX;
			mousePos.y = event.screenY;
		}
	}
	var handleExpandableMouseup = (event) => {
		const MOUSE_MOVE_THRESHOLD = { x: 4, y: 4 };

		// Only handle primary click (usually left mouse button)
		if (event.button == 0) {
			var xDistance = Math.abs(event.screenX - mousePos.x);
			var yDistance = Math.abs(event.screenY - mousePos.y);

			if (xDistance < MOUSE_MOVE_THRESHOLD.x && yDistance < MOUSE_MOVE_THRESHOLD.y) {
				var expandableCell = getExpandableCell(event.target);

				if (!expandableCell.dataset.full) {
					expandableCell.dataset.full = "0";
				}

				toggleFullDetails(expandableCell, expandableCell.dataset.full == "0");
			}
		}
	}

	var toggleFullCells = document.getElementById("cells-toggle");
	var toggleOn = false;
	if (toggleFullCells) {
		var cellState = window.localStorage.getItem("cellState");
		toggleOn = cellState == "1";
		toggleFullCells.checked = toggleOn;

		toggleFullCells.addEventListener("change", event => {
			toggleOn = event.target.checked;
			for (let i = 0; i < expandableCells.length; i++) {
				toggleFullDetails(expandableCells[i], toggleOn);
			}

			window.localStorage.setItem("cellState", toggleOn ? "1" : "0");
		});
	}

	var expandableCells = document.getElementsByClassName("expandable");
	for (var i = 0; i < expandableCells.length; i++) {
		expandableCells[i].addEventListener("mousedown", handleExpandableMousedown);
		expandableCells[i].addEventListener("mouseup", handleExpandableMouseup);

		if (toggleOn) {
			toggleFullDetails(expandableCells[i], true);
		}
	}
});
