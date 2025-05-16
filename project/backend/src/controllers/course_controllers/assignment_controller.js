import { getTodoAssignments as getTodoAssignmentsService } from '#src/services/course_services/assignment_service.js';

// 取得待辦作業列表
export const getTodoAssignments = async (req, res) => {
    try {
        // 調用服務層獲取資料
        const todoAssignments = await getTodoAssignmentsService();
        
        // 返回資料給客戶端
        res.json(todoAssignments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};