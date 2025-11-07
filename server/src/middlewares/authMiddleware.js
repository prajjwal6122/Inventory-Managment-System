// src/middlewares/authMiddleware.js
const { DASH_TOKEN } = require('../config');

function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid token' });
  }
  const token = auth.split(' ')[1];
  if (token !== DASH_TOKEN) {
    return res.status(403).json({ error: 'Unauthorized' });
  }
  next();
}

module.exports = { requireAuth };
