window.scrollToElement = (element) => {
	var rect = element.getBoundingClientRect();
	window.scrollTo(0, rect.y);
}
window.eachElementByClassName = (className, callback) => {
	var el = document.getElementsByClassName(className);
	for (var i = 0; i < el.length; i++) {
		callback(el[i], i);
	}
}

ready(() => {
	const gToggleEvent = new Event("g-toggle");

	function saveVersionCookie(version) {
		try {
			document.cookie = "mh1g-wiki-version=" + version + ";SameSite=Lax";
		}
		catch (err) {
			console.warn("Unable to write MH version cookie:", err);
		}
	}
	function getVersionFromCookie() {
		try {
			var cookieIndex = document.cookie.indexOf("mh1g-wiki-version");
			// This will be just a single character;
			// the cookie name is 17 characters long, plus one for the "=" sign
			return document.cookie[cookieIndex + 18];
		}
		catch (err) {
			console.warn("Unable to retrieve MH version cookie:", err);
		}

		return "";
	}
	// Only load the saved version if we allow version swapping on this page
	var gToggle = document.getElementById("g-toggle");
	if (gToggle) {
		var version = getVersionFromCookie();
		if (version) {
			gToggle.checked = version == "g";
			toggleGVersion(version == "g");
		}
	}

	function toggleGVersion(toggleOn) {
		saveVersionCookie(toggleOn ? "g" : "1");

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

		document.body.dispatchEvent(gToggleEvent, toggleOn ? "g" : "1");
	}
	var gToggleCheckbox = document.getElementById("g-toggle");
	if (gToggleCheckbox) {
		gToggleCheckbox.addEventListener("change", (event) => {
			toggleGVersion(event.currentTarget.checked);
		});
		if (!gToggleCheckbox.checked) {
			toggleGVersion(false);
		}
	}

	window.closePopup = () => {
		document.body.classList.remove("show-popup");
	};
});
