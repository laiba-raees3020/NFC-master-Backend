const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  rollNo: {
    type: String,
    required: true
  },
  registrationNo: {
    type: String,
    required: true
  },
  serialNo: {
    type: String,
    required: true
  },
  session: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  fatherName: {
    type: String,
    required: true
  },
  Department: {
    type: String,
    required: true
  },
  cgpa: {
    type: String,
    required: true
  },
  grade: {
    type: String,
    required: true
  },
  dateOfCompletion: {
    type: Date,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;
