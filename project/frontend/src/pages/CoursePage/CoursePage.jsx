import React, { useEffect, useState } from "react";
import { getCourses } from "@/services/DashboardApi";
import "./CoursePage.css";
import CourseListItem from "@/components/course/CourseListItem/CourseListItem";

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
            <CourseListItem key={index} {...course} />
          ))}
        </div>
  
        <h3 className="past-title">Past Enrollments</h3>
        <hr className="course-heading-divider" />
      </div>
    );
  }
  
  export default CoursePage;
