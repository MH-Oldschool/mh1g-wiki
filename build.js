const fs = require("fs");
const path = require("path");
const mustache = require("mustache");

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
			files.push(data);
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

		renderAndWriteToFile(pageName, files[2], JSON.parse(files[3]), partialFiles);
	});
}

buildPage("index");
buildPage("weapons");
