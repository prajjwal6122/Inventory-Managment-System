// src/controllers/authController.js
const { JWT_SECRET } = require("../config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const users = [
  {
    id: 1,
    username: "admin",
    password_hash: bcrypt.hashSync("IamPrajjwal", 10),
    first_name: "prajjwal",
    last_name: "sharma",
    role: "admin",
  },
];

async function login(req, res) {
  const { username, password } = req.body;
  // demo creds
  const user = users.find((u) => u.username === username);
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: "invalid Credentials" });
  }

  const token = jwt.sign(
    {
      userId: user.id,
      username: user.username,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "5h" }
  );
  res.json({ token });
}

module.exports = { login };
