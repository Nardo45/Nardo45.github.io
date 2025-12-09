// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String },
  birthday: { type: Date }
});

// Hash password before saving (async/promise style)
userSchema.pre('save', async function () {
  // only hash when password was changed or is new
  if (!this.isModified('password')) return;
  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
});

// Compare password for login
userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
