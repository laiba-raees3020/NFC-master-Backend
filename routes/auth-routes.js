const express = require('express');

const {
  registerStudent,
  login,
  checkAuth,
} = require('../controllers/auth-controller');

const router = express.Router();

router.route('/api/student/register').post(registerStudent);

router.route('/api/login').post(login);

router.route('/is-logged-in').get(checkAuth);

module.exports = router;
