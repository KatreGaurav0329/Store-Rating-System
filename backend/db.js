const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'storerating',
  password: '032903',
  port: 5432,
});
module.exports = pool;
