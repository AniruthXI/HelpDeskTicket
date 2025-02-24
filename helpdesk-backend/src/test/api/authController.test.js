// src/tests/api/authController.test.js
const request = require('supertest');
const bcrypt = require('bcryptjs');
const User = require('../../models/user.model');

// Import app ที่ไม่มีการ start server
const app = require('../../app');

// ใช้การเชื่อมต่อ MongoDB จาก jest.setup.js

beforeEach(async () => {
  await User.deleteMany({});
});

describe('Auth Controller', () => {
  // ปรับแก้ test cases ให้ตรงกับโครงสร้างจริงของ API response
test('POST /api/auth/register - should register a new user', async () => {
  const userData = {
    username: 'newuser',
    email: 'newuser@example.com',
    password: 'password123'
  };
  
  const response = await request(app)
    .post('/api/auth/register')
    .send(userData)
    .expect(201);
  
  // ตรวจสอบโครงสร้างของ response ว่าเป็นรูปแบบใด
  console.log('Register API Response:', JSON.stringify(response.body, null, 2));
  
  // แก้ไขตามโครงสร้างจริงของ response
  // ตัวอย่าง:
  expect(response.body).toHaveProperty('user');
  expect(response.body).toHaveProperty('token');
  expect(response.body.user).toHaveProperty('username', 'newuser');
  expect(response.body.user).toHaveProperty('email', 'newuser@example.com');
  expect(response.body.user).not.toHaveProperty('password');
});
  
  test('POST /api/auth/login - should log in an existing user', async () => {
    // Create a user first
    const hashedPassword = await bcrypt.hash('password123', 10);
    await User.create({
      username: 'existinguser',
      email: 'existing@example.com',
      password: hashedPassword,
      role: 'user'
    });
    
    const loginData = {
      email: 'existing@example.com',
      password: 'password123'
    };
    
    const response = await request(app)
      .post('/api/auth/login')
      .send(loginData)
      .expect(200);
    
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toHaveProperty('username', 'existinguser');
    expect(response.body).toHaveProperty('token');
  });
  
  test('POST /api/auth/login - should reject invalid credentials', async () => {
    // Create a user first
    const hashedPassword = await bcrypt.hash('password123', 10);
    await User.create({
      username: 'existinguser',
      email: 'existing@example.com',
      password: hashedPassword
    });
    
    const loginData = {
      email: 'existing@example.com',
      password: 'wrongpassword'
    };
    
    const response = await request(app)
      .post('/api/auth/login')
      .send(loginData)
      .expect(401);
    
    expect(response.body).toHaveProperty('error');
  });
});