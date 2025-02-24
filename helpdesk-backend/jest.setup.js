// jest.setup.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
  // ถ้ามีการเชื่อมต่ออยู่แล้ว ให้ปิดก่อน
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
});

// เคลียร์ timeout ที่อาจจะค้างอยู่หลังจากทดสอบเสร็จ
afterEach(() => {
  jest.useRealTimers();
});