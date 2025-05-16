import React, { useState } from "react";
import styles from "./CourseCard.module.css";
import { useNavigate } from "react-router-dom";
import { FaBullhorn, FaTasks, FaComments, FaEdit } from "react-icons/fa";
import EditCourseModal from "../EditCourseModal/EditCourseModal";

function CourseCard({ title, courseId, color, isTeacher, isStudent, isAssistant, onDeleteCourse }) {
  // console.log(title, courseId, color, isTeacher, isStudent, isAssistant);
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);

  

  const handleCardClick = () => {
    console.log("📦 儲存角色資訊:", {
      isTeacher,
      isStudent,
      isAssistant,
    });
    
    // 儲存角色資訊到 localStorage，防止 F5 後丟失
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

    navigate(`/course/${courseId}`, {
      state: { isTeacher, isStudent, isAssistant }
    });
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
          {isTeacher && <span className={`${styles["role-badge-teacher"]}`}>教</span>}
          {isAssistant && <span className={`${styles["role-badge-assistant"]}`}>助</span>}
          {!isAssistant && isStudent && <span className={`${styles["role-badge-student"]}`}>學</span>}
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
      <div className={`${styles["course-title"]}`}>{title}</div>
      <div className={`${styles["course-footer"]}`} onClick={(e) => e.stopPropagation()}>
        <FaBullhorn
          title="Announcement"
          onClick={() => navigate(`/courses/${courseId}/announcements`)}
        />
        <FaTasks
          title="Assignments"
          onClick={() => navigate(`/courses/${courseId}/assignments`)}
        />
        <FaComments
          title="Discussion"
          onClick={() => navigate(`/courses/${courseId}/discussions`)}
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
