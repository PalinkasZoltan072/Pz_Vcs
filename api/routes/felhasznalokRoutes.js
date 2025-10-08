const express = require("express");
const router = express.Router();
const felhasznalokController = require("../controllers/felhasznalokController");


router.get("/", felhasznalokController.getFelhasznalok);


router.get("/:username", felhasznalokController.getFelhasznaloByUsername);


router.post("/regisztral", felhasznalokController.regisztral);

router.post("/login", felhasznalokController.login);

module.exports = router;