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
});
