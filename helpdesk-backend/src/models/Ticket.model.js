// backend/src/models/ticket.model.js
const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  attachments: [{
    filename: String,
    path: String,
    mimetype: String
  }]
}, {
  timestamps: true
});

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'resolved', 'closed'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['technical', 'billing', 'general', 'feature_request'],
    default: 'general'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  comments: [commentSchema],
  attachments: [{
    filename: String,
    path: String,
    mimetype: String
  }],
  tags: [{
    type: String,
    trim: true
  }],
  dueDate: Date,
  resolvedAt: Date,
  closedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
ticketSchema.index({ status: 1 });
ticketSchema.index({ priority: 1 });
ticketSchema.index({ category: 1 });
ticketSchema.index({ createdBy: 1 });
ticketSchema.index({ assignedTo: 1 });
ticketSchema.index({ tags: 1 });
ticketSchema.index({ title: 'text', description: 'text' });

// Virtual field for time tracking
ticketSchema.virtual('responseTime').get(function() {
  if (this.status === 'pending') {
    return Date.now() - this.createdAt;
  }
  return this.updatedAt - this.createdAt;
});

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;