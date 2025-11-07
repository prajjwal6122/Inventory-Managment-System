// src/controllers/ledgerController.js
const productService = require('../services/productService');

async function getLedger(req, res) {
  try {
    const data = await productService.getLedger();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { getLedger };
