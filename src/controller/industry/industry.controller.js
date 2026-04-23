const Industry = require("../../models/industry.model")
const Portfolio = require("../../models/portfolio.model")

exports.createIndustry = async (req, res) => {
    try {
        const { name } = req.body || {}
        if (!name) {
            return res.status(400).json({ message: "Industry name is required" })
        }
        let existingIndustry = await Industry.findOne({ name })
        if (existingIndustry) {
            return res.status(400).json({ message: "Industry already exists" })
        }
        await Industry.create({ name })
        return res.status(201).json({ message: "Industry created successfully" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

exports.getAllIndustries = async (req, res) => {
    try {
        const industries = await Industry.find({}, { _id: 1, name: 1, createdAt: 1 })
            .sort({ createdAt: -1 })

        const portfolioCounts = await Portfolio.aggregate([
            {
                $match: {
                    industry: { $ne: null }
                }
            },
            {
                $group: {
                    _id: "$industry",
                    portfolioCount: { $sum: 1 }
                }
            }
        ])

        const portfolioCountMap = new Map(
            portfolioCounts.map((item) => [String(item._id), item.portfolioCount])
        )

        const industriesWithCounts = industries.map((industry) => ({
            _id: industry._id,
            name: industry.name,
            createdAt: industry.createdAt,
            portfolioCount: portfolioCountMap.get(String(industry._id)) || 0
        }))

        return res.status(200).json({ message: "Industries fetched successfully", industries: industriesWithCounts })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

exports.getIndustryById = async (req, res) => {
    try {
        const { id } = req.params || {}
        const industry = await Industry.findById(id, { _id: 1, name: 1, createdAt: 1 })
        if (!industry) {
            return res.status(404).json({ message: "Industry not found" })
        }
        return res.status(200).json({ message: "Industry fetched successfully", industry })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

exports.updateIndustry = async (req, res) => {
    try {
        const { id } = req.params || {}
        const { name } = req.body || {}
        if (!name) {
            return res.status(400).json({ message: "Industry name is required" })
        }
        const industry = await Industry.findByIdAndUpdate(id, { name }, { new: true })
        if (!industry) {
            return res.status(404).json({ message: "Industry not found" })
        }
        return res.status(200).json({ message: "Industry updated successfully" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

exports.deleteIndustry = async (req, res) => {
    try {
        const { id } = req.params || {}
        const industry = await Industry.findByIdAndDelete(id)
        if (!industry) {
            return res.status(404).json({ message: "Industry not found" })
        }
        return res.status(200).json({ message: "Industry deleted successfully" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" })
    }
}
