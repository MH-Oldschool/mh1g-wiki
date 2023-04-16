ready(() => {
	const itemDialog = document.getElementById("item-dialog");

	function toggleItemDialog(toggleOn) {
		if (toggleOn) {
			itemDialog.showModal();
		}
		else {
			itemDialog.close();
		}

		toggleDialogBackdrop(toggleOn);
	}
	function showItemDetails(index) {
		const dialogName = document.getElementById("item-dialog-name");
		const dialogDescription = document.getElementById("item-dialog-description");
		const dialogDetails = document.getElementById("item-dialog-details");
		const dialogAcquire = document.getElementById("item-dialog-acquire");
		const dialogCombo = document.getElementById("item-dialog-combo");
		const dialogTrades = document.getElementById("item-dialog-trades");
		const dialogComboUses = document.getElementById("item-dialog-combo-uses");
		const dialogWeaponUses = document.getElementById("item-dialog-weapon-uses");
		const dialogArmorUses = document.getElementById("item-dialog-armor-uses");

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

		if (data.comboForItem && data.comboForItem) {
			dialogCombo.innerHTML = data.comboForItem;
			itemDialog.classList.add("show-combo");
		}
		else if (data.alchemyForItem) {
			dialogCombo.innerHTML = data.alchemyForItem;
			itemDialog.classList.add("show-alchemy");
			itemDialog.classList.add("show-combo");
		}
		else {
			itemDialog.classList.remove("show-alchemy");
			itemDialog.classList.remove("show-combo");
		}

		if (data.tradesForItem && data.tradesForItem) {
			dialogTrades.innerHTML = data.tradesForItem;
			itemDialog.classList.add("show-trades");
		}
		else {
			itemDialog.classList.remove("show-trades");
		}

		if (data.combosUsingItem && data.combosUsingItem) {
			dialogComboUses.innerHTML = data.combosUsingItem;
			itemDialog.classList.add("show-combo-uses");
		}
		else {
			itemDialog.classList.remove("show-combo-uses");
		}

		if (data.weaponUses && data.weaponUses) {
			dialogWeaponUses.innerHTML = data.weaponUses;
			itemDialog.classList.add("show-weapon-uses");
		}
		else {
			itemDialog.classList.remove("show-weapon-uses");
		}

		if (data.armorUses && data.armorUses) {
			dialogArmorUses.innerHTML = data.armorUses;
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
