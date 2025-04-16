const jwt = require('jsonwebtoken');

function authenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization;
  
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
  
      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
  
        req.user = user;
        next();
      });
    } else {
      res.sendStatus(401);
    }
  }
  
  // Middleware to authorize by role
  function authorizeRole(requiredRole) {
    return (req, res, next) => {
      if (req.user && req.user.role === requiredRole) {
        next();
      } else {
        res.status(403).json({ message: 'Access denied. Insufficient role.' });
      }
    };
  }
  
  module.exports = {
    authenticateJWT,
    authorizeRole,  // 
  };