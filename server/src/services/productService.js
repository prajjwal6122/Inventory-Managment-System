const db = require('../db');

/**
 * Helper service to read product summaries for API
 */

async function getAllProductsSummary() {
  const res = await db.query(`
    SELECT p.id AS product_id,
           COALESCE(SUM(b.remaining_quantity),0) AS total_quantity,
           ROUND(COALESCE(SUM(b.remaining_quantity * b.unit_price),0)::numeric,2) AS total_cost
    FROM products p
    LEFT JOIN inventory_batches b ON b.product_id = p.id
    GROUP BY p.id
    ORDER BY p.id;
  `);

  return res.rows.map(r => {
    const total_quantity = parseInt(r.total_quantity || 0, 10);
    const total_cost = parseFloat(r.total_cost || 0);
    return {
      product_id: r.product_id,
      product_name: r.product_id, // optional future enhancement
      total_quantity,
      total_cost,
      average_cost: total_quantity > 0 ? +((total_cost / total_quantity).toFixed(2)) : 0,
    };
  });
}


async function getLedger({ limit = 500, since, until } = {}) {
  const purchasesQ = `
    SELECT id, product_id, quantity, unit_price, created_at
    FROM inventory_batches
    WHERE ($1::timestamptz IS NULL OR created_at >= $1)
      AND ($2::timestamptz IS NULL OR created_at <= $2)
    ORDER BY created_at DESC
    LIMIT $3;
  `;

  const salesQ = `
    SELECT s.id,
           s.product_id,
           s.quantity,
           s.total_cost,
           s.created_at,
           json_agg(
             json_build_object(
               'batch_id', sa.batch_id,
               'allocated_quantity', sa.allocated_quantity,
               'allocated_unit_cost', sa.allocated_unit_cost
             )
           ) AS allocations
    FROM sales s
    LEFT JOIN sale_allocations sa ON sa.sale_id = s.id
    WHERE ($1::timestamptz IS NULL OR s.created_at >= $1)
      AND ($2::timestamptz IS NULL OR s.created_at <= $2)
    GROUP BY s.id
    ORDER BY s.created_at DESC
    LIMIT $3;
  `;

  const pRes = await db.query(purchasesQ, [since || null, until || null, limit]);
  const sRes = await db.query(salesQ, [since || null, until || null, limit]);

  return { purchases: pRes.rows, sales: sRes.rows };
}


async function getBatches(product_id) {
  const { rows } = await db.query(`SELECT id, quantity, remaining_quantity, unit_price, created_at FROM inventory_batches WHERE product_id=$1 ORDER BY created_at ASC`, [product_id]);
  return rows;
}

async function getProductSummary(product_id) {
  const q = await db.query(
    `SELECT COALESCE(SUM(remaining_quantity),0) as total_quantity,
            COALESCE(SUM(remaining_quantity * unit_price),0) as total_cost
     FROM inventory_batches WHERE product_id=$1`,
    [product_id]
  );
  const total_quantity = parseInt(q.rows[0].total_quantity || 0, 10);
  const total_cost = parseFloat(q.rows[0].total_cost || 0);
  const average_cost = total_quantity > 0 ? +(total_cost/total_quantity).toFixed(2) : 0;
  return { total_quantity, total_cost, average_cost };
}


module.exports = { getAllProductsSummary, getLedger,getBatches,getProductSummary };
