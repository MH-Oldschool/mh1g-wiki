ready(() => {
	const itemDialog = document.getElementById("item-dialog");

	function toggleItemDialog(toggleOn) {
		if (toggleOn) {
			document.body.classList.add("show-dialog");
			itemDialog.showModal();
		}
		else {
			document.body.classList.remove("show-dialog");
			itemDialog.close();
		}
	}
	function showItemDetails(index) {
		const dialogName = document.getElementById("item-dialog-name");
		const dialogDescription = document.getElementById("item-dialog-description");
		const dialogDetails = document.getElementById("item-dialog-details");
		const dialogAcquire = document.getElementById("item-dialog-acquire");
		const dialogCombo = document.getElementById("item-dialog-combo");
		const dialogComboUses = document.getElementById("item-dialog-combo-uses");
		const dialogWeaponUses = document.getElementById("item-dialog-weapon-uses");
		const dialogArmorUses = document.getElementById("item-dialog-armor-uses");

		var version = getMHVersion();
		var data = window.items[index];

		dialogName.innerHTML = data.name;
		dialogDescription.innerHTML = data.description;

		if (data.details) {
			dialogDetails.innerHTML = data.details;
			itemDialog.classList.add("show-details");
		}
		else {
			itemDialog.classList.remove("show-details");
		}

		if (data.acquire) {
			dialogAcquire.innerHTML = data.acquire;
			itemDialog.classList.add("show-acquire");
		}
		else {
			itemDialog.classList.remove("show-acquire");
		}

		if (data.comboForItem && data.comboForItem[version]) {
			dialogCombo.innerHTML = data.comboForItem[version];
			itemDialog.classList.add("show-combo");
		}
		else if (version == "g" && data.alchemyForItem) {
			dialogCombo.innerHTML = data.alchemyForItem;
			itemDialog.classList.add("show-alchemy");
			itemDialog.classList.add("show-combo");
		}
		else {
			itemDialog.classList.remove("show-alchemy");
			itemDialog.classList.remove("show-combo");
		}

		if (data.combosUsingItem && data.combosUsingItem[version]) {
			dialogComboUses.innerHTML = data.combosUsingItem[version];
			itemDialog.classList.add("show-combo-uses");
		}
		else {
			itemDialog.classList.remove("show-combo-uses");
		}

		// TODO: show Veggie Elder trades

		if (data.weaponUses && data.weaponUses[version]) {
			dialogWeaponUses.innerHTML = data.weaponUses[version];
			itemDialog.classList.add("show-weapon-uses");
		}
		else {
			itemDialog.classList.remove("show-weapon-uses");
		}

		if (data.armorUses && data.armorUses[version]) {
			dialogArmorUses.innerHTML = data.armorUses[version];
			itemDialog.classList.add("show-armor-uses");
		}
		else {
			itemDialog.classList.remove("show-armor-uses");
		}

		toggleItemDialog(true);
	}
	function handleItemDetailsClick(event) {
		showItemDetails(this.dataset.index);
	}

	window.eachElementByClassName("item-details-button", (element, index) => {
		element.dataset.index = index;
		element.addEventListener("click", handleItemDetailsClick);
	});
	window.eachElementByClassName("close-dialog-button", (element) => {
		element.addEventListener("click", () => {
			toggleItemDialog(false);
		});
	});
	document.getElementById("item-dialog").addEventListener("click", function(event) {
		if (event.target == this) {
			toggleItemDialog(false);
		}
	});
});