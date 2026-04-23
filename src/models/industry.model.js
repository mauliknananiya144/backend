const mongoose = require("mongoose")

const industrySchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        unique: true
    }
}, { timestamps: true })


module.exports = mongoose.model("Industry", industrySchema)