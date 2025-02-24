// src/tests/middleware/auth.test.js
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../../models/user.model');

const authMiddleware = require('../../middleware/auth.middleware'); // ตรวจสอบว่าไฟล์นี้มีอยู่จริง


// Mock Express request and response
const mockRequest = () => {
  const req = {};
  req.header = jest.fn().mockImplementation(header => {
    if (header === 'Authorization') return req.authHeader;
    return null;
  });
  return req;
};

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// ให้ใช้การเชื่อมต่อ MongoDB จาก jest.setup.js
let userId;

beforeEach(async () => {
  // เคลียร์ข้อมูลเดิม
  await User.deleteMany({});
  
  // สร้าง user สำหรับทดสอบ
  const user = await User.create({
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
    role: 'user'
  });
  
  userId = user._id;
  
  // Mock JWT Secret
  process.env.JWT_SECRET = 'testsecret';
});

describe('Auth Middleware', () => {
  // นำเข้า auth middleware ในนี้เพื่อให้ใช้การเชื่อมต่อ MongoDB ที่ถูกต้อง
  const { auth, admin } = require('../../middleware/auth.middleware');
  
  test('should set req.user if valid token is provided', async () => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const req = mockRequest();
    req.authHeader = `Bearer ${token}`;
    
    const res = mockResponse();
    const next = jest.fn();
    
    await auth(req, res, next);
    
    expect(req.user).toBeDefined();
    expect(req.user._id.toString()).toBe(userId.toString());
    expect(next).toHaveBeenCalled();
  });
  
  test('should return 401 if no token is provided', async () => {
    const req = mockRequest();
    req.authHeader = null;
    
    const res = mockResponse();
    const next = jest.fn();
    
    await auth(req, res, next);
    
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
    expect(next).not.toHaveBeenCalled();
  });
  
  test('should return 401 if invalid token is provided', async () => {
    const req = mockRequest();
    req.authHeader = 'Bearer invalidtoken';
    
    const res = mockResponse();
    const next = jest.fn();
    
    await auth(req, res, next);
    
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
    expect(next).not.toHaveBeenCalled();
  });
});

describe('Admin Middleware', () => {
  // นำเข้า auth middleware ในนี้เพื่อให้ใช้การเชื่อมต่อ MongoDB ที่ถูกต้อง
  const { auth, admin } = require('../../middleware/auth.middleware');
  
  test('should call next if user is admin', async () => {
    // Create an admin user
    const adminUser = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin'
    });
    
    const req = mockRequest();
    req.user = await User.findById(adminUser._id);
    
    const res = mockResponse();
    const next = jest.fn();
    
    admin(req, res, next);
    
    expect(next).toHaveBeenCalled();
  });
  
  test('should return 403 if user is not admin', async () => {
    const req = mockRequest();
    req.user = await User.findById(userId); // Regular user
    
    const res = mockResponse();
    const next = jest.fn();
    
    admin(req, res, next);
    
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
    expect(next).not.toHaveBeenCalled();
  });
});