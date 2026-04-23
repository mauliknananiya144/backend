const Skill = require("../../models/skill.model")

exports.createSkill = async (req, res) => {
    try {
        const { name } = req.body || {}
        const { icon } = req.files || {}

        if (!name) {
            return res.status(400).json({ message: "Skill name is required" })
        }

        if (!icon) {
            return res.status(400).json({ message: "Skill icon is required" })
        }

        const existingSkill = await Skill.findOne({ name })
        if (existingSkill) {
            return res.status(400).json({ message: "Skill already exists" })
        }

        await Skill.create({
            name,
            icon: icon[0].filename
        })

        return res.status(201).json({ message: "Skill created successfully" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

exports.getAllSkills = async (req, res) => {
    try {
        const skills = await Skill.find({}, { _id: 1, name: 1, icon: 1 }).sort({ createdAt: -1 })
        return res.status(200).json({ message: "Skills fetched successfully", skills })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

exports.deleteSkill = async (req, res) => {
    try {
        const { id } = req.params || {}
        await Skill.findByIdAndDelete(id)
        return res.status(200).json({ message: "Skill deleted successfully" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" })
    }
}
