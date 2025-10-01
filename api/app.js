const express = require("express");
const app = express();

app.use(express.json());

// Route-ok importálása
const cipokRoutes = require("./routes/cipokRoutes");
const felhasznalokRoutes = require("./routes/felhasznalokRoutes");
const rendelesekRoutes = require("./routes/rendelesekRoutes");

// Route-ok használata
app.use("/api/cipok", cipokRoutes);
app.use("/api/felhasznalok", felhasznalokRoutes);
app.use("/api/rendelesek", rendelesekRoutes);

module.exports = app;