const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const tokenBlacklistModel = require("../models/blacklist.model")

async function registerUserController(req, res) {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please provide username, email and password"
            })
        }

        const isUserAlreadyExists = await userModel.findOne({
            $or: [{ name }, { email }]
        })

        if (isUserAlreadyExists) {
            return res.status(400).json({
                message: "Account already exists with this email address or username"
            })
        }

        const hash = await bcrypt.hash(password, 10)

        const user = await userModel.create({
            name,
            email,
            password: hash
        })

        const token = jwt.sign(
            { id: user._id, name: user.name, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        res.cookie("token", token)

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })

    } catch (err) {
        res.status(500).json({
            message: "Something went wrong while registering the user"
        })
    }
}

async function loginUserController(req, res) {
    try {
        const { email, password } = req.body

        const user = await userModel.findOne({ email })

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }

        const token = jwt.sign(
            { id: user._id, name: user.name, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        res.cookie("token", token)
        res.status(200).json({
            message: "User loggedIn successfully.",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })

    } catch (err) {
        res.status(500).json({
            message: "Something went wrong while logging in"
        })
    }
}

async function logoutUserController(req, res) {
    try {
        const token = req.cookies.token

        if (token) {
            await tokenBlacklistModel.create({ token })
        }

        res.clearCookie("token")

        res.status(200).json({
            message: "User logged out successfully"
        })

    } catch (err) {
        res.status(500).json({
            message: "Something went wrong while logging out"
        })
    }
}

module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController
}