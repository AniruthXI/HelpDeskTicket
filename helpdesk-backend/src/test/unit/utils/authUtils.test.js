// src/tests/unit/utils/auth.utils.test.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Mock environment variable
process.env.JWT_SECRET = 'test-secret';

describe('Auth Utils', () => {
  // ตรวจสอบ path ที่ถูกต้องของ auth utils
  // ตัวอย่าง:
  const authUtils = require('../../../utils/auth.utils');
  // หรือ
  // const authUtils = require('../../../utils/auth');
  
  test('generateToken creates a valid JWT', () => {
    const userId = '507f1f77bcf86cd799439011';
    const role = 'user';
    
    const token = authUtils.generateToken(userId, role);
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    expect(decoded.userId).toBe(userId);
    expect(decoded.role).toBe(role);
    expect(decoded).toHaveProperty('exp');
    expect(decoded).toHaveProperty('iat');
  });
  
  test('comparePassword correctly compares hashed password', async () => {
    const plainPassword = 'securePassword123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);
    
    const result = await authUtils.comparePassword(plainPassword, hashedPassword);
    
    expect(result).toBe(true);
  });
  
  test('comparePassword returns false for incorrect password', async () => {
    const correctPassword = 'securePassword123';
    const wrongPassword = 'wrongPassword';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(correctPassword, salt);
    
    const result = await authUtils.comparePassword(wrongPassword, hashedPassword);
    
    expect(result).toBe(false);
  });
});