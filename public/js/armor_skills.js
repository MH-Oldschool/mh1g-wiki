ready(() => {
	var detailsToggle = document.getElementById("details-toggle");
	function toggleDetails(toggleOn) {
		if (toggleOn) {
			document.body.classList.add("show-details");
		}
		else {
			document.body.classList.remove("show-details");
		}
	}
	detailsToggle.addEventListener("click", (event) => {
		toggleDetails(event.target.checked);
	});
	toggleDetails(detailsToggle.checked);
});
