import {
    FindFromExamJoinStudyInJoinCourseByUserId,
    FindExamsByCourseId,
    AddExamByCourseId,
    // getComingExams as getComingExamsService
} from '#src/services/exam_service.js';

import { 
    FindCourseById
} from '#src/services/course_service.js';

import { 
    SaveFile, 
    DeleteFile 
} from '#src/services/file_services/file_storage_service.js';

import {
    SendNotify
} from '#src/services/notification_service.js'

import {
    FindStudyInJoinUserByCourseId
} from '#src/services/course_member_service.js'

import CalculateWeek from '#src/utils/calculate_week.js';

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

async function GetCourseExams(req, res) {
    try {
        const { courseId } = req.params;

        let formattedExams = await FindExamsByCourseId(courseId);
        const course = await FindCourseById(courseId);

        // 使用 start_date 而非 create_date
        const courseStartDate = course.start_date || course.create_date; // 如果沒有 start_date 則使用 create_date 作為備用
        const courseWeekNum = course.week_num || 16; // 使用課程設定的週數，如果沒有則默認為16週

        formattedExams = formattedExams.map((exam) => {
            const examDate = exam.start_date || exam.create_date;
            const week = CalculateWeek(courseStartDate, examDate, courseWeekNum);
            return {
                id: exam.exam_id,
                name: exam.exam_name,
                description: exam.description,
                dueDate: exam.end_date,
                startDate: exam.start_date,
                attachments: exam.attachments || [],
                week: week
            };
        })

        res.json(formattedExams);
    } catch (error) {
        console.error("取得課程作業錯誤:", error);
        res.status(500).json({ message: error.message });
    }
}

// 上傳考試附件
async function UploadExam(req, res) {
    try {
        const { courseId } = req.params;
        const {
            createByUserId,
            examName,
            startDate,
            endDate,
            description,
            maxScore,
            percentage
        } = req.body;

        const files = req.files || [];

        const savedFiles = [];
        for (const file of files) {
            const savedFile = await SaveFile(file.buffer, decodeURIComponent(file.originalname), "exam");
            savedFiles.push({
                filename: savedFile.originalName,
                path_to_file: savedFile.relativeUrl
            });
        }

        const now = new Date();

        const examData = {
            in_course_id: parseInt(courseId),
            create_by_user_id: parseInt(createByUserId),
            exam_name: examName,
            start_date: new Date(startDate),
            end_date: new Date(endDate),
            description,
            create_date: now,
            max_score: parseFloat(maxScore) || 100, // 使用傳入的值或預設100
            percentage: parseFloat(percentage) || 0, // 使用傳入的值或預設0
            attachments: savedFiles // 多檔案附件
        };

        const dbResult = await AddExamByCourseId(examData);
        console.log(dbResult);

        //發送通知給學生
        const course = await FindCourseById(courseId);
        const students = await FindStudyInJoinUserByCourseId(courseId);
        const notification = {
            event_id: parseInt(courseId),
            event_category: "test",
            context: `${course.name} 新增了考試 ${examName}`,
            notified_users: students
        }
        const notificationres = await SendNotify(notification);
        console.log(notificationres);

        res.status(200).json({
            message: savedFiles.length > 0 ? "考試上傳成功（包含附件）" : "考試上傳成功",
            filesCount: savedFiles.length,
            fileNames: savedFiles.map(f => f.filename),
            data: dbResult
        });
    } catch (error) {
        console.error("上傳考試附件錯誤:", error);
        res.status(500).json({ message: error.message });
    }
}

// 下載考試附件
function DownloadExam(req, res) {
    const { path: filePathParam } = req.query;
    if (!filePathParam) return res.status(400).json({ message: "Missing path parameter" });

    const sanitizedPath = filePathParam.replace(/^\/+/, "");
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

// async function DeleteExam(req, res) {
//     try {
//         const { path: filePath } = req.query;
        
//         if (!filePath) {
//             return res.status(400).json({ message: "缺少檔案路徑參數" });
//         }
        
//         const result = await DeleteFile(filePath);
        
//         if (result) {
//             return res.status(200).json({ message: "考試檔案刪除成功" });
//         } else {
//             return res.status(404).json({ message: "考試檔案不存在或刪除失敗" });
//         }
//     } catch (error) {
//         console.error("刪除考試檔案時發生錯誤:", error);
//         res.status(500).json({ message: "刪除考試檔案時發生錯誤", error: error.message });
//     }
// }

export {
    GetUpcomingExamsByUserId,
    GetCourseExams,
    UploadExam,
    DownloadExam,
    // DeleteExam
    // getComingExams
}