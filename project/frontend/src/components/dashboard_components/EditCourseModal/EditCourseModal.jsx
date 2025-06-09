import React, { useState } from "react";
import { DeleteCourse, EditCourseName } from "@/services/CourseApi";
import styles from "./EditCourseModal.module.css";
import { addAlert } from "@/utils/alert/AlertContext";

function EditCourseModal({ course, onClose }) {
    const [courseName, setCourseName] = useState(course.title);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleSave = async () => {
        if (!courseName.trim()) {
            addAlert("課程名稱不能為空", "error");
            return;
        }
        setIsSaving(true);
        try {
            EditCourseName(course.courseId, courseName);
            onClose();
            addAlert("課程名稱已成功更新", "success");

        } catch (err) {
            console.error("儲存課程失敗:", err);
            addAlert("儲存失敗，請稍後再試", "error");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            // console.log("刪除課程:", course.courseId);
            await DeleteCourse(course.courseId);
            addAlert("刪除成功", "success");
            onClose();
        } catch (err) {
            console.error("刪除課程失敗:", err);
            addAlert("刪除失敗，請稍後再試", "error");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleNameChange = (e) => {
        setCourseName(e.target.value);
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
                    // aria-describedby={error ? "errorMessage" : undefined}
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
