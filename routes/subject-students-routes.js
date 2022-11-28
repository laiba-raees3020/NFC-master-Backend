const express = require('express');

const {
  registerSubjectStudents,
} = require('../controllers/subject-students-controllers');

const router = express.Router();

router.route('/api/subject-students').get().post(registerSubjectStudents);

module.exports = router;
