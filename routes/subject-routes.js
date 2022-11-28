const express = require('express');

const { registerSubject } = require('../controllers/subject-controller');

const router = express.Router();

router.route('/api/subjects').get().post(registerSubject);

module.exports = router;
