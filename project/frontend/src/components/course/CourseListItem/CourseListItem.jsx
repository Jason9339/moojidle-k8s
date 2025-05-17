import React from "react";
import styles from "./CourseListItem.module.css";
import { useNavigate } from "react-router-dom";

function CourseListItem({
    title,
    courseId,
    color,
    isTeacher,
    isStudent,
    isAssistant,
}) {
    const navigate = useNavigate();

    const handleClick = () => {
        // 儲存當前課程的角色資訊到 localStorage
        localStorage.removeItem("courseRole");
        localStorage.setItem(
            "courseRole",
            JSON.stringify({
                isTeacher: isTeacher || false,
                isStudent: isStudent || false,
                isAssistant: isAssistant || false,
            })
        );

        localStorage.setItem("courseId", courseId);

        // 導向課程細節頁
        navigate(`/course/${courseId}`);
    };

    return (
        <div
            className={`${styles["course-list-item"]}`}
            onClick={handleClick}
            style={{ cursor: "pointer" }}
        >
            <div className={`${styles["course-title"]}`}>
                <div
                    className={`${styles["course-color-indicator"]}`}
                    style={{ backgroundColor: color }}
                />
                <span className={styles["course-title-text"]} title={title}>
                    {title}
                </span>
            </div>
            <span className={`${styles["course-id"]}`}>{courseId}</span>
        </div>
    );
}

export default CourseListItem;
