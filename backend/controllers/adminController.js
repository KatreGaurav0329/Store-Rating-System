const db = require('../db'); // your DB connection

const listUsers = async (req, res) => {
  try {
    const { name, email, address, role, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    const filters = [];
    const values = [];

    let idx = 1;

    if (name) {
      filters.push(`name ILIKE '%' || $${idx} || '%'`);
      values.push(name);
      idx++;
    }
    if (email) {
      filters.push(`email ILIKE '%' || $${idx} || '%'`);
      values.push(email);
      idx++;
    }
    if (address) {
      filters.push(`address ILIKE '%' || $${idx} || '%'`);
      values.push(address);
      idx++;
    }
    if (role) {
      filters.push(`role = $${idx}`);
      values.push(role);
      idx++;
    }

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

    const queryText = `
      SELECT id, name, email, address, role
      FROM users
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${idx} OFFSET $${idx + 1}
    `;
    values.push(limit);
    values.push(offset);

    const usersResult = await db.query(queryText, values);
    const countResult = await db.query(`SELECT COUNT(*) FROM users ${whereClause}`, values.slice(0, idx - 1));

    res.json({
      users: usersResult.rows,
      total: parseInt(countResult.rows[0].count, 10),
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    });
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body;
    // Add your validation and password hash logic here

    // Example: check email uniqueness
    const emailCheck = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (emailCheck.rowCount > 0) return res.status(409).json({ message: 'Email already exists' });

    // Hash password (example with bcrypt)
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(password, 10);

    const insertQuery = `INSERT INTO users (name, email, password, address, role) 
                         VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, address, role`;

    const result = await db.query(insertQuery, [name, email, hashedPassword, address, role]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { listUsers, createUser };
