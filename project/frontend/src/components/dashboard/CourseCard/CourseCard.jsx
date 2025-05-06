import React, { useState } from "react";
import "./CourseCard.css";
import { useNavigate } from "react-router-dom";
import { FaBullhorn, FaTasks, FaComments, FaEdit } from "react-icons/fa";
import EditCourseModal from "../EditCourseModal/EditCourseModal";

function CourseCard({ title, courseId, color, isTeacher }) {
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
      {isTeacher && (
        <FaEdit
          className="edit-icon"
          onClick={(e) => {
            e.stopPropagation(); 
            setShowEditModal(true);
          }}
          title="編輯課程"
        />
      )}
      <div>
        <p className="course-id">{courseId}</p>
        <h4 className="course-title">{title}</h4>
      </div>
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
        />
      )}
    </div>
  );
}

export default CourseCard;
