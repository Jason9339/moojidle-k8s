import React from "react";
import "./CourseListItem.css";
import { useNavigate } from "react-router-dom";

function CourseListItem({ title, courseId, color }) {
  const navigate = useNavigate();

  return (
    <div
      className="course-list-item"
      onClick={() => navigate(`/course/${courseId}`)}
      style={{ cursor: "pointer" }}
    >
      <div className="course-title">
        <div className="course-color-indicator" style={{ backgroundColor: color }} />
        <span>{title}</span>
      </div>
      <span className="course-id">{courseId}</span>
    </div>
  );
}

export default CourseListItem;
