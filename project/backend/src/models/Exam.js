import mongoose from "mongoose";

const examSchema = new mongoose.Schema({
    exam_id: { type: Number, required: true, unique: true },
    in_course_id: { type: Number, required: true },
    create_by_user_id: { type: Number, required: true },
    exam_name: { type: String, required: true },
    exam_date: { type: Date, required: true },
    description: { type: String },
    attachments: [
        {
            filename: { type: String },
            url: { type: String }
        }
    ]
});

// 明確指定集合名稱為 "exams"
export default mongoose.model("Exam", examSchema, "exams");