// src/controllers/auditController.js
const db = require('../db');

async function getBatches(req, res) {
  try {
    const product_id = req.query.product_id;
    const limit = parseInt(req.query.limit || '100', 10);
    const where = product_id ? 'WHERE product_id = $1' : '';
    const params = product_id ? [product_id] : [];
    const { rows } = await db.query(
      `SELECT id, product_id, quantity, remaining_quantity, unit_price, created_at
       FROM inventory_batches ${where}
       ORDER BY created_at DESC
       LIMIT $${params.length+1}`, [...params, limit]
    );
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'internal' });
  }
}

async function getSaleDetail(req, res) {
  try {
    const id = req.params.id;
    const sale = await db.query('SELECT id, product_id, quantity, total_cost, created_at FROM sales WHERE id = $1', [id]);
    if (sale.rowCount === 0) return res.status(404).json({ error: 'not found' });
    const allocations = await db.query('SELECT batch_id, allocated_quantity, allocated_unit_cost FROM sale_allocations WHERE sale_id = $1', [id]);
    return res.json({ ...sale.rows[0], allocations: allocations.rows });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'internal' });
  }
}

module.exports = { getBatches, getSaleDetail };
