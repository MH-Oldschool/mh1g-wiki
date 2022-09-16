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
