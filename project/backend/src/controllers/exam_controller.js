import Exam from '#src/models/Exam.js';

// 取得即將到來的考試/活動
export const getComingExams = async (req, res) => {
    try {
        // 取得當前日期
        const currentDate = new Date();
        
        // 查詢未發生的考試（考試日期 > 當前日期）
        const exams = await Exam.find({ 
            exam_date: { $gt: currentDate } 
        }).sort({ exam_date: 1 }); // 依日期升序排序
        
        // 轉換為前端需要的格式
        const comingExams = exams.map(exam => ({
            id: exam.exam_id,
            name: exam.exam_name,
            description: exam.description,
            date: exam.exam_date,
            courseId: exam.in_course_id
        }));
        
        res.json(comingExams);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};