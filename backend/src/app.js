const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

app.use(express.json());
app.use(cookieParser())

const authRouter = require('./routes/auth.routes');
const eventRouter = require('./routes/event.routes');

app.use('/auth', authRouter);
app.use('/events', eventRouter);

module.exports = app;