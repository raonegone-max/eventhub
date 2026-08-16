const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json());
app.use(cookieParser())

const authRouter = require('./routes/auth.routes');
const eventRouter = require('./routes/event.routes');
const rsvpRouter = require('./routes/rsvp.routes');

app.use('/auth', authRouter);
app.use('/events', eventRouter);
app.use('/rsvp', rsvpRouter);

module.exports = app;