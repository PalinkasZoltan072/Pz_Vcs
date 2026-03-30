require("dotenv").config({
    path: process.env.NODE_ENV === "test" ? ".env.test" : ".env"
  }); // a teszt.envet nagyon nem akarta csak a .envet betölteni ezert kell így
require("./db")
const express = require("express");
const cors = require("cors");

const felhasznaloRoutes = require("./routes/felhasznaloRoutes");
const cipoRoutes = require("./routes/cipoRoutes");
const rendelesRoutes = require("./routes/rendelesRoutes");
const adminRoutes = require("./routes/adminRoutes")

const { swaggerUi, specs } = require("./config/swagger");
const { notFound, showError } = require("./middlewares/errorHandler"); 
const { attachTransaction } = require("./middlewares/transactionMiddleware");
const app = express();


app.use(cors());
app.use(express.json());



app.use(attachTransaction);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));


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
// console.log("APP EXPORT ELÉRT");
module.exports = app;
