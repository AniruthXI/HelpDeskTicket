// src/controllers/admin.controller.js
const User = require("../models/user.model");
const Ticket = require("../models/ticket.model");

const adminController = {
  // Get all users
  async getUsers(req, res) {
    try {
        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 });

        console.log('Users from DB:', users);
        res.json({ data: users }); // แน่ใจว่าส่งในรูปแบบ { data: [...users] }
    } catch (error) {
        console.error('Controller error:', error);
        res.status(500).json({ error: error.message });
    }
},

  // Get user details with stats
  async getUserDetails(req, res) {
    try {
      const user = await User.findById(req.params.id).select("-password");
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Get user's tickets stats
      const stats = await Ticket.aggregate([
        { $match: { createdBy: user._id } },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]);

      // Format stats
      const ticketStats = stats.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {});

      res.json({
        user,
        stats: ticketStats,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update user role
  async updateUserRole(req, res) {
    try {
      const { role } = req.body;
      if (!["user", "admin"].includes(role)) {
        return res.status(400).json({ error: "Invalid role" });
      }

      const user = await User.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true }
      ).select("-password");

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Update user status
  async updateUserStatus(req, res) {
    try {
      const { isActive } = req.body;

      const user = await User.findByIdAndUpdate(
        req.params.id,
        { isActive },
        { new: true }
      ).select("-password");

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get user tickets
  async getUserTickets(req, res) {
    try {
      const tickets = await Ticket.find({ createdBy: req.params.id })
        .populate("createdBy", "username email")
        .sort({ createdAt: -1 });

      res.json(tickets);
    } catch (error) {
      res.status(500).json({ error: error.message });
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

module.exports = adminController;
