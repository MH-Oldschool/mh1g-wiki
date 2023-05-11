ready(() => {
	const SERVER_TZ = "Europe/Berlin";
	const START_HOUR = 24; // Midnight, I hope
	const MONTH_NAMES = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];

	// This gives us the local time when the rotation starts
	const SHOP_ROTATION_START = moment.tz({
		year: 2023,
		month: 4,
		date: 11,
		hour: 0
	}, SERVER_TZ);
	const SHOP_SPECIALS = [
		{
			title: "No shop specials currently active",
			description: ""
		},
		{
			title: "Claw Day", // Wyvern Claws, Fangs, Monster Fluid, Rathalos/ian Scales
			description: "The Materials Vendor offers: Ivy, Godbugs, Nitroshrooms, Toadstools, Blue Mushrooms, Sm Bone Husks, Cactus Flowers, Power Seeds, Armor Seeds, Paintberries, Sm Monster Bones, Wyvern Fangs, Wyvern Claws, Monster Fluid, Rathian Scales, and Rathalos Scales."
		},
		{
			title: "Half-Off Sale", // All market stalls half price
			description: "All market vendors sell at half the normal prices."
		},
		{
			title: "Tool Day", // Mega tools, Gunpowder
			description: "The Tool Vendor offers: Mega Bugnets, Mega Pickaxes, Fireflies, and Gunpowder."
		},
		{
			title: "Fish & Food Day", // Food and Fish shops?
			description: "The Food Vendor offers: Sleepyfish, Honey, Burst Arowana, Bomb Arowana, and Scatterfish."
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
	// Day 11=1	[Repeat, starting with Day 1]
	var SHOP_SPECIAL_ROTATION = new Uint8Array([1,0,2,0,3,0,2,0,4,0]);

	const MH1_EVENTS = [
		{
			title: "Forest Gathering",
			category: "gather",
			location: "Forest and Hills",
			client: "Hunter's Guild Material Collection",
			description: "Quest I think as much as you can, if you collect field material, you can clear the quest by delivering Map in the box."
		},
		{
			title: "Jungle Gathering",
			category: "gather",
			location: "Jungle",
			client: "Hunter's Guild Material Collection",
			description: "Quest I think as much as you can, if you collect field material, you can clear the quest by delivering Map in the box."
		},
		{
			title: "Swamp Gathering",
			category: "gather",
			location: "Swamp",
			client: "Hunter's Guild Material Collection",
			description: "Quest I think as much as you can, if you collect field material, you can clear the quest by delivering Map in the box."
		},
		{
			title: "Desert Gathering",
			category: "gather",
			location: "Desert",
			client: "Hunter's Guild Material Collection",
			description: "Quest I think as much as you can, if you collect field material, you can clear the quest by delivering Map in the box."
		},
		{
			title: "Volcano Gathering",
			category: "gather",
			location: "Volcano",
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
			client: "Town Guardsman",
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
		},
		{
			title: "Gravios Hunting!",
			category: "hunt",
			location: "Volcano",
			target: "Gravios",
			client:"Requestor: Guild Boss",
			description:"The battle royale is about to begin! Can you hunt down a Gravios and make it back alive? Slip up once and it's QUEST OVER!"
		},
		{
			title: "Rulers of Heaven and Earth",
			category: "hunt",
			location: "Forest and Hills",
			target: "Rathian and Rathalos",
			client:"Requestor: Brave Prince",
			description:"A Rathalos and Rathian have paired up and are ravaging my country! My father won't let me go, so please kill them for me!"
		},
		{
			title: "Expeditious Assault!",
			category: "hunt",
			location: "Forest and Hills",
			target: "Gypceros",
			client:"Requestor: Guild Boss",
			description:"Prove your strength, skills and teamwork as a hunter! The time limit is just 5 minutes, and you only have one chance. Don't blow it!"
		}
	];
	// Day 1 Lao
	// Day 2 Gather FnH
	// Day 3 Kirin
	// Day 4 Gather Jungle
	// Day 5 YKK Capture
	// Day 6 Gather Swamp
	// Day 7 Khezu Capture
	// Day 8 Gather Desert
	// Day 9 GMR Chrome Heart (actually King Meat quest)
	// Day 10 Gather Volcano
	// Day 11 Gravios Hunting
	// Day 12 Gather Forest
	// Day 13 Rulers of Heaven and Earth
	// Day 14 Gather Jungle
	// Day 15 Gary Expeditious Assault Paw Tix
	var MH1_EVENTS_ROTATION = new Uint8Array([
		5,0,6,1,7,2,8,3,9,4,10,0,11,1,12
	]);

	const MHG_EVENTS = [
		{
			title: "The Legendary Kirin",
			category: "special",
			location: "Swamp",
			target: "Kirin",
			client: "??",
			description: "??"
		},
		{
			title: "On the Trail of the Beast!",
			category: "special",
			location: "Swamp",
			target: "Kirin",
			client: "??",
			description: "??"
		},
		{
			title: "Thunder and Lighting",
			category: "special",
			location: "The Battleground",
			target: "Two Kirin",
			client: "??",
			description: "??"
		},
		{
			title: "The Advent of Calamity",
			category: "special",
			location: "The Battleground",
			target: "Crimson Fatalis",
			client: "??",
			description: "??"
		},
		{
			title: "The Wrath of Calamity",
			category: "special",
			location: "The Battleground",
			target: "Crimson Fatalis",
			client: "??",
			description: "??"
		},
		{
			title: "Stop the Giant Dragon!",
			category: "hunt",
			location: "The Fort",
			target: "Lao-Shan Lung",
			client: "??",
			description: "??"
		},
		{
			title: "Rocky Mountain Dragon",
			category: "hunt",
			location: "The Fort",
			target: "Ashen Lao-Shan Lung",
			client: "??",
			description: "??"
		}
	];
	/*
	none
	none
	none
	none
	none
	Kirin Low
	Kirin Low, Kirin High
	Kirin Low, Kirin High
	none
	none
	none
	none
	Crimson Fatalis
	Crimson Fatalis Hard
	Crimson Fatalis Hard
	none
	none
	none
	none
	Lao
	Lao, Ashen Lao
	Lao, Ashen Lao
	none
	none
	none
	none
	Lao, Kirin Low, Double Kirin
	Crimson Fatalis, Kirin High, Kirin Low
	Crimson Fatalis, Ashen Lao, Lao
	none
	none
	*/
	var MHG_EVENTS_ROTATION = [
		0,
		0,
		0,
		0,
		0,
		[0],
		[0,1],
		[0,1],
		0,
		0,
		0,
		0,
		[3],
		[4],
		[4],
		0,
		0,
		0,
		0,
		[5],
		[5,6],
		[5,6],
		0,
		0,
		0,
		0,
		[5,0,2],
		[3,1,0],
		[3,6,5],
		0,
		0
	];

	function isMondayStart() {
		return document.body.classList.contains("monday-start");
	}
	function getIntDay(myDate) {
		var myDay = myDate.day();

		if (isMondayStart()) {
			if (myDay == 0) {
				return 6;
			}

			return myDay - 1;
		}

		return myDay;
	}

	const MILLISECONDS_PER_DAY = 86400000;
	function populateStartTime() {
		var now = moment.tz(SERVER_TZ);
		var startTime = moment.tz({
			year: now.year(),
			month: now.month(),
			day: now.date(),
			hour: START_HOUR
		}, SERVER_TZ);

		document.getElementById("event-time-gmt").innerText = startTime.tz("Etc/GMT").format("h");
		document.getElementById("event-special-time").innerText = startTime.tz(moment.tz.guess()).format("h:mm:ss A");
	}
	populateStartTime();

	// Get the event index based on the current time
	function getFirstDayEventIndex(year, monthIndex, version) {
		var firstDayEventEnd = moment.tz({ year: year, month: monthIndex, date: 1, hour: START_HOUR }, SERVER_TZ);
		var now = moment.tz(SERVER_TZ);
		var nowOnFirstDay = moment.tz({ year: year, month: monthIndex, date: 1, hour: now.hour() }, SERVER_TZ);

		if (nowOnFirstDay.isAfter(firstDayEventEnd)) {
			return 1;
		}

		return 0;
	}
	// Figure out when the most recent shop special cycle started at or before this month
	function getFirstDayShopIndex(year, monthIndex) {
		var ROTATION_LENGTH = SHOP_SPECIAL_ROTATION.length;
		var now = moment();
		var firstOfMonth = moment.tz({
			year: year,
			month: monthIndex,
			date: 1,
			hour: now.hour()
		}, SERVER_TZ);

		// For people in a timezone other than the server's, we may need to push the firstOfMonth date.
		// If the server's current hour puts it one date behind the user, we need to push the firstOfMonth one day backward to compensate.
		// If server's current hour puts it one date ahead of the user, we need to push the firstOfMonth one day forward to compensate.
		// (if the difference 28 through 31 that indicates the month changed as well)
		var nowServer = moment.tz(SERVER_TZ);
		var serverIsAhead = nowServer.date() - now.date();
		if (serverIsAhead == -1) {
			firstOfMonth.subtract(1, "days");
		}
		else if (serverIsAhead != 0) {
			firstOfMonth.add(1, "days");
		}

		// Find the most recent start of the rotation
		var difference = 0;
		var lastIndex = ROTATION_LENGTH - 1;
		if (firstOfMonth.isBefore(SHOP_ROTATION_START)) {
			difference = SHOP_ROTATION_START.diff(firstOfMonth, "days") % ROTATION_LENGTH;
			return lastIndex - difference;
		}
		else {
			difference = firstOfMonth.diff(SHOP_ROTATION_START, "days") % ROTATION_LENGTH;
			return difference;
		}
	}

	var calendarDays = document.getElementById("calendar-tbody").getElementsByTagName("td");
	var calendarWeeks = document.getElementsByClassName("calendar-week");
	function getDaysInMonth(year, monthIndex) {
		var thisMonth = moment.tz({ year: year, month: monthIndex }, SERVER_TZ);

		return thisMonth.daysInMonth();
	}

	function get1Event(givenDate) {
		var firstDayEventIndex = getFirstDayEventIndex(givenDate.year(), givenDate.month(), "1");
		var eventIndex1 = (firstDayEventIndex + (givenDate.date() - 1)) % MH1_EVENTS_ROTATION.length;

		return MH1_EVENTS[MH1_EVENTS_ROTATION[eventIndex1]];
	}
	function getGEvents(givenDate) {
		var firstDayEventIndex = getFirstDayEventIndex(givenDate.year(), givenDate.month(), "g");
		var eventIndexG = (firstDayEventIndex + (givenDate.date() - 1)) % MHG_EVENTS_ROTATION.length;
		var currentEventsIndices = MHG_EVENTS_ROTATION[eventIndexG];

		if (currentEventsIndices) {
			return currentEventsIndices.map((eventIndex) => {
				return MHG_EVENTS[eventIndex];
			});
		}

		return false;
	}

	function setMonthTable(year, monthIndex) {
		document.getElementById("calendar-title").innerText = `${ MONTH_NAMES[monthIndex] } ${ year }`;

		var firstDay = moment({ year: year, month: monthIndex, date: 1 });
		var firstDayOfWeek = getIntDay(firstDay);

		for (let i = 0; i < 7; i++) {
			if (i < firstDayOfWeek) {
				calendarDays[i].classList.add("hidden");
			}
			else {
				calendarDays[i].classList.remove("hidden");
			}
		}

		var dayCount = firstDay.daysInMonth();
		let calendarDayNumbers = document.getElementsByClassName("day-number");
		for (let i = 0; i < dayCount; i++) {
			calendarDayNumbers[i + firstDayOfWeek].innerText = (i + 1).toString();
			calendarDays[i + firstDayOfWeek].dataset.day = i + 1;
		}

		// Hide excess days
		var lastDay = moment({ year: year, month: monthIndex, date: dayCount });
		var lastDayOfWeek = getIntDay(lastDay);
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

		var now = moment();
		var pastEventDeadline = moment.tz({ year: now.year(), month: now.month(), date: now.date(), hour: START_HOUR }, SERVER_TZ).isBefore(now);

		// Add events to the calendar
		var dayEvents1 = document.getElementsByClassName("day-event-mh1");
		var dayEventsG = document.getElementsByClassName("day-event-mhg");
		var eventIndex1 = getFirstDayEventIndex(year, monthIndex, "1");
		var eventIndexG = getFirstDayEventIndex(year, monthIndex, "g");
		for (var i = 0; i < dayCount; i++) {
			var currentEvent1 = MH1_EVENTS[MH1_EVENTS_ROTATION[eventIndex1]];

			dayEvents1[firstDayOfWeek + i].classList.remove("gather-quest", "hunt-quest", "capture-quest", "special-quest");
			dayEvents1[firstDayOfWeek + i].classList.add(currentEvent1.category + "-quest");
			dayEvents1[firstDayOfWeek + i].innerText = currentEvent1.title;
			dayEvents1[firstDayOfWeek + i].title = currentEvent1.description;

			eventIndex1 = (eventIndex1 + 1) % MH1_EVENTS_ROTATION.length;

			var currentEventGIndices = MHG_EVENTS_ROTATION[eventIndexG];

			dayEventsG[firstDayOfWeek + i].classList.remove("gather-quest", "hunt-quest", "capture-quest", "special-quest");
			if (currentEventGIndices) {
				dayEventsG[firstDayOfWeek + i].classList.add(MHG_EVENTS[currentEventGIndices[0]].category + "-quest")

				var dayTitlesG = [];
				currentEventGIndices.forEach((index) => {
					dayTitlesG.push(MHG_EVENTS[index].title);
				});
				if (dayTitlesG.length > 1) {
					dayTitlesG[dayTitlesG.length - 1] = "and " + dayTitlesG[dayTitlesG.length - 1];
				}

				dayEventsG[firstDayOfWeek + i].innerText = dayTitlesG[0] + (dayTitlesG.length > 1 ? `${dayTitlesG.length > 2 ? "," : ""} ${dayTitlesG[1].substr(0, 3)}...` : "");
				dayEventsG[firstDayOfWeek + i].title = dayTitlesG.join(", ");
			}
			else {
				dayEventsG[firstDayOfWeek + i].innerText = "no events";
				dayEventsG[firstDayOfWeek + i].title = "no events";
			}
			eventIndexG = (eventIndexG + 1) % MHG_EVENTS_ROTATION.length;
		}

		var firstDayShopIndex = getFirstDayShopIndex(year, monthIndex);
		var daySpecials = document.getElementsByClassName("day-special");
		var shopIndex = firstDayShopIndex;
		for (let i = 0; i < dayCount; i++) {
			let currentSpecial = SHOP_SPECIALS[SHOP_SPECIAL_ROTATION[shopIndex]];
			if (SHOP_SPECIAL_ROTATION[shopIndex] == 0) {
				daySpecials[firstDayOfWeek + i].style.display = "none";
			}
			else {
				daySpecials[firstDayOfWeek + i].style.display = "";
				daySpecials[firstDayOfWeek + i].innerText = currentSpecial.title;
				daySpecials[firstDayOfWeek + i].title = currentSpecial.description;
			}

			shopIndex = (shopIndex + 1) % SHOP_SPECIAL_ROTATION.length;
		}

		// Highlight current day
		var today = moment();
		if (year == today.year() && monthIndex == today.month()) {
			calendarDays[firstDayOfWeek + today.date() - 1].classList.add("today");
		}
	}

	var currentEventsSliderContainer = document.getElementById("current-events-container");

	function setCurrentEvent() {
		const currentEventElement = document.getElementById("current-event");

		var now = moment();
		var currentEvent = get1Event(now);

		var eventContent = document.getElementById("current-event-content");
		eventContent.classList.remove("gather-quest", "hunt-quest", "capture-quest", "special-quest");
		eventContent.classList.add(currentEvent.category + "-quest");

		document.getElementById("current-event-title").innerText = currentEvent.title;
		document.getElementById("current-event-location").innerText = currentEvent.location;
		document.getElementById("current-target-container").style.display = currentEvent.category == "gather" ? "none" : "";
		document.getElementById("current-target").innerText = currentEvent.target;
		document.getElementById("current-event-client").innerText = currentEvent.client;
		document.getElementById("current-event-description").innerText = currentEvent.description;

		// MHG events
		var currentGEvents = getGEvents(now);
		if (currentGEvents) {
			const currentEventGContents = document.getElementsByClassName("current-content-g");
			const currentEventGTitles = document.getElementsByClassName("current-event-title-g");
			const currentEventGLocations = document.getElementsByClassName("current-event-location-g");
			const currentEventGTargetContainers = document.getElementsByClassName("current-target-container-g");
			const currentEventGTargets = document.getElementsByClassName("current-target-g");
			const currentEventGClients = document.getElementsByClassName("current-event-client-g");
			const currentEventGDescriptions = document.getElementsByClassName("current-event-description-g");

			currentEventElement.parentElement.classList.remove("current-events-g-none");
			for (var i = 0; i < currentGEvents.length; i++) {
				currentEventGContents[i].classList.remove("gather-quest", "hunt-quest", "capture-quest", "special-quest");
				currentEventGContents[i].classList.add(currentGEvents[i].category + "-quest");

				currentEventGTitles[i].innerText = currentGEvents[i].title;
				currentEventGLocations[i].innerText = currentGEvents[i].location;
				currentEventGTargetContainers[i].style.display = currentGEvents[i].category == "gather" ? "none" : "";
				currentEventGTargets[i].innerText = currentGEvents[i].target;

				currentEventGClients[i].innerText = currentGEvents[i].client;
				currentEventGDescriptions[i].innerText = currentGEvents[i].description;
			}

			currentEventsSliderContainer.dataset.maxEvents = currentGEvents.length;
		}
		else {
			currentEventElement.parentElement.classList.add("current-events-g-none");
			currentEventsSliderContainer.dataset.maxEvents = 0;
		}
	}
	function getCurrentShopSpecial() {
		var now = moment.tz(SERVER_TZ);
		var hoursSinceShopSwitched = now.diff(moment.tz({ year: now.year(), month: now.month(), date: 1, hour: now.hour() }, SERVER_TZ), "hours");
		var shopIndex = Math.floor(hoursSinceShopSwitched / 24) % SHOP_SPECIAL_ROTATION.length;

		return SHOP_SPECIALS[SHOP_SPECIAL_ROTATION[shopIndex]];
	}
	function setCurrentShopSpecial() {
		var currentSpecial = getCurrentShopSpecial();

		document.getElementById("current-special-title").innerText = currentSpecial.title;
		document.getElementById("current-special-description").innerHTML = currentSpecial.description;
	}

	function initCalendar() {
		var now = moment();
		setMonthTable(now.year(), now.month());
		setCurrentEvent();
		setCurrentShopSpecial();
	}

	var calendarDate = moment();
	document.getElementById("previous-month").addEventListener("click", () => {
		calendarDate.subtract(1, "month");

		setMonthTable(calendarDate.year(), calendarDate.month());
	});
	document.getElementById("next-month").addEventListener("click", () => {
		calendarDate.add(1, "month");

		setMonthTable(calendarDate.year(), calendarDate.month());
	});

	var weekStartToggle = document.getElementById("week-start-toggle");
	function setWeekStart(weekStart, setCheckbox) {
		if (weekStart == "s") {
			document.body.classList.remove("monday-start");
			document.body.classList.add("sunday-start");
		}
		else {
			document.body.classList.add("monday-start");
			document.body.classList.remove("sunday-start");
		}

		if (setCheckbox) {
			weekStartToggle.checked = weekStart == "m";
		}

		window.localStorage.setItem("weekStart", weekStart);
	}
	weekStartToggle.addEventListener("change", (event) => {
		setWeekStart(isMondayStart() ? "s" : "m");
		initCalendar();
	});

	if (window.localStorage.getItem("weekStart") == "m") {
		setWeekStart("m", true);
	}

	initCalendar();

	// Dialog stuff
	var dialogSlideIndex = 0;
	var dialogPageNumber = document.getElementById("page-number");
	var dialogPageTotal = document.getElementById("page-total");
	var eventsDialog = document.getElementById("events-dialog");
	function toggleEventsDialog(toggleOn) {
		if (toggleOn) {
			eventsDialog.showModal();
		}
		else {
			eventsDialog.close();
		}

		toggleDialogBackdrop(toggleOn);
	}
	function activateEventsDialog(givenDate) {
		const dialogDate = document.getElementById("dialog-date");
		dialogDate.innerText = `${MONTH_NAMES[givenDate.month()]} ${givenDate.date()}`

		if (getMHVersion() == 1) {
			var event1 = get1Event(givenDate);
			if (event1) {
				eventsDialog.classList.remove("no-events");

				const eventContent = document.getElementById("dialog-event-content");
				const title = document.getElementById("dialog-event-title-1");
				const location = document.getElementById("dialog-event-location-1");
				const targetContainer = document.getElementById("dialog-event-target-container-1");
				const target = document.getElementById("dialog-event-target-1");
				const client = document.getElementById("dialog-event-client-1");
				const description = document.getElementById("dialog-event-description-1");

				var hasTarget = event1.category != "gather";

				eventContent.classList.remove("gather-quest", "hunt-quest", "capture-quest", "special-quest");
				eventContent.classList.add(event1.category + "-quest");

				title.innerText = event1.title;
				location.innerText = event1.location;
				targetContainer.style.display = hasTarget ? "" : "none";
				if (hasTarget) {
					target.innerText = event1.target;
				}
				client.innerText = event1.client;
				description.innerText = event1.description;
			}
			else {
				eventsDialog.classList.add("no-events");
			}
		}
		else {
			var eventsG = getGEvents(givenDate);
			if (eventsG) {
				eventsDialog.classList.remove("no-events");

				const slides = document.getElementsByClassName("dialog-event-slide");
				const titles = document.getElementsByClassName("dialog-event-title-g");
				const locations = document.getElementsByClassName("dialog-event-location-g");
				const targetContainers = document.getElementsByClassName("dialog-event-target-container-g");
				const targets = document.getElementsByClassName("dialog-event-target-g");
				const clients = document.getElementsByClassName("dialog-event-client-g");
				const descriptions = document.getElementsByClassName("dialog-event-description-g");

				for (var i = 0; i < eventsG.length; i++) {
					var hasTarget = eventsG[i].category != "gather";

					slides[i].classList.remove("gather-quest", "hunt-quest", "capture-quest", "special-quest");
					slides[i].classList.add(eventsG[i].category + "-quest");

					titles[i].innerText = eventsG[i].title;
					locations[i].innerText = eventsG[i].location;
					targetContainers[i].style.display = hasTarget ? "" : "none";
					if (hasTarget) {
						targets[i].innerText = eventsG[i].target;
					}
					clients[i].innerText = eventsG[i].client;
					descriptions[i].innerText = eventsG[i].description;
				}

				dialogPageNumber.innerText = "1";
				dialogPageTotal.innerText = eventsG.length;
				resetDialogSlider();
			}
			else {
				eventsDialog.classList.add("no-events");
			}
		}

		toggleEventsDialog(true);
	}
	function handleCalendarDayClick(event) {
		var givenDate = moment({ year: calendarDate.year(), month: calendarDate.month(), day: this.dataset.day });
		activateEventsDialog(givenDate);
	}
	document.body.addEventListener("click", (event) => {
		if (event.target.id == eventsDialog.id) {
			toggleEventsDialog(false);
		}
	});
	document.getElementById("close-events-dialog").addEventListener("click", () => {
		toggleEventsDialog(false);
	});

	var dialogSliderRow = document.getElementById("dialog-slider-row");
	function resetDialogSlider() {
		dialogSlideIndex = 0;
		dialogSliderRow.style.left = "0%";
	}
	function slideDialogEvents(direction) {
		var newIndex = dialogSlideIndex + direction;
		if (0 <= newIndex && newIndex < dialogPageTotal.innerText) {
			dialogSlideIndex = newIndex;
			dialogSliderRow.style.left = `-${dialogSlideIndex}00%`;
			dialogPageNumber.innerText = dialogSlideIndex + 1;
		}
	}
	for (var i = 0; i < calendarDays.length; i++) {
		calendarDays[i].addEventListener("click", handleCalendarDayClick);
	}
	document.getElementById("dialog-button-previous").addEventListener("click", (event) => {
		slideDialogEvents(-1);
	});
	document.getElementById("dialog-button-next").addEventListener("click", (event) => {
		slideDialogEvents(1);
	});

	var mhgEventIndex = 0;
	function slideEvents(direction) {
		var nextIndex = mhgEventIndex + direction;
		if (0 <= nextIndex && nextIndex < currentEventsSliderContainer.dataset.maxEvents) {
			mhgEventIndex = nextIndex;
			currentEventsSliderContainer.style.left = `-${mhgEventIndex}00%`;
		}
	}
	document.getElementById("slider-button-previous").addEventListener("click", () => {
		slideEvents(-1);
	});
	document.getElementById("slider-button-next").addEventListener("click", () => {
		slideEvents(1);
	});

	var lastTimestamp = 0;
	var now = moment();
	var DEADLINE = moment.tz({ year: now.year(), month: now.month(), day: now.date(), hour: START_HOUR }, SERVER_TZ);
	function getTimeToNextEvent() {
		var now = moment();
		// Move deadline ahead a day if it's already passed
		if (DEADLINE.isBefore(now)) {
			DEADLINE.add(1, "day");
		}

		return moment.duration(DEADLINE.diff(now));
	}

	function updateCountdown() {
		var remainingTime = getTimeToNextEvent();

		var hours = document.getElementById("countdown-hours");
		var minutes = document.getElementById("countdown-minutes");

		hours.innerText = remainingTime.hours();
		minutes.innerText = remainingTime.minutes().toString().padStart(2, "0");

		// Schedule the next update to happen on the next minute
		setTimeout(updateCountdown, 1000 - moment().milliseconds());
	}
	updateCountdown();
});
