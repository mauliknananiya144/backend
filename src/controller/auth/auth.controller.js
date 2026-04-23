// const prisma = require("../../config/db")
const bcrypt = require("bcrypt")
const Admin = require("../../models/admin.model")
exports.createAdmin = async (req, res) => {
    try {
        let { username,
            email,
            password } = req.body || {}
        if (!username) {
            return res.status(400).json({ message: "Username is required" })
        }
        if (!email) {
            return res.status(400).json({ message: "Email is required" })
        }
        if (!password) {
            return res.status(400).json({ message: "Password is required" })
        }
        let existingEmail = await Admin.findOne({
            email: email
        })
        if (existingEmail) {
            return res.status(400).json({ message: "Email already exists" })
        }
        let existingUsername = await Admin.findOne({
            username: username
        })
        if (existingUsername) {
            return res.status(400).json({ message: "Username already exists" })
        }
        let hasedPassword = await bcrypt.hash(password, 10)
        await Admin.create({
            username: username,
            email: email,
            password: hasedPassword
        })
        return res.status(201).json({ message: "Admin created successfully" })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
}

exports.adminLogin = async (req, res) => {
    try {
        let { email, password } = req.body || {}
        if (!email) {
            return res.status(400).json({ message: "Email is required" })
        }
        if (!password) {
            return res.status(400).json({ message: "Password is required" })
        }
        let existingAdmin = await Admin.findOne({
            email: email
        }, { password: 1, email: 1, username: 1, _id: 0 })
        if (!existingAdmin) {
            return res.status(400).json({ message: "Email not registered" })
        }
        let comparePassword = await bcrypt.compare(password, existingAdmin.password)
        if (!comparePassword) {
            return res.status(400).json({ message: "Invalid password" })
        }
        const adminData = existingAdmin.toObject()
        delete adminData.password
        return res.status(200).json({ message: "Login successfully", admin: adminData })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
}

exports.changePassword = async (req, res) => {
    try {
        let { email, oldPassword, newPassword, confirmPassword } = req.body || {}

        if (!email) {
            return res.status(400).json({ message: "Email is required" })
        }
        if (!oldPassword) {
            return res.status(400).json({ message: "Old Password is required" })
        }
        if (!newPassword) {
            return res.status(400).json({ message: "New Password is required" })
        }
        if (!confirmPassword) {
            return res.status(400).json({ message: "Confirm Password is required" })
        }
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "New Password and Confirm Password do not match" })
        }

        // ⚠️ Include password if select:false in schema
        let existingAdmin = await Admin.findOne({ email }).select("+password")

        if (!existingAdmin) {
            return res.status(400).json({ message: "Email not registered" })
        }

        // ✅ FIX: add await
        let comparePassword = await bcrypt.compare(oldPassword, existingAdmin.password)

        if (!comparePassword) {
            return res.status(400).json({ message: "Invalid old password" })
        }

        // Optional: prevent same password reuse
        if (oldPassword === newPassword) {
            return res.status(400).json({ message: "New password must be different from old password" })
        }

        let hashedPassword = await bcrypt.hash(newPassword, 10)

        await Admin.findOneAndUpdate(
            { email },
            { password: hashedPassword },
            { new: true }
        )

        return res.status(200).json({ message: "Password changed successfully" })

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal server error" })
    }
}
