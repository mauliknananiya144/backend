const mongoose = require("mongoose")

const toolSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true
    },
    icon: {
        type: String,
        require: true
    }
}, { timestamps: true })

module.exports = mongoose.model("Tool", toolSchema)