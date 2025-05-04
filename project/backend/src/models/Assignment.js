import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
    ass_id: { type: Number, required: true, unique: true },
    in_course_id: { type: Number, required: true },
    create_by_user_id: { type: Number, required: true },
    ass_name: { type: String, required: true },
    create_date: { type: Date, default: Date.now },
    end_date: { type: Date, required: true },
    description: { type: String },
    attachments: [
        {
            filename: { type: String },
            url: { type: String }
        }
    ]
});

// 明確指定集合名稱為 "assignments"
export default mongoose.model("Assignment", assignmentSchema, "assignments");