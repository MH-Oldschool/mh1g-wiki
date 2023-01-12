ready(() => {
	/*
		TODO: for now I have to change this when DST changes in Germany (server
			timezone), but there should be a way to use moment.js or another library
			to just get the time from a given timezone properly
	*/
	const START_HOUR = 23; // DST: 22; not-DST: 23

	// This gives us the local time when the rotation starts
	const SHOP_ROTATION_START = new Date(Date.UTC(2023, 0, 10, START_HOUR, 0, 0));
	const SHOP_SPECIALS = [
		{
			title: "No Shop Specials",
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
			details:"The battle royale is about to begin! Can you hunt down a Gravios and make it back alive? Slip up once and it's QUEST OVER!"
		},
		{
			title: "Rulers of Heaven and Earth",
			category: "hunt",
			location: "Forest and Hills",
			target: "Rathian and Rathalos",
			client:"Requestor: Brave Prince",
			details:"A Rathalos and Rathian have paired up and are ravaging my country! My father won't let me go, so please kill them for me!"
		},
		{
			title: "Expeditious Assault!",
			category: "hunt",
			location: "Forest and Hills",
			target: "Gypceros",
			client:"Requestor: Guild Boss",
			details:"Prove your strength, skills and teamwork as a hunter! The time limit is just 5 minutes, and you only have one chance. Don't blow it!"
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
		5,0,6,1,7,2,8,3,9,4//,10,0,11,1,12
	]);

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
	Lao, Kirin Low
	Crimson Fatalis, Kirin High, Kirin Low
	Crimson Fatalis, Ashen Lao, Lao
	none
	none
	*/
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
		[2],
		[2,3],
		[2,3],
		0,
		0,
		0,
		0,
		[4],
		[4,5],
		[4,5],
		0,
		0,
		0,
		0,
		[4,0],
		[2,1,0],
		[2,5,4],
		0,
		0
	];

	function isMondayStart() {
		return document.body.classList.contains("monday-start");
	}
	function getIntDay(myDate) {
		let myDay = myDate.getDay();

		if (isMondayStart()) {
			if (myDay == 0) {
				return 6;
			}

			return myDay - 1;
		}

		return myDay;
	}

	const MILLISECONDS_PER_DAY = 86400000;
	function dateToDays(date) {
		let timestamp = Date.parse(date);
		// divide by milliseconds in a day, and truncate
		return Math.floor(timestamp / MILLISECONDS_PER_DAY);
	}
	function populateStartTime() {
		document.getElementById("event-time-gmt").innerText = START_HOUR;

		var now = new Date;
		var startTime = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), START_HOUR, 0, 0));
		document.getElementById("event-special-time").innerText = startTime.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });
	}
	populateStartTime();

	// Get the event index based on the current time
	function getFirstDayEventIndex(year, monthIndex) {
		const MILLISECONDS_PER_DAY = 86400000;

		var eventRotationStart = Date.UTC(year, monthIndex, 0, START_HOUR, 0, 0);
		var now = new Date();
		var firstOfMonth = Date.parse(new Date(year, monthIndex, 1, now.getHours(), now.getMinutes(), 0));

		var daysSinceRotation = Math.floor((firstOfMonth - eventRotationStart) / MILLISECONDS_PER_DAY);
		if (daysSinceRotation < 0) {
			daysSinceRotation = MH1_EVENTS_ROTATION.length + daysSinceRotation;
		}

		return daysSinceRotation;
	}
	// Figure out when the most recent shop special cycle started at or before this month
	function getFirstDayShopIndex(year, monthIndex) {
		let ROTATION_LENGTH = SHOP_SPECIAL_ROTATION.length;
		let now = new Date();
		let firstOfMonth = Date.parse(new Date(year, monthIndex, 1, now.getHours(), now.getMinutes()));
		// Add one rotation's worth of days until firstOfMonth is greater than the start date
		while (firstOfMonth < SHOP_ROTATION_START) {
			firstOfMonth += ROTATION_LENGTH * MILLISECONDS_PER_DAY;
		}
		let daysSinceStart = (firstOfMonth - SHOP_ROTATION_START) / MILLISECONDS_PER_DAY;
		let cyclesSinceStart = daysSinceStart / ROTATION_LENGTH;
		// Use parseInt to truncate decimals
		let index = parseInt(ROTATION_LENGTH * (cyclesSinceStart - parseInt(cyclesSinceStart)));
		while (index < 0) index += ROTATION_LENGTH;

		return index;
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
		let firstDayOfWeek = getIntDay(firstDay)

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
		let lastDayOfWeek = getIntDay(lastDay);
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

		var now = new Date();
		var pastEventDeadline = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), START_HOUR) < Date.now();

		// Add events to the calendar
		let firstDayEventIndex = getFirstDayEventIndex(year, monthIndex);
		var dayEvents1 = document.getElementsByClassName("day-event-mh1");
		var dayEventsG = document.getElementsByClassName("day-event-mhg");
		var eventIndex1 = eventIndexG = firstDayEventIndex;
		for (var i = 0; i < dayCount; i++) {
			// If it's the last day of the month, and we're past the event deadline,
			// we should show the first event
			if (i == dayCount - 1 && pastEventDeadline) {
				eventIndex1 = 0;
				eventIndexG = 0;
			}

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

				dayEventsG[firstDayOfWeek + i].innerText = dayTitlesG[0] + (dayTitlesG.length > 1 ? ` (+${dayTitlesG.length - 1})` : "");
				dayEventsG[firstDayOfWeek + i].title = dayTitlesG.join(", ");
			}
			else {
				dayEventsG[firstDayOfWeek + i].innerText = "no events";
				dayEventsG[firstDayOfWeek + i].title = "no events";
			}
			eventIndexG = (eventIndexG + 1) % MHG_EVENTS_ROTATION.length;
		}

		let firstDayShopIndex = getFirstDayShopIndex(year, monthIndex);
		let daySpecials = document.getElementsByClassName("day-special");
		let shopIndex = firstDayShopIndex;
		for (let i = 0; i < dayCount; i++) {
			var currentSpecial = SHOP_SPECIALS[SHOP_SPECIAL_ROTATION[shopIndex]];
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
		var today = new Date();
		if (year == today.getFullYear() && monthIndex == today.getMonth()) {
			calendarDays[firstDayOfWeek + today.getDate() - 1].classList.add("today");
		}
	}

	var currentEventsSliderContainer = document.getElementById("current-events-container");

	function setCurrentEvent() {
		const currentEventElement = document.getElementById("current-event");

		let now = new Date();
		let firstDayEventIndex = getFirstDayEventIndex(now.getFullYear(), now.getMonth());

		let eventIndex = (firstDayEventIndex + (now.getDate() - 1)) % MH1_EVENTS_ROTATION.length;
		let currentEvent = MH1_EVENTS[MH1_EVENTS_ROTATION[eventIndex]];

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
		var eventIndexG = (firstDayEventIndex + (now.getDate() - 1)) % MHG_EVENTS_ROTATION.length;
		var currentEventsIndices = MHG_EVENTS_ROTATION[eventIndexG];
		if (currentEventsIndices) {
			const currentEventGContents = document.getElementsByClassName("current-content-g");
			const currentEventGTitles = document.getElementsByClassName("current-event-title-g");
			const currentEventGLocations = document.getElementsByClassName("current-event-location-g");
			const currentEventGTargetContainers = document.getElementsByClassName("current-target-container-g");
			const currentEventGTargets = document.getElementsByClassName("current-target-g");
			const currentEventGClients = document.getElementsByClassName("current-event-client-g");
			const currentEventGDescriptions = document.getElementsByClassName("current-event-description-g");

			currentEventElement.classList.remove("current-events-g-none");
			for (var i = 0; i < currentEventsIndices.length; i++) {
				currentEvent = MHG_EVENTS[currentEventsIndices[i]];

				currentEventGContents[i].classList.remove("gather-quest", "hunt-quest", "capture-quest", "special-quest");
				currentEventGContents[i].classList.add(currentEvent.category + "-quest");

				currentEventGTitles[i].innerText = currentEvent.title;
				currentEventGLocations[i].innerText = currentEvent.location;
				currentEventGTargetContainers[i].style.display = currentEvent.category == "gather" ? "none" : "";
				currentEventGTargets[i].innerText = currentEvent.target;

				currentEventGClients[i].innerText = currentEvent.client;
				currentEventGDescriptions[i].innerText = currentEvent.description;
			}

			currentEventsSliderContainer.dataset.maxEvents = currentEventsIndices.length;
		}
		else {
			currentEventElement.classList.add("current-events-g-none");
			currentEventsSliderContainer.dataset.maxEvents = 0;
		}
	}
	function setCurrentShopSpecial() {
		let now = new Date();
		let firstDayShopIndex = getFirstDayShopIndex(now.getFullYear(), now.getMonth());

		let shopIndex = (firstDayShopIndex + (now.getDate() - 1)) % SHOP_SPECIAL_ROTATION.length;
		let currentSpecial = SHOP_SPECIALS[SHOP_SPECIAL_ROTATION[shopIndex]];

		document.getElementById("current-special-title").innerText = currentSpecial.title;
		document.getElementById("current-special-description").innerHTML = currentSpecial.description;
	}

	function initCalendar() {
		var now = new Date();
		setMonthTable(now.getFullYear(), now.getMonth());
		setCurrentEvent();
		setCurrentShopSpecial();
	}

	var calendarDate = new Date();
	document.getElementById("previous-month").addEventListener("click", () => {
		calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1);

		setMonthTable(calendarDate.getFullYear(), calendarDate.getMonth());
	});
	document.getElementById("next-month").addEventListener("click", () => {
		calendarDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1);

		setMonthTable(calendarDate.getFullYear(), calendarDate.getMonth());
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
	function getTimeToNextEvent() {
		var now = new Date();
		var milliseconds = Date.now();
		var DEADLINE = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), START_HOUR);
		// Move deadline ahead a day if it's already passed
		if (DEADLINE < milliseconds) {
			DEADLINE = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() + 1, START_HOUR);
		}

		return DEADLINE - milliseconds;
	}
	var remainingTime = getTimeToNextEvent();

	function updateCountdown(time) {
		const MS_PER_MINUTE = 60000;

		var hours = document.getElementById("countdown-hours");
		var minutes = document.getElementById("countdown-minutes");

		var minutesLeft = time / MS_PER_MINUTE;
		var hoursLeft = Math.floor(Math.ceil(minutesLeft) / 60);
		if (minutesLeft % 60 == 0) {
			hoursLeft += 1;
		}

		hours.innerText = hoursLeft.toString().padStart(2, "0");
		minutes.innerText = ((Math.ceil(minutesLeft) % 60)).toString().padStart(2, "0");
	}
	var delta = 0;
	function frameStep(timestamp) {
		const MIN_STEP = 60000;

		if (timestamp !== 0) {
			delta += timestamp - lastTimestamp;

			if (delta > MIN_STEP) {
				remainingTime -= delta;

				if (remainingTime <= 0) {
					remainingTime = getTimeToNextEvent();
					initCalendar();
				}

				updateCountdown(remainingTime);
				delta -= MIN_STEP;
			}
		}

		lastTimestamp = timestamp;
		window.requestAnimationFrame(frameStep);
	}
	function initCountdown() {
		window.requestAnimationFrame(frameStep);
		updateCountdown(remainingTime);
	}
	initCountdown();
});
