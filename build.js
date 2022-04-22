const fs = require("fs");
const path = require("path");
const mustache = require("mustache");

function buildPage(layoutName, pageName) {
	fs.readFile("_content/" + pageName + ".mustache", "utf8", (err, content) => {
		fs.readFile("_views/" + pageName + ".json", "utf8", (err, data) => {
			try {
				var view = JSON.parse(data);

				fs.readFile("_layouts/" + layoutName + ".mustache", "utf8", (err, template) => {
					var rendered = mustache.render(template, view, { content: content });

					fs.writeFile("public/" + pageName + ".html", rendered, {}, (err) => {
						if (err) {
							console.error(err);
						}
						else {
							console.log(pageName, "built successfully!");
						}
					});
				});
			}
			catch (error) {
				console.error("Unable to parse " + viewName + ".json", error);
			}
		});
	});
}

buildPage("main", "weapons");
buildPage("main", "index");
