const express = require("express")
const router = express.Router()
const { createAdmin, adminLogin, changePassword } = require("../../controller/auth/auth.controller")


router.post("/create", createAdmin)
router.post("/login", adminLogin)
router.post("/change-password", changePassword)

module.exports = router
