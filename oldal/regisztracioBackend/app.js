const express = require("express")
const app = express()
app.use(express.urlencoded({extended:true}))
app.use(express.json())
const regisztracioRoute = require("./api/routes/regisztracioRoute")
app.use("/", regisztracioRoute)
const errorHandler = require("./api/middlewares/errorHandler")
app.use(errorHandler)
module.exports =app