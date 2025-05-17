import {
    GetToDoAssignments as GetToDoAssignmentsService,
    GetToDoAssignmentsByUserId as GetToDoAssignmentsByUserIdService
} from '#src/services/course_services/assignment_service.js';

// 取得待辦作業列表
async function GetToDoAssignments (req, res) {
    try {
        // 調用服務層獲取資料
        const todoAssignments = await GetToDoAssignmentsService();
        
        // 返回資料給客戶端
        res.json(todoAssignments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

async function GetToDoAssignmentsByUserId(req, res) {
    try {
        const toDoAssignments = await GetToDoAssignmentsByUserIdService(req.query.user_id);
        res.status(200).json(toDoAssignments); // Send the fetched data as a JSON response
    } catch (error) {
        console.error("Error in GetToDoAssignments:", error);
        res.status(500).send("Failed to fetch to-do assignments");
    }
}

export {
    GetToDoAssignments,
    GetToDoAssignmentsByUserId
};