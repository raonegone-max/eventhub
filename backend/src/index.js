require('dotenv').config();
const app = require('./app');
const connectToDB = require('./config/database');

// connect once when this function instance starts up. on a "warm" invocation
// (Vercel reusing an existing instance for a quick second request), this
// resolves instantly because of the isConnected cache in database.js
connectToDB();

// CRITICAL: no app.listen() here. Vercel's @vercel/node runtime wraps this
// exported Express app itself and calls it per-request — app.listen() is what
// a traditional always-on server (like Render) needs, but on Vercel it would
// either do nothing useful or actively break the serverless model
module.exports = app;