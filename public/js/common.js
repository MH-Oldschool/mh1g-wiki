window.getMHVersion = () => {
	return document.body.classList.contains("show-1") ? "1" : "g";
};
window.scrollToElement = (element) => {
	var rect = element.getBoundingClientRect();
	window.scrollTo(0, rect.y);
};
window.eachElementByClassName = (className, callback) => {
	var el = document.getElementsByClassName(className);
	for (var i = 0; i < el.length; i++) {
		callback(el[i], i);
	}
};

window.toggleLowRank = (toggleOn) => {
	document.body.classList[toggleOn ? "remove" : "add"]("hide-low-rank");
};
window.toggleHighRank = (toggleOn) => {
	document.body.classList[toggleOn ? "remove" : "add"]("hide-high-rank");
};
window.toggleGRank = (toggleOn) => {
	document.body.classList[toggleOn ? "remove" : "add"]("hide-g-rank");
};

window.closePopup = () => {
	document.body.classList.remove("show-popup");
};

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

	// Only load the saved version if we allow version swapping on this page
	var gToggle = document.getElementById("g-toggle");
	if (gToggle) {
		gToggle.addEventListener("change", (event) => {
			toggleGVersion(event.currentTarget.checked);
		});

		// Check for version forced through a url param
		var urlParams = window.location.search.substr(1).split("&");
		var versionParam;
		urlParams.forEach((param) => {
			var split = param.split("=");
			if (split[0] == "v") {
				versionParam = split[1];
			}
		});

		if (versionParam && versionParam == "1" || versionParam == "g") {
			if (versionParam == "1") {
				gToggle.checked = false;
				toggleGVersion(false);
			}
		}
		else {
			var version = getVersionFromCookie();
			if (version) {
				gToggle.checked = version == "g";
				toggleGVersion(version == "g");
			}
		}
	}
});
