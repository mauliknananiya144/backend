const Tool = require("../../models/tool.model")

exports.createTool = async (req, res) => {
    try {
        const { name } = req.body || {}
        const { icon } = req.files || {}

        if (!icon) {
            return res.status(400).json({ message: "Tool icon is required" })
        }
        const existingTool = await Tool.findOne({ name })
        if (existingTool) {
            return res.status(400).json({ message: "Tool already exists" })
        }
        await Tool.create({ name, icon: icon[0].filename })
        return res.status(201).json({ message: "Tool created successfully" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

exports.getAllTools = async (req, res) => {
    try {
        const tools = await Tool.find({}, { _id: 1, name: 1, icon: 1 })
        return res.status(200).json({ message: "Tools fetched successfully", tools })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" })
    }
}


exports.deleteTool = async (req, res) => {
    try {
        const { id } = req.params
        await Tool.findByIdAndDelete(id)
        return res.status(200).json({ message: "Tool deleted successfully" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" })
    }
}
