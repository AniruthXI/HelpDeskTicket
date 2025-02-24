// src/middleware/admin.middleware.js
const isAdmin = async (req, res, next) => {
    try {
      if (req.user && req.user.role === 'admin') {
        next();
      } else {
        res.status(403).json({ error: 'Access denied. Admin only.' });
      }
    } catch (error) {
      res.status(401).json({ error: 'Please authenticate.' });
    }
  };
  
  module.exports = isAdmin;