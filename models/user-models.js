const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    name: String,
    email: String,
    section: String,
    session: String,
    program: String,
    rollNo: String,
    gender: String,
    phoneNo: String,
    password: String,
    avatar: String,
    role: String,
  },
  { timestamps: true }
);

const parentSchema = mongoose.Schema(
  {
    name: String,
    email: String,
    phoneNo: String,
    password: String,
    avatar: String,
  },
  { timestamps: true }
);

module.exports = {
  User: mongoose.model('User', userSchema),
  Parent: mongoose.model('Parent', parentSchema),
};
