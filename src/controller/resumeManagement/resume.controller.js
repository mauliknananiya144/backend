const path = require("path")
const fs = require("fs")
const Resume = require("../../models/resume.model")

const getResumeFilePath = (fileName) =>
    path.join(__dirname, "..", "..", "..", "uploads", fileName)

const getOriginalFileName = (storedFileName = "") => {
    const firstDashIndex = storedFileName.indexOf("-")
    if (firstDashIndex === -1) {
        return storedFileName
    }
    return storedFileName.slice(firstDashIndex + 1)
}

exports.getResume = async (req, res) => {
    try {
        let existingResume = await Resume.findOne()
        if (!existingResume) {
            return res.status(404).json({ message: "Resume not found" })
        }

        let filePath = getResumeFilePath(existingResume.resume)
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: "Resume not found" })
        }

        let fileStats = fs.statSync(filePath)

        return res.status(200).json({
            message: "Resume fetched successfully",
            resume: {
                fileName: getOriginalFileName(existingResume.resume),
                storedFileName: existingResume.resume,
                fileSize: fileStats.size,
                uploadedAt: existingResume.updatedAt || existingResume.createdAt,
                downloadUrl: "/api/v1/resume/download"
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
}

exports.uploadResume = async (req, res) => {
    try {
        let { resume } = req.files || {}
        console.log(resume);

        if (!resume) {
            return res.status(400).json({ message: "Resume is required" })
        }
        if (resume[0].mimetype !== "application/pdf") {
            return res.status(400).json({
                message: "Only PDF files are allowed"
            })
        }
        console.log(resume);

        let existingResume = await Resume.findOne()
        if (existingResume) {
            await Resume.updateOne({
                _id: existingResume._id
            },
                {
                    resume: resume?.[0]?.filename
                }
            )
        } else {
            await Resume.create({
                resume: resume?.[0]?.filename
            })
        }
        return res.status(200).json({ message: "Resume added successfully" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
}

exports.deleteResume = async (req, res) => {
    try {
        await Resume.deleteMany()
        return res.status(200).json({ message: "Resume deleted successfully" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
}

exports.downloadResume = async (req, res) => {
    try {
        console.log("APi called");

        let existingResume = await Resume.findOne()
        if (!existingResume) {
            return res.status(404).json({ message: "Resume not found" })
        }
        let filePath = getResumeFilePath(existingResume.resume)
        console.log(filePath);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: "Resume not found" })
        }

        return res.download(filePath, getOriginalFileName(existingResume.resume))
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
}
