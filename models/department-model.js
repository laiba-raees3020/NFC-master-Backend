const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    department_name: String,
    department_abbreviation: String,
    no_of_programs: Number,
    location: {
      lat: Number,
      lng: Number,
    },
    change_history: [],
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
