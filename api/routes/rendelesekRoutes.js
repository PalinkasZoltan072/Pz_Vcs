const express = require("express");
const router = express.Router();
const rendelesekController = require("../controllers/rendelesekController");

router.get("/", rendelesekController.getRendelesek);
router.get("/:id", rendelesekController.getRendelesById);

module.exports = router;