import mongoose from "mongoose";

const materialSchema = new mongoose.Schema({
    m_id: { type: Number, required: true, unique: true },
    in_course_id: { type: Number, required: true },
    create_by_user_id: { type: Number, required: true },
    m_name: { type: String, required: true },
    create_date: { type: Date, default: Date.now },
    path_to_file: { type: String },
    url: { type: String },
    description: { type: String }
});

// 明確指定集合名稱為 "materials"
export default mongoose.model("Material", materialSchema, "materials");