const express = require("express")
const router = express.Router()
const multer = require("multer")
const { getResume, uploadResume, deleteResume, downloadResume } = require("../../controller/resumeManagement/resume.controller")

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: function (req, file, cb) {
        const uniqueFilename = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueFilename);
    }
});

const uploads = multer({
    storage: storage, limits: {
        fileSize: 10 * 1024 * 1024
    }
})

// router.post("/upload", uploads.fields([{ name: "resume" }]), uploadResume)


router.post("/upload", (req, res, next) => {
    uploads.fields([{ name: "resume" }])(req, res, function (err) {

        if (err instanceof multer.MulterError) {
            if (err.code === "LIMIT_FILE_SIZE") {
                return res.status(400).json({
                    message: "File size must be less than 10MB"
                })
            }
        }

        if (err) {
            return res.status(400).json({
                message: err.message
            })
        }

        next()
    })
}, uploadResume)
router.get("/", getResume)
router.delete("/delete", deleteResume)
router.get("/download", downloadResume)

module.exports = router
