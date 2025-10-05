const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/', async (req, res) => {
  const { name, email, address, owner_id } = req.body;
  try {
    const result = await pool.query('INSERT INTO stores (name,email,address,owner_id) VALUES ($1,$2,$3,$4) RETURNING *', [name,email,address,owner_id]);
    res.json(result.rows[0]);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT s.*, u.name as owner_name FROM stores s LEFT JOIN users u ON s.owner_id = u.id');
    res.json(result.rows);
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
