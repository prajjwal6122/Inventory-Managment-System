// src/controllers/ledgerController.js
const productService = require('../services/productService');

async function getLedger(req, res) {
  try {
    const limit = parseInt(req.query.limit || '500', 10);
    const since = req.query.since;
    const until = req.query.until;
    const data = await productService.getLedger({ limit, since, until });
    return res.json(data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'internal' });
  }
}

module.exports = { getLedger };
