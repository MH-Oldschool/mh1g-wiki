ready(() => {
	// Make sure this is in GMT+00 so we reliably convert to the user's timezone
	const SHOP_ROTATION_START = new Date(Date.UTC(2022, 5, 17, 22, 30, 0));
	const SHOP_SPECIALS = [
		{
			title: "No Shop Specials",
			description: ""
		},
		{
			title: "Claw Day", // Wyvern Claws, Fangs, Monster Fluid, Rathalos/ian Scales
			description: "The Materials Vendor offers: Ivy, Godbug, Nitroshroom, Toadstool, Blue Mushroom, Sm Bone Husk, Cactus Flower, Power Seed, Armor Seed, Paintberry, Sm Monster Bone, Wyvern Fang, Wyvern Claw, Monster Fluid, Rathian Scale, and Rathalos Scale."
		},
		{
			title: "Half-Off Sale", // All market stalls half price
			description: "All market vendors sell at half the normal prices."
		},
		{
			title: "Gunpowder Day", // Mega tools, Gunpowder
			description: "The Tool Vendor offers: Mega Bugnet, Mega Pickaxe, and Gunpowder."
		},
		{
			title: "Fish & Food Day", // Food and Fish shops?
			description: "The Food Vendor offers: Sleepyfish, Honey, Burst Arrowana, Bomb Arrowana, and Scatterfish."
		}
	];
	// Day 1	Material Day (aka Claw day because Wyvern Claws for Fatalis Clust Lv.2 farming are sold)
	// Day 2	[none]
	// Day 3	Half-Price Day (Material+Tool+Food Shops regular stock for half price)
	// Day 4	[none]
	// Day 5	Tool Shop Day (Mega PickAxe/Gunpowder)
	// Day 6	[none]
	// Day 7	Half-Price Day
	// Day 8	[none]
	// Day 9	Food/Fish Shop Day
	// Day 10	[none]
	// Day 11	Half-Price Day
	// Day 12	[none]
	// Day 13=1	[Repeat, starting with Day 1]
	var SHOP_SPECIAL_ROTATION = new Uint8Array([1,0,2,0,3,0,2,0,4,0,2,0]);

	// Make sure this is in GMT+00 so we reliably convert to the user's timezone
	const EVENT_ROTATION_START = new Date(Date.UTC(2022, 5, 30, 22, 30, 0));
	const MH1_EVENTS = [
		{
			title: "Gathering",
			category: "gather",
			location: "Forest and Hills",
			client: "Hunter's Guild Material Collection",
			description: "Quest I think as much as you can, if you collect field material, you can clear the quest by delivering Map in the box."
		},
		{
			title: "Repel the Giant Dragon!",
			category: "hunt",
			location: "Fort",
			target: "Lao-Shan Lung",
			client: "Loyal Minister",
			description: "A giant dragon has attacked our fort again! Use the fort's weaponry to slay the beast and save our great nation!"
		},
		{
			title: "On the Trail of the Beast",
			category: "special",
			location: "Swamp",
			target: "Kirin",
			client: "Town Guardsman",
			description: "I saw it, I swear! Like a ghost, faintly glowing... Riches await the one who slays it, but you only get one chance. Don't blow it!."
		},
		{
			title: "Capture a Yian Kut-Ku",
			category: "capture",
			location: "Forest and Hills",
			target: "Yian Kut-Ku",
			client: "Guild Boss",
			description: "Prove your skill and team-work by capturing a Kut-Ku. The time limit is just 5 minutes, and you only have one chance. Don't blow it!"
		},
		{
			title: "Capture a Khezu",
			category: "capture",
			location: "Swamp",
			target: "Khezu",
			client: "Guild Boss",
			description: "Prove your skill and team-work by capturing a Khezu. The time limit is just 10 minutes, and you only have one chance. Don't blow it!"
		},
		{
			title: "The GMR Heavy Metal Crusade",
			category: "hunt",
			location: "Desert",
			target: "Diablos",
			client: "GMR",
			description: "Level the field with the Holy Grail of Heavy Metal. Only those with hearts of steel will walk away with The GMR Chrome Heart. (Actually the King Meat quest.)"
		}
	];
	// Day 1 Lao
	// Day 2 Gather
	// Day 3 Kirin
	// Day 4 Gather
	// Day 5 YKK Capture
	// Day 6 Gather
	// Day 7 Khezu Capture
	// Day 8 Gather
	// Day 9 GMR Chrome Heart (actually King Meat quest)
	// Day 10 Gather
	// Day 11 Gather
	// Day 12 Gather
	// Day 13 Gather
	// Day 14 Gather
	// Day 15 (back to Day 1)
	var MH1_EVENTS_ROTATION = new Uint8Array([
		1,0,2,0,3,0,4,0,5,0,0,0,0,0
	]);

	const MILLISECONDS_PER_DAY = 86400000;
	function dateToDays(date) {
		let timestamp = Date.parse(date);
		// divide by milliseconds in a day, and truncate
		return Math.floor(timestamp / MILLISECONDS_PER_DAY);
	}
	function populateStartTime() {
		let startTime = SHOP_ROTATION_START.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
		document.getElementById("event-special-time").innerText = startTime;
	}
	populateStartTime();

	// Figure out when the most recent event cycle started at or before this month
	function getFirstDayEventIndex(year, monthIndex) {
		let daysTimestamp = Date.UTC(year, monthIndex, 1, 22, 30, 0) / MILLISECONDS_PER_DAY;
		let cyclesSinceStart = (daysTimestamp - dateToDays(EVENT_ROTATION_START)) / MH1_EVENTS_ROTATION.length;
		return Math.floor(MH1_EVENTS_ROTATION.length * (cyclesSinceStart - Math.floor(cyclesSinceStart)));
	}
	// Figure out when the most recent shop special cycle started at or before this month
	function getFirstDayShopIndex(year, monthIndex) {
		let daysTimestamp = Date.UTC(year, monthIndex, 1, 22, 30, 0) / MILLISECONDS_PER_DAY;
		let cyclesSinceStart = (daysTimestamp - dateToDays(SHOP_ROTATION_START)) / SHOP_SPECIAL_ROTATION.length;
		return Math.floor(SHOP_SPECIAL_ROTATION.length * (cyclesSinceStart - Math.floor(cyclesSinceStart)));
	}

	var calendarDays = document.getElementById("calendar-tbody").getElementsByTagName("td");
	var calendarWeeks = document.getElementsByClassName("calendar-week");
	function getDaysInMonth(year, monthIndex) {
		// Try and set the date at the next month, with day 0
		// this should get the last day of the previous month
		if (monthIndex == 11) year += 1;
		monthIndex = (monthIndex + 1) % 12;
		let lastDay = new Date(year, monthIndex, 0);

		return lastDay.getDate();
	}
	function setMonthTable(year, monthIndex) {
		const MONTH_NAMES = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
		document.getElementById("calendar-title").innerText = `${ MONTH_NAMES[monthIndex] } ${ year }`;

		let firstDay = new Date(year, monthIndex, 1);
		let firstDayOfWeek = firstDay.getDay();
		for (let i = 0; i < 7; i++) {
			if (i < firstDayOfWeek) {
				calendarDays[i].classList.add("hidden");
			}
			else {
				calendarDays[i].classList.remove("hidden");
			}
		}

		let dayCount = getDaysInMonth(year, monthIndex);
		let calendarDayNumbers = document.getElementsByClassName("day-number");
		for (let i = 0; i < dayCount; i++) {
			calendarDayNumbers[i + firstDayOfWeek].innerText = (i + 1).toString();
		}

		// Hide excess days
		let lastDay = new Date(year, monthIndex, dayCount);
		let lastDayOfWeek = lastDay.getDay();
		let lastDayIndex = (dayCount - 1) + firstDayOfWeek;
		for (let i = calendarDays.length - 1; i > 28; i--) {
			if (i > lastDayIndex) {
				calendarDays[i].classList.add("hidden");
			}
			else {
				calendarDays[i].classList.remove("hidden");
			}
		}

		// Toggle last week
		if (lastDayIndex < 35) {
			calendarWeeks[calendarWeeks.length - 1].classList.add("hidden");
		}
		else {
			calendarWeeks[calendarWeeks.length - 1].classList.remove("hidden");
		}

		// Add events to the calendar
		let firstDayEventIndex = getFirstDayEventIndex(year, monthIndex);
		let dayEvents = document.getElementsByClassName("day-event");
		let eventIndex = firstDayEventIndex;
		// let eventIndex = 0;
		for (let i = 0; i < dayCount; i++) {
			var currentEvent = MH1_EVENTS[MH1_EVENTS_ROTATION[eventIndex]]
			calendarDays[firstDayOfWeek + i].className = currentEvent.category;
			dayEvents[firstDayOfWeek + i].innerText = currentEvent.title;
			eventIndex = (eventIndex + 1) % MH1_EVENTS_ROTATION.length;
		}

		let firstDayShopIndex = getFirstDayShopIndex(year, monthIndex);
		let daySpecials = document.getElementsByClassName("day-special");
		let shopIndex = firstDayShopIndex;
		// let shopIndex = 0;
		for (let i = 0; i < dayCount; i++) {
			var currentSpecial = SHOP_SPECIALS[SHOP_SPECIAL_ROTATION[shopIndex]];
			if (SHOP_SPECIAL_ROTATION[shopIndex] == 0) {
				daySpecials[firstDayOfWeek + i].style.display = "none";
			}
			else {
				daySpecials[firstDayOfWeek + i].style.display = "";
				daySpecials[firstDayOfWeek + i].innerText = currentSpecial.title;
			}

			shopIndex = (shopIndex + 1) % SHOP_SPECIAL_ROTATION.length;
		}
	}

	function setCurrentEvent() {
		let now = new Date();
		let firstDayEventIndex = getFirstDayEventIndex(now.getFullYear(), now.getMonth());

		// Use the previous event if it isn't time for the change yet
		let changeDatetime = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 22, 30, 0);
		if (Date.parse(now) < changeDatetime) {
			if (firstDayEventIndex == 0) {
				firstDayEventIndex = MH1_EVENTS_ROTATION.length - 1;
			}
			else {
				firstDayEventIndex -= 1;
			}
		}

		let eventIndex = (firstDayEventIndex + (now.getDate() - 1)) % MH1_EVENTS_ROTATION.length;
		let currentEvent = MH1_EVENTS[MH1_EVENTS_ROTATION[eventIndex]];

		var eventContent = document.getElementById("current-event-content");
		eventContent.classList.remove("gather", "hunt", "capture", "special");
		eventContent.classList.add(currentEvent.category);

		document.getElementById("current-event").className = currentEvent.category;
		document.getElementById("current-event-title").innerText = currentEvent.title;
		document.getElementById("current-event-description").innerText = currentEvent.description;
	}
	function setCurrentShopSpecial() {
		let now = new Date();
		let firstDayShopIndex = getFirstDayShopIndex(now.getFullYear(), now.getMonth());

		// Use the previous special if it isn't time for the change yet
		let changeDatetime = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 22, 30, 0);
		if (Date.parse(now) < changeDatetime) {
			if (firstDayShopIndex == 0) {
				firstDayShopIndex = SHOP_SPECIAL_ROTATION.length - 1;
			}
			else {
				firstDayShopIndex -= 1;
			}
		}

		let shopIndex = (firstDayShopIndex + (now.getDate() - 1)) % SHOP_SPECIAL_ROTATION.length;
		let currentSpecial = SHOP_SPECIALS[SHOP_SPECIAL_ROTATION[shopIndex]];

		document.getElementById("current-special-title").innerText = currentSpecial.title;
		document.getElementById("current-special-description").innerHTML = currentSpecial.description;
	}

	var now = new Date();
	setMonthTable(now.getFullYear(), now.getMonth());
	setCurrentEvent();
	setCurrentShopSpecial();

	document.getElementById("previous-month").addEventListener("click", () => {
		let previousMonth = now.getMonth() - 1;
		if (previousMonth < 0) previousMonth = 11;
		// Update "now" to previous month for further month changes
		now = new Date(now.getFullYear(), previousMonth, 1);

		setMonthTable(now.getFullYear(), now.getMonth());
	});
	document.getElementById("next-month").addEventListener("click", () => {
		let nextMonth = (now.getMonth() + 1) % 12;
		// Update "now" to next month for further month changes
		now = new Date(now.getFullYear(), nextMonth, 1);

		setMonthTable(now.getFullYear(), now.getMonth());
	});
});
