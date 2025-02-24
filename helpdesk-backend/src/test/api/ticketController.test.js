// src/tests/api/ticketController.test.js
const request = require('supertest');
const jwt = require('jsonwebtoken');
const User = require('../../models/user.model');
const Ticket = require('../../models/ticket.model');

// Import app ที่ไม่มีการ start server
const app = require('../../app');

// ใช้การเชื่อมต่อ MongoDB จาก jest.setup.js

// ตัวแปรสำหรับเก็บข้อมูลทดสอบ
let adminToken;
let userToken;
let adminId;
let userId;

beforeEach(async () => {
  await User.deleteMany({});
  await Ticket.deleteMany({});
  
  // Create test users
  const adminUser = await User.create({
    username: 'admin',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin'
  });
  
  const regularUser = await User.create({
    username: 'user',
    email: 'user@example.com',
    password: 'password123',
    role: 'user'
  });
  
  adminId = adminUser._id;
  userId = regularUser._id;
  
  // Generate tokens
  adminToken = jwt.sign(
    { userId: adminId, role: 'admin' }, 
    process.env.JWT_SECRET || 'testsecret', 
    { expiresIn: '1h' }
  );
  
  userToken = jwt.sign(
    { userId: userId, role: 'user' }, 
    process.env.JWT_SECRET || 'testsecret', 
    { expiresIn: '1h' }
  );
});

describe('Ticket Controller', () => {
  test('GET /api/tickets - admin should get all tickets', async () => {
    // Create test tickets
    await Ticket.create([
      {
        title: 'Admin Ticket',
        description: 'Admin Description',
        status: 'pending',
        priority: 'medium',
        category: 'general',
        createdBy: adminId
      },
      {
        title: 'User Ticket',
        description: 'User Description',
        status: 'pending',
        priority: 'medium',
        category: 'general',
        createdBy: userId
      }
    ]);
    
    const response = await request(app)
      .get('/api/tickets')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
    
    expect(response.body.tickets.length).toBe(2);
    expect(response.body.tickets[0]).toHaveProperty('title');
    expect(response.body.tickets[0]).toHaveProperty('createdBy');
    expect(response.body).toHaveProperty('total');
  });
  
  test('GET /api/tickets - admin should get all tickets', async () => {
    // Code to create test tickets...
    
    const response = await request(app)
      .get('/api/tickets')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
    
    // ตรวจสอบโครงสร้างของ response ว่าเป็นรูปแบบใด
    console.log('API Response Structure:', JSON.stringify(response.body, null, 2));
    
    // แก้ไขตามโครงสร้างจริงของ response
    // ตัวอย่าง: ถ้า response เป็น array โดยตรง
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2);
    expect(response.body[0]).toHaveProperty('title');
  });
  
  test('POST /api/tickets - should create a new ticket', async () => {
    const ticketData = {
      title: 'New Ticket',
      description: 'New Description',
      priority: 'high',
      category: 'technical'
    };
    
    const response = await request(app)
      .post('/api/tickets')
      .set('Authorization', `Bearer ${userToken}`)
      .send(ticketData)
      .expect(201);
    
    expect(response.body).toHaveProperty('_id');
    expect(response.body.title).toBe('New Ticket');
    expect(response.body.status).toBe('pending');
  });
  
  test('GET /api/tickets/:id - should get a single ticket', async () => {
    // Create a test ticket
    const ticket = await Ticket.create({
      title: 'Single Ticket',
      description: 'Single Description',
      status: 'pending',
      priority: 'medium',
      category: 'general',
      createdBy: userId
    });
    
    const response = await request(app)
      .get(`/api/tickets/${ticket._id}`)
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);
    
    expect(response.body._id.toString()).toBe(ticket._id.toString());
    expect(response.body.title).toBe('Single Ticket');
  });
  
  test('PUT /api/tickets/:id - should update a ticket', async () => {
    // Create a test ticket
    const ticket = await Ticket.create({
      title: 'Original Title',
      description: 'Original Description',
      status: 'pending',
      priority: 'medium',
      category: 'general',
      createdBy: userId
    });
    
    const updateData = {
      title: 'Updated Title',
      status: 'in_progress'
    };
    
    const response = await request(app)
      .put(`/api/tickets/${ticket._id}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(updateData)
      .expect(200);
    
    expect(response.body.title).toBe('Updated Title');
    expect(response.body.status).toBe('in_progress');
    expect(response.body.description).toBe('Original Description'); // Unchanged field
  });
  
  test('POST /api/tickets/:id/comments - should add a comment to a ticket', async () => {
    // Create a test ticket
    const ticket = await Ticket.create({
      title: 'Comment Ticket',
      description: 'Comment Description',
      status: 'pending',
      priority: 'medium',
      category: 'general',
      createdBy: userId
    });
    
    const commentData = {
      content: 'This is a test comment'
    };
    
    const response = await request(app)
      .post(`/api/tickets/${ticket._id}/comments`)
      .set('Authorization', `Bearer ${userToken}`)
      .send(commentData)
      .expect(200);
    
    expect(response.body.comments.length).toBe(1);
    expect(response.body.comments[0].content).toBe('This is a test comment');
  });
});