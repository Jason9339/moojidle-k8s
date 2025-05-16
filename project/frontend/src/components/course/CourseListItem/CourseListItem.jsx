import React from "react";
import styles from "./CourseListItem.module.css";
import { useNavigate } from "react-router-dom";

function CourseListItem({ title, courseId, color }) {
  const navigate = useNavigate();

  return (
    <div
      className={`${styles["course-list-item"]}`}
      onClick={() => navigate(`/course/${courseId}`)}
      style={{ cursor: "pointer" }}
    >
      <div className={`${styles["course-title"]}`}>
        <div className={`${styles["course-color-indicator"]}`} style={{ backgroundColor: color }} />
        <span>{title}</span>
      </div>
      <span className={`${styles["course-id"]}`}>{courseId}</span>
    </div>
  );
}

export default CourseListItem;
