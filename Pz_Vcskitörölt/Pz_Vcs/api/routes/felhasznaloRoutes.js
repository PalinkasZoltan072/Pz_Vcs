const express = require("express");
const router = express.Router();

const felhasznaloController = require("../controllers/felhasznaloController");

router.get("/", felhasznaloController.getFelhasznalok);
router.get("/:id", felhasznaloController.getFelhasznalo);
router.post("/", felhasznaloController.createFelhasznalo);


router.patch("/:id", felhasznaloController.updateFelhasznalo);

router.delete("/:id", felhasznaloController.deleteFelhasznalo);

module.exports = router;
