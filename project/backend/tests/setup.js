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

// 初始化測試數據，與真實數據庫的 Seed.js 保持一致
async function setupTestData() {
  // 創建 counter collection，與 Seed.js 保持一致
  await mongoose.connection.db.collection('counter').insertOne({
    announcement: 15,
    assignments: 13,
    assist_in: 18,
    course: 5,
    course_tag: 47,
    custom_tag: 29,
    discussion_board: 10,
    exams: 10,
    mailbox: 60,
    materials: 19,
    post: 46,
    study_in: 13,
    submitted_ass: 31,
    teach_in: 16,
    user: 15
  });

  // 創建測試用戶數據，與 Seed.js 中的前兩個用戶保持一致
  await mongoose.connection.db.collection('user').insertMany([
    {
      user_id: 1,
      name: "User 1",
      contact_ways: [
        {
          approach: "phone",
          details: "555-5491"
        },
        {
          approach: "social_media",
          details: "@user49"
        }
      ],
      path_to_profile_pic: "/profiles/1.jpg",
      email: "user1@example.com",
      pw: "hashed_password_1",
      create_date: new Date("2025-01-01T00:00:00.000Z")
    },
    {
      user_id: 2,
      name: "User 2",
      contact_ways: [
        {
          approach: "social_media",
          details: "@user7"
        },
        {
          approach: "phone",
          details: "555-5864"
        },
        {
          approach: "email",
          details: "user76@example.com"
        }
      ],
      path_to_profile_pic: "/profiles/2.jpg",
      email: "user2@example.com",
      pw: "hashed_password_2",
      create_date: new Date("2025-01-01T00:00:00.000Z")
    }
  ]);

  // 創建測試標籤數據，與 Seed.js 中的數據保持一致
  await mongoose.connection.db.collection('custom_tag').insertMany([
    {
      user_id: 1,
      user_tag: "User1's CustomTag_1"
    },
    {
      user_id: 2,
      user_tag: "User2's CustomTag_1"
    },
    {
      user_id: 2,
      user_tag: "User2's CustomTag_2"
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