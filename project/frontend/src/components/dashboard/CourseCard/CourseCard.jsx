import React, { useState } from "react";
import "./CourseCard.css";
import { useNavigate } from "react-router-dom";
import { FaBullhorn, FaTasks, FaComments, FaEdit } from "react-icons/fa";
import EditCourseModal from "../EditCourseModal/EditCourseModal";

function CourseCard({ title, courseId, color, isTeacher, isStudent, isAssistant, onDeleteCourse }) {
  console.log(title, courseId, color, isTeacher, isStudent, isAssistant);
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);

  const handleCardClick = () => {
    navigate(`/course/${courseId}`);
  };

  return (
    <div
      className="course-card"
      style={{ backgroundColor: color }}
      onClick={handleCardClick}
    >
      <div className="course-id-container">
        <span className="course-id">{courseId}</span>
        <div className="role-indicators">
          {isTeacher && <span className="role-badge teacher">教</span>}
          {isAssistant && <span className="role-badge assistant">助</span>}
          {!isAssistant && isStudent && <span className="role-badge student">學</span>}
          {isTeacher && (
              <FaEdit
                className="role-badge teacher edit-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowEditModal(true);
                }}
                title="編輯課程"
              />
          )} 
        </div>
      </div>
      <div className="course-title">{title}</div>
      <div className="course-footer" onClick={(e) => e.stopPropagation()}>
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
