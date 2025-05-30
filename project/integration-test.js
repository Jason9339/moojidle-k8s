#!/usr/bin/env node

/**
 * 學生作業提交功能整合測試腳本
 * 
 * 此腳本用於驗證學生作業提交和顯示功能的完整性
 * 包括前後端代碼的邏輯檢查和潛在問題識別
 */

import fs from 'fs';
import path from 'path';

const PROJECT_ROOT = process.cwd();
const BACKEND_ROOT = path.join(PROJECT_ROOT, 'backend');
const FRONTEND_ROOT = path.join(PROJECT_ROOT, 'frontend');

console.log('🧪 開始學生作業提交功能整合測試...\n');

// 測試結果收集
const testResults = {
    passed: 0,
    failed: 0,
    issues: []
};

function logTest(description, passed, details = '') {
    const status = passed ? '✅' : '❌';
    console.log(`${status} ${description}`);
    if (details) console.log(`   ${details}`);
    if (passed) testResults.passed++;
    else {
        testResults.failed++;
        testResults.issues.push(description);
    }
}

// 檢查文件存在性
function checkFileExists(filePath, description) {
    const fullPath = path.join(PROJECT_ROOT, filePath);
    const exists = fs.existsSync(fullPath);
    logTest(description, exists, exists ? `檔案位置: ${fullPath}` : `檔案不存在: ${fullPath}`);
    return exists;
}

// 檢查代碼內容
function checkCodeContent(filePath, searchPattern, description) {
    const fullPath = path.join(PROJECT_ROOT, filePath);
    if (!fs.existsSync(fullPath)) {
        logTest(description, false, `檔案不存在: ${fullPath}`);
        return false;
    }
    
    const content = fs.readFileSync(fullPath, 'utf8');
    const found = searchPattern.test(content);
    logTest(description, found, found ? '✓ 找到預期內容' : '✗ 未找到預期內容');
    return found;
}

console.log('📁 檢查關鍵檔案存在性...');
checkFileExists('backend/src/controllers/assignment_controller.js', '後端控制器檔案存在');
checkFileExists('backend/src/routes/assignment_route.js', '後端路由檔案存在');
checkFileExists('frontend/src/services/AssignmentApi.js', '前端 API 服務檔案存在');
checkFileExists('frontend/src/components/course_components/AssignmentStudentTable/AssignmentsStudentsTab.jsx', '前端學生作業組件存在');

console.log('\n🔧 檢查後端 API 實作...');
checkCodeContent(
    'backend/src/controllers/assignment_controller.js',
    /async function SubmitAssignment/,
    '後端包含 SubmitAssignment 函數'
);

checkCodeContent(
    'backend/src/controllers/assignment_controller.js',
    /async function GetAssignmentSubmission/,
    '後端包含 GetAssignmentSubmission 函數'
);

checkCodeContent(
    'backend/src/controllers/assignment_controller.js',
    /console\.log.*\[SubmitAssignment\]/,
    '後端 SubmitAssignment 包含日誌記錄'
);

checkCodeContent(
    'backend/src/controllers/assignment_controller.js',
    /submit_user_course_tag.*StudentTag_/,
    '後端正確設定 submit_user_course_tag'
);

console.log('\n🛣️ 檢查後端路由註冊...');
checkCodeContent(
    'backend/src/routes/assignment_route.js',
    /GetAssignmentSubmission/,
    '路由檔案導入 GetAssignmentSubmission'
);

checkCodeContent(
    'backend/src/routes/assignment_route.js',
    /router\.get\('\/\:assignmentId\/submission'.*GetAssignmentSubmission/,
    '註冊 GET submission 路由'
);

checkCodeContent(
    'backend/src/routes/assignment_route.js',
    /router\.post\('\/\:assignmentId\/submit'.*SubmitAssignment/,
    '註冊 POST submit 路由'
);

console.log('\n🌐 檢查前端 API 呼叫...');
checkCodeContent(
    'frontend/src/services/AssignmentApi.js',
    /export const GetAssignmentSubmission/,
    '前端導出 GetAssignmentSubmission 函數'
);

checkCodeContent(
    'frontend/src/services/AssignmentApi.js',
    /JSON\.parse\(localStorage\.getItem\('user'\)\)/,
    '前端正確從 localStorage 取得 user 物件'
);

checkCodeContent(
    'frontend/src/services/AssignmentApi.js',
    /user\?\.user_id/,
    '前端正確提取 user_id'
);

console.log('\n🖥️ 檢查前端組件邏輯...');
checkCodeContent(
    'frontend/src/components/course_components/AssignmentStudentTable/AssignmentsStudentsTab.jsx',
    /const refreshAssignments = async \(\) =>/,
    '前端 refreshAssignments 為 async 函數'
);

checkCodeContent(
    'frontend/src/components/course_components/AssignmentStudentTable/AssignmentsStudentsTab.jsx',
    /refreshSubmissionMapWithAssignments/,
    '前端包含 refreshSubmissionMapWithAssignments 函數'
);

checkCodeContent(
    'frontend/src/components/course_components/AssignmentStudentTable/AssignmentsStudentsTab.jsx',
    /onSuccess.*async.*refreshAssignments/,
    '前端 onSuccess 回調使用 async refreshAssignments'
);

checkCodeContent(
    'frontend/src/components/course_components/AssignmentStudentTable/AssignmentsStudentsTab.jsx',
    /submissionMap\[assignment\.id\]/,
    '前端正確使用 submissionMap 顯示學生提交'
);

console.log('\n📊 測試結果總結');
console.log(`✅ 通過測試: ${testResults.passed}`);
console.log(`❌ 失敗測試: ${testResults.failed}`);

if (testResults.failed > 0) {
    console.log('\n🚨 需要修正的問題:');
    testResults.issues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue}`);
    });
} else {
    console.log('\n🎉 所有測試通過！功能應該可以正常運行。');
}

console.log('\n📋 下一步驟:');
console.log('1. 啟動 MongoDB 資料庫');
console.log('2. 在 backend 目錄執行: npm run dev');
console.log('3. 在 frontend 目錄執行: npm run dev'); 
console.log('4. 按照 TESTING_PLAN.md 進行實際測試');

process.exit(testResults.failed > 0 ? 1 : 0);
