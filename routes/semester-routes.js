const express = require('express');

const { registerSemester } = require('../controllers/semester-controller');

const router = express.Router();

router.route('/api/semesters').get().post(registerSemester);

module.exports = router;
