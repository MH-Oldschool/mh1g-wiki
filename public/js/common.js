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

window.commaStringToNumber = (number) => {
	if (typeof number == "string") {
		return new Number(number.replace(",", ""));
	}

	return number;
};
window.numberWithCommas = (number) => {
	if (number > 1000) {
		var withCommas = [];
		var numberString = number.toString();

		for (var i = numberString.length; i >= 0; i -= 3) {
			withCommas.unshift(numberString.substring(Math.max(0, i - 3), i));
		}

		return withCommas.join(",");
	}

	return number;
};

window.getUserOS = () => {
	var userOS = "";

	if (navigator.userAgent.indexOf("Linux") !== -1 || navigator.userAgent.indexOf("X11") !== -1) {
		userOS = "Linux";
	}
	else if (navigator.userAgent.indexOf("Mac") !== -1) {
		userOS = "Mac";
	}
	else if (navigator.userAgent.indexOf("Win") !== -1) {
		userOS = "Windows";
	}

	// If we can determine whether it's a 32- or 64-bit OS, add that
	if (navigator.userAgent.indexOf("x64") !== -1) {
		userOS += " 64";
	}
	else if (navigator.userAgent.indexOf("x86") !== -1) {
		userOS += " 32";
	}

	return userOS;
}

// Choose a random cursor
var cursorClass = (() => {
	const CURSORS = ["greatsword","hammer","lance","sword","bowgun"];
	var index = Math.floor(Math.random() * CURSORS.length);

	return CURSORS[index] + "-cursor";
})()

ready(() => {
	document.body.classList.add(cursorClass);

	const gToggleEvent = new Event("g-toggle");

	function toggleGVersion(toggleOn) {
		window.localStorage.setItem("version", toggleOn ? "g" : "1");

		var gOnlyEl = document.getElementsByClassName("g-only");
		for (var i = 0; i < gOnlyEl.length; i++) {
			gOnlyEl[i].style.display = toggleOn ? "" : "none";
		}

		var baseOnlyEl = document.getElementsByClassName("base-only");
		for (var i = 0; i < baseOnlyEl.length; i++) {
			baseOnlyEl[i].style.display = toggleOn ? "none" : "";
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
			var version = window.localStorage.getItem("version");
			if (version) {
				gToggle.checked = version == "g";
				toggleGVersion(version == "g");
			}
		}
	}

	// Keep footer at the bottom of the visible screen
	var footer = document.getElementById("footer");
	function updateFooterPosition() {
		var boundingRect = footer.getBoundingClientRect();
		footer.style.top = (window.innerHeight - boundingRect.height) + "px";
	}
	window.addEventListener("resize", () => {
		window.requestAnimationFrame(updateFooterPosition);
	});
	updateFooterPosition();
});
