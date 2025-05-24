import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

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
        await setupInitialTestData();

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
                await resetTestDatabase();
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
        process.on('SIGTERM', gracefulShutdown);
        process.on('SIGINT', gracefulShutdown);

    } catch (error) {
        console.error('啟動測試服務器失敗:', error);
        process.exit(1);
    }
}

async function gracefulShutdown() {
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
async function setupInitialTestData() {
    console.log('📋 初始化測試資料...');

    // 創建 counter collection
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

    // 創建測試用戶
    await mongoose.connection.db.collection('user').insertMany([
        {
            user_id: 1,
            name: "User 1",
            contact_ways: [
                { approach: "phone", details: "555-5491" },
                { approach: "social_media", details: "@user49" }
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
                { approach: "social_media", details: "@user7" },
                { approach: "phone", details: "555-5864" },
                { approach: "email", details: "user76@example.com" }
            ],
            path_to_profile_pic: "/profiles/2.jpg",
            email: "user2@example.com",
            pw: "hashed_password_2",
            create_date: new Date("2025-01-01T00:00:00.000Z")
        }
    ]);

    // 創建測試標籤
    await mongoose.connection.db.collection('custom_tag').insertMany([
        { user_id: 1, user_tag: "User1's CustomTag_1" },
        { user_id: 2, user_tag: "User2's CustomTag_1" },
        { user_id: 2, user_tag: "User2's CustomTag_2" }
    ]);

    console.log('✅ 測試資料初始化完成');
}

// 重置測試資料庫
async function resetTestDatabase() {
    console.log('🔄 重置測試資料庫...');

    // 清理所有資料
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }

    // 重新初始化基本資料
    await setupInitialTestData();

    // 確保資料插入完成
    await new Promise(resolve => setTimeout(resolve, 10));

    console.log('✅ 資料庫重置完成');
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
    console.log('🔍 檢測到直接執行，啟動服務器...');
    startTestServer();
} else {
    console.log('🔍 作為模組導入，不自動啟動服務器');
}

// 導出函數供測試使用
export { startTestServer, gracefulShutdown }; 