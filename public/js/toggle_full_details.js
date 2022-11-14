ready(() => {
	function getMaterialsCell(element) {
		if (element.classList.contains("materials")) {
			return element;
		}

		return getMaterialsCell(element.parentElement);
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
	var handleMaterialsMousedown = (event) => {
		// Only handle primary click (usually left mouse button)
		if (event.button == 0) {
			mousePos.x = event.screenX;
			mousePos.y = event.screenY;
		}
	}
	var handleMaterialsMouseup = (event) => {
		const MOUSE_MOVE_THRESHOLD = { x: 4, y: 4 };

		// Only handle primary click (usually left mouse button)
		if (event.button == 0) {
			var xDistance = Math.abs(event.screenX - mousePos.x);
			var yDistance = Math.abs(event.screenY - mousePos.y);

			if (xDistance < MOUSE_MOVE_THRESHOLD.x && yDistance < MOUSE_MOVE_THRESHOLD.y) {
				var materialsCell = getMaterialsCell(event.target);

				if (!materialsCell.dataset.full) {
					materialsCell.dataset.full = "0";
				}

				toggleFullDetails(materialsCell, materialsCell.dataset.full == "0");
			}
		}
	}

	var toggleFullCells = document.getElementById("cells-toggle");
	var toggleOn = false;
	if (toggleFullCells) {
		if (window.localStorage.getItem("cellState")) {
			toggleOn = true;
			toggleFullCells.checked = true;
		}

		toggleFullCells.addEventListener("change", event => {
			toggleOn = event.target.checked;
			for (let i = 0; i < materialCells.length; i++) {
				toggleFullDetails(materialCells[i], toggleOn);
			}

			window.localStorage.setItem("cellState", toggleOn ? "1" : "0");
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
