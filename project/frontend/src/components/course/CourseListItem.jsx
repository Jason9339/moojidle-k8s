import React from "react";
import "@/styles/CourseListItem.css";

function CourseListItem({ title, courseId, color }) {
  return (
    <div className="course-list-item">
      <div className="course-color-indicator" style={{ backgroundColor: color }} />
      <span className="course-title">{title}</span>
      <span className="course-id">{courseId}</span>
    </div>
  );
}

export default CourseListItem;
