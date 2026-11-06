const express = require("express");
const router = express.Router();
const { authUser } = require("../middlewares/auth.middleware");
const { isOrganizer } = require("../middlewares/role.middleware");
const { validateCreateEvent, validateUpdateEvent, validateObjectId } = require("../middlewares/validate.middleware");
const { createEvent, getEvents, getEventById, getMyEvents, updateEvent, deleteEvent } = require("../controllers/event.controller");

// "/mine" must stay above "/:id", otherwise Express would treat "mine" as an id
router.get("/mine", authUser, isOrganizer, getMyEvents);

router.get("/", getEvents);

router.get("/:id", validateObjectId('id'), getEventById);

router.post("/", authUser, isOrganizer, validateCreateEvent, createEvent);

router.put("/:id", authUser, isOrganizer, validateObjectId('id'), validateUpdateEvent, updateEvent);

router.delete("/:id", authUser, isOrganizer, validateObjectId('id'), deleteEvent);

module.exports = router;