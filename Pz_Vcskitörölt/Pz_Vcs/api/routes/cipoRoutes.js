const express = require("express");
const router = express.Router();

const cipoController = require("../controllers/cipoController");
const cipoFilter = require("../middlewares/cipoFilter");

router.get("/", cipoFilter,  cipoController.getCipok);
router.get("/:id", cipoController.getCipo);
router.post("/", cipoController.createCipo);
router.patch("/:id", cipoController.updateCipo);
router.delete("/:id", cipoController.deleteCipo);

module.exports = router;
