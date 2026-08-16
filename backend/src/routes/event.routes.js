const express = require("express");
const router = express.Router();
const { authUser } = require("../middlewares/auth.middleware");
const { isOrganizer } = require("../middlewares/role.middleware");
const { createEvent, getEvents, getEventById, getMyEvents, updateEvent, deleteEvent } = require("../controllers/event.controller");

router.get("/mine", authUser, isOrganizer, getMyEvents);

router.get("/", getEvents);

router.get("/:id", getEventById);

router.post("/", authUser, isOrganizer, createEvent);

router.put("/:id", authUser, isOrganizer, updateEvent);

router.delete("/:id", authUser, isOrganizer, deleteEvent);

module.exports = router;