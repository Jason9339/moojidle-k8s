import mongoose from "mongoose";

// Service function to retrieve all upcoming assignments
async function getTodoAssignments() {
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

export {
    getTodoAssignments
};