const express = require('express');
const { createStudent, getAllStudents } = require('../controllers/student');
const router = express.Router();



router.route('/students').post(createStudent).get(getAllStudents);

module.exports = router;
