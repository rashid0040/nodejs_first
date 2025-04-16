const express = require('express');
const User = require('../models/user');
const { authenticateJWT, authorizeRole } = require('../middleware/authMiddleware');
const router = express.Router();

// update user role (only for admin)

router.put('/:id/role', authenticateJWT, authorizeRole('admin'), async (req, res) => {
    try {
      const { id } = req.params;
      const { role } = req.body;
  
      // Prevent admin from modifying their own role
      if (req.user.id === id) {
        return res.status(403).json({ message: "You can't change your own role." });
      }
  
      const user = await User.findByIdAndUpdate(id, { role }, { new: true });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      res.json({ message: 'User role updated.', user });
    } catch (err) {
      res.status(500).json({ message: 'Server error.', error: err.message });
    }
  });

router.delete('/:id', authenticateJWT, authorizeRole('admin'), async (req, res) => {
    try {
      const { id } = req.params;
      
        console.log("In API")
      // Prevent admin from deleting themselves
      if (req.user.id === id) {
        return res.status(403).json({ message: "You can't Delete your ownself." });
      }
  
      const deleteduser = await User.findByIdAndDelete(id);
  
      if (!deleteduser) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      res.json({ message: 'User deleted.' });
    } catch (err) {
      res.status(500).json({ message: 'Server error.', error: err.message });
    }
  });
  
  router.get('/', authenticateJWT, authorizeRole('admin'), async (req, res) => {
    try {
      const users = await User.find().select('-password'); // exclude passwords
      res.status(200).json(users);
    } catch (err) {
      res.status(500).send('Server error');
    }
  });

module.exports = router;