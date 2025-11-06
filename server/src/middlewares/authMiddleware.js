const { DASH_TOKEN } = require('../config');

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'missing authorization' });
  const token = authHeader.replace('Bearer ', '');
  if (token !== DASH_TOKEN) return res.status(403).json({ error: 'invalid token' });
  next();
}

module.exports = { requireAuth };
