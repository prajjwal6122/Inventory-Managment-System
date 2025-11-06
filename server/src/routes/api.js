const express = require('express');
const router = express.Router();
const { getProducts, getLedger } = require('../controllers/productController');
const { requireAuth } = require('../middlewares/authMiddleware');
const { produceEvent } = require('../kafka/producer');

// Protected endpoints
router.get('/products', requireAuth, getProducts);
router.get('/ledger', requireAuth, getLedger);

// endpoint to fire a simulator event from frontend (for convenience)
router.post('/simulate', requireAuth, async (req, res) => {
  try {
    const { events } = req.body; // array of event objects
    if (!Array.isArray(events)) return res.status(400).json({ error: 'events must be array' });

    for (const ev of events) {
      await produceEvent(ev);
    }
    res.json({ ok: true });
  } catch (err) {
    console.error('simulate error', err);
    res.status(500).json({ error: 'internal' });
  }
});

module.exports = router;
