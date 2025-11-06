const http = require('http');
const { createApp } = require('./app');
const { startConsumer } = require('./kafka/consumer');
const { PORT } = require('./config');
const { Server } = require('socket.io');
const logger = require('./utils/logger');
const db = require('./db');

// create HTTP server with express app
const appWrap = createApp(); // passing undefined io; we'll attach io below
const server = http.createServer(appWrap);
const io = new Server(server, { cors: { origin: '*' } });

// attach io to app so that routes/middlewares can access if needed (optional)
appWrap.set('io', io);

io.on('connection', (socket) => {
  logger.info('Socket connected', socket.id);
  socket.on('disconnect', () => logger.info('Socket disconnected', socket.id));
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
