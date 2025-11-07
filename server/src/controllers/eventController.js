// src/controllers/eventController.js
const fifoService = require('../services/fifoService');
const { produceEvent } = require('../kafka/producer');

async function postPurchase(req, res) {
  try {
    const { product_id, quantity, unit_price, timestamp } = req.body;
    if (!product_id || !quantity || !unit_price) return res.status(400).json({ error: 'missing fields' });
    // use fifoService to create batch directly
    const result = await fifoService.processPurchase({ product_id, quantity, unit_price, timestamp: timestamp || new Date().toISOString() });
    return res.json({ ok: true, batchId: result.batchId });
  } catch (err) {
    console.error('postPurchase', err);
    return res.status(500).json({ error: err.message || 'internal' });
  }
}

async function postSale(req, res) {
  try {
    const { product_id, quantity, timestamp } = req.body;
    if (!product_id || !quantity) return res.status(400).json({ error: 'missing fields' });
    const result = await fifoService.processSale({ product_id, quantity, timestamp: timestamp || new Date().toISOString() });
    return res.json({ ok: true, saleId: result.saleId, total_cost: result.totalCost });
  } catch (err) {
    console.error('postSale', err);
    return res.status(400).json({ error: err.message || 'internal' });
  }
}

async function simulate(req, res) {
  try {
    // body: { count: 10 } or none
    const count = parseInt(req.body?.count || req.query?.count || '10', 10);
    const products = ['PRD001','PRD002','PRD003'];
    const events = [];
    for (let i=0;i<count;i++) {
      const pid = products[Math.floor(Math.random()*products.length)];
      const isPurchase = Math.random() > 0.4; // ~60% purchases
      if (isPurchase) {
        const qty = Math.floor(Math.random()*100)+1;
        const price = Math.floor(Math.random()*200)+10;
        events.push({ product_id: pid, event_type: 'purchase', quantity: qty, unit_price: price, timestamp: new Date().toISOString()});
      } else {
        const qty = Math.floor(Math.random()*50)+1;
        events.push({ product_id: pid, event_type: 'sale', quantity: qty, timestamp: new Date().toISOString()});
      }
    }
    // produce events sequentially (or in parallel)
    for (const e of events) {
      await produceEvent(e);
      await new Promise(r=>setTimeout(r, 200)); // brief pause so backend processes sequentially
    }
    return res.json({ ok: true, produced: events.length });
  } catch (err) {
    console.error('simulate', err);
    return res.status(500).json({ error: 'internal' });
  }
}

module.exports = { postPurchase, postSale, simulate };
