ready(() => {
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
