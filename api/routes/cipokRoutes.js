const express = require("express");
const router = express.Router();
const cipokController = require("../controllers/cipokController");

router.get("/", cipokController.getCipok);
router.get("/:id", cipokController.getCipoById);

module.exports = router;