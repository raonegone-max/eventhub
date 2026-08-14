const rsvpModel = require('../models/RSVP.model')
const eventModel = require('../models/event.model')

async function createRSVP(req, res) {
    try {
        const { eventId } = req.body

        if (!eventId) {
            return res.status(400).json({
                message: "Please provide eventId"
            })
        }

        const event = await eventModel.findById(eventId)

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            })
        }

        // check for an existing RSVP document (going OR cancelled) for this event+user pair.
        // the unique index only allows ONE such document to ever exist, so we must reuse
        // it rather than trying to create a fresh one every time.
        const existingRSVP = await rsvpModel.findOne({
            event: eventId,
            user: req.user.id
        })

        if (existingRSVP && existingRSVP.status === 'going') {
            return res.status(400).json({
                message: "You have already RSVP'd to this event"
            })
        }

        // capacity check — only matters if a limit is actually set
        if (event.capacity !== null) {
            const goingCount = await rsvpModel.countDocuments({
                event: eventId,
                status: 'going'
            })

            if (goingCount >= event.capacity) {
                return res.status(400).json({
                    message: "This event is full"
                })
            }
        }

        let rsvp

        if (existingRSVP) {
            // they had cancelled before — flip the same document back to 'going'
            // instead of inserting a new one (which the unique index would reject anyway)
            existingRSVP.status = 'going'
            rsvp = await existingRSVP.save()
        } else {
            rsvp = await rsvpModel.create({
                event: eventId,
                user: req.user.id
            })
        }

        res.status(201).json({
            message: "RSVP successful",
            rsvp
        })

    } catch (err) {
        // fallback safety net — shouldn't normally hit this now, but kept in case
        // of a race condition between two simultaneous requests
        if (err.code === 11000) {
            return res.status(400).json({
                message: "You have already RSVP'd to this event"
            })
        }

        res.status(500).json({
            message: "Something went wrong while creating the RSVP"
        })
    }
}

async function cancelRSVP(req, res) {
    try {
        const { eventId } = req.params

        const rsvp = await rsvpModel.findOne({
            event: eventId,
            user: req.user.id
        })

        if (!rsvp) {
            return res.status(404).json({
                message: "RSVP not found"
            })
        }

        rsvp.status = 'cancelled'
        await rsvp.save()

        res.status(200).json({
            message: "RSVP cancelled successfully",
            rsvp
        })

    } catch (err) {
        res.status(500).json({
            message: "Something went wrong while cancelling the RSVP"
        })
    }
}

async function getMyRSVPs(req, res) {
    try {
        const rsvps = await rsvpModel.find({
            user: req.user.id,
            status: 'going'
        }).populate('event')

        res.status(200).json({
            rsvps
        })

    } catch (err) {
        res.status(500).json({
            message: "Something went wrong while fetching your RSVPs"
        })
    }
}

async function getEventAttendees(req, res) {
    try {
        const { eventId } = req.params

        const event = await eventModel.findById(eventId)

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            })
        }

        // only the organizer who owns this event can see the attendee list
        if (event.organizer.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You are not allowed to view attendees for this event"
            })
        }

        const rsvps = await rsvpModel.find({
            event: eventId,
            status: 'going'
        }).populate('user', 'name email')

        res.status(200).json({
            attendees: rsvps
        })

    } catch (err) {
        res.status(500).json({
            message: "Something went wrong while fetching attendees"
        })
    }
}

module.exports = {
    createRSVP,
    cancelRSVP,
    getMyRSVPs,
    getEventAttendees
}