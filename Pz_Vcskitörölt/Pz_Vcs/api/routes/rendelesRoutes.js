const express = require("express");
const router = express.Router();
const rendelesFilter = require("../middlewares/rendelesFilter");
const rendelesController = require("../controllers/rendelesController");

router.get("/", rendelesFilter, rendelesController.getRendelesek);
router.get("/:id", rendelesController.getRendeles);
router.post("/", rendelesController.createRendeles);
router.patch("/:id", rendelesController.updateRendeles);
router.delete("/:id", rendelesController.deleteRendeles);

module.exports = router;
