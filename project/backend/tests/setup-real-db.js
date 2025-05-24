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
  
  console.log('開始載入 Schema 和 Seed 數據...');
  
  // 載入正式的 Schema 和 Seed 數據
  await loadSchemaAndSeed();
  
  console.log('Schema 和 Seed 數據載入完成');
};

global.afterAll = async () => {
  // 清理測試數據庫
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  console.log('測試數據庫已清理並關閉連接');
};

global.beforeEach = async () => {
  // 不清理數據 - 使用完整的 seed 數據
  // 如果需要隔離測試，可以在這裡添加特定的清理邏輯
};

// 載入 Schema 和 Seed 數據
async function loadSchemaAndSeed() {
  try {
    // 讀取並執行 Schema.js
    await loadSchema();
    
    // 讀取並執行 Seed.js  
    await loadSeed();
    
  } catch (error) {
    console.error('載入 Schema/Seed 失敗:', error);
    throw error;
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
  
  // 將 MongoDB shell 腳本轉換為 Node.js 可執行的代碼
  await executeMongoScript(schemaContent, 'Schema');
}

// 載入 Seed 數據
async function loadSeed() {
  const seedPath = path.resolve(process.cwd(), '../database/Seed.js');
  
  if (!fs.existsSync(seedPath)) {
    throw new Error(`Seed 文件不存在: ${seedPath}`);
  }
  
  // 讀取 Seed.js 內容
  const seedContent = fs.readFileSync(seedPath, 'utf8');
  
  // 將 MongoDB shell 腳本轉換為 Node.js 可執行的代碼
  await executeMongoScript(seedContent, 'Seed');
}

// 執行 MongoDB 腳本
async function executeMongoScript(scriptContent, type) {
  const db = mongoose.connection.db;
  
  try {
    if (type === 'Schema') {
      await executeSchemaScript(scriptContent, db);
    } else if (type === 'Seed') {
      await executeSeedScript(scriptContent, db);
    }
  } catch (error) {
    console.error(`執行 ${type} 腳本失敗:`, error);
    throw error;
  }
}

// 執行 Schema 腳本
async function executeSchemaScript(schemaContent, db) {
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
}

// 執行 Seed 腳本
async function executeSeedScript(seedContent, db) {
  // 解析 insertMany 指令
  const insertManyRegex = /db\.([a-zA-Z_]+)\.insertMany\(\s*(\[[^\]]+\])\s*\);/g;
  let match;
  
  while ((match = insertManyRegex.exec(seedContent)) !== null) {
    const collectionName = match[1];
    const dataStr = match[2];
    
    try {
      // 處理 ISODate 函數
      const processedDataStr = dataStr.replace(/ISODate\("([^"]+)"\)/g, 'new Date("$1")');
      
      // 解析數據數組
      const data = eval(processedDataStr);
      
      // 插入數據
      const result = await db.collection(collectionName).insertMany(data);
      console.log(`✓ 插入 ${result.insertedCount} 筆數據到 ${collectionName}`);
      
    } catch (error) {
      console.warn(`⚠ 插入數據到 ${collectionName} 失敗:`, error.message);
      // 繼續執行其他 collections
    }
  }
}

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: vi.fn(),
  error: vi.fn(), 
  warn: vi.fn(),
}; 