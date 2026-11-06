const mongoose = require('mongoose')

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function fail(res, message) {
    return res.status(400).json({ message })
}

// --- auth ---------------------------------------------------------------

function validateRegister(req, res, next) {
    let { name, email, password } = req.body || {}

    if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
        return fail(res, "Please provide name, email and password")
    }

    name = name.trim()
    email = email.trim().toLowerCase()

    if (name.length < 2 || name.length > 50) {
        return fail(res, "Name must be between 2 and 50 characters")
    }
    if (!EMAIL_REGEX.test(email)) {
        return fail(res, "Please provide a valid email address")
    }
    // bcrypt only uses the first 72 bytes, so longer passwords are pointless
    if (password.length < 8 || password.length > 72) {
        return fail(res, "Password must be between 8 and 72 characters")
    }

    req.body.name = name
    req.body.email = email
    next()
}

function validateLogin(req, res, next) {
    let { email, password } = req.body || {}

    if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
        return fail(res, "Please provide email and password")
    }

    req.body.email = email.trim().toLowerCase()
    next()
}

// --- events -------------------------------------------------------------

function parseCapacity(value) {
    // null / "" means unlimited
    if (value === null || value === '') return { ok: true, value: null }
    const n = Number(value)
    if (!Number.isInteger(n) || n < 1 || n > 100000) return { ok: false }
    return { ok: true, value: n }
}

function validateEventBody({ partial }) {
    return (req, res, next) => {
        const body = req.body || {}
        const { title, description, date, location, capacity } = body

        if (!partial) {
            if (!title || !description || !date || !location) {
                return fail(res, "Please provide title, description, date and location")
            }
        }

        if (title !== undefined) {
            if (typeof title !== 'string' || title.trim().length < 3 || title.trim().length > 100) {
                return fail(res, "Title must be between 3 and 100 characters")
            }
            req.body.title = title.trim()
        }

        if (description !== undefined) {
            if (typeof description !== 'string' || description.trim().length < 10 || description.trim().length > 2000) {
                return fail(res, "Description must be between 10 and 2000 characters")
            }
            req.body.description = description.trim()
        }

        if (location !== undefined) {
            if (typeof location !== 'string' || location.trim().length < 2 || location.trim().length > 200) {
                return fail(res, "Location must be between 2 and 200 characters")
            }
            req.body.location = location.trim()
        }

        if (date !== undefined) {
            const parsed = new Date(date)
            if (isNaN(parsed.getTime())) {
                return fail(res, "Please provide a valid date")
            }
            if (!partial && parsed.getTime() < Date.now() - 24 * 60 * 60 * 1000) {
                return fail(res, "Event date can't be in the past")
            }
        }

        if (capacity !== undefined) {
            const result = parseCapacity(capacity)
            if (!result.ok) {
                return fail(res, "Capacity must be a whole number of at least 1 (or empty for unlimited)")
            }
            req.body.capacity = result.value
        }

        next()
    }
}

const validateCreateEvent = validateEventBody({ partial: false })
const validateUpdateEvent = validateEventBody({ partial: true })

// --- ids ----------------------------------------------------------------

// Without this, a malformed id makes mongoose throw a CastError and the
// client gets a confusing 500 instead of a clean 400.
function validateObjectId(...paramNames) {
    return (req, res, next) => {
        for (const name of paramNames) {
            if (!mongoose.isValidObjectId(req.params[name])) {
                return fail(res, `Invalid ${name}`)
            }
        }
        next()
    }
}

function validateRSVPBody(req, res, next) {
    const { eventId } = req.body || {}
    if (!eventId) return fail(res, "Please provide eventId")
    if (typeof eventId !== 'string' || !mongoose.isValidObjectId(eventId)) {
        return fail(res, "Invalid eventId")
    }
    next()
}

module.exports = {
    validateRegister,
    validateLogin,
    validateCreateEvent,
    validateUpdateEvent,
    validateObjectId,
    validateRSVPBody
}