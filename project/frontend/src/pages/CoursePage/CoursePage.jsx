import React, { useEffect, useState } from "react";
import { getCourses } from "@/services/DashboardApi";
import styles from "./CoursePage.module.css";
import CourseListItem from "@/components/course/CourseListItem/CourseListItem";
import LeftBar from "@/components/LeftBar/LeftBar";

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
      <div className={`${styles["app-layout"]}`}>
        <LeftBar />
        <div className={`${styles["course-page"]}`}>
        <h2 className={`${styles["course-heading"]}`}>All Course</h2>
        <hr className={`${styles["course-heading-divider"]}`} />
  
        <div className={`${styles["course-list-header"]}`}>
          <span>課程名稱</span>
          <span>課程代碼</span>
        </div>
  
        <div className={`${styles["course-list"]}`}>
          {courses.map((course, index) => (
            <CourseListItem key={index} {...course} />
          ))}
        </div>
  
        <h3 className={`${styles["past-title"]}`}>Past Enrollments</h3>
        <hr className={`${styles["course-heading-divider"]}`} />
      </div>
    </div>
    );
  }
  
  export default CoursePage;
