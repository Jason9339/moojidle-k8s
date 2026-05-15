import GetNextCounterId from '#src/utils/get_next_counter_id.js';

import {
    FindSubAssById,
    FindSubAssByAssAndUser,
    FindProjectSubAssignByUserIdAssId,
    InsertSubAss,
    UpdateSubAssById,
    DeleteSubAssById,

    FindSubmissionsByAssignmentId,
    UpdateReviewAssignmentSubmission,
} from '#src/services/submitted_ass_service.js';

import {
    SaveFile,
    DeleteFile,
    DownloadFile
} from '#src/services/file_services/file_storage_service.js';

import { FindCourseById } from "#src/services/course_service.js";
import { FindStudyInJoinUserByCourseId } from '#src/services/course_member_service.js';
import { FindOneUserById } from '#src/services/user_service.js';
import { FindAssignmentById, FindProjectedAssignmentsByCourseId } from '#src/services/assignment_service.js';

async function GetOneSubAss(req, res) {
    try {
        const userId = parseInt(req.params.userId);
        const assId = parseInt(req.params.assignmentId);

        // check if user exist
        const user = await FindOneUserById(userId);
        if (!user) {
            res.status(404).send("user not find while finding sub ass for a user");
            return;
        }

        // check if ass exist
        const ass = await FindAssignmentById(assId);
        if (!ass) {
            res.status(404).send("assignment not find while finding sub ass for a user");
            return;
        }

        const submission = await FindSubAssByAssAndUser(assId, userId);

        if (submission.length == 0) {
            res.status(200).json(null);
            return;
        }

        // send back the newest one if have muiltiple
        res.status(200).json(submission.at(-1));
    } catch (error) {
        console.error(`[GetAssignmentSubmission] 錯誤:`, error);
        res.status(500).json({ message: error.message });
    }
}

async function GetAllStudentsProjectedSubAssign(req, res) {
    try {
        const courseId = parseInt(req.params.courseId);

        // check valid course
        if ((await FindCourseById(courseId)) == null) {
            res.status(404).send("course not found while finding submitted assignments");
            return;
        }

        // get students, FindStudyInJoinUserByCourseId gets:
        // [
        //     {
        //         "user_id": 1,
        //         "name": "User 1",
        //         "contact_ways": [
        //             {
        //                 "approach": "social_media",
        //                 "details": "@user65"
        //             },
        //             {
        //                 "approach": "phone",
        //                 "details": "555-9868"
        //             }
        //         ],
        //         "email": "user1@example.com",
        //         "student_id": 3099
        //     },
        //    ....................
        // ]
        let studentsGrades = await FindStudyInJoinUserByCourseId(courseId);

        // no students in this course
        if (studentsGrades == null || studentsGrades.length == 0) {
            res.status(200).send([]);
            return
        }

        studentsGrades.forEach((student) => {
            // remove redundant property
            delete student.contact_ways;
            delete student.email;

            // prepare the property to fill with grade
            student.sub_ass = [];
        });

        let assigns = await FindProjectedAssignmentsByCourseId(courseId);

        // no assign yet in the course
        if (assigns == null || assigns.length == 0) {
            res.status(200).send(studentsGrades);
            return;
        } else {
            // for each assigns
            for (const ass of assigns) {
                for (const student of studentsGrades) {
                    let subAss = await FindProjectSubAssignByUserIdAssId(student.user_id, ass.ass_id);

                    // push the last grade into the array
                    if(subAss.at(-1) == undefined){
                        student.sub_ass.push({ ass_name: ass.ass_name, percentage: ass.percentage });
                    }else{
                        let finalSubAss = subAss.at(-1);
                        finalSubAss.ass_name = ass.ass_name;
                        finalSubAss.percentage = ass.percentage;
                        finalSubAss.max_score = ass.max_score;
                        student.sub_ass.push(finalSubAss);
                    }
                }
            }
        }

        res.status(200).send(studentsGrades);
    } catch (err) {
        throw err;
    }
}

async function GetStudentProjectedSubAssign(req, res) {
    try {
        const courseId = parseInt(req.params.courseId);
        const userId = parseInt(req.params.userId);

        // check valid course
        if ((await FindCourseById(courseId)) == null) {
            res.status(404).send("course not found while finding submitted assignments for a student");
            return;
        }

        // get students, FindStudyInJoinUserByCourseId gets:
        // [
        //     {
        //         "user_id": 1,
        //         "name": "User 1",
        //         "contact_ways": [
        //             {
        //                 "approach": "social_media",
        //                 "details": "@user65"
        //             },
        //             {
        //                 "approach": "phone",
        //                 "details": "555-9868"
        //             }
        //         ],
        //         "email": "user1@example.com",
        //         "student_id": 3099
        //     },
        //    ....................
        // ]
        const students = await FindStudyInJoinUserByCourseId(courseId);

        // check if student is in that course
        let isStudent = false;
        let studentGrade;
        for (let i = 0; i < students.length; i++) {
            if (students[i].user_id == userId) {
                isStudent = true;
                studentGrade = students[i];

                // remove redundant property
                delete studentGrade.contact_ways;
                delete studentGrade.email;
            }
        }
        if (!isStudent) {
            res.status(404).send("can't find this student in the course");
            return;
        }

        // prepare the property to fill with grade
        studentGrade.sub_ass = [];
        let assigns = await FindProjectedAssignmentsByCourseId(courseId);

        // no assignment yet in the course
        if (assigns == null || assigns.length == 0) {
            res.status(200).send(studentGrade);
            return;
        } else {
            // for each assignment
            for (const assign of assigns) {
                let subAss = await FindProjectSubAssignByUserIdAssId(userId, assign.ass_id);

                // push the last grade into the array
                if (subAss.at(-1) == undefined) {
                    studentGrade.sub_ass.push({ ass_name: assign.ass_name, percentage: assign.percentage });
                } else {
                    let finalSubAss = subAss.at(-1);
                    finalSubAss.ass_name = assign.ass_name;
                    finalSubAss.percentage = assign.percentage;
                    finalSubAss.max_score = assign.max_score;
                    studentGrade.sub_ass.push(finalSubAss);
                }
            }
        }

        res.status(200).send(studentGrade);

    } catch (error) {
        throw error;
    }
}

async function DeleteSubmissionRecord(req, res) {
    try {
        const subAssId = parseInt(req.params.subAssId);

        // check if this sub ass exist
        const subAss = await FindSubAssById(subAssId);
        if (!subAss) {
            res.status(404).send("sub ass not found while deleting");
            return;
        }

        // handle file deletion
        for (let attachment of subAss.attachments) {
            const filePath = attachment.path_to_file; // Use path_to_file field
            const result = await DeleteFile(filePath);

            // since seed has a lot of invalid path, i dont do error handle here,
            // just assume everything is deleted
        }

        const result = await DeleteSubAssById(subAssId);
        if (result) {
            res.status(200).json("delete sub ass successfully");
        } else {
            res.status(500).send("internal error when delete sub ass");
        }
    } catch (error) {
        console.error("DeleteSubmissionRecord 錯誤:", error);
        res.status(500).json({ message: error.message });
    }
}

async function CreateAssignmentSubmission(req, res) {
    try {
        const userId = parseInt(req.params.userId);
        const assId = parseInt(req.params.assignmentId);
        const { userTags, description } = req.body;

        // since using multer to parse the body we have req.files to use
        const files = req.files || [];

        // check if user exist
        const user = await FindOneUserById(userId);
        if (!user) {
            res.status(404).send("user not find while creating sub ass for a user");
            return;
        }

        // check if ass exist
        const ass = await FindAssignmentById(assId);
        if (!ass) {
            res.status(404).send("assignment not find while creating sub ass for a user");
            return;
        }

        // handle file storage
        const savedFiles = [];
        for (const file of files) {
            const savedFile = await SaveFile(file.buffer, decodeURIComponent(file.originalname), "submitted_assignment");
            savedFiles.push({
                filename: savedFile.originalName,
                path_to_file: savedFile.relativeUrl,
                size: file.size || 0 // 添加檔案大小資訊
            });
        }

        const nextSAssId = await GetNextCounterId("submitted_ass");

        const submission = {
            s_ass_id: nextSAssId,
            ass_id: assId,
            submit_by_user_id: userId,
            submit_user_course_tag: userTags || "",
            submit_date: new Date(),
            attachments: savedFiles,
            description: description || ""
        };

        const result = await InsertSubAss(submission);

        if (result) {
            res.status(200).json("create sub ass successfully");
        } else {
            res.status(500).send("internal error when creating sub ass");
        }
    } catch (error) {
        console.error("[CreateAssignmentSubmission] 錯誤:", error);
        res.status(500).json({ message: error.message });
    }
}

async function UpdateAssignmentSubmission(req, res) {
    try {
        const subAssId = parseInt(req.params.subAssId);
        const { userTags, description, keepFiles } = req.body;

        // since using multer to parse the body we have req.files to use
        const files = req.files || [];

        // check if this sub ass exist
        const subAss = await FindSubAssById(subAssId);
        if (!subAss) {
            res.status(404).send("sub ass not found while updating");
            return;
        }

        // 處理要保留的檔案
        let filesToKeep = [];
        if (keepFiles) {
            try {
                filesToKeep = JSON.parse(keepFiles);
            } catch (e) {
                console.error("解析 keepFiles 失敗:", e);
                filesToKeep = [];
            }
        }

        // handle file storage - 保存新上傳的檔案
        const newSavedFiles = [];
        for (const file of files) {
            const savedFile = await SaveFile(file.buffer, decodeURIComponent(file.originalname), "submitted_assignment");
            newSavedFiles.push({
                filename: savedFile.originalName,
                path_to_file: savedFile.relativeUrl,
                size: file.size || 0 // 添加檔案大小資訊
            });
        }

        // 刪除不在 keepFiles 中的原有檔案
        const originalFiles = subAss.attachments || [];
        for (const origFile of originalFiles) {
            const shouldKeep = filesToKeep.some(keepFile => 
                keepFile.filename === origFile.filename || 
                keepFile.path_to_file === origFile.path_to_file
            );

            if (!shouldKeep) {
                // 檔案不在保留列表中，需要刪除
                const filePath = origFile.path_to_file;
                
                // 呼叫刪除函數，但不因為刪除失敗而中斷整個流程
                const deleteResult = await DeleteFile(filePath);
            }
        }

        // 組合最終的檔案列表：保留的檔案 + 新上傳的檔案
        const finalAttachments = [
            ...filesToKeep.map(keepFile => ({
                filename: keepFile.filename,
                path_to_file: keepFile.path_to_file,
                // 如果有 size 欄位就保留，否則設為 0
                ...(keepFile.size !== undefined && { size: keepFile.size })
            })),
            ...newSavedFiles
        ];

        const result = await UpdateSubAssById(
            subAssId, 
            userTags || "", // 確保不是 undefined
            finalAttachments, 
            description || "", // 確保不是 undefined
            new Date() // 添加當前時間
        );

        if (result != 0) {
            res.status(200).json("update sub ass successfully");
        } else {
            res.status(500).send("internal error when updating sub ass");
        }
    } catch (error) {
        console.error("[UpdateAssignmentSubmission] 錯誤:", error);
        res.status(500).json({ message: error.message });
    }
}

async function DownloadSubmittedAss(req, res) {
    const { path: filePathParam, filename } = req.query;

    if (!filePathParam) {
        return res.status(400).json({ message: "Missing path parameter" });
    }

    return DownloadFile(filePathParam, res, { downloadName: filename });
}

async function GetAssignmentSubmissions(req, res) {
    try {
        const { assignmentId } = req.params;

        // Validate input
        if (!assignmentId) {
            return res.status(400).json({ message: "缺少作業ID" });
        }
        const assId = parseInt(assignmentId);

        const ass = await FindAssignmentById(assId); 
        // Get course ID from assignment ID
        if (!ass) {
            return res.status(404).json({ message: "找不到對應的課程" });
        }
        const courseId = ass.in_course_id; 

        const studentInCourse = await FindStudyInJoinUserByCourseId(courseId);

        // console.log("學生列表:", studentInCourse);
        
        const submissions = await FindSubmissionsByAssignmentId(assId);

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
        
        // 先檢查提交是否存在
        const existingSubmission = await FindSubAssById(submitAssignmentId);
        if (!existingSubmission) {
            return res.status(400).json({message: "沒有該繳交作業"})
        }
        
        const ass = await FindAssignmentById(existingSubmission.ass_id);


        const score_lb = 0;
        // 獲取作業的最大分數 
        const score_ub = ass.max_score;
        if (score < score_lb || score > score_ub) {
            return res.status(400).json({message: "分數不得超過上限或為負數"})
        }
        
        // Call service function to update the submission
        const result = await UpdateReviewAssignmentSubmission(submitAssignmentId, score, graderId);
        // console.log("評分結果:", result);
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


export {
    GetOneSubAss,
    GetAllStudentsProjectedSubAssign,
    GetStudentProjectedSubAssign,
    CreateAssignmentSubmission,
    UpdateAssignmentSubmission,
    DeleteSubmissionRecord,
    DownloadSubmittedAss,


    GetAssignmentSubmissions,
    ReviewAssignmentSubmission,
};
