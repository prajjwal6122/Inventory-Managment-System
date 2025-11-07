/**
 * src/kafka/producer.js
 * Safe Kafka producer for Confluent Cloud or local Kafka.
 */

const { Kafka } = require('kafkajs');
const logger = require('../utils/logger');

// --- Read env vars directly (do not destructure) ---
const brokersEnv = process.env.KAFKA_BROKERS;
const usernameEnv = process.env.KAFKA_USERNAME;
const passwordEnv = process.env.KAFKA_PASSWORD;

// --- Defensive parse ---
let brokers;
try {
  if (Array.isArray(brokersEnv)) {
    brokers = brokersEnv;
  } else if (typeof brokersEnv === 'string') {
    brokers = brokersEnv.split(',').map((b) => b.trim());
  } else {
    throw new Error(`Invalid type for KAFKA_BROKERS: ${typeof brokersEnv}`);
  }
} catch (e) {
  console.error('❌ Failed to parse KAFKA_BROKERS:', brokersEnv, e);
  process.exit(1);
}

console.log('✅ Parsed Kafka brokers:', brokers);

// --- Create Kafka client ---
const kafka = new Kafka({
  clientId: 'im-fifo-backend',
  brokers,
  ssl: true,
  sasl: {
    mechanism: 'plain',
    username: usernameEnv,
    password: passwordEnv,
  },
});

const producer = kafka.producer();
let connected = false;

async function connectProducer() {
  if (!connected) {
    await producer.connect();
    connected = true;
    logger.info('Kafka producer connected');
  }
}

async function produceEvent(event) {
  try {
    await connectProducer();
    await producer.send({
      topic: 'inventory-events',
      messages: [{ value: JSON.stringify(event) }],
    });
    logger.info('Produced event', event);
  } catch (err) {
    logger.error('Kafka produceEvent error:', err.message || err);
    throw err;
  }
}

async function disconnectProducer() {
  if (connected) {
    await producer.disconnect();
    connected = false;
    logger.info('Kafka producer disconnected');
  }
}

module.exports = { produceEvent, connectProducer, disconnectProducer };
