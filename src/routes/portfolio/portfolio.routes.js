const express = require("express")
const router = express.Router()
const { createPortfolio, getAllPortfolio, getAllPortfolioWeb, getPortfolioById, updatePortfolio, deletePortfolio } = require("../../controller/portfolio/portfolio.controller")
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

router.post("/create", upload.fields([{ name: "coverImage", maxCount: 1 }, { name: "image", maxCount: 10 }, { name: "video", maxCount: 1 }, { name: "icon", maxCount: 1 }]), createPortfolio)
router.get("/", getAllPortfolio)
router.get("/web", getAllPortfolioWeb)
router.get("/:id", getPortfolioById)
router.put("/:id", upload.fields([{ name: "coverImage", maxCount: 1 }, { name: "image", maxCount: 10 }, { name: "video", maxCount: 1 }, { name: "icon", maxCount: 1 }]), updatePortfolio)
router.delete("/:id", deletePortfolio)

module.exports = router