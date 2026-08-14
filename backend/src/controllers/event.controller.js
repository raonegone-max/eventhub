const eventModel = require('../models/event.model')

async function createEvent(req, res) {
    try {
        const { title, description, date, location, capacity } = req.body

        if (!title || !description || !date || !location) {
            return res.status(400).json({
                message: "Please provide title, description, date and location"
            })
        }

        const event = await eventModel.create({
            title,
            description,
            date,
            location,
            capacity: capacity || null,
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

async function getEvents(req, res) {
    try {
        const events = await eventModel.find().populate('organizer', 'name email')

        res.status(200).json({
            events
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

        if (title) event.title = title
        if (description) event.description = description
        if (date) event.date = date
        if (location) event.location = location
        if (capacity !== undefined) event.capacity = capacity

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

module.exports = {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent
}