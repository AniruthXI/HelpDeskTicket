// src/routes/admin.routes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const auth = require('../middleware/auth.middleware');
const isAdmin = require('../middleware/admin.middleware');

router.use(auth, isAdmin);

// Get all users
router.get('/users', adminController.getUsers);

// Get user details
router.get('/users/:id', adminController.getUserDetails);

// Update user role
router.put('/users/:id/role', adminController.updateUserRole);

// Update user status (activate/suspend)
router.put('/users/:id/status', adminController.updateUserStatus);

// Get user tickets
router.get('/users/:id/tickets', adminController.getUserTickets);

router.get("/stats", adminController.getStats);

module.exports = router;