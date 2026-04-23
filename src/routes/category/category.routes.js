const express = require("express")
const { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory } = require("../../controller/category/category.controller")
const router = express.Router()

router.post("/create", createCategory)
router.get("/", getAllCategories)
router.get("/:id", getCategoryById)
router.put("/:id", updateCategory)
router.delete("/:id", deleteCategory)

module.exports = router