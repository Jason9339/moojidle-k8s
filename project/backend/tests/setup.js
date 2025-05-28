import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { vi } from 'vitest';
import fs from 'fs';
import path from 'path';

// for custom CONTANT SEED
import {
    CounterSeed,
    UserSeed,
    Custom_tagSeed,
    CourseSeed,
    Teach_inSeed,
    Assist_inSeed,
    Study_inSeed,
    AnnouncementSeed,
    Discussion_boardSeed,
    ExamsSeed,
    Taken_examsSeed,
    MaterialsSeed,
    AssignmentsSeed,
    Submitted_assSeed,
    PostSeed,
    Course_tagSeed,
    NotificationSeed,
    NotifiedSeed,
    MailboxSeed,
} from './seed.js';

let mongoServer;

// 全局測試設置
global.beforeAll = async (test) => {
    console.log('🚀 啟動測試環境 (Memory + Schema 驗證)');

    // 創建內存中的 MongoDB 實例
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    // 連接到測試數據庫
    await mongoose.connect(mongoUri);

    // 載入 Schema 驗證
    console.log('📋 正在載入 Schema 驗證...');
    await LoadSchema();

    // 初始化測試數據
    await SetupTestData();

    console.log('✅ 測試環境準備完成', test);
};

global.afterAll = async () => {
    // 清理數據庫
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
};

global.beforeEach = async () => {
    // 每個測試前清理數據
    // const collections = mongoose.connection.collections;
    // for (const key in collections) {
    //     const collection = collections[key];
    //     await collection.deleteMany({});
    // }
    await mongoose.connection.dropDatabase();
    await LoadSchema();

    // 添加小延遲確保清理完成
    await new Promise(resolve => setTimeout(resolve, 5));

    // 重新初始化測試數據
    await SetupTestData();

    // 再次添加小延遲確保數據插入完成
    await new Promise(resolve => setTimeout(resolve, 5));
};

// 載入 Schema（從 setup-real-db.js 移植）
async function LoadSchema() {
    const schemaPath = path.resolve(process.cwd(), '../database/Schema.js');

    if (!fs.existsSync(schemaPath)) {
        console.warn(`⚠️ Schema 文件不存在: ${schemaPath}`);
        console.warn('將跳過 Schema 驗證，使用簡單的 collection 創建');
        return;
    }

    try {
        // 讀取 Schema.js 內容
        const schemaContent = fs.readFileSync(schemaPath, 'utf8');

        // 執行 Schema 腳本
        await ExecuteSchemaScript(schemaContent);
        console.log('✅ Schema 載入完成');
    } catch (error) {
        console.warn(`⚠️ Schema 載入失敗，將使用簡化模式:`, error.message);
    }
}

// 執行 Schema 腳本
async function ExecuteSchemaScript(schemaContent) {
    const db = mongoose.connection.db;

    try {
        // 更強大的正則表達式來匹配多行的 createCollection 調用
        const createCollectionRegex = /db\.createCollection\("([^"]+)",\s*({[\s\S]*?})\s*\);/g;
        let match;
        let successCount = 0;
        let failCount = 0;

        while ((match = createCollectionRegex.exec(schemaContent)) !== null) {
            const collectionName = match[1];
            const optionsStr = match[2];

            try {
                // 清理選項字串，移除註釋
                const cleanOptionsStr = optionsStr
                    .replace(/\/\/.*$/gm, '') // 移除單行註釋
                    .replace(/\/\*[\s\S]*?\*\//g, '') // 移除多行註釋
                    .trim();

                // 解析選項對象
                const options = eval(`(${cleanOptionsStr})`);

                // 創建 collection
                await db.createCollection(collectionName, options);
                successCount++;
                console.log(`✓ 創建 collection: ${collectionName}`);

            } catch (error) {
                failCount++;
                console.warn(`⚠ 跳過 collection ${collectionName}:`, error.message);
                // 繼續執行其他 collections
            }
        }

        console.log(`📊 Schema 載入結果: ${successCount} 成功, ${failCount} 跳過`);
    } catch (error) {
        console.error('❌ Schema 腳本執行失敗:', error);
        throw error;
    }
}

// 初始化測試數據，與真實數據庫的 Seed.js 保持一致
async function SetupTestData() {
    await CounterSeed();
    await UserSeed();
    await Custom_tagSeed();
    await CourseSeed();
    await Teach_inSeed();
    await Assist_inSeed();
    await Study_inSeed();
    await AnnouncementSeed();
    await Discussion_boardSeed();
    await ExamsSeed();
    await Taken_examsSeed();
    await MaterialsSeed();
    await AssignmentsSeed();
    await Submitted_assSeed();
    await PostSeed();
    await Course_tagSeed();
    await NotificationSeed();
    await NotifiedSeed();
    await MailboxSeed();
}

// Mock console methods to reduce noise in tests
global.console = {
    ...console,
    log: vi.fn(),
    error: vi.fn(),
    warn: vi.fn(),
}; 