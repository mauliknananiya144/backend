const mongoose = require("mongoose")

const portfolioSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    category: {
        // type: mongoose.Schema.Types.ObjectId,
        // ref: "Category"
        type: String
    },
    industry: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Industry"
    },
    tools: {
        type: [String],
        require: true
    },
    toolDetails: {
        type: [
            {
                name: {
                    type: String,
                    required: true
                },
                icon: {
                    type: String,
                    default: ""
                }
            }
        ],
        default: []
    },
    skills: {
        type: [String],
        default: []
    },
    skillDetails: {
        type: [
            {
                name: {
                    type: String,
                    required: true
                },
                icon: {
                    type: String,
                    default: ""
                }
            }
        ],
        default: []
    },
    coverImage: {
        type: String,
        require: true
    },
    image: {
        type: [String],
        require: true
    },
    video: {
        type: String
    },
    icon: {
        type: String
    },
    isHide: {
        type: Boolean,
        default: false
    },
    figmaUrl: {
        type: String
    },
    secondaryTitle: {
        type: String
    },
    secondaryDescription: {
        type: String
    },
    status: {
        type: String,
        require: true,
        enum: ["LIVE", "DRAFT"],
        default: "DRAFT"
    }

}, { timestamps: true })

module.exports = mongoose.model("Portfolio", portfolioSchema)
