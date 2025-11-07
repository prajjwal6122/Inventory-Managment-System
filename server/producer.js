/**
 * producer.js
 * ------------
 * Standalone simulator script for generating and sending
 * dummy inventory-events to Kafka.
 *
 * Usage:
 *    node producer.js
 */

require('dotenv').config();
const { produceEvent, connectProducer, disconnectProducer } = require('./src/kafka/producer');

// --- Generate some realistic dummy events ---
function generateEvents() {
  const now = new Date();
  const events = [
    {
      product_id: 'PRD001',
      event_type: 'purchase',
      quantity: 100,
      unit_price: 50.0,
      timestamp: now.toISOString(),
    },
    {
      product_id: 'PRD001',
      event_type: 'purchase',
      quantity: 50,
      unit_price: 55.0,
      timestamp: now.toISOString(),
    },
    {
      product_id: 'PRD001',
      event_type: 'sale',
      quantity: 80,
      timestamp: now.toISOString(),
    },
    {
      product_id: 'PRD002',
      event_type: 'purchase',
      quantity: 200,
      unit_price: 20.0,
      timestamp: now.toISOString(),
    },
    {
      product_id: 'PRD002',
      event_type: 'sale',
      quantity: 30,
      timestamp: now.toISOString(),
    },
  ];

  // Add random extra transactions
  for (let i = 0; i < 3; i++) {
    const pid = `PRD00${Math.ceil(Math.random() * 3)}`;
    const isPurchase = Math.random() > 0.5;
    events.push({
      product_id: pid,
      event_type: isPurchase ? 'purchase' : 'sale',
      quantity: Math.floor(Math.random() * 50) + 10,
      ...(isPurchase && { unit_price: Math.floor(Math.random() * 100) + 20 }),
      timestamp: new Date().toISOString(),
    });
  }

  return events;
}

// --- Main Runner ---
async function runProducer() {
  try {
    console.log('🔗 Connecting Kafka producer...');
    await connectProducer();

    const events = generateEvents();
    console.log(`🚀 Sending ${events.length} inventory-events...`);

    for (const event of events) {
      await produceEvent(event);
      console.log('📦 Sent:', event);
      await new Promise((res) => setTimeout(res, 500)); // 0.5s delay
    }

    console.log('✅ All events sent successfully!');
  } catch (err) {
    console.error('❌ Producer error:', err.message || err);
  } finally {
    await disconnectProducer();
    console.log('🔌 Producer disconnected.');
  }
}

// --- Execute ---
runProducer();
