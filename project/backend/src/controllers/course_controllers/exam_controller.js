import {
    GetUpcomingExamsByUserId as GetUpcomingExamsByUserIdService
    // getComingExams as getComingExamsService
} from '#src/services/course_services/exam_service.js';

async function GetUpcomingExamsByUserId(req, res) {
    try {
        const upcomingExams = await GetUpcomingExamsByUserIdService(req.query.user_id);
        res.status(200).json(upcomingExams); // Send the fetched data as a JSON response
    } catch (error) {
        console.error("Error in GetUpcomingExams:", error);
        res.status(500).send("Failed to fetch upcoming exams");
    }
}

// 取得即將到來的考試/活動
// async function getComingExams (req, res) {
//     try {
//         // 調用服務層獲取資料
//         const comingExams = await getComingExamsService();
        
//         // 返回資料給客戶端
//         res.json(comingExams);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

export {
    GetUpcomingExamsByUserId
    // getComingExams
}