const { Pool } = require('pg');
const { DATABASE_URL } = require('../config');

const pool = new Pool({
  connectionString: DATABASE_URL
});

pool.on('error', (err) => {
  console.error('Unexpected PG client error', err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
  pool
};
