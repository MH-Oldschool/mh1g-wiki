const fs = require("fs");
const path = require("path");
const mustache = require("mustache");

function addLastToArrays(obj) {
	if (typeof obj === "object") {
		for (prop in obj) {
			if (obj.hasOwnProperty(prop)) {
				if (Array.isArray(obj[prop]) && obj[prop].length !== 0) {
					obj[prop][obj[prop].length - 1].last = 1;
					obj[prop] = obj[prop].map((element) => {
						if (typeof element === "object") {
							return addLastToArrays(element);
						}
						return element;
					});
				}
			}
		}
	}

	return obj;
}

function readFiles(fileNames, files, callback) {
	if (!files) {
		files = [];
	}

	if (fileNames.length == 0) {
		callback(files);
		return;
	}

	return fs.readFile(fileNames[0], "utf8", (err, data) => {
		if (err) {
			console.error(err);
		}
		else {
			files.push(data.replace(/[\n\r]+/g, "").replace(/\t+/g, ""));
			readFiles(fileNames.slice(1, fileNames.length), files, callback);
		}
	});
}

function renderAndWriteToFile(pageName, template, view, partials) {
	var rendered = mustache.render(template, view, partials);

	fs.writeFile("public/" + pageName + ".html", rendered, {}, (err) => {
		if (err) {
			console.error(err);
		}
		else {
			console.log(pageName, "built successfully!");
		}
	});
}

function buildPage(pageName, partials) {
	var fileNames = [
		path.join(__dirname, "_partials/head.mustache"),
		path.join(__dirname, "_partials/foot.mustache"),
		path.join(__dirname, "_templates/" + pageName + ".mustache"),
		path.join(__dirname, "_views/" + pageName + ".json")
	];
	if (partials) {
		fileNames = fileNames.concat(partials.map((name) => path.join(__dirname, "_partials", name + ".mustache")));
	}

	readFiles(fileNames, null, (files) => {
		var partialFiles = {
			head: files[0],
			foot: files[1]
		}
		for (var i = 4; i < files.length; i++) {
			partialFiles[partials[i - 4]] = files[i];
		}

		try {
			var view = JSON.parse(files[3]);
			renderAndWriteToFile(pageName, files[2], view, partialFiles);
		}
		catch (err) {
			console.log("Unable to parse JSON:", err);
		}
	});
}

buildPage("index");
buildPage("weapons", ["bowgun_1","bowgun_g"]);
buildPage("armor", ["headgear_row","torso_row","arms_row","waist_row","legs_row","armor_data"]);
buildPage("bestiary");
buildPage("armor_skills");
buildPage("items");
buildPage("quests", ["quest"]);
