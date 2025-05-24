import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { vi } from 'vitest';

let mongoServer;

// 全局測試設置
global.beforeAll = async () => {
  // 創建內存中的 MongoDB 實例
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  // 連接到測試數據庫
  await mongoose.connect(mongoUri);
  
  // 初始化測試數據
  await setupTestData();
};

global.afterAll = async () => {
  // 清理數據庫
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
};

global.beforeEach = async () => {
  // 每個測試前清理數據
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
  
  // 添加小延遲確保清理完成
  await new Promise(resolve => setTimeout(resolve, 5));
  
  // 重新初始化測試數據
  await setupTestData();
  
  // 再次添加小延遲確保數據插入完成
  await new Promise(resolve => setTimeout(resolve, 5));
};

// 初始化測試數據
async function setupTestData() {
  // 創建 counter collection 用於 user_id 自增
  await mongoose.connection.db.collection('counter').insertOne({
    user: 2
  });

  // 創建測試用戶數據
  await mongoose.connection.db.collection('user').insertMany([
    {
      user_id: 1,
      name: "Test User 1",
      email: "test1@example.com",
      pw: "password123",
      create_date: new Date(),
      contact_ways: [
        {
          approach: "email",
          details: "test1@example.com"
        }
      ]
    },
    {
      user_id: 2,
      name: "Test User 2",
      email: "test2@example.com",
      pw: "password456",
      create_date: new Date(),
      contact_ways: [
        {
          approach: "email",
          details: "test2@example.com"
        }
      ]
    }
  ]);

  // 創建測試標籤數據
  await mongoose.connection.db.collection('custom_tag').insertMany([
    {
      user_id: 1,
      user_tag: "TestTag_1"
    },
    {
      user_id: 2,
      user_tag: "TestTag_2"
    }
  ]);
}

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
}; 