// src/controllers/authController.js
const { DASH_TOKEN } = require('../config');

async function login(req, res) {
  const { username, password } = req.body;
  // demo creds
  if (username === 'admin' && password === 'password') {
    return res.json({ token: DASH_TOKEN });
  }
  return res.status(401).json({ error: 'invalid credentials' });
}

module.exports = { login };
