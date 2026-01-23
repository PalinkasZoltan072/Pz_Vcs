require("dotenv").config();
require("./db")
const express = require("express");
const cors = require("cors");

const felhasznaloRoutes = require("./routes/felhasznaloRoutes");
const cipoRoutes = require("./routes/cipoRoutes");
const rendelesRoutes = require("./routes/rendelesRoutes");
const adminRoutes = require("./routes/adminRoutes")


const { notFound, showError } = require("./middlewares/errorHandler"); // kettőt exportal a errorhandler így kettő kell

const app = express();


app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
    res.status(200).json({ message: "Cipőbolt API működik" });
});


app.use("/felhasznalok", felhasznaloRoutes);
app.use("/cipok", cipoRoutes);
app.use("/rendelesek", rendelesRoutes);
app.use("/adminok", adminRoutes )

// 404 middleware
app.use(notFound);

// hiba kezelő middleware
app.use(showError);

module.exports = app;
