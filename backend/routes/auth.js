const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const JWT_SECRET = 'your_jwt_secret_here';

// Registration
router.post('/register', [ 
  body('name').isLength({ min: 20, max: 60 }),
  body('email').isEmail(),
  body('address').isLength({ max: 400 }),
  body('password').isLength({ min: 8, max: 16 }).matches(/[A-Z]/).matches(/[!@#$%^&*]/),
  body('role').isIn(['SYSTEM_ADMIN', 'NORMAL_USER', 'STORE_OWNER'])
], async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password, address, role } = req.body;
  try {
    const userExists = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    if(userExists.rows.length > 0) return res.status(400).json({ message: 'User exists' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const result = await pool.query('INSERT INTO users (name,email,password_hash,address,role) VALUES ($1,$2,$3,$4,$5) RETURNING id,name,email,address,role', [name, email, hashedPassword, address, role]);

    const token = jwt.sign({ id: result.rows[0].id, role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: result.rows[0] });
  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', [
  body('email').isEmail(),
  body('password').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  try {
    const userResult = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    if(userResult.rows.length === 0) return res.status(400).json({ message: 'Invalid credentials' });

    const user = userResult.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if(!match) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    const { password_hash, ...userData } = user; 
let redirectTo = '/';
if (user.role === 'SYSTEM_ADMIN') {
  redirectTo = '/admin-dashboard';
} else if (user.role === 'STORE_OWNER') {
  redirectTo = '/store-dashboard';
} else if (user.role === 'NORMAL_USER') {
  redirectTo = '/user-dashboard';
}
res.json({ 
  token, 
  user: userData, 
  role: user.role, 
  redirectTo 
});

  } catch(err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
