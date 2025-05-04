import mongoose from "mongoose";

const announcementSchema = new mongoose.Schema({
    a_id: { type: Number, required: true, unique: true },
    create_date: { type: Date, default: Date.now },
    context: { type: String, required: true },
    user_id: { type: Number, required: true },
    course_id: { type: Number, required: true }
});

// 明確指定集合名稱為 "announcement"
export default mongoose.model("Announcement", announcementSchema, "announcement");