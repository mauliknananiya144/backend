const mongoose = require("mongoose")

const resumeSchema = new mongoose.Schema({
    resume: {
        type: String,
        require: true
    }
}, { timestamps: true })

module.exports = mongoose.model("Resume", resumeSchema)