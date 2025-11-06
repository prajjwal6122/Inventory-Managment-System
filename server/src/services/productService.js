const db = require('../db');

/**
 * Helper service to read product summaries for API
 */

async function getAllProductsSummary() {
  const { rows } = await db.query(`SELECT id, name FROM products`);
  const products = [];

  for (const p of rows) {
    const qRes = await db.query(
      `SELECT COALESCE(SUM(remaining_quantity), 0) AS qty,
              COALESCE(SUM(remaining_quantity * unit_price), 0) AS total_cost
       FROM inventory_batches WHERE product_id=$1`,
      [p.id]
    );
    const qty = parseInt(qRes.rows[0].qty || 0, 10);
    const total_cost = parseFloat(qRes.rows[0].total_cost || 0);
    const avg_cost = qty > 0 ? total_cost / qty : 0;
    products.push({ id: p.id, name: p.name, qty, total_cost, avg_cost });
  }

  return products;
}

async function getLedger() {
  const purchases = await db.query(
    `SELECT id, product_id, quantity, unit_price, created_at FROM inventory_batches ORDER BY created_at DESC LIMIT 500`
  );
  const sales = await db.query(
    `SELECT s.id, s.product_id, s.quantity, s.total_cost, s.created_at,
        COALESCE(json_agg(json_build_object('batch_id', sa.batch_id, 'qty', sa.allocated_quantity, 'unit_cost', sa.allocated_unit_cost)) FILTER (WHERE sa.id IS NOT NULL), '[]') AS allocations
     FROM sales s
     LEFT JOIN sale_allocations sa ON sa.sale_id = s.id
     GROUP BY s.id
     ORDER BY s.created_at DESC
     LIMIT 500`
  );

  return { purchases: purchases.rows, sales: sales.rows };
}

module.exports = { getAllProductsSummary, getLedger };
