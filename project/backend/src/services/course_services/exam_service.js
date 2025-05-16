import mongoose from "mongoose";

// Service function to retrieve all upcoming exams
async function getComingExams() {
    try {
        // 取得當前日期
        const currentDate = new Date();
        
        // 查詢未發生的考試（考試日期 > 當前日期）
        const exams = await mongoose.connection.db.collection('exams')
            .find({ exam_date: { $gt: currentDate } })
            .sort({ exam_date: 1 }) // 依日期升序排序
            .toArray();
        
        // 轉換為前端需要的格式
        const formattedExams = exams.map(exam => ({
            id: exam.exam_id,
            name: exam.exam_name,
            description: exam.description,
            date: exam.exam_date,
            courseId: exam.in_course_id
        }));
        
        return formattedExams;
        
    } catch (error) {
        console.error("[getComingExams] Error fetching exams:", error);
        // Re-throw the error for the controller to handle
        throw new Error(`Failed to retrieve upcoming exams: ${error.message}`);
    }
}

export {
    getComingExams
};