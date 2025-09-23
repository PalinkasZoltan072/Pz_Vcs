const express = require("express")
const router =express.Router()
const regisztracioController = require("../controllers/regisztracioController")
router.post("/mukodj",regisztracioController.regisztralas)
module.exports = router