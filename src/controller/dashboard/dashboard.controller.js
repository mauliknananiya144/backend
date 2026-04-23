const Portfolio = require("../../models/portfolio.model")
const Category = require("../../models/category.model")
const Industry = require("../../models/industry.model")
const Tool = require("../../models/tool.model")

exports.getDashboardSummary = async (req, res) => {
    try {
        const [
            publishedPortfolioCount,
            draftPortfolioCount,
            categoryCount,
            industryCount,
            toolCount,
            totalPortfolioCount,
            recentPortfolios
        ] = await Promise.all([
            Portfolio.countDocuments({ status: "LIVE" }),
            Portfolio.countDocuments({ status: "DRAFT" }),
            Category.countDocuments(),
            Industry.countDocuments(),
            Tool.countDocuments(),
            Portfolio.countDocuments(),
            Portfolio.find({}, {
                _id: 1,
                title: 1,
                status: 1,
                category: 1,
                industry: 1,
                updatedAt: 1
            })
                .sort({ updatedAt: -1 })
                .limit(5)
                .populate("industry", "name")
        ])

        return res.status(200).json({
            message: "Dashboard summary fetched successfully",
            summary: {
                publishedPortfolioCount,
                draftPortfolioCount,
                categoryCount,
                industryCount,
                toolCount,
                totalPortfolioCount,
                updatedAt: new Date().toISOString()
            },
            recentPortfolios
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" })
    }
}
