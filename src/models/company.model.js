const mongoose = require("mongoose")

const companySchema = new mongoose.Schema({
    isCompanyAllowed: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

module.exports = mongoose.model("Company", companySchema)