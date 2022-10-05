const express = require('express');

const { registerStudent, login } = require('../controllers/auth-controller');

const router = express.Router();

router.route('/api/student/register').post(registerStudent);

router.route('/login').post(login);

module.exports = router;
