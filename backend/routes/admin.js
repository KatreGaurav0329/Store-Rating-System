const express = require('express');
const router = express.Router();
const { listUsers, createUser } = require('../controllers/adminController');
const authenticate = require('../middlewares/authenticate');  // Your JWT/auth middleware
const authorize = require('../middlewares/authorize');        // Middleware checking roles
const { UserRole } = require('../utils/constants');

router.get('/users', authenticate, authorize([UserRole.SYSTEM_ADMIN]), listUsers);
router.post('/users', authenticate, authorize([UserRole.SYSTEM_ADMIN]), createUser);

module.exports = router;
