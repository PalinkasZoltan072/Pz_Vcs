const express = require("express");
const app = express();
const path = require("path");

app.use(express.json());
app.use(express.static("public"));

app.use(express.static(path.join(__dirname, "../oldal")));

const cipokRoutes = require("./routes/cipokRoutes");
const felhasznalokRoutes = require("./routes/felhasznalokRoutes");
const rendelesekRoutes = require("./routes/rendelesekRoutes");
const kosarRoutes = require("./routes/kosarRoutes");

app.use("/kosar", kosarRoutes);
app.use("/cipok", cipokRoutes);
app.use("/felhasznalok", felhasznalokRoutes);
app.use("/rendelesek", rendelesekRoutes);

module.exports = app;