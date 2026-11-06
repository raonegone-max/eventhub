const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const app = express();

// Render (and most hosts) put a proxy in front of the app. Without this,
// every request looks like it comes from the proxy's IP, so rate limiting
// would treat ALL users as one person.
app.set('trust proxy', 1);

app.use(helmet());


app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}))

// Health check for UptimeRobot. Kept ABOVE the rate limiter and body parsers
// so monitoring pings are never blocked.
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'online' });
});

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser())

// general limit for the whole API
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { message: "Too many requests, please try again later." }
});

// much stricter limit on login/register to slow down password guessing
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { message: "Too many attempts, please try again in a few minutes." }
});

app.use(apiLimiter);

const authRouter = require('./routes/auth.routes');
const eventRouter = require('./routes/event.routes');
const rsvpRouter = require('./routes/rsvp.routes');

app.use('/auth/login', authLimiter);
app.use('/auth/register', authLimiter);

app.use('/auth', authRouter);
app.use('/events', eventRouter);
app.use('/rsvp', rsvpRouter);

// unknown routes -> clean JSON 404 instead of Express's HTML page
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// malformed JSON bodies and any other uncaught error end up here
app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ message: "Invalid JSON in request body" });
    }
    if (err.type === 'entity.too.large') {
        return res.status(413).json({ message: "Request body too large" });
    }
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
});

module.exports = app;