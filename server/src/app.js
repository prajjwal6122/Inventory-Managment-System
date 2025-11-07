const express = require('express');
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');
const cors = require("cors");


function createApp(io) {
  const app = express();
  app.use(express.json());


// Detect origin automatically
const allowedOrigins = [
  "http://localhost:3001", // for local dev
  "https://fifo-inventory-managment-system.onrender.com" // your Render frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

  app.get('/health', (req, res) => res.json({ ok: true }));
  app.use("/", apiRoutes);
  app.use('/api', apiRoutes);
  app.use('/auth', authRoutes);

  // error handler
  app.use((err, req, res, next) => {
    console.error('Unhandled error', err);
    res.status(500).json({ error: 'internal' });
  });

  return app;
}

module.exports = { createApp };
