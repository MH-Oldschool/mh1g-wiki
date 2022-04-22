window.scrollToElement = (element) => {
	var rect = element.getBoundingClientRect();
	window.scrollTo(0, rect.y);
}

ready(() => {
	var toggleGVersion = (toggleOn) => {
		var gOnlyEl = document.getElementsByClassName("g-only");
		for (var i = 0; i < gOnlyEl.length; i++) {
			if (toggleOn) {
				gOnlyEl[i].classList.remove("hide");
			}
			else {
				gOnlyEl[i].classList.add("hide");
			}
		}

		var baseOnlyEl = document.getElementsByClassName("base-only");
		for (var i = 0; i < baseOnlyEl.length; i++) {
			if (toggleOn) {
				baseOnlyEl[i].classList.remove("show");
			}
			else {
				baseOnlyEl[i].classList.add("show");
			}
		}

		if (toggleOn) {
			document.body.classList.add("show-g");
			document.body.classList.remove("show-1");
		}
		else {
			document.body.classList.remove("show-g");
			document.body.classList.add("show-1");
		}
	}
	var gToggleCheckbox = document.getElementById("g-toggle");
	gToggleCheckbox.addEventListener("change", (event) => {
		toggleGVersion(event.currentTarget.checked);
	});
	if (!gToggleCheckbox.checked) {
		toggleGVersion(false);
	}
});
