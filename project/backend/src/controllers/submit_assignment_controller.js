import {
    FindSubmissionsByAssignmentId,
    ReviewAssignmentSubmissionService,
    FindSubmissionAssignmentBySubmitAssId
} from '#src/services/submit_assignment_service.js';

import { FindCourseIdByAssignmentId, FindAssignmentMaxScore } from '#src/services/assignment_service.js';

import { FindStudyInJoinUserByCourseId } from '#src/services/course_member_service.js';

async function GetAssignmentSubmissions(req, res) {
    try {
        const { assignmentId } = req.params;

        console.log(assignmentId)

        // Validate input
        if (!assignmentId) {
            return res.status(400).json({ message: "缺少作業ID" });
        }
        const assId = parseInt(assignmentId);

        // Get course ID from assignment ID
        const courseId = await FindCourseIdByAssignmentId(assId); 
        // console.log("courseId", courseId)
        if (!courseId) {
            return res.status(404).json({ message: "找不到對應的課程" });
        }
        
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
        const existingSubmission = await FindSubmissionAssignmentBySubmitAssId(submitAssignmentId);
        if (!existingSubmission) {
            return res.status(400).json({message: "沒有該繳交作業"})
        }
        


        const score_lb = 0;
        // 獲取作業的最大分數 
        const score_ub = await FindAssignmentMaxScore (existingSubmission.ass_id);
        if (score < score_lb || score > score_ub) {
            return res.status(400).json({message: "分數不得超過上限或為負數"})
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

export {
    GetAssignmentSubmissions,
    ReviewAssignmentSubmission,

}

