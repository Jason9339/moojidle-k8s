import {
    GetToDoAssignmentsByUserId as GetToDoAssignmentsByUserIdService,
    FindAssignmentsByCourseId,
    InsertAssignmentToDB
} from '#src/services/assignment_service.js';

import {
    FindStudyInJoinUserByCourseId,
} from '#src/services/course_member_service.js';

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
import { SendNotification, SendNotified } from '#src/services/notification_service.js';

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
            return {
                id: assignment.ass_id,
                name: assignment.ass_name,
                description: assignment.description,
                dueDate: assignment.end_date,
                startDate: assignment.start_date,
                attachments: assignment.attachments || [],
                week: week
            };
        })

        res.json(formattedAssignments);
    } catch (error) {
        console.error("取得課程作業錯誤:", error);
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
        const files = req.files || [];

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

        const dbResult = await InsertAssignmentToDB(assignmentData);

        //發送notification
        const course = await FindCourseById(courseId);
        const students = await FindStudyInJoinUserByCourseId(courseId);
        const userIdsOnly = students.map(user => ({ user_id: user.user_id }));
        const notification = {
            event_id: course.course_id,
            event_category: "homework",
            context: `${course.name} 新增作業 ${assName}`,
        }
        const notificationres = await SendNotification(notification);
        await SendNotified(notificationres.notification.n_id,userIdsOnly)

        res.status(200).json({
            message: savedFiles.length > 0 ? "作業上傳成功（包含附件）" : "作業上傳成功",
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

    const sanitizedPath = filePathParam.replace(/^\/+/, ""); // 去除開頭的 "/"
    // 從當前控制器目錄往上回到 backend 根目錄，然後加上檔案路徑
    const filePath = path.join(__dirname, "../../", sanitizedPath);
    // console.log("Resolved file path:", filePath);

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error("❌ 檔案不存在:", filePath);
            return res.status(404).json({ message: "File not found" });
        }

        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${path.basename(filePath)}"`
        );

        res.download(filePath, (err) => {
            if (err) {
                console.error("❌ 下載錯誤:", err);
                res.status(500).json({ message: "Error downloading file" });
            }
        });
    });
}

// 刪除作業檔案
// async function DeleteAssignment(req, res) {
//     try {
//         const { path: filePath } = req.query;
        
//         if (!filePath) {
//             return res.status(400).json({ message: "缺少檔案路徑參數" });
//         }
        
//         const result = await DeleteFile(filePath);
        
//         if (result) {
//             return res.status(200).json({ message: "作業檔案刪除成功" });
//         } else {
//             return res.status(404).json({ message: "作業檔案不存在或刪除失敗" });
//         }
//     } catch (error) {
//         console.error("刪除作業檔案時發生錯誤:", error);
//         res.status(500).json({ message: "刪除作業檔案時發生錯誤", error: error.message });
//     }
// }

export {
    GetToDoAssignmentsByUserId,
    GetCourseAssignments,
    UploadAssignment,
    DownloadAssignment,
    // DeleteAssignment
};