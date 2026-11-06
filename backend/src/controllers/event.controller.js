const eventModel = require('../models/event.model')
const rsvpModel = require('../models/RSVP.model')

async function createEvent(req, res) {
    try {
        // body is already validated and trimmed by validateCreateEvent
        const { title, description, date, location, capacity } = req.body

        const event = await eventModel.create({
            title,
            description,
            date,
            location,
            capacity: capacity ?? null,
            organizer: req.user.id
        })

        res.status(201).json({
            message: "Event created successfully",
            event
        })

    } catch (err) {
        res.status(500).json({
            message: "Something went wrong while creating the event"
        })
    }
}

// escape user input so characters like ( or * can't break/abuse the regex
function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// GET /events?page=1&limit=12&search=react&location=delhi
//            &from=2026-01-01&to=2026-12-31&upcoming=true&sort=date
async function getEvents(req, res) {
    try {
        const page = Math.max(parseInt(req.query.page) || 1, 1)
        // default is 50 so the current frontend (which loads everything at once)
        // keeps working; hard cap at 100 so nobody can request the whole DB
        const limit = Math.min(Math.max(parseInt(req.query.limit) || 50, 1), 100)

        const filter = {}

        if (typeof req.query.search === 'string' && req.query.search.trim()) {
            const rx = new RegExp(escapeRegex(req.query.search.trim().slice(0, 100)), 'i')
            filter.$or = [{ title: rx }, { description: rx }, { location: rx }]
        }

        if (typeof req.query.location === 'string' && req.query.location.trim()) {
            filter.location = new RegExp(escapeRegex(req.query.location.trim().slice(0, 100)), 'i')
        }

        const dateFilter = {}
        if (req.query.upcoming === 'true') dateFilter.$gte = new Date()
        if (req.query.from) {
            const from = new Date(req.query.from)
            if (isNaN(from.getTime())) return res.status(400).json({ message: "Invalid 'from' date" })
            if (!dateFilter.$gte || from > dateFilter.$gte) dateFilter.$gte = from
        }
        if (req.query.to) {
            const to = new Date(req.query.to)
            if (isNaN(to.getTime())) return res.status(400).json({ message: "Invalid 'to' date" })
            dateFilter.$lte = to
        }
        if (Object.keys(dateFilter).length) filter.date = dateFilter

        // whitelist of allowed sorts — never pass raw query input to .sort()
        const sortOptions = {
            'date': { date: 1, _id: 1 },
            '-date': { date: -1, _id: -1 },
            'newest': { createdAt: -1, _id: -1 }
        }
        const sort = sortOptions[req.query.sort] || sortOptions['date']

        const [events, total] = await Promise.all([
            eventModel.find(filter)
                .populate('organizer', 'name email')
                .sort(sort)
                .skip((page - 1) * limit)
                .limit(limit),
            eventModel.countDocuments(filter)
        ])

        const totalPages = Math.max(Math.ceil(total / limit), 1)

        res.status(200).json({
            events,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        })

    } catch (err) {
        res.status(500).json({
            message: "Something went wrong while fetching events"
        })
    }
}

async function getEventById(req, res) {
    try {
        const event = await eventModel.findById(req.params.id).populate('organizer', 'name email')

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            })
        }

        res.status(200).json({
            event
        })

    } catch (err) {
        res.status(500).json({
            message: "Something went wrong while fetching the event"
        })
    }
}

async function updateEvent(req, res) {
    try {
        const event = await eventModel.findById(req.params.id)

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            })
        }

        // only the organizer who created it can update it
        if (event.organizer.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You are not allowed to update this event"
            })
        }

        const { title, description, date, location, capacity } = req.body

        if (title !== undefined) event.title = title
        if (description !== undefined) event.description = description
        if (date !== undefined) {
            const newDate = new Date(date)
            const changed = newDate.toISOString().slice(0, 10) !== event.date.toISOString().slice(0, 10)
            if (changed && newDate.getTime() < Date.now() - 24 * 60 * 60 * 1000) {
                return res.status(400).json({ message: "Event date can't be in the past" })
            }
            event.date = date
        }
        if (location !== undefined) event.location = location
        if (capacity !== undefined) {
            // don't let an organizer shrink capacity below people already going
            if (capacity !== null) {
                const goingCount = await rsvpModel.countDocuments({ event: event._id, status: 'going' })
                if (capacity < goingCount) {
                    return res.status(400).json({
                        message: `Capacity can't be lower than the ${goingCount} people already going`
                    })
                }
            }
            event.capacity = capacity
        }

        await event.save()

        res.status(200).json({
            message: "Event updated successfully",
            event
        })

    } catch (err) {
        res.status(500).json({
            message: "Something went wrong while updating the event"
        })
    }
}

async function deleteEvent(req, res) {
    try {
        const event = await eventModel.findById(req.params.id)

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            })
        }

        // only the organizer who created it can delete it
        if (event.organizer.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You are not allowed to delete this event"
            })
        }

        await rsvpModel.deleteMany({ event: event._id })
        await event.deleteOne()

        res.status(200).json({
            message: "Event deleted successfully"
        })

    } catch (err) {
        res.status(500).json({
            message: "Something went wrong while deleting the event"
        })
    }
}

async function getMyEvents(req, res) {
    try {
        const events = await eventModel.find({ organizer: req.user.id }).sort({ date: 1 })

        res.status(200).json({
            events
        })

    } catch (err) {
        res.status(500).json({
            message: "Something went wrong while fetching your events"
        })
    }
}

module.exports = {
    createEvent,
    getEvents,
    getEventById,
    getMyEvents,
    updateEvent,
    deleteEvent
}