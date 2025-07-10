const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  socketId: { type: String },
  online: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);