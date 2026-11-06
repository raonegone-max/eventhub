const express = require("express");
const router = express.Router();
const { authUser } = require("../middlewares/auth.middleware");
const { isOrganizer } = require("../middlewares/role.middleware");
const { validateObjectId, validateRSVPBody } = require("../middlewares/validate.middleware");
const { createRSVP, cancelRSVP, getMyRSVPs, getEventAttendees, checkInRSVP } = require("../controllers/rsvp.controller");

router.post("/", authUser, validateRSVPBody, createRSVP);

router.delete("/:eventId", authUser, validateObjectId('eventId'), cancelRSVP);

router.get("/my", authUser, getMyRSVPs);

router.get("/attendees/:eventId", authUser, validateObjectId('eventId'), getEventAttendees);

// no id validation here on purpose: checkInRSVP already returns a friendly
// "This QR code isn't a valid pass." for malformed ids, which the scanner shows
router.post("/checkin/:rsvpId", authUser, isOrganizer, checkInRSVP);

module.exports = router;