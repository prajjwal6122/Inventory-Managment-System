
const express = require('express');
const router = express.Router();
const { DASH_TOKEN } = require('../config');
const { login } = require('../controllers/authController');

router.post('/login',login);

module.exports = router;
