const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();

// FRONTEND_URL is set in your .env locally (http://localhost:5173) and in
// Render's dashboard for production (your real Vercel URL) — this way the
// same code works in both places without editing anything by hand
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}))
app.use(express.json());
app.use(cookieParser())

const authRouter = require('./routes/auth.routes');
const eventRouter = require('./routes/event.routes');
const rsvpRouter = require('./routes/rsvp.routes');

app.use('/auth', authRouter);
app.use('/events', eventRouter);
app.use('/rsvp', rsvpRouter);

module.exports = app;