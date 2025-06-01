import {
    GetToDoAssignmentsByUserId as GetToDoAssignmentsByUserIdService,
    FindAssignmentsByCourseId,
    GetAssignmentSubmissionTime,
    InsertAssignmentToDB,
    CreateAssignmentService,
    GetCourseAssignmentsService,
    GetAssignmentSubmissionTimeService,
    SubmitAssignmentService,
    GetAssignmentSubmissionService,
    DeleteSubmittedFileService,
    DeleteSubmissionRecordService
} from '#src/services/assignment_service.js';

import { 
    FindCourseById
} from '#src/services/course_service.js';

import {
    SaveFile,
    DeleteFile
} from '#src/services/file_services/file_storage_service.js';

import CalculateWeek from '#src/utils/calculate_week.js';

import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// 模擬 __dirname，因為使用的是 ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function GetToDoAssignmentsByUserId(req, res) {
    try {
        const toDoAssignments = await GetToDoAssignmentsByUserIdService(req.query.user_id);
        res.status(200).json(toDoAssignments); // Send the fetched data as a JSON response
    } catch (error) {
        console.error("Error in GetToDoAssignments:", error);
        res.status(500).send("Failed to fetch to-do assignments");
    }
}

// 取得特定課程的作業
async function GetCourseAssignments(req, res) {
    try {
        const { courseId } = req.params;

        let formattedAssignments = await FindAssignmentsByCourseId(courseId);
        const course = await FindCourseById(courseId);

        // 使用 start_date 而非 create_date
        const courseStartDate = course.start_date || course.create_date; // 如果沒有 start_date 則使用 create_date 作為備用
        const courseWeekNum = course.week_num || 16; // 使用課程設定的週數，如果沒有則默認為16週

        formattedAssignments = formattedAssignments.map((assignment) => {
            const assignmentDate = assignment.start_date || assignment.create_date;
            const week = CalculateWeek(courseStartDate, assignmentDate, courseWeekNum);
            // 處理 attachments，將 url 轉換為 path_to_file
            const processedAttachments = (assignment.attachments || []).map(att => {
                let path_to_file = att.path_to_file || att.url;
                if (att.url && att.url.includes('/assignments/')) {
                    const pathPart = att.url.split('/assignments/')[1];
                    path_to_file = `uploads/assignment/${pathPart}`;
                } else if (att.url && att.url.includes('/submit/')) {
                    const pathPart = att.url.split('/submit/')[1];
                    path_to_file = `uploads/submit/${pathPart}`;
                } else if (att.url && !att.url.startsWith('http')) {
                    path_to_file = att.url;
                }
                return {
                    ...att,
                    path_to_file
                };
            });
            return {
                id: assignment.ass_id,
                name: assignment.ass_name,
                description: assignment.description,
                dueDate: assignment.end_date,
                startDate: assignment.start_date,
                attachments: processedAttachments,
                week: week
            };
        })
        res.json(formattedAssignments);
    } catch (error) {
        console.error("取得課程作業錯誤:", error);
        res.status(500).json({ message: error.message });
    }
}

// 取得作業繳交時間
async function GetAssignmentSubmissionTimeController(req, res) {
    try {
        const { assignmentId } = req.params;
        const { userId } = req.query;
        if (!userId) return res.status(400).json({ message: "缺少 userId" });

        const submitTime = await GetAssignmentSubmissionTimeService(assignmentId, userId);
        res.json({ submitTime });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// 上傳課程作業
async function UploadAssignment(req, res) {
    try {
        const { courseId } = req.params;
        const {
            createByUserId,
            assName,
            startDate,
            endDate,
            description,
            maxScore,
            percentage
        } = req.body;

        // 支援多檔案上傳
        const files = req.files || []; // 使用 req.files 而不是 req.file
        if (!files || files.length === 0) {
            return res.status(400).json({ message: "No files uploaded" });
        }

        // 儲存所有檔案到硬碟
        const savedFiles = [];
        for (const file of files) {
            const savedFile = await SaveFile(file.buffer, decodeURIComponent(file.originalname), "assignment");
            savedFiles.push({
                filename: savedFile.originalName,
                path_to_file: savedFile.relativeUrl
            });
        }

        const now = new Date();

        const assignmentData = {
            in_course_id: parseInt(courseId),
            create_by_user_id: parseInt(createByUserId),
            ass_name: assName,
            start_date: new Date(startDate),
            end_date: new Date(endDate),
            description,
            create_date: now,
            max_score: parseFloat(maxScore) || 100, // 使用傳入的值或預設100
            percentage: parseFloat(percentage) || 0, // 使用傳入的值或預設0
            attachments: savedFiles // 多檔案附件
        };

        const dbResult = await CreateAssignmentService(assignmentData);

        res.status(200).json({
            message: "上傳作業成功",
            filesCount: savedFiles.length,
            fileNames: savedFiles.map(f => f.filename),
            data: dbResult
        });
    } catch (error) {
        console.error("上傳作業錯誤:", error);
        res.status(500).json({ message: error.message });
    }
}

// 下載作業檔案
function DownloadAssignment(req, res) {
    const { path: filePathParam } = req.query;

    if (!filePathParam) {
        return res.status(400).json({ message: "Missing path parameter" });
    }

    const sanitizedPath = filePathParam.replace(/^\/+/,''); // 去除開頭的 "/"
    const filePath = path.join(__dirname, "../../", sanitizedPath);
    console.log("✅ [DownloadAssignment] 參數 path:", filePathParam);
    console.log("✅ [DownloadAssignment] 實際檔案路徑:", filePath);

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error("❌ 檔案不存在:", filePath);
            return res.status(404).json({ message: "File not found", filePath });
        }

        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${path.basename(filePath)}"`
        );

        res.download(filePath, (err) => {
            if (err) {
                console.error("❌ 下載錯誤:", err);
                res.status(500).json({ message: "Error downloading file", filePath });
            }
        });
    });
}

// 刪除作業檔案
async function DeleteAssignment(req, res) {
    try {
        const { path: filePath } = req.query;
        
        if (!filePath) {
            return res.status(400).json({ message: "缺少檔案路徑參數" });
        }
        
        const result = await DeleteFile(filePath);
        
        if (result) {
            return res.status(200).json({ message: "作業檔案刪除成功" });
        } else {
            return res.status(404).json({ message: "作業檔案不存在或刪除失敗" });
        }
    } catch (error) {
        console.error("刪除作業檔案時發生錯誤:", error);
        res.status(500).json({ message: "刪除作業檔案時發生錯誤", error: error.message });
    }
}

// 學生繳交作業 - 支援多檔案上傳和修改
async function SubmitAssignment(req, res) {
    try {
        const { assignmentId } = req.params;
        const { submitByUserId, description } = req.body;
        const files = req.files || [];
        
        console.log(`[SubmitAssignment] 開始處理學生作業提交: assignmentId=${assignmentId}, submitByUserId=${submitByUserId}, 檔案數量=${files.length}`);
        
        if (!assignmentId || !submitByUserId) {
            return res.status(400).json({ message: "缺少必要參數" });
        }
        
        let savedFiles = [];
        
        // 如果有新檔案要上傳，先儲存到硬碟
        if (files.length > 0) {
            console.log(`[SubmitAssignment] 開始儲存 ${files.length} 個檔案`);
            for (const file of files) {
                const savedFile = await SaveFile(file.buffer, decodeURIComponent(file.originalname), "submit");
                savedFiles.push({
                    filename: savedFile.originalName,
                    url: savedFile.relativeUrl,
                    path_to_file: savedFile.relativeUrl,
                    fileId: savedFile.fileId
                });
                console.log(`[SubmitAssignment] 檔案已儲存: ${savedFile.originalName}`);
            }
        }
        
        // 調用 service 層處理業務邏輯
        const result = await SubmitAssignmentService(assignmentId, submitByUserId, description, savedFiles);
        
        if (result.deleted) {
            res.status(200).json({ 
                message: "作業提交記錄已完全清除",
                data: result
            });
        } else {
            res.status(200).json({ 
                message: files.length > 0 ? "檔案上傳成功" : "作業更新成功", 
                data: result 
            });
        }
        
    } catch (error) {
        console.error("學生繳交作業錯誤:", error);
        res.status(500).json({ message: error.message });
    }
}

// 取得某學生針對某作業的繳交紀錄
async function GetAssignmentSubmission(req, res) {
    try {
        const { assignmentId } = req.params;
        const { user_id } = req.query;
        console.log(`[GetAssignmentSubmission] 查詢參數: assignmentId=${assignmentId}, user_id=${user_id}`);
        
        if (!user_id) return res.status(400).json({ message: "缺少 user_id" });
        
        const submission = await GetAssignmentSubmissionService(assignmentId, user_id);
        
        console.log(`[GetAssignmentSubmission] 查詢結果:`, submission);
        res.json({ data: submission });
    } catch (error) {
        console.error(`[GetAssignmentSubmission] 錯誤:`, error);
        res.status(500).json({ message: error.message });
    }
}

// 刪除學生提交的單個檔案
async function DeleteSubmittedFile(req, res) {
    try {
        const { assignmentId } = req.params;
        const { submitByUserId, fileUrl } = req.body;
        
        console.log(`[DeleteSubmittedFile] 刪除檔案: assignmentId=${assignmentId}, submitByUserId=${submitByUserId}, fileUrl=${fileUrl}`);
        
        if (!assignmentId || !submitByUserId || !fileUrl) {
            return res.status(400).json({ message: "缺少必要參數" });
        }
        
        // 調用 service 層處理業務邏輯
        const result = await DeleteSubmittedFileService(assignmentId, submitByUserId, fileUrl);
        
        // 刪除硬碟上的檔案
        try {
            await DeleteFile(result.deleteFilePath);
            console.log(`[DeleteSubmittedFile] 硬碟檔案已刪除: ${result.deleteFilePath}`);
        } catch (deleteError) {
            console.warn(`[DeleteSubmittedFile] 刪除硬碟檔案失敗: ${deleteError.message}`);
            // 繼續執行，不要因為檔案刪除失敗而中斷整個操作
        }
        
        if (result.deleted) {
            res.status(200).json({ 
                message: "檔案刪除成功，提交記錄已完全清除",
                data: { 
                    deleted: true,
                    reason: result.reason
                }
            });
        } else {
            res.status(200).json({ 
                message: "檔案刪除成功",
                data: { 
                    attachments: result.attachments,
                    deleted: false 
                }
            });
        }
        
    } catch (error) {
        console.error("刪除提交檔案錯誤:", error);
        res.status(500).json({ message: error.message });
    }
}

// 完全刪除學生的作業提交記錄
async function DeleteSubmissionRecord(req, res) {
    try {
        const { assignmentId } = req.params;
        const { submitByUserId } = req.body;
        
        console.log(`[DeleteSubmissionRecord] 刪除提交記錄: assignmentId=${assignmentId}, submitByUserId=${submitByUserId}`);
        
        if (!assignmentId || !submitByUserId) {
            return res.status(400).json({ message: "缺少必要參數" });
        }
        
        // 調用 service 層處理業務邏輯
        const result = await DeleteSubmissionRecordService(assignmentId, submitByUserId);
        
        // 刪除所有相關檔案
        if (result.attachments && result.attachments.length > 0) {
            for (const attachment of result.attachments) {
                const deleteFilePath = attachment.path_to_file || attachment.url;
                try {
                    await DeleteFile(deleteFilePath);
                    console.log(`[DeleteSubmissionRecord] 硬碟檔案已刪除: ${deleteFilePath}`);
                } catch (deleteError) {
                    console.warn(`[DeleteSubmissionRecord] 刪除硬碟檔案失敗: ${deleteError.message}`);
                }
            }
        }
        
        res.status(200).json({ 
            message: "作業提交記錄已完全刪除",
            data: { deleted: true }
        });
        
    } catch (error) {
        console.error("刪除提交記錄錯誤:", error);
        res.status(500).json({ message: error.message });
    }
}

export {
    GetToDoAssignmentsByUserId,
    GetCourseAssignments,
    GetAssignmentSubmissionTimeController,
    UploadAssignment,
    DownloadAssignment,
    DeleteAssignment,
    SubmitAssignment,
    GetAssignmentSubmission, // 新增導出
    DeleteSubmittedFile, // 新增刪除學生提交檔案的功能
    DeleteSubmissionRecord // 新增完全刪除學生作業提交記錄的功能
};