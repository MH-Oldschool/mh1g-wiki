const PORT = process.env.PORT || 8000;
const path = require("path");
const express = require("express");
const app = express();

// Routing
app.use(express.static(path.join(__dirname, "public")));
// Use HTTP for larger payloads
app.get("/", (req, res) => {
	res.send(res.sendFile(path.join(__dirname, "public/index.html")));
});
app.get("/weapons", (req, res) => {
	res.sendFile(path.join(__dirname, "public/weapons.html"));
});
app.get("/armor", (req, res) => {
	res.sendFile(path.join(__dirname, "public/armor.html"));
});
app.get("/bestiary", (req, res) => {
	res.sendFile(path.join(__dirname, "public/bestiary.html"));
});
app.get("/armor-skills", (req, res) => {
	res.sendFile(path.join(__dirname, "public/armor_skills.html"));
});
app.get("/items", (req, res) => {
	res.sendFile(path.join(__dirname, "public/items.html"));
});
app.get("/quests", (req, res) => {
	res.sendFile(path.join(__dirname, "public/quests.html"));
});
app.get("/maps", (req, res) => {
	res.sendFile(path.join(__dirname, "public/maps.html"));
});

var server = app.listen(PORT);
console.log(`Listening on ${ PORT }`);
