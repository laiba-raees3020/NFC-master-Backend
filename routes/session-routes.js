const express = require('express');

const { registerSession } = require('../controllers/session-controller');

const router = express.Router();

router.route('/api/sessions').get().post(registerSession);

module.exports = router;
