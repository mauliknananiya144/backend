const mongoose = require("mongoose")

const skillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    icon: {
        type: String,
        require: true
    }
}, { timestamps: true })

module.exports = mongoose.model("Skill", skillSchema)
