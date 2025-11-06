const express = require('express');
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');

function createApp(io) {
  const app = express();
  app.use(express.json());

  app.get('/health', (req, res) => res.json({ ok: true }));

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
