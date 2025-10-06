module.exports = (allowedRoles = []) => {
  return (req, res, next) => {
    // Authenticate middleware should set req.user
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: 'Forbidden: No user or role' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }
    next();
  };
};
