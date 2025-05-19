import React, { useState } from "react";
import {
    FetchCourseIdByCode,
    InviteStudent,
} from "@/services/CourseApi";
import styles from "./JoinCourseModal.module.css";

function JoinCourseModal({ onClose, onJoinCourse, currentUserId }) {
    const [inviteCode, setInviteCode] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleJoin = async () => {
        if (!inviteCode) {
            alert("請輸入課程代碼！");
            return;
        }

        try {
            setIsSubmitting(true);

            const courseId = await FetchCourseIdByCode(inviteCode);
            const msg = await InviteStudent(
                courseId.courseId,
                currentUserId,
                currentUserId
            );
            console.log(msg);
            alert(msg.message);

            await onJoinCourse(); // 重新 fetch 所有資料
            onClose(); // 關閉 modal
        } catch (error) {
            console.error("加入課程失敗:", error);
            const errorMessage =
                error.response?.data?.message ||
                error.message ||
                "加入課程失敗，請稍後再試。";
            alert(`加入課程失敗: ${errorMessage}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={`${styles["modal-backdrop"]}`}>
            <div className={`${styles["modal"]}`}>
                <h3>加入課程</h3>

                <input
                    placeholder="課程代碼"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    disabled={isSubmitting}
                />

                <div className={`${styles["modal-btn-group-join"]}`}>
                    <button onClick={handleJoin} disabled={isSubmitting}>
                        {isSubmitting ? "加入中..." : "加入課程"}
                    </button>
                    <button onClick={onClose} disabled={isSubmitting}>
                        取消
                    </button>
                </div>
            </div>
        </div>
    );
}

export default JoinCourseModal;
