const Portfolio = require("../../models/portfolio.model")
const Tool = require("../../models/tool.model")
const Skill = require("../../models/skill.model")

const normalizeStringArray = (value) => {
    if (!value) {
        return []
    }

    return Array.isArray(value) ? value : [value]
}

const parseBoolean = (value) => {
    if (typeof value === "boolean") {
        return value
    }

    if (typeof value === "string") {
        return value.toLowerCase() === "true"
    }

    return false
}

const buildAssetDetails = async (names, Model) => {
    const uniqueNames = [...new Set(normalizeStringArray(names))]

    if (!uniqueNames.length) {
        return []
    }

    const documents = await Model.find({ name: { $in: uniqueNames } }, { name: 1, icon: 1, _id: 0 })
    const documentMap = new Map(documents.map((item) => [item.name, item.icon || ""]))

    return uniqueNames.map((name) => ({
        name,
        icon: documentMap.get(name) || ""
    }))
}

exports.createPortfolio = async (req, res) => {
    try {
        let {
            title,
            description,
            category,
            industry,
            tools,
            skills,
            isHide = false,
            figmaUrl,
            secondaryTitle,
            secondaryDescription,
            status = "DRAFT"
        } = req.body || {}
        let {
            coverImage,
            image,
            video,
            icon
        } = req.files || {}
        const normalizedTools = normalizeStringArray(tools)
        const normalizedSkills = normalizeStringArray(skills)

        if (!title) {
            return res.status(400).json({ message: "Title is required" })
        }
        if (!description) {
            return res.status(400).json({ message: "Description is required" })
        }
        if (!industry) {
            return res.status(400).json({ message: "Industry is required" })
        }
        if (!normalizedTools.length) {
            return res.status(400).json({ message: "Tools is required" })
        }
        if (!normalizedSkills.length) {
            return res.status(400).json({ message: "Skills is required" })
        }
        if (!coverImage) {
            return res.status(400).json({ message: "Cover Image is required" })
        }
        if (!image) {
            return res.status(400).json({ message: "Image is required" })
        }
        if (!figmaUrl) {
            return res.status(400).json({ message: "Figma Url is required" })
        }
        if (!secondaryTitle) {
            return res.status(400).json({ message: "Secondary Title is required" })
        }
        if (!secondaryDescription) {
            return res.status(400).json({ message: "Secondary Description is required" })
        }
        if (!["LIVE", "DRAFT"].includes(status)) {
            return res.status(400).json({ message: "Invalid status type" })
        }

        let coverImageUrl = coverImage?.[0]?.filename
        let imageUrl = image.map((item) => item.filename)
        let videoUrl = video?.[0]?.filename
        let iconUrl = icon?.[0]?.filename
        const toolDetails = await buildAssetDetails(normalizedTools, Tool)
        const skillDetails = await buildAssetDetails(normalizedSkills, Skill)

        await Portfolio.create({
            title,
            description,
            category,
            industry,
            tools: normalizedTools,
            toolDetails,
            skills: normalizedSkills,
            skillDetails,
            coverImage: coverImageUrl,
            image: imageUrl,
            video: videoUrl,
            icon: iconUrl,
            isHide: parseBoolean(isHide),
            figmaUrl,
            secondaryTitle,
            secondaryDescription,
            status
        })

        return res.status(201).json({ message: "Portfolio created successfully" })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

exports.getAllPortfolio = async (req, res) => {
    try {
        let { status } = req.query || {}
        let query = {}

        if (status) {
            query.status = status
        }

        const portfolio = await Portfolio.find(query, {
            _id: 1,
            title: 1,
            description: 1,
            category: 1,
            industry: 1,
            tools: 1,
            toolDetails: 1,
            skills: 1,
            skillDetails: 1,
            coverImage: 1,
            image: 1,
            video: 1,
            icon: 1,
            isHide: 1,
            figmaUrl: 1,
            secondaryTitle: 1,
            secondaryDescription: 1,
            status: 1,
            createdAt: 1,
        }).populate("category", "name").populate("industry", "name")

        return res.status(200).json({ message: "Portfolio fetched successfully", portfolio })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

exports.getPortfolioById = async (req, res) => {
    try {
        const { id } = req.params

        if (!id) {
            return res.status(400).json({ message: "Portfolio ID is required" })
        }

        const portfolio = await Portfolio.findById(id).populate("category", "name").populate("industry", "name")
        return res.status(200).json({ message: "Portfolio fetched successfully", portfolio })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

exports.updatePortfolio = async (req, res) => {
    try {
        const { id } = req.params

        if (!id) {
            return res.status(400).json({ message: "Portfolio ID is required" })
        }

        let {
            title,
            description,
            category,
            industry,
            tools,
            skills,
            isHide = false,
            figmaUrl,
            secondaryTitle,
            secondaryDescription,
            status = "DRAFT",
            existingImages,
            existingCoverImage,
            existingVideo,
            existingIcon
        } = req.body || {}
        let {
            coverImage,
            image,
            video,
            icon
        } = req.files || {}

        const normalizedTools = normalizeStringArray(tools)
        const normalizedSkills = normalizeStringArray(skills)
        const normalizedExistingImages = normalizeStringArray(existingImages)

        if (!title) {
            return res.status(400).json({ message: "Title is required" })
        }
        if (!description) {
            return res.status(400).json({ message: "Description is required" })
        }
        if (!industry) {
            return res.status(400).json({ message: "Industry is required" })
        }
        if (!normalizedTools.length) {
            return res.status(400).json({ message: "Tools is required" })
        }
        if (!normalizedSkills.length) {
            return res.status(400).json({ message: "Skills is required" })
        }
        if (!figmaUrl) {
            return res.status(400).json({ message: "Figma Url is required" })
        }
        if (!secondaryTitle) {
            return res.status(400).json({ message: "Secondary Title is required" })
        }
        if (!secondaryDescription) {
            return res.status(400).json({ message: "Secondary Description is required" })
        }
        if (!["LIVE", "DRAFT"].includes(status)) {
            return res.status(400).json({ message: "Invalid status type" })
        }

        let existingPortfolio = await Portfolio.findById(id)

        if (!existingPortfolio) {
            return res.status(404).json({ message: "Portfolio not found" })
        }

        let coverImageUrl = coverImage?.[0]?.filename || existingCoverImage || existingPortfolio.coverImage
        let imageUrl = image ? image.map((item) => item.filename) : []
        let finalImages = [...normalizedExistingImages, ...imageUrl]
        let videoUrl = video?.[0]?.filename || existingVideo || existingPortfolio.video
        let iconUrl = icon?.[0]?.filename || existingIcon || existingPortfolio.icon
        const toolDetails = await buildAssetDetails(normalizedTools, Tool)
        const skillDetails = await buildAssetDetails(normalizedSkills, Skill)

        if (!coverImageUrl) {
            return res.status(400).json({ message: "Cover Image is required" })
        }
        if (!finalImages.length) {
            return res.status(400).json({ message: "Image is required" })
        }

        const portfolio = await Portfolio.findByIdAndUpdate(id, {
            title,
            description,
            category,
            industry,
            tools: normalizedTools,
            toolDetails,
            skills: normalizedSkills,
            skillDetails,
            coverImage: coverImageUrl,
            image: finalImages,
            video: videoUrl,
            icon: iconUrl,
            isHide: parseBoolean(isHide),
            figmaUrl,
            secondaryTitle,
            secondaryDescription,
            status
        }, { new: true })

        return res.status(200).json({ message: "Portfolio updated successfully", portfolio })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

exports.deletePortfolio = async (req, res) => {
    try {
        const { id } = req.params

        if (!id) {
            return res.status(400).json({ message: "Portfolio ID is required" })
        }

        const portfolio = await Portfolio.findByIdAndDelete(id)
        return res.status(200).json({ message: "Portfolio deleted successfully", portfolio })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

exports.getAllPortfolioWeb = async (req, res) => {
    try {
        let { categoryId, category, industryId } = req.query || {}

        let query = {
            status: "LIVE"
        }

        const CompanySetting = require("../../models/company.model");
        const companySetting = await CompanySetting.findOne({});
        const isCompanyAllowed = companySetting ? companySetting.isCompanyAllowed : false;

        if (!isCompanyAllowed) {
            query.category = { $ne: "Company" };
        }

        if (categoryId || category) {
            let requestedCategory = categoryId || category;
            if (!isCompanyAllowed && requestedCategory === "Company") {
                query._id = null;
            } else {
                query.category = requestedCategory;
            }
        }

        if (industryId) {
            query.industry = industryId
        }

        const portfolio = await Portfolio.find(query).populate("category", "name").populate("industry", "name")

        return res.status(200).json({
            message: "Portfolio fetched successfully",
            portfolio
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}
