import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

// for custom CONTANT SEED
import {
    CounterSeed,
    UserSeed,
    UserTagSeed,
} from './tests/seed.js';

// 導入路由
import userRoute from '#src/routes/user_route.js';
import courseRoute from '#src/routes/course_router.js';
import courseMemberRoute from '#src/routes/course_member_route.js';
import assignmentRoute from '#src/routes/assignment_route.js';
import materialRoute from '#src/routes/material_route.js';
import announcementRoute from '#src/routes/announcement_route.js';
import discussionBoardRoute from '#src/routes/discussion_board_route.js';
import postRoute from '#src/routes/post_routes.js';
import examRoute from '#src/routes/exam_route.js';
import fileRoute from '#src/routes/file_routes/file_route.js';

let mongoServer;
let server;

async function startTestServer() {
    console.log('🚀 啟動前端整合測試專用後端服務器...');

    try {
        // 1. 啟動 MongoDB Memory Server
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri);

        // 2. 初始化測試資料
        // NOTICE, since we already test the database integrity in backend,
        // we dont need to input schema into the mongoDB, we just need seed!
        await SetupInitialTestData();

        // 3. 創建 Express 應用
        const app = express();

        // 中間件
        app.use(bodyParser.json());
        app.use(cors({
            origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
            credentials: true
        }));

        // 載入所有路由
        app.use("/user", userRoute);
        app.use("/course", courseRoute);
        app.use("/course/member", courseMemberRoute);
        app.use("/discussion-board", discussionBoardRoute);
        app.use("/post", postRoute);
        app.use("/assignment", assignmentRoute);
        app.use("/material", materialRoute);
        app.use("/announcement", announcementRoute);
        app.use("/exams", examRoute);
        app.use("/file", fileRoute);

        // 測試專用端點
        app.post('/test/reset-database', async (req, res) => {
            try {
                await ResetTestDatabase();
                res.json({ message: '資料庫已重置' });
            } catch (error) {
                console.error('重置資料庫錯誤:', error);
                res.status(500).json({ error: error.message });
            }
        });

        app.get('/health', (req, res) => {
            res.json({
                status: 'ok',
                timestamp: new Date().toISOString(),
                server: 'integration-test'
            });
        });

        // 全局錯誤處理
        app.use((err, req, res, next) => {
            console.error('服務器錯誤:', err);
            res.status(err.status || 500).json({
                error: err.message || 'Internal Server Error',
                stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
            });
        });

        // 4. 啟動服務器
        const PORT = process.env.PORT || 3000;
        server = app.listen(PORT, () => {
            console.log(`✅ 整合測試後端服務器運行在 http://localhost:${PORT}`);
            console.log('🎯 整合測試環境準備完成');
        });

        // 優雅關閉處理
        process.on('SIGTERM', GracefulShutdown);
        process.on('SIGINT', GracefulShutdown);

    } catch (error) {
        console.error('啟動測試服務器失敗:', error);
        process.exit(1);
    }
}

async function GracefulShutdown() {
    console.log('🧹 正在關閉測試服務器...');

    if (server) {
        server.close();
    }

    if (mongoose.connection.readyState === 1) {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    }

    if (mongoServer) {
        await mongoServer.stop();
    }

    console.log('✅ 測試服務器已關閉');
    process.exit(0);
}

// 初始化測試資料
async function SetupInitialTestData() {
    // console.log('📋 初始化測試資料...');

    await CounterSeed();
    await UserSeed();
    await UserTagSeed();

    // console.log('✅ 測試資料初始化完成');
}

// 重置測試資料庫
async function ResetTestDatabase() {
    // console.log('🔄 重置測試資料庫...');

    // 清理所有資料
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }

    // 重新初始化基本資料
    await SetupInitialTestData();

    // 確保資料插入完成
    await new Promise(resolve => setTimeout(resolve, 10));

    // console.log('✅ 資料庫重置完成');
}

// 如果直接執行此文件，啟動服務器
import { fileURLToPath } from 'url';
import { resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const isMainModule = resolve(process.argv[1]) === __filename;

console.log('🔍 檢查執行模式:', {
    '__filename': __filename,
    'process.argv[1]': resolve(process.argv[1]),
    isMainModule
});

if (isMainModule) {
    console.log('🔍 檢測到直接執行，啟動測試服務器...');
    startTestServer();
} else {
    console.log('🔍 作為模組導入，不自動啟動服務器');
}