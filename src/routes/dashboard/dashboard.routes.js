const express = require("express")
const router = express.Router()
const { getDashboardSummary } = require("../../controller/dashboard/dashboard.controller")

router.get("/", getDashboardSummary)

module.exports = router
