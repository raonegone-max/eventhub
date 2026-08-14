const mongoose = require('mongoose');
async function connectToDB() {
   await mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('Connected to MongoDB'))
        .catch((error) => console.error('Error connecting to MongoDB:', error));
}

module.exports = connectToDB;