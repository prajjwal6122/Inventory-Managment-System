const productService = require('../services/productService');

async function getProducts(req, res) {
  try {
    const products = await productService.getAllProductsSummary();
    return res.json(products);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'internal' });
  }
}

async function getLedger(req, res) {
  try {
    const ledger = await productService.getLedger();
    return res.json(ledger);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'internal' });
  }
}

module.exports = { getProducts, getLedger };
