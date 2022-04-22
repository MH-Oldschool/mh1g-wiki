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

var server = app.listen(PORT);
console.log(`Listening on ${ PORT }`);
