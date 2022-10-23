const express = require('express');

const { registerDepartment } = require('../controllers/department-controller');

const router = express.Router();

router.route('/api/departments').get().post(registerDepartment);

module.exports = router;
