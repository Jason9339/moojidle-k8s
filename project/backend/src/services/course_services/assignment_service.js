import mongoose from "mongoose";
import CalculateWeek from '#src/utils/calculate_week.js';

// Service function to retrieve all upcoming assignments
async function GetToDoAssignments() {
    try {
        // 取得當前日期
        const currentDate = new Date();
        
        // 查詢未過期的作業（截止日期 > 當前日期）
        const assignments = await mongoose.connection.db.collection('assignments')
            .find({ end_date: { $gt: currentDate } })
            .sort({ end_date: 1 }) // 依截止日期升序排序
            .toArray();
        
        // 轉換為前端需要的格式
        const formattedAssignments = assignments.map(assignment => ({
            id: assignment.ass_id,
            name: assignment.ass_name,
            description: assignment.description,
            dueDate: assignment.end_date,
            courseId: assignment.in_course_id
        }));
        
        return formattedAssignments;
        
    } catch (error) {
        console.error("[getTodoAssignments] Error fetching assignments:", error);
        // Re-throw the error for the controller to handle
        throw new Error(`Failed to retrieve todo assignments: ${error.message}`);
    }
}

// Fetch unsubmitted assignments for a specific user
async function GetToDoAssignmentsByUserId(user_id) {
    try {
        const db = mongoose.connection.db;
        // user_id is of type string
        const parsedUserId = parseInt(user_id);

        // Define a fixed current time for testing
        const current_time = new Date("2025-01-08T00:00:00Z"); // Set to a date in 2025
        // const current_time = new Date(); // Comment this out for testing

        const result = await db.collection("assignments").aggregate([
            // Match assignments for courses the user is studying in
            {
                $lookup: {
                    from: "study_in", // Join with the study_in collection
                    localField: "in_course_id", // Match course_id in assignments
                    foreignField: "course_id", // Match course_id in study_in
                    as: "study_data"
                }
            },
            {
                $unwind: "$study_data" // De-normalize study_data
            },
            {
                $match: {
                    "study_data.user_id": parsedUserId, // Filter by user_id
                }
            },
            // Exclude assignments that have been submitted by the current user
            {
                $lookup: {
                    from: "submitted_ass", // Join with submitted_ass collection
                    let: { ass_id: "$ass_id", user_id: parsedUserId }, // Pass ass_id and user_id to the pipeline
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$ass_id", "$$ass_id"] }, // Match ass_id
                                        { $eq: ["$submit_by_user_id", "$$user_id"] } // Match user_id
                                    ]
                                }
                            }
                        }
                    ],
                    as: "submitted_data"
                }
            },
            {
                $match: {
                    submitted_data: { $size: 0 } // Only unsubmitted assignments
                }
            },
            // Join with the course collection to get course details
            {
                $lookup: {
                    from: "course",
                    localField: "in_course_id",
                    foreignField: "course_id",
                    as: "course_data"
                }
            },
            {
                $unwind: "$course_data" // De-normalize course_data
            },
            // Project only the required fields
            {
                $project: {
                    _id: 0,
                    title: "$ass_name", // Map to frontend's "title"
                    course: "$course_data.name", // Map to frontend's "course"
                    start_date: "$start_date", // Map to frontend's "start_date"
                    due: "$end_date", // Map to frontend's "due"
                    points: { $literal: 100 } // Add a placeholder value for "points"
                }
            }
        ]).toArray();

        return result;
    } catch (error) {
        console.error("Error in FetchToDoAssignments:", error);
        throw error;
    }
}

// 取得特定課程的作業
async function GetAssignmentsByCourseId(courseId) {
    try {
        const course = await mongoose.connection.db.collection('course').findOne({ course_id: parseInt(courseId) });
        if (!course) {
            throw new Error('找不到課程');
        }
        // 使用 start_date 而非 create_date
        const courseStartDate = course.start_date || course.create_date; // 如果沒有 start_date 則使用 create_date 作為備用
        const courseWeekNum = course.week_num || 16; // 使用課程設定的週數，如果沒有則默認為16週
        const assignments = await mongoose.connection.db.collection('assignments')
            .find({ in_course_id: parseInt(courseId) })
            .sort({ end_date: 1 }) // 依截止日期升序排列
            .toArray();
        return Promise.all(assignments.map(async (assignment) => { // Ensure Promise.all is used
            // 計算週次 - 使用 start_date 而非 create_date
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
        }));
    } catch (error) {
        console.error(`[getAssignmentsByCourseId] Error fetching assignments for course ID ${courseId}:`, error);
        throw new Error(`Failed to retrieve course assignments: ${error.message}`);
    }
}

export {
    GetToDoAssignments,
    GetToDoAssignmentsByUserId,
    GetAssignmentsByCourseId
};