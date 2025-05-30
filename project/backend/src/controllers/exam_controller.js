import {
    FindFromExamJoinStudyInJoinCourseByUserId,
    GetExamsByCourseId,
    AddExamByCourseId,
    AddExamAttachment,
    RemoveExamAttachment,
    FindExamById
    // getComingExams as getComingExamsService
} from '#src/services/exam_service.js';

import { SaveFile, DeleteFile } from '#src/services/file_services/file_storage_service.js';
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function GetUpcomingExamsByUserId(req, res) {
    try {
        const upcomingExams = await FindFromExamJoinStudyInJoinCourseByUserId(req.query.user_id);
        res.status(200).json(upcomingExams); // Send the fetched data as a JSON response
    } catch (error) {
        console.error("Error in GetUpcomingExams:", error);
        res.status(500).send("Failed to fetch upcoming exams");
    }
}

// 取得即將到來的考試/活動
// async function getComingExams (req, res) {
//     try {
//         // 調用服務層獲取資料
//         const comingExams = await getComingExamsService();
        
//         // 返回資料給客戶端
//         res.json(comingExams);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

async function CourseExams(req, res) {
    try {
        const courseId = req.params.courseId;
        const exams = await GetExamsByCourseId(courseId);
        return res.status(200).json(exams);
    } catch (error) {
        console.error("Error in CourseExams:", error);
        res.status(500).send("Failed to fetch exams for course");
    }
}

async function AddExam(req, res) {
    try {
        const newExam = await AddExamByCourseId(req.body);
        res.status(201).json({ message: "Exam added successfully", exam: newExam });
    } catch (error) {
        console.error("Error in AddExam:", error);
        res.status(500).send("Failed to add exam");
    }
}

// 上傳考試附件
async function UploadExamAttachment(req, res) {
    try {
        const { examId } = req.params;
        const files = req.files || [];
        if (!files.length) return res.status(400).json({ message: "No files uploaded" });

        const savedFiles = [];
        for (const file of files) {
            const savedFile = await SaveFile(file.buffer, decodeURIComponent(file.originalname), "exam");
            savedFiles.push({
                filename: savedFile.originalName,
                path_to_file: savedFile.relativeUrl
            });
        }

        await AddExamAttachment(parseInt(examId), savedFiles);

        res.status(200).json({
            message: "考試附件上傳成功",
            filesCount: savedFiles.length,
            fileNames: savedFiles.map(f => f.filename)
        });
    } catch (error) {
        console.error("上傳考試附件錯誤:", error);
        res.status(500).json({ message: error.message });
    }
}

// 下載考試附件
function DownloadExamAttachment(req, res) {
    const { path: filePathParam } = req.query;
    if (!filePathParam) return res.status(400).json({ message: "Missing path parameter" });

    const sanitizedPath = filePathParam.replace(/^\/+/, "");
    const filePath = path.join(__dirname, "../../", sanitizedPath);

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error("❌ 檔案不存在:", filePath);
            return res.status(404).json({ message: "File not found" });
        }
        res.setHeader("Content-Disposition", `attachment; filename="${path.basename(filePath)}"`);
        res.download(filePath, (err) => {
            if (err) {
                console.error("❌ 下載錯誤:", err);
                res.status(500).json({ message: "Error downloading file" });
            }
        });
    });
}

// 刪除考試附件
async function DeleteExamAttachment(req, res) {
    try {
        const { path: filePath, examId, filename } = req.query;
        if (!filePath || !examId || !filename) {
            return res.status(400).json({ message: "缺少必要參數" });
        }
        const result = await DeleteFile(filePath);
        if (result) {
            await RemoveExamAttachment(parseInt(examId), filename);
            return res.status(200).json({ message: "考試附件刪除成功" });
        } else {
            return res.status(404).json({ message: "考試附件不存在或刪除失敗" });
        }
    } catch (error) {
        console.error("刪除考試附件時發生錯誤:", error);
        res.status(500).json({ message: "刪除考試附件時發生錯誤", error: error.message });
    }
}

export {
    GetUpcomingExamsByUserId,
    CourseExams,
    AddExam,
    UploadExamAttachment,
    DownloadExamAttachment,
    DeleteExamAttachment
    // getComingExams
}