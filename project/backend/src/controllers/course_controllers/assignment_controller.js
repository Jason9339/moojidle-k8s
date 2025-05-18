import {
    GetToDoAssignmentsByUserId as GetToDoAssignmentsByUserIdService,
    FindAssignmentsByCourseId
} from '#src/services/course_services/assignment_service.js';

import { 
    FindCourseById 
} from '#src/services/course_services/course_service.js';

import CalculateWeek from '#src/utils/calculate_week.js';

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

export {
    GetToDoAssignmentsByUserId,
    GetCourseAssignments
};