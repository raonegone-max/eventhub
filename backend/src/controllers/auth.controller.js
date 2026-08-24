const userModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const tokenBlacklistModel = require("../models/blacklist.model")
const { OAuth2Client } = require('google-auth-library')

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

// in production, frontend and backend live on different domains, so the browser
// needs explicit permission to send this cookie cross-site. locally (same-site,
// http) these extra flags aren't needed and would actually break things — hence
// the NODE_ENV check rather than hardcoding one behavior
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
}

async function registerUserController(req, res) {
    try {
        const { name, email, password, role } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Please provide username, email and password"
            })
        }

        // whitelist check — never trust the client to send an arbitrary role string,
        // even though the schema's enum would also reject anything invalid
        const allowedRoles = ['student', 'organizer']
        const finalRole = allowedRoles.includes(role) ? role : 'student'

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
            password: hash,
            role: finalRole
        })

        const token = jwt.sign(
            { id: user._id, name: user.name, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        res.cookie("token", token, cookieOptions)

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

        res.cookie("token", token, cookieOptions)
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

        res.clearCookie("token", cookieOptions)

        res.status(200).json({
            message: "User logged out successfully"
        })

    } catch (err) {
        res.status(500).json({
            message: "Something went wrong while logging out"
        })
    }
}

async function getMeController(req, res) {
    try {
        const user = await userModel.findById(req.user.id).select('-password')

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        res.status(200).json({
            user
        })

    } catch (err) {
        res.status(500).json({
            message: "Something went wrong while fetching user data"
        })
    }
}

async function googleAuthController(req, res) {
    try {
        const { credential, role } = req.body

        if (!credential) {
            return res.status(400).json({
                message: "Missing Google credential"
            })
        }

        // same whitelist as normal registration — never trust the client's
        // role string directly, even for Google sign-in
        const allowedRoles = ['student', 'organizer']
        const finalRole = allowedRoles.includes(role) ? role : 'student'

        // this is the critical security step — anyone could send a fake
        // { name, email } object claiming to be from Google. verifyIdToken
        // cryptographically confirms this token was genuinely issued by
        // Google for OUR app (matched against GOOGLE_CLIENT_ID), not forged.
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        })

        const payload = ticket.getPayload()
        const { sub: googleId, email, name } = payload

        // find by googleId first (returning user), fall back to email
        // (handles someone who registered normally, then later uses Google
        // sign-in with the same email — we link the accounts instead of
        // creating a confusing duplicate)
        let user = await userModel.findOne({ $or: [{ googleId }, { email }] })

        if (user) {
            if (!user.googleId) {
                user.googleId = googleId
                await user.save()
            }
        } else {
            // brand new user via Google — role comes from the picker the
            // frontend shows alongside the Google button, same as normal
            // registration. existing users keep whatever role they already have.
            user = await userModel.create({
                name,
                email,
                googleId,
                role: finalRole
            })
        }

        const token = jwt.sign(
            { id: user._id, name: user.name, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        res.cookie("token", token, cookieOptions)

        res.status(200).json({
            message: "Signed in with Google successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })

    } catch (err) {
        console.error(err)
        res.status(401).json({
            message: "Google sign-in failed. Please try again."
        })
    }
}

module.exports = {
    registerUserController,
    loginUserController,
    logoutUserController,
    getMeController,
    googleAuthController
}