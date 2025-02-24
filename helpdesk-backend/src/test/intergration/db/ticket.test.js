// src/tests/integration/db/ticket.test.js
const mongoose = require('mongoose');
const Ticket = require('../../../models/ticket.model');
const User = require('../../../models/user.model');

// ใช้การเชื่อมต่อ MongoDB จาก jest.setup.js

beforeEach(async () => {
  await Ticket.deleteMany({});
  await User.deleteMany({});
});

describe('Ticket Database Operations', () => {
  test('Should create and retrieve a ticket with populated fields', async () => {
    // Create a user first
    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      role: 'user'
    });
    
    // Create a ticket
    const ticketData = {
      title: 'Test Ticket',
      description: 'Test Description',
      status: 'pending',
      priority: 'medium',
      category: 'general',
      createdBy: user._id
    };
    
    await Ticket.create(ticketData);
    
    // Retrieve ticket with populated fields
    const retrievedTicket = await Ticket.findOne({ title: 'Test Ticket' })
      .populate('createdBy', 'username email');
    
    expect(retrievedTicket.title).toBe('Test Ticket');
    expect(retrievedTicket.createdBy.username).toBe('testuser');
    expect(retrievedTicket.createdBy.email).toBe('test@example.com');
  });
  
  test('Should filter tickets by status', async () => {
    const user = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    });
    
    // Create multiple tickets with different statuses
    await Ticket.create([
      {
        title: 'Pending Ticket',
        description: 'Test Description',
        status: 'pending',
        priority: 'medium',
        category: 'general',
        createdBy: user._id
      },
      {
        title: 'In Progress Ticket',
        description: 'Test Description',
        status: 'in_progress',
        priority: 'high',
        category: 'technical',
        createdBy: user._id
      },
      {
        title: 'Resolved Ticket',
        description: 'Test Description',
        status: 'resolved',
        priority: 'low',
        category: 'general',
        createdBy: user._id
      }
    ]);
    
    const pendingTickets = await Ticket.find({ status: 'pending' });
    expect(pendingTickets.length).toBe(1);
    expect(pendingTickets[0].title).toBe('Pending Ticket');
    
    const highPriorityTickets = await Ticket.find({ priority: 'high' });
    expect(highPriorityTickets.length).toBe(1);
    expect(highPriorityTickets[0].title).toBe('In Progress Ticket');
  });
});