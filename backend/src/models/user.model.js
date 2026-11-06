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
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId;
    },
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true, 
  },
  role: {
    type: String,
    enum: ['student', 'organizer'],
    default: 'student',
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);