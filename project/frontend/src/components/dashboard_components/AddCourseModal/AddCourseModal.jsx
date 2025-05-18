import React, { useState } from "react";
import { addCourse } from "@/services/DashboardApi";
import styles from "./AddCourseModal.module.css";

function AddCourseModal({ onClose, onAddCourse, currentUserId }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [color, setColor] = useState("#4A90E2");
    const [time, setTime] = useState(new Date().toISOString().slice(0, 16)); // Default to current time
    const [weeks, setWeeks] = useState(16); // Default to 16 weeks
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAdd = async () => {
        if (!title) {
            alert("請輸入課程名稱！");
            return;
        }

        if (!weeks || weeks < 5 || weeks > 30) {
            alert("週數必須介於 5 到 30 週之間！");
            return;
        }

        const coursePayload = {
            name: title,
            description: description,
            syllabus: "",
            userId: currentUserId,
            color: color,
            start_date: new Date(time),
            week: parseInt(weeks, 10),
        };

        console.log("課程資料:", coursePayload);

        try {
            setIsSubmitting(true); // 顯示 loading 狀態
            await addCourse(coursePayload);
            await onAddCourse(); // 重新 fetch 所有資料
            onClose(); // 關閉 modal
        } catch (error) {
            console.error("新增課程失敗:", error);
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "新增課程失敗，請稍後再試。";
            alert(`新增課程失敗: ${errorMessage}`);
        } finally {
            setIsSubmitting(false); // 恢復狀態
        }
    };

    return (
        <div className={`${styles["modal-backdrop"]}`}>
            <div className={`${styles["modal"]}`}>
                <h3>新增課程</h3>

                <div className={`${styles["form-row"]}`}>
                    <label htmlFor="course-title">
                        課程名稱{" "}
                        <span className={`${styles["required"]}`}>*</span>
                    </label>
                    <input
                        id="course-title"
                        placeholder="請輸入課程名稱"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={isSubmitting}
                        required
                    />
                </div>

                <div className={`${styles["form-row"]}`}>
                    <label htmlFor="course-description">課程描述</label>
                    <textarea
                        id="course-description"
                        placeholder="請輸入課程描述"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={isSubmitting}
                    />
                </div>

                <div className={`${styles["form-row"]}`}>
                    <label htmlFor="course-time">課程時間</label>
                    <input
                        id="course-time"
                        type="datetime-local"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        disabled={isSubmitting}
                    />
                </div>

                <div className={`${styles["form-row"]}`}>
                    <label htmlFor="course-weeks">
                        課程週數{" "}
                        <span className={`${styles["required"]}`}>*</span>
                    </label>
                    <div className={`${styles["input-with-help"]}`}>
                        <input
                            id="course-weeks"
                            type="number"
                            min="5"
                            max="30"
                            required
                            value={weeks}
                            onChange={(e) => setWeeks(e.target.value)}
                            disabled={isSubmitting}
                        />
                        <small className={`${styles["help-text"]}`}>
                            請輸入 5-30 之間的週數
                        </small>
                    </div>
                </div>

                <div className={`${styles["form-row"]}`}>
                    <label htmlFor="course-color">課程顏色</label>
                    <input
                        id="course-color"
                        type="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        disabled={isSubmitting}
                    />
                </div>
                <div className={`${styles["modal-btn-group"]}`}>
                    <button onClick={handleAdd} disabled={isSubmitting}>
                        {isSubmitting ? "新增中..." : "確定新增"}
                    </button>
                    <button onClick={onClose} disabled={isSubmitting}>
                        取消
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddCourseModal;
