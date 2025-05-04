import React, { useEffect, useState } from "react";
import { getCourses } from "@/services/DashboardApi";
import "@/styles/CoursePage.css";

function CoursePage() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await getCourses();
        setCourses(data);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="course-page">
      <h2 className="course-heading">All Course</h2>
      <hr className="course-heading-divider" />

      <div className="course-list-header">
        <span>課程名稱</span>
        <span>課程代碼</span>
      </div>

      <div className="course-list">
        {courses.map((course, index) => (
          <div key={index} className="course-list-item">
            <div className="course-item-title">
              <span
                className="course-color-block"
                style={{ backgroundColor: course.color }}
              ></span>
              {course.title}
            </div>
            <div className="course-item-id">{course.courseId}</div>
          </div>
        ))}
      </div>

      <h3 className="past-title">Past Enrollments</h3>
      <hr className="course-heading-divider" />
    </div>
  );
}

export default CoursePage;
