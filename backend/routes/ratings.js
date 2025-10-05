const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/', async (req, res) => {
  const { user_id, store_id, rating } = req.body;
  try {
    const existing = await pool.query('SELECT * FROM ratings WHERE user_id=$1 AND store_id=$2', [user_id, store_id]);
    if(existing.rows.length > 0) {
      const updated = await pool.query('UPDATE ratings SET rating=$1, updated_at=NOW() WHERE user_id=$2 AND store_id=$3 RETURNING *', [rating,user_id,store_id]);
      res.json(updated.rows[0]);
    } else {
      const inserted = await pool.query('INSERT INTO ratings (user_id,store_id,rating) VALUES ($1,$2,$3) RETURNING *', [user_id,store_id,rating]);
      res.json(inserted.rows[0]);
    }
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
