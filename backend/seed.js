const pool = require('./db');
const bcrypt = require('bcryptjs');

async function seed() {
  const password = await bcrypt.hash('Admin123!', 12);

  await pool.query(`
    INSERT INTO users (name,email,address,password_hash,role) VALUES
    ('System Administrator Example', 'admin@example.com', 'Admin Address', $1, 'SYSTEM_ADMIN'),
    ('Normal User Example', 'user@example.com', 'User Address', $1, 'NORMAL_USER'),
    ('Store Owner Example', 'owner@example.com', 'Owner Address', $1, 'STORE_OWNER')
  `, [password]);

  await pool.query(`
    INSERT INTO stores (name,email,address,owner_id) VALUES
    ('Store One', 'store1@example.com', '123 Main St', 3),
    ('Store Two', 'store2@example.com', '456 Elm St', 3)
  `);

  await pool.query(`
    INSERT INTO ratings (user_id,store_id,rating) VALUES
    (2, 1, 4),
    (2, 2, 5)
  `);

  console.log('Seeding complete');
  process.exit();
}

seed().catch(console.error);
