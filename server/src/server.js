const http = require('http');
const { createApp } = require('./app');
const { startConsumer } = require('./kafka/consumer');
const { PORT } = require('./config');
const { Server } = require('socket.io');
const logger = require('./utils/logger');
const db = require('./db');
const express=require('express')
const path = require("path");

// create HTTP server with express app
const appWrap = createApp(); // passing undefined io; we'll attach io below
const server = http.createServer(appWrap);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3001", 
      "https://fifo-inventory-managment-system.onrender.com"
    ],
    methods: ["GET", "POST"],
  },
});

// attach io to app so that routes/middlewares can access if needed (optional)
appWrap.set('io', io);

io.on('connection', (socket) => {
  logger.info('Socket connected', socket.id);
  socket.on('disconnect', () => logger.info('Socket disconnected', socket.id));
});


// Serve the static files from React build folder
appWrap.use(express.static(path.join(__dirname, "../../client/build")));

// Handle any unknown routes by returning index.html
appWrap.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../../client/build", "index.html"));
});


// run DB migrations before starting
(async () => {
  try {
    // ensure db reachable
    await db.query('SELECT 1');
    // start kafka consumer (consumer will emit inventory_event over io)
    startConsumer(io).catch(err => {
      logger.error('Kafka consumer error', err);
    });

    server.listen(PORT, () => {
      logger.info(`Server listening on ${PORT}`);
    });
  } catch (err) {
    logger.error('Failed to initialize server', err);
    process.exit(1);
  }
})();
