const express = require("express");
const router = express.Router();
const { authUser } = require("../middlewares/auth.middleware");
const { createEvent, getEvents, getEventById, updateEvent, deleteEvent } = require("../controllers/event.controller");

router.get("/", getEvents);

router.get("/:id", getEventById);

router.post("/", authUser, createEvent);

router.put("/:id", authUser, updateEvent);

router.delete("/:id", authUser, deleteEvent);

module.exports = router;