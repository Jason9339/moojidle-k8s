import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    course_id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    syllabus: { type: String },
    invite_link: { type: String },
    create_date: { type: Date, default: Date.now }
});

// 明確指定集合名稱為 "course"，而不是默認的 "courses"
export default mongoose.model("Course", courseSchema, "course");