
const express = require('express');
const router = express.Router();
const { DASH_TOKEN } = require('../config');

router.post('/login', (req, res) => {
  const { username, password } = req?.body;
  // demo credentials — replace with real user store later
  if (username === 'admin' && password === 'password') {
    return res.json({ token: DASH_TOKEN });
  }
  return res.status(401).json({ error: 'invalid credentials' });
});

module.exports = router;
