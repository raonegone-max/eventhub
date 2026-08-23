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
    // password is only required for accounts created the normal way —
    // a Google sign-in never sets a password, since Google handles that verification
    required: function () {
      return !this.googleId;
    },
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true, // sparse: lets many users have NO googleId without violating uniqueness
  },
  role: {
    type: String,
    enum: ['student', 'organizer'],
    default: 'student',
  },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);