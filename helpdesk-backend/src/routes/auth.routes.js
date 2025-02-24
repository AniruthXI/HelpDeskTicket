// src/routes/auth.routes.js
const express = require('express');
const router = express.Router();
const User = require('../models/user.model');
const auth = require('../middleware/auth.middleware');
const isAdmin = require('../middleware/admin.middleware');
const upload = require('../middleware/upload.middleware');
const { sendResetPasswordEmail } = require('../services/email.service');
const jwt = require('jsonwebtoken'); // เพิ่ม import jwt


/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 */
// src/routes/auth.routes.js
// Register route
router.post('/register', async (req, res) => {
    try {
      const { username, email, password } = req.body;
      console.log('Registration attempt:', { username, email });
  
      // Check if user already exists
      const existingUser = await User.findOne({ 
        $or: [{ email }, { username }] 
      });
  
      if (existingUser) {
        return res.status(400).json({ 
          error: 'Username or email already exists' 
        });
      }
  
      // Create new user
      const user = new User({ username, email, password });
      await user.save();
  
      // Generate token
      const token = jwt.sign(
        { userId: user._id }, 
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
  
      res.status(201).json({
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        token
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(400).json({ error: error.message });
    }
  });

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 */
// Login route
router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      // Generate token
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
  
      res.json({
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        token
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 */
// Get current user
router.get('/me', auth, async (req, res) => {
    res.json({
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role
      }
    });
  });

// Forgot Password
router.post('/forgot-password', async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const resetToken = user.generateResetPasswordToken();
      await user.save();
  
      await sendResetPasswordEmail(user.email, resetToken);
      res.json({ message: 'Reset password email sent' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Reset Password
router.post('/reset-password/:token', async (req, res) => {
    try {
      const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
      });
  
      if (!user) {
        return res.status(400).json({ error: 'Invalid or expired token' });
      }
  
      user.password = req.body.password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();
  
      res.json({ message: 'Password reset successful' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Update Profile
router.put('/profile', auth, async (req, res) => {
    try {
      const updates = {};
      if (req.body.username) updates.username = req.body.username;
      if (req.body.email) updates.email = req.body.email;
      if (req.body.password) updates.password = req.body.password;
  
      const user = await User.findByIdAndUpdate(
        req.user._id,
        updates,
        { new: true, runValidators: true }
      );
  
      res.json({ user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage
      }});
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
  // Upload Profile Image
  router.post('/profile/image', auth, upload.single('image'), async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.user._id,
        { profileImage: req.file.path },
        { new: true }
      );
  
      res.json({ profileImage: user.profileImage });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
  // Admin Routes
  router.get('/users', auth, isAdmin, async (req, res) => {
    try {
      const users = await User.find().select('-password');
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  
  router.put('/users/:id', auth, isAdmin, async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      ).select('-password');
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
  router.delete('/users/:id', auth, isAdmin, async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { isActive: false },
        { new: true }
      );
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.json({ message: 'User deactivated successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

module.exports = router;