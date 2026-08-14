// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true, // store the HASH, never the plain password
  },
  role: {
    type: String,
    enum: ['student', 'organizer'],
    default: 'student',
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);