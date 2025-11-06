const { Kafka } = require('kafkajs');
const { KAFKA_BROKERS } = require('../config');
const fifoService = require('../services/fifoService');
const logger = require('../utils/logger');

const kafka = new Kafka({
  clientId: 'im-consumer',
  brokers: KAFKA_BROKERS
});

const consumer = kafka.consumer({ groupId: 'im-fifo-group' });

async function startConsumer(io) {
  await consumer.connect();
  await consumer.subscribe({ topic: 'inventory-events', fromBeginning: false });
  logger.info('Kafka consumer connected and subscribed to inventory-events');

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const event = JSON.parse(message.value.toString());
        const { product_id, event_type, quantity, unit_price, timestamp } = event;
        logger.info('Received event', event);

        if (event_type === 'purchase') {
          const res = await fifoService.processPurchase({
            product_id,
            quantity,
            unit_price,
            timestamp: timestamp || new Date().toISOString()
          });
          io.emit('inventory_event', { type: 'purchase', product_id, quantity, unit_price, timestamp });
        } else if (event_type === 'sale') {
          const res = await fifoService.processSale({
            product_id,
            quantity,
            timestamp: timestamp || new Date().toISOString()
          });
          io.emit('inventory_event', { type: 'sale', product_id, quantity, total_cost: res.totalCost, timestamp });
        } else {
          logger.warn('Unknown event_type', event_type);
        }
      } catch (err) {
        logger.error('Error processing Kafka message', err.message || err);
        // depending on requirement we might want to rethrow to let Kafka retry
      }
    }
  });
}

module.exports = { startConsumer };
