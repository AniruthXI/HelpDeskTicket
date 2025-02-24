// src/controllers/ticket.controller.js
const Ticket = require('../models/ticket.model');

const ticketController = {
  // Create ticket
  async create(req, res) {
    try {
      const ticket = new Ticket({
        ...req.body,
        createdBy: req.user._id // จาก auth middleware
      });

      await ticket.save();
      
      // Populate createdBy field
      await ticket.populate('createdBy', 'username email');

      res.status(201).json(ticket);
    } catch (error) {
      console.error('Create ticket error:', error);
      res.status(400).json({ error: error.message });
    }
  },

  // Get all tickets
  async getAll(req, res) {
    try {
      const { status, priority, category, search, page = 1, limit = 10 } = req.query;
      
      // Build query
      const query = {};
      
      if (status) query.status = status;
      if (priority) query.priority = priority;
      if (category) query.category = category;
      
      // Text search
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }
  
      // Regular users can only see their own tickets
      if (req.user.role !== 'admin') {
        query.$or = [
          { createdBy: req.user._id },
          { assignedTo: req.user._id }
        ];
      }
  
      const tickets = await Ticket.find(query)
        .populate('createdBy', 'username email')
        .populate('assignedTo', 'username email')
        .sort({ createdAt: -1 });
        // .skip((page - 1) * limit)  // ปิดไว้ก่อนเพื่อเทสต์
        // .limit(limit);            // ปิดไว้ก่อนเพื่อเทสต์
  
      console.log('Found tickets:', tickets); // Debug log
  
      // ส่งข้อมูลกลับในรูปแบบ array เลย
      res.json(tickets);
      
    } catch (error) {
      console.error('Get tickets error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Get single ticket
  async getOne(req, res) {
    try {
      const ticket = await Ticket.findById(req.params.id)
        .populate('createdBy', 'username email')
        .populate('assignedTo', 'username email')
        .populate('comments.user', 'username email');

      if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found' });
      }

      // Check if user has access to this ticket
      if (req.user.role !== 'admin' && 
          ticket.createdBy._id.toString() !== req.user._id.toString() &&
          (!ticket.assignedTo || ticket.assignedTo._id.toString() !== req.user._id.toString())) {
        return res.status(403).json({ error: 'Access denied' });
      }

      res.json(ticket);
    } catch (error) {
      console.error('Get ticket error:', error);
      res.status(500).json({ error: error.message });
    }
  },

  // Update ticket
  async update(req, res) {
    try {
      const ticket = await Ticket.findById(req.params.id);

      if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found' });
      }

      // Check permissions
      if (req.user.role !== 'admin' && 
          ticket.createdBy.toString() !== req.user._id.toString() &&
          (!ticket.assignedTo || ticket.assignedTo.toString() !== req.user._id.toString())) {
        return res.status(403).json({ error: 'Access denied' });
      }

      // Update status timestamps
      if (req.body.status === 'resolved' && ticket.status !== 'resolved') {
        req.body.resolvedAt = Date.now();
      }
      if (req.body.status === 'closed' && ticket.status !== 'closed') {
        req.body.closedAt = Date.now();
      }

      const updatedTicket = await Ticket.findByIdAndUpdate(
        req.params.id,
        { ...req.body, updatedAt: Date.now() },
        { new: true, runValidators: true }
      )
      .populate('createdBy', 'username email')
      .populate('assignedTo', 'username email');

      res.json(updatedTicket);
    } catch (error) {
      console.error('Update ticket error:', error);
      res.status(400).json({ error: error.message });
    }
  },

  // Add comment to ticket
  async addComment(req, res) {
    try {
      const ticket = await Ticket.findById(req.params.id);

      if (!ticket) {
        return res.status(404).json({ error: 'Ticket not found' });
      }

      ticket.comments.push({
        user: req.user._id,
        content: req.body.content
      });

      await ticket.save();
      await ticket.populate('comments.user', 'username email');

      res.json(ticket);
    } catch (error) {
      console.error('Add comment error:', error);
      res.status(400).json({ error: error.message });
    }
  },

  // Get ticket statistics
  async getStats(req, res) {
    try {
      const query = req.user.role !== 'admin' 
        ? { createdBy: req.user._id }
        : {};

      const [statusStats, priorityStats] = await Promise.all([
        Ticket.aggregate([
          { $match: query },
          { $group: { _id: '$status', count: { $sum: 1 } } }
        ]),
        Ticket.aggregate([
          { $match: query },
          { $group: { _id: '$priority', count: { $sum: 1 } } }
        ])
      ]);

      res.json({
        statusStats: statusStats.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        priorityStats: priorityStats.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {})
      });
    } catch (error) {
      console.error('Get stats error:', error);
      res.status(500).json({ error: error.message });
    }
  }
};

const assignTicket = async (req, res) => {
  try {
    const { userId } = req.body;
    const ticketId = req.params.id;

    // เช็คว่า ticket มีอยู่จริง
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // เช็คว่า user ที่จะ assign มีอยู่จริง
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // อัพเดท ticket
    ticket.assignedTo = userId;
    ticket.assignedAt = new Date();
    ticket.status = 'assigned';
    await ticket.save();

    // ส่ง email แจ้งเตือน (ถ้ามี)
    // TODO: Implement email notification

    // ส่งข้อมูลกลับ
    await ticket.populate('assignedTo', 'username email');
    res.json(ticket);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const unassignTicket = async (req, res) => {
  try {
    const ticketId = req.params.id;
    
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    ticket.assignedTo = null;
    ticket.assignedAt = null;
    ticket.status = 'pending';
    await ticket.save();

    res.json(ticket);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updatePriority = async (req, res) => {
  try {
    const { priority } = req.body;
    const ticketId = req.params.id;

    if (!['low', 'medium', 'high', 'urgent'].includes(priority)) {
      return res.status(400).json({ error: 'Invalid priority level' });
    }

    const ticket = await Ticket.findByIdAndUpdate(
      ticketId,
      { priority },
      { new: true }
    ).populate('assignedTo', 'username email');

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    res.json(ticket);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  ...module.exports,
  assignTicket,
  unassignTicket,
  updatePriority
};