const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");

router.get("/", adminController.getAdminok);
router.get("/:id", adminController.getAdmin);
router.post("/", adminController.createAdmin);
router.patch("/:id", adminController.updateAdmin);
router.delete("/:id", adminController.deleteAdmin);

module.exports = router;
