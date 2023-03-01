ready(() => {
  function toggleGatheringPoints(toggleOn) {
    var mapsContainer = document.getElementById("maps-container");

    if (toggleOn) {
      mapsContainer.classList.add("show-gathering-points");
    }
    else {
      mapsContainer.classList.remove("show-gathering-points");
    }
  }

  var showGatheringSpots = document.getElementById("show-gathering-spots")
  showGatheringSpots.addEventListener("change", (event) => {
    toggleGatheringPoints(event.target.checked)
  });
  toggleGatheringPoints(showGatheringSpots.checked);

  function toggleGatheringDetails(toggleOn) {
    if (toggleOn) {
      document.body.classList.add("show-gathering-details");
      showGatheringSpots.checked = true;
      toggleGatheringPoints(true);
    }
    else {
      document.body.classList.remove("show-gathering-details");
    }
  }

  var showGatheringDetails = document.getElementById("show-gathering-details");
  showGatheringDetails.addEventListener("change", (event) => {
    toggleGatheringDetails(event.target.checked);
  });
  toggleGatheringDetails(showGatheringDetails.checked);
});
