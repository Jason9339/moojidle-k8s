import { getComingExams as getComingExamsService } from '#src/services/course_services/exam_service.js';

// 取得即將到來的考試/活動
export const getComingExams = async (req, res) => {
    try {
        // 調用服務層獲取資料
        const comingExams = await getComingExamsService();
        
        // 返回資料給客戶端
        res.json(comingExams);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};