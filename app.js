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

app.get("/armor-data", (req, res) => {
	res.sendFile(path.join(__dirname, "_views/armor.json"));
});

var server = app.listen(PORT);
console.log(`Listening on ${ PORT }`);
