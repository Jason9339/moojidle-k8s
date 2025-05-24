import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { vi } from 'vitest';
import dotenv from 'dotenv';

// 加載環境變量
dotenv.config();

// 測試數據庫名稱（避免影響正式數據庫）
const TEST_DB_NAME = process.env.TEST_DB_NAME || 'moojidle_test';
const MONGO_URL = process.env.DATA_BASE_URL || 'mongodb://localhost:27017';

// 構建測試資料庫 URL
const TEST_DB_URL = MONGO_URL.replace(/\/[^\/]*$/, `/${TEST_DB_NAME}`);

// 全局測試設置
global.beforeAll = async () => {
  console.log(`連接到測試資料庫: ${TEST_DB_URL}`);
  
  // 連接到測試數據庫
  await mongoose.connect(TEST_DB_URL);
  
  // 清空測試數據庫（確保乾淨的測試環境）
  await mongoose.connection.dropDatabase();
  
  console.log('開始載入 Schema...');
  
  // 只載入 Schema（不載入 Seed 數據）
  await loadSchema();
  
  console.log('Schema 載入完成');
  console.log('準備測試環境...');
  
  // 初始化基本測試數據
  await initializeTestData();
  
  console.log('測試環境準備完成');
};

global.afterAll = async () => {
  // 清理測試數據庫
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  console.log('測試數據庫已清理並關閉連接');
};

global.beforeEach = async () => {
  // 在真實數據庫測試中，確保基本測試數據存在
  await ensureTestData();
};

// 初始化基本測試數據（只在 beforeAll 中調用一次）
async function initializeTestData() {
  const db = mongoose.connection.db;
  
  try {
    // 初始化 counter collection（按照原始 Schema 設計，單一文檔包含所有計數器）
    const counterData = {
      "announcement": 0,      // 沒有公告數據
      "assignments": 0,       // 沒有作業數據
      "assist_in": 0,         // 沒有助教關係數據
      "course": 0,            // 沒有課程數據
      "course_tag": 0,        // 沒有課程標籤數據
      "custom_tag": 3,        // 我們會創建 3 個自定義標籤
      "discussion_board": 0,  // 沒有討論板數據
      "exams": 0,             // 沒有考試數據
      "mailbox": 0,           // 沒有郵箱數據
      "materials": 0,         // 沒有教材數據
      "post": 0,              // 沒有貼文數據
      "study_in": 0,          // 沒有學習關係數據
      "submitted_ass": 0,     // 沒有提交作業數據
      "teach_in": 0,          // 沒有教學關係數據
      "user": 2               // 我們會創建 2 個用戶
    };

    await db.collection('counter').insertOne(counterData);

    console.log('✓ 初始化 counter collection - 所有計數器已設置');
    
  } catch (error) {
    console.error('初始化測試數據失敗:', error);
  }
}

// 確保測試數據存在（在每個測試前調用）
async function ensureTestData() {
  const db = mongoose.connection.db;
  
  try {
    // 確保基本測試用戶存在（用於測試依賴）
    const testUsers = [
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
    ];

    // 使用 upsert 確保這些測試用戶存在
    for (const user of testUsers) {
      await db.collection('user').findOneAndUpdate(
        { user_id: user.user_id },
        { $set: user },
        { upsert: true }
      );
    }

    // 確保基本測試標籤存在
    const testTags = [
      { user_id: 1, user_tag: "User1's CustomTag_1" },
      { user_id: 2, user_tag: "User2's CustomTag_1" },
      { user_id: 2, user_tag: "User2's CustomTag_2" }
    ];

    for (const tag of testTags) {
      await db.collection('custom_tag').findOneAndUpdate(
        { user_id: tag.user_id, user_tag: tag.user_tag },
        { $set: tag },
        { upsert: true }
      );
    }

  } catch (error) {
    console.error('確保測試數據失敗:', error);
  }
}

// 載入 Schema
async function loadSchema() {
  const schemaPath = path.resolve(process.cwd(), '../database/Schema.js');
  
  if (!fs.existsSync(schemaPath)) {
    throw new Error(`Schema 文件不存在: ${schemaPath}`);
  }
  
  // 讀取 Schema.js 內容
  const schemaContent = fs.readFileSync(schemaPath, 'utf8');
  
  // 執行 Schema 腳本
  await executeSchemaScript(schemaContent);
}

// 執行 Schema 腳本
async function executeSchemaScript(schemaContent) {
  const db = mongoose.connection.db;
  
  try {
    // 解析 createCollection 指令
    const createCollectionRegex = /db\.createCollection\("([^"]+)",\s*({[^}]+})\s*\);/g;
    let match;
    
    while ((match = createCollectionRegex.exec(schemaContent)) !== null) {
      const collectionName = match[1];
      const optionsStr = match[2];
      
      try {
        // 解析選項對象
        const options = eval(`(${optionsStr})`);
        
        // 創建 collection
        await db.createCollection(collectionName, options);
        console.log(`✓ 創建 collection: ${collectionName}`);
        
      } catch (error) {
        console.warn(`⚠ 創建 collection ${collectionName} 失敗:`, error.message);
        // 繼續執行其他 collections
      }
    }
  } catch (error) {
    console.error('執行 Schema 腳本失敗:', error);
    throw error;
  }
}

// 提供測試輔助函數：動態插入測試數據
global.insertTestData = async (collectionName, data) => {
  const db = mongoose.connection.db;
  
  try {
    if (Array.isArray(data)) {
      const result = await db.collection(collectionName).insertMany(data);
      return result.insertedIds;
    } else {
      const result = await db.collection(collectionName).insertOne(data);
      return result.insertedId;
    }
  } catch (error) {
    console.error(`插入測試數據到 ${collectionName} 失敗:`, error);
    throw error;
  }
};

// 提供測試輔助函數：清理特定 collection 的測試數據
global.cleanTestData = async (collectionName, filter = {}) => {
  const db = mongoose.connection.db;
  
  try {
    const result = await db.collection(collectionName).deleteMany(filter);
    return result.deletedCount;
  } catch (error) {
    console.error(`清理 ${collectionName} 測試數據失敗:`, error);
    throw error;
  }
};

// 提供測試輔助函數：獲取下一個自動遞增 ID
global.getNextId = async (collectionName) => {
  const db = mongoose.connection.db;
  
  try {
    // 根據新的 counter 結構，直接更新對應的欄位
    const updateField = {};
    updateField[collectionName] = 1;
    
    const counter = await db.collection('counter').findOneAndUpdate(
      {}, // 查找第一個（也是唯一的）counter 文檔
      { $inc: updateField },
      { 
        returnDocument: 'after',
        projection: { [collectionName]: 1 }
      }
    );
    
    return counter[collectionName];
  } catch (error) {
    console.error(`獲取 ${collectionName} 的下一個 ID 失敗:`, error);
    throw error;
  }
};

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: vi.fn(),
  error: vi.fn(), 
  warn: vi.fn(),
}; 