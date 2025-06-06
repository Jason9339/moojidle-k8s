import React, { useState } from "react";
import styles from "./CourseCard.module.css";
import { useNavigate } from "react-router-dom";
import { FaBullhorn, FaTasks, FaEdit } from "react-icons/fa";
import { IoBarChart } from "react-icons/io5";
import EditCourseModal from "../EditCourseModal/EditCourseModal";

function CourseCard({
    title,
    courseId,
    color,
    isTeacher,
    isStudent,
    isAssistant,
    onDeleteCourse,
}) {
    // console.log(title, courseId, color, isTeacher, isStudent, isAssistant);
    const navigate = useNavigate();
    const [showEditModal, setShowEditModal] = useState(false);

    const handleCardClick = () => {
        navigate(`/course/${courseId}`);
    };

    return (
        <div
            className={`${styles["course-card"]}`}
            style={{ backgroundColor: color }}
            onClick={handleCardClick}
        >
            <div className={`${styles["course-id-container"]}`}>
                <span className={`${styles["course-id"]}`}>{courseId}</span>
                <div className={`${styles["role-indicators"]}`}>
                    {isTeacher && (
                        <span className={`${styles["role-badge-teacher"]}`}>
                            教
                        </span>
                    )}
                    {isAssistant && (
                        <span className={`${styles["role-badge-assistant"]}`}>
                            助
                        </span>
                    )}
                    {!isAssistant && isStudent && (
                        <span className={`${styles["role-badge-student"]}`}>
                            學
                        </span>
                    )}
                    {isTeacher && (
                        <FaEdit
                            className={`${styles["role-badge-teacher-edit-icon"]}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowEditModal(true);
                            }}
                            title="編輯課程"
                        />
                    )}
                </div>
            </div>
            <div className={`${styles["course-title"]}`}>
                <div className={styles["course-title-text"]} title={title}>{title}</div>
            </div>

            <div
                className={`${styles["course-footer"]}`}
                onClick={(e) => e.stopPropagation()}
            >
                <FaBullhorn
                    title="Announcement"
                    onClick={() =>
                        navigate(`/course/${courseId}/announcement`)
                    }
                />
                <FaTasks
                    title="Assignments"
                    onClick={() => navigate(`/course/${courseId}/assignment`)}
                />
                <IoBarChart
                    title="grade"
                    onClick={() => navigate(`/course/${courseId}/grade`)}
                />
            </div>
            {showEditModal && (
                <EditCourseModal
                    course={{ title, courseId }}
                    onClose={() => setShowEditModal(false)}
                    onDeleteCourse={onDeleteCourse} // 傳進去
                />
            )}
        </div>
    );
}

export default CourseCard;
