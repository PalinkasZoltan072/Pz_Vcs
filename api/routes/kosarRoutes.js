const express = require("express");
const router = express.Router();
const kosarController = require("../controllers/kosarController");


router.get("/:username", kosarController.getKosarByFelhasznalo);


router.post("/add", kosarController.addToKosar);


router.delete("/remove/:id", kosarController.removeFromKosar);


router.delete("/clear/:username", kosarController.clearKosar);

module.exports = router;