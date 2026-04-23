const Company = require("../../models/company.model")

exports.updateCompany = async (req, res) => {
    try {
        const { isCompanyAllowed = false } = req.body || {}

        const company = await Company.findOneAndUpdate(
            {},
            { isCompanyAllowed },
            { new: true, upsert: true }
        )

        return res.status(200).json({
            message: "Company updated successfully",
            company
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

exports.getCompany = async (req, res) => {
    try {
        const company = await Company.findOne({}, { isCompanyAllowed: 1, _id: 0 })
        return res.status(200).json({ message: "Company fetched successfully", company })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" })
    }
}