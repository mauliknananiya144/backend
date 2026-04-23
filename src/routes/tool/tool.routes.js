const express = require("express")
const router = express.Router()
const { createTool, getAllTools, deleteTool } = require("../../controller/tool/tool.controller")
const multer = require("multer")
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/")
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})
const upload = multer({ storage })
router.post("/create", upload.fields([{ name: "icon", maxCount: 1 }]), createTool)
router.get("/", getAllTools)
router.delete("/:id", deleteTool)

module.exports = router