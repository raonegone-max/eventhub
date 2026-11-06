const mongoose = require('mongoose')


const blacklistTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: [ true, "token is required to be added in blacklist" ],
        index: true // looked up on every authenticated request
    }
}, {
    timestamps: true
})

// Tokens only live for 1 day (see expiresIn in auth.controller), so a
// blacklisted token is useless after that. MongoDB deletes these documents
// automatically, which keeps the collection (and the lookup) small.
blacklistTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 })

const tokenBlacklistModel = mongoose.model("blacklistTokens", blacklistTokenSchema)


module.exports = tokenBlacklistModel