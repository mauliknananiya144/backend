const Category = require("../../models/category.model")
const Portfolio = require("../../models/portfolio.model")

exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body || {}
        if (!name) {
            return res.status(400).json({ message: "Category name is required" })
        }
        const existingCategory = await Category.findOne({ name })
        if (existingCategory) {
            return res.status(400).json({ message: "Category already exists" })
        }
        await Category.create({ name })
        return res.status(201).json({ message: "Category created successfully" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

exports.getAllCategories = async (req, res) => {
    try {
        const { isWeb } = req.query || {};
        const categories = await Category.find()
            .select({ _id: 1, name: 1, createdAt: 1 })
            .sort({ createdAt: -1 })

        const portfolioCounts = await Portfolio.aggregate([
            {
                $match: {
                    category: { $nin: [null, ""] }
                }
            },
            {
                $group: {
                    _id: "$category",
                    portfolioCount: { $sum: 1 }
                }
            }
        ])

        const portfolioCountMap = new Map();
        portfolioCounts.forEach((item) => {
            if (item._id) {
                portfolioCountMap.set(String(item._id).trim(), item.portfolioCount);
            }
        });

        const categoryWithCounts = categories.map((category) => ({
            _id: category._id,
            name: category.name,
            createdAt: category.createdAt,
            portfolioCount: portfolioCountMap.get(String(category.name).trim()) || 0
        }))

        if (isWeb === 'true') {
            const Company = require("../../models/company.model");
            const companySetting = await Company.findOne({});
            const isCompanyAllowed = companySetting ? companySetting.isCompanyAllowed : false;

            if (isCompanyAllowed) {
                categoryWithCounts.unshift({
                    _id: "company-default-category",
                    name: "Company",
                    createdAt: new Date(),
                    portfolioCount: portfolioCountMap.get("Company") || 0
                });
            }
        }

        return res.status(200).json({ message: "Categories fetched successfully", categories: categoryWithCounts })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

exports.getCategoryById = async (req, res) => {
    try {
        const { id } = req.params || {}
        const category = await Category.findById(id).select({ _id: 1, name: 1, createdAt: 1 })
        if (!category) {
            return res.status(404).json({ message: "Category not found" })
        }
        return res.status(200).json({ message: "Category fetched successfully", category })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params || {}
        const { name } = req.body || {}
        if (!name) {
            return res.status(400).json({ message: "Category name is required" })
        }
        const category = await Category.findByIdAndUpdate(id, { name }, { new: true })
        if (!category) {
            return res.status(404).json({ message: "Category not found" })
        }
        return res.status(200).json({ message: "Category updated successfully" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" })
    }
}

exports.deleteCategory = async (req, res) => {
    try {
        const { id } = req.params || {}
        const category = await Category.findByIdAndDelete(id)
        if (!category) {
            return res.status(404).json({ message: "Category not found" })
        }
        return res.status(200).json({ message: "Category deleted successfully" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" })
    }
}
