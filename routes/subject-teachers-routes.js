const express = require('express');

const {
  registerSubjectTeachers,
} = require('../controllers/subject-teachers-controller');

const router = express.Router();

router.route('/api/subject-teachers').get().post(registerSubjectTeachers);

module.exports = router;
