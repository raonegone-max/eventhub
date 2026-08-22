const mongoose = require('mongoose');

// serverless functions can spin up a fresh instance per request, so we cache
// the connection on the module itself — if a warm instance already has one,
// reuse it instead of opening a new connection every single time (which would
// quickly exhaust MongoDB Atlas's connection limit)
let isConnected = false;

async function connectToDB() {
    if (isConnected) {
        return;
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        isConnected = true;
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

module.exports = connectToDB;