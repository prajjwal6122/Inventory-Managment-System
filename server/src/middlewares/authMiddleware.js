// src/middlewares/authMiddleware.js
const { JWT_SECRET } = require("../config");
const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid token" });
  }
  const token = auth.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "invalid or expired token" });
  }
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ error: "Permission Not allowed" });
    }
    next();
  };
}

module.exports = { requireAuth, requireRole };
