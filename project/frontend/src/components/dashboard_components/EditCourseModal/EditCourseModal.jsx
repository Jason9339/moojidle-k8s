import React, { useState } from "react";
import { DeleteCourse, EditCourseName } from "@/services/CourseApi";
import styles from "./EditCourseModal.module.css";

function EditCourseModal({ course, onClose, onUpdateCourse, onDeleteCourse }) {
    const [courseName, setCourseName] = useState(course.title);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState("");

    const handleSave = async () => {
        if (!courseName.trim()) {
            setError("課程名稱不能為空");
            return;
        }
        setError("");
        setIsSaving(true);
        try {
            EditCourseName(course.courseId, courseName );
            onClose();
            alert("課程名稱已成功更新");
            window.location.reload();
        } catch (err) {
            console.error("儲存課程失敗:", err);
            setError("儲存失敗，請稍後再試");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        setError("");
        setIsDeleting(true);
        try {
            // console.log("刪除課程:", course.courseId);
            await DeleteCourse(course.courseId);
            onDeleteCourse(course.courseId);
            onClose();
        } catch (err) {
            console.error("刪除課程失敗:", err);
            setError("刪除失敗，請稍後再試");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleNameChange = (e) => {
        setCourseName(e.target.value);
        if (error) setError("");
    };

    const isDisabled = isSaving || isDeleting;

    return (
        <div className={styles["modal-backdrop"]} onClick={onClose}>
            <div
                className={styles["modal"]}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-labelledby="editCourseModalTitle"
                aria-modal="true"
            >
                <h3 id="editCourseModalTitle">編輯課程</h3>

                {error && <p className={styles["error-message"]}>{error}</p>}

                <div className={styles["form-field"]}>
                    <label htmlFor="courseNameInput" className={styles["field-label"]}>
                        課程名稱：
                    </label>
                    <input
                        id="courseNameInput"
                        type="text"
                        value={courseName}
                        onChange={handleNameChange}
                        placeholder="請輸入新的課程名稱"
                        disabled={isDisabled}
                        aria-describedby={error ? "errorMessage" : undefined}
                    />
                </div>

                <div className={styles["modal-btn-group"]}>
                    <button
                        onClick={handleSave}
                        className={styles["btn-save"]}
                        disabled={isDisabled || !courseName.trim()}
                    >
                        {isSaving ? "儲存中..." : "儲存修改"}
                    </button>
                    <button
                        onClick={handleDelete}
                        className={`${styles["btn-delete"]} ${styles["danger"]}`}
                        disabled={isDisabled}
                    >
                        {isDeleting ? "刪除中..." : "刪除課程"}
                    </button>
                    <button
                        onClick={onClose}
                        className={styles["btn-cancel"]}
                        disabled={isDisabled}
                    >
                        取消
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditCourseModal;
