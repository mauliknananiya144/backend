const mongoose = require("mongoose")

const portfolioResumeSchema = new mongoose.Schema({
    resume: {
        type: String,
        require: true
    }
}, { timestamps: true })

module.exports = mongoose.model("PortfolioResume", portfolioResumeSchema)