import {
    FindFromExamJoinStudyInJoinCourseByUserId,
    FindProjectedExamsByCourseId,
    FindExamsByCourseId,

    AddExamByCourseId,

    UpdateOneExamScoreById
} from '#src/services/exam_service.js';

import {
    FindCourseById
} from '#src/services/course_service.js';

import { 
    SaveFile, 
    DeleteFile,
    DownloadFile
} from '#src/services/file_services/file_storage_service.js';

import {
    SendNotification, SendNotified
} from '#src/services/notification_service.js'

import {
    FindStudyInJoinUserByCourseId
} from '#src/services/course_member_service.js'

import CalculateWeek from '#src/utils/calculate_week.js';

async function GetUpcomingExamsByUserId(req, res) {
    try {
        const upcomingExams = await FindFromExamJoinStudyInJoinCourseByUserId(req.query.user_id);
        res.status(200).json(upcomingExams); // Send the fetched data as a JSON response
    } catch (error) {
        console.error("Error in GetUpcomingExams:", error);
        res.status(500).send("Failed to fetch upcoming exams");
    }
}

async function GetProjectedExamsByCourseId(req, res) {
    try {
        const courseId = parseInt(req.params.courseId);

        // check if course exist
        if((await FindCourseById(courseId)) == null){
            res.status(404).send("course not found while finding simplified exams");
            return;
        }

        // get the exmas in the course
        let exams = await FindProjectedExamsByCourseId(courseId);

        // can only be [] or [.....]
        if(exams === undefined){
            res.status(500).send("error on finding exams in the course");
        }

        res.status(200).send(exams);

    } catch (err) {
        res.status(500).send(err);
    }
}

async function UpdateExamScore(req, res) {
    try {
        const examId = parseInt(req.params.examId);
        const payload = req.body;

        if (!payload || !payload.max_score || !payload.percentage ||
            typeof payload.max_score != "number" || typeof payload.percentage != "number"
        ) {
            return res.status(400).send("invalid exam Data");
        }

        // get the exmas in the course
        let result = await UpdateOneExamScoreById(examId, payload.max_score, payload.percentage);

        if(result == null){
            res.status(404).send("exam not found");
        }

        res.status(200).send("Update successful!");
    } catch (err) {
        res.status(500).send(err);
    }
}

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
                week: week,
                maxScore: exam.max_score || 100, // 使用傳入的值或預設100
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
            const savedFile = await SaveFile(file.buffer, decodeURIComponent(file.originalname), "exam", {
                contentType: file.mimetype,
                size: file.size,
                uploadedByUserId: parseInt(createByUserId),
                relatedType: "course",
                relatedId: parseInt(courseId)
            });
            savedFiles.push({
                filename: savedFile.originalName,
                url: savedFile.relativeUrl
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
        const userIdsOnly = students.map(user => ({ user_id: user.user_id }));
        const notification = {
            event_id: parseInt(courseId),
            event_category: "exam",
            context: `${course.name} 新增了考試 ${examName}`,
        }
        const notificationres = await SendNotification(notification);
        await SendNotified(notificationres.notification.n_id,userIdsOnly)

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
async function DownloadExam(req, res) {
    const { path: filePathParam, filename } = req.query;
    if (!filePathParam) return res.status(400).json({ message: "Missing path parameter" });

    return DownloadFile(filePathParam, res, { downloadName: filename });
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
    GetProjectedExamsByCourseId,
    GetCourseExams,
    DownloadExam,

    UploadExam,
    
    UpdateExamScore,
    // DeleteExam
    // getComingExams
}
