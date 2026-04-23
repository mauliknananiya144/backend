const express = require("express")
const { updateCompany,
    getCompany,
} = require("../../controller/company/company.controller")
const router = express.Router()

router.post("/create", updateCompany)
router.get("/", getCompany)

module.exports = router