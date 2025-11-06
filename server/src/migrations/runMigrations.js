const fs = require('fs');
const path = require('path');
const db = require('../db');
const logger = require('../utils/logger');

(async () => {
  try {
    const sql = fs.readFileSync(path.join(__dirname, '../../schema.sql'), 'utf8');
    await db.query(sql);
    logger.info('Migrations ran successfully');
    process.exit(0);
  } catch (err) {
    logger.error('Migration failed', err);
    process.exit(1);
  }
})();
