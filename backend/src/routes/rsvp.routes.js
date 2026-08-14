const express = require("express");
const router = express.Router();
const { authUser } = require("../middlewares/auth.middleware");
const { createRSVP, cancelRSVP, getMyRSVPs, getEventAttendees } = require("../controllers/rsvp.controller");

router.post("/", authUser, createRSVP);

router.delete("/:eventId", authUser, cancelRSVP);

router.get("/my", authUser, getMyRSVPs);

router.get("/attendees/:eventId", authUser, getEventAttendees);

module.exports = router;