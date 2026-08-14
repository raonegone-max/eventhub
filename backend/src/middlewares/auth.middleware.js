const jwt = require("jsonwebtoken");
const tokenBlacklistModel = require("../models/blacklist.model")

async function authUser(req, res, next) {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Not logged in." });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(401).json({ message: "Invalid or expired token." });
        }

        const isTokenBlacklisted = await tokenBlacklistModel.findOne({ token })

        if (isTokenBlacklisted) {
            return res.status(401).json({ message: "Token is invalid." });
        }

        req.user = decoded;

        next();

    } catch (err) {
        return res.status(500).json({ message: "Something went wrong during authentication." });
    }
}

module.exports = { authUser };