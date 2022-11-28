const express = require('express');

const { registerProgram } = require('../controllers/program-controller');

const router = express.Router();

router.route('/api/programs').get().post(registerProgram);

module.exports = router;
