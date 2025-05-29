import {
    GetToDoAssignmentsByUserId as GetToDoAssignmentsByUserIdService,
    FindAssignmentsByCourseId,
    GetCourseIdByAssignmentId,
    GetSubmissionsByAssignmentId,
    ReviewAssignmentSubmissionService,
    InsertAssignmentToDB
} from '#src/services/assignment_service.js';

import { 
    FindCourseById

} from '#src/services/course_service.js';

import {
    FindStudyInJoinUserByCourseId
} from '#src/services/course_member_service.js'

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





async function GetAssignmentSubmissions(req, res) { //TODO: service 重構
    try {
        const { assignmentId } = req.params;

        console.log(assignmentId)

        // Validate input
        if (!assignmentId) {
            return res.status(400).json({ message: "缺少作業ID" });
        }
        const assId = parseInt(assignmentId);

        // Get course ID from assignment ID
        const courseId = await GetCourseIdByAssignmentId(assId); 
        if (!courseId) {
            return res.status(404).json({ message: "找不到對應的課程" });
        }
        
        const studentInCourse = await FindStudyInJoinUserByCourseId(courseId);

        console.log("學生列表:", studentInCourse);
        
        const submissions = await GetSubmissionsByAssignmentId(assId);

        // Create a map of submissions by user ID for quick lookup
        const submissionByUserId = {};
        submissions.forEach(submission => {
            submissionByUserId[submission.submit_by_user_id] = submission;
        });

        // Create comprehensive student status list with submission data where available
        const studentStatusList = studentInCourse.map(student => {
            const submission = submissionByUserId[student.user_id];
            return {
                ...student,
                submission_status: submission ? "已繳交" : "未繳交",
                submission_date: submission ? submission.submit_date : null,
                grading_status: submission ? submission.status : null,
                score: submission ? submission.score : null,
                submission_id: submission ? submission.s_ass_id : null,
                has_attachments: submission && submission.attachments ? submission.attachments.length > 0 : false
            };
        });

        // Split into submitted and non-submitted lists
        const submittedStudents = studentStatusList.filter(student => student.submission_status === "已繳交");
        const nonSubmittedStudents = studentStatusList.filter(student => student.submission_status === "未繳交");

        const submissionData = {
            all_students: studentStatusList,
            submitted: submittedStudents,
            non_submitted: nonSubmittedStudents,
            submissions: submissions
        };



        return res.status(200).json({
            submissions: submissionData.submissions,
            nonSubmittingStudents: submissionData.non_submitted,
            studentStatusList: submissionData.all_students,
            submittedStudents: submissionData.submitted
        });
    } catch (error) {
        console.error("獲取繳交作業失敗", error);
        res.status(500).json({ message: error.message });
    }
}

async function ReviewAssignmentSubmission(req, res) {
    try {
        const { submitAssignmentId } = req.params;
        const { score, graderId } = req.body;
        
        // Validate required inputs
        if (!submitAssignmentId) {
            return res.status(400).json({ message: "缺少作業提交ID" });
        }
        
        if (score === undefined || score === null) {
            return res.status(400).json({ message: "缺少評分分數" });
        }
        
        
        // Call service function to update the submission
        const result = await ReviewAssignmentSubmissionService(submitAssignmentId, score, graderId);
        console.log("評分結果:", result);
        // Return success response
        return res.status(200).json({
            message: "作業評分成功",
            updated: result.updated,
        });
    } catch (error) {
        console.error("評分作業時發生錯誤:", error);
        
        // Return appropriate error response based on the type of error
        if (error.message.includes("Score must be")) {
            return res.status(400).json({ message: error.message });
        } else if (error.message.includes("not found")) {
            return res.status(404).json({ message: "找不到指定的作業提交" });
        } else {
            return res.status(500).json({ message: "伺服器錯誤，無法完成評分" });
        }
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
            description
        } = req.body;

        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        // 儲存檔案到硬碟
        const savedFile = await SaveFile(file.buffer, decodeURIComponent(file.originalname), "assignment");
        const now = new Date();

        const assignmentData = {
            in_course_id: parseInt(courseId),
            create_by_user_id: parseInt(createByUserId),
            ass_name: assName,
            start_date: new Date(startDate),
            end_date: new Date(endDate),
            description,
            create_date: now,
            max_score: 100, // 預設最高分數
            percentage: 0, // 預設佔總成績的百分比
            attachments: [
                {
                    filename: savedFile.originalName,
                    path_to_file: savedFile.relativeUrl
                }
            ]
        };

        const dbResult = await InsertAssignmentToDB(assignmentData);

        res.status(200).json({
            message: "上傳作業成功",
            fileId: savedFile.fileId,
            fileName: savedFile.originalName,
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
    console.log("✅ Resolved file path:", filePath);

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

export {
    GetToDoAssignmentsByUserId,
    GetCourseAssignments,
    GetAssignmentSubmissions,
    ReviewAssignmentSubmission,
    UploadAssignment,
    DownloadAssignment,
    DeleteAssignment
};
