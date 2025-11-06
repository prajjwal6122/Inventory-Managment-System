/**
 * fifoService
 * - processPurchase: inserts batch
 * - processSale: consumes batches FIFO with DB transaction + SELECT FOR UPDATE
 *
 * Policy: sale is rejected if insufficient stock. You may change to allow negative stock/backorder.
 */

const db = require('../db');
const logger = require('../utils/logger');

async function processPurchase({ product_id, quantity, unit_price, timestamp }) {
  const client = await db.getClient();
  try {
    await client.query('BEGIN');

    // ensure product exists
    await client.query(
      `INSERT INTO products (id, name) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING`,
      [product_id, product_id]
    );

    const insertText = `
      INSERT INTO inventory_batches (product_id, quantity, remaining_quantity, unit_price, created_at)
      VALUES ($1, $2, $2, $3, $4)
      RETURNING id
    `;
    const res = await client.query(insertText, [product_id, quantity, unit_price, timestamp]);
    await client.query('COMMIT');
    logger.info('Purchase processed', { batchId: res.rows[0].id, product_id, quantity, unit_price });
    return { ok: true, batchId: res.rows[0].id };
  } catch (err) {
    await client.query('ROLLBACK');
    logger.error('processPurchase error', err);
    throw err;
  } finally {
    client.release();
  }
}

async function processSale({ product_id, quantity, timestamp }) {
  const client = await db.getClient();
  try {
    await client.query('BEGIN');

    // check product exists
    const prod = await client.query(`SELECT id FROM products WHERE id = $1`, [product_id]);
    if (prod.rowCount === 0) {
      throw new Error('Product not found');
    }

    // create sale record (total_cost will be updated after allocations)
    const saleRes = await client.query(
      `INSERT INTO sales (product_id, quantity, total_cost, created_at) VALUES ($1,$2,$3,$4) RETURNING id`,
      [product_id, quantity, 0, timestamp]
    );
    const saleId = saleRes.rows[0].id;

    // fetch batches FIFO and lock them
    const batchesRes = await client.query(
      `SELECT id, remaining_quantity, unit_price FROM inventory_batches
        WHERE product_id = $1 AND remaining_quantity > 0
        ORDER BY created_at ASC
        FOR UPDATE`,
      [product_id]
    );

    let needed = quantity;
    let totalCost = 0;

    for (const b of batchesRes.rows) {
      if (needed <= 0) break;
      const take = Math.min(b.remaining_quantity, needed);

      await client.query(
        `INSERT INTO sale_allocations (sale_id, batch_id, allocated_quantity, allocated_unit_cost)
          VALUES ($1,$2,$3,$4)`,
        [saleId, b.id, take, b.unit_price]
      );

      await client.query(
        `UPDATE inventory_batches SET remaining_quantity = remaining_quantity - $1 WHERE id = $2`,
        [take, b.id]
      );

      totalCost += parseFloat(b.unit_price) * take;
      needed -= take;
    }

    if (needed > 0) {
      // policy: reject sale if insufficient stock
      throw new Error('Insufficient stock to fulfill sale');
    }

    await client.query(`UPDATE sales SET total_cost = $1 WHERE id = $2`, [totalCost, saleId]);
    await client.query('COMMIT');

    logger.info('Sale processed', { saleId, product_id, quantity, totalCost });
    return { saleId, totalCost };
  } catch (err) {
    await client.query('ROLLBACK');
    logger.error('processSale error', err.message || err);
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { processPurchase, processSale };
