import Assignment from '#src/models/Assignment.js';

// 取得待辦作業列表
export const getTodoAssignments = async (req, res) => {
    try {
        // 取得當前日期
        const currentDate = new Date();
        
        // 查詢未過期的作業（截止日期 > 當前日期）
        const assignments = await Assignment.find({ 
            end_date: { $gt: currentDate } 
        }).sort({ end_date: 1 }); // 依截止日期升序排序
        
        // 轉換為前端需要的格式
        const todoAssignments = assignments.map(assignment => ({
            id: assignment.ass_id,
            name: assignment.ass_name,
            description: assignment.description,
            dueDate: assignment.end_date,
            courseId: assignment.in_course_id
        }));
        
        res.json(todoAssignments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};