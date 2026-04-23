const express = require("express")
const router = express.Router()
const multer = require("multer")
const { createSkill, getAllSkills, deleteSkill } = require("../../controller/skill/skill.controller")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/")
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})

const upload = multer({ storage })

router.post("/create", upload.fields([{ name: "icon", maxCount: 1 }]), createSkill)
router.get("/", getAllSkills)
router.delete("/:id", deleteSkill)

module.exports = router
