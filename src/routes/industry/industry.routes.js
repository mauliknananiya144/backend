const express = require("express")
const router = express.Router()
const { createIndustry, getAllIndustries, getIndustryById, updateIndustry, deleteIndustry } = require("../../controller/industry/industry.controller")

router.post("/create", createIndustry)
router.get("/", getAllIndustries)
router.get("/:id", getIndustryById)
router.put("/:id", updateIndustry)
router.delete("/:id", deleteIndustry)

module.exports = router