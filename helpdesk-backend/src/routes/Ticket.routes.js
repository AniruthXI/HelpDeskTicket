// src/routes/ticket.routes.js
const express = require('express');
const router = express.Router();
const Ticket = require('../models/ticket.model');
const auth = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');
const isAdmin = require('../middleware/admin.middleware');
const ticketController = require('../controllers/ticket.controller');
const adminController = require('../controllers/admin.controller')


// Get all tickets
router.get('/', async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate('createdBy', 'username email')
      .sort({ createdAt: -1 });
    
    console.log('Found tickets:', tickets); // Debug log
    res.json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create new ticket
router.post('/', async (req, res) => {
  try {
    const ticket = new Ticket({
      ...req.body,
      createdBy: req.user._id  // จาก auth middleware
    });

    await ticket.save();
    await ticket.populate('createdBy', 'username email');

    res.status(201).json(ticket);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get single ticket
router.get('/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('createdBy', 'username email');
    
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update ticket
router.put('/:id', async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    ).populate('createdBy', 'username email');

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json(ticket);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Upload attachments
router.post('/:id/attachments', upload.array('files', 5), async (req, res) => {
  try {
    const files = req.files.map(file => ({
      filename: file.originalname,
      path: file.path,
      mimetype: file.mimetype,
      size: file.size
    }));

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { $push: { attachments: { $each: files } } },
      { new: true }
    ).populate('createdBy', 'username email');

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json(ticket);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Assignment routes (admin only)
router.post('/:id/assign', isAdmin, ticketController.assignTicket);
router.post('/:id/unassign', isAdmin, ticketController.unassignTicket);
router.put('/:id/priority', isAdmin, ticketController.updatePriority);

router.get('/stats', adminController.getStats); // เพิ่มเส้นทาง API


module.exports = router;