import React, { useEffect, useState } from "react";
import { GetCourses } from "@/services/CourseApi";
import styles from "./CoursePage.module.css";

import CourseListItem from "@/components/course_components/CourseListItem/CourseListItem";
import LeftBar from "@/components/LeftBar/LeftBar";

function CoursePage() {
    const [courses, setCourses] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                const userId = user?.user_id;
                const data = await GetCourses(userId);
                setCourses(data);
            } catch (err) {
                console.error("Failed to fetch courses:", err);
            }
        };
        fetchCourses();
    }, []);

    return (
        <div className={styles["app-layout"]}>
            <LeftBar />
            {!courses ? (
                <div
                    className={styles["course-page"]}
                    style={{ backgroundColor: "#eff2f5", flex: 1 }}
                />
            ) : (
                <div className={styles["course-page"]}>
                    <h2 className={styles["course-heading"]}>All Course</h2>
                    <hr className={styles["course-heading-divider"]} />

                    <div className={styles["course-list-header"]}>
                        <span>課程名稱</span>
                        <span>課程代碼</span>
                    </div>

                    <div className={styles["course-list"]}>
                        {courses
                            .filter(
                                (course) =>
                                    course.isTeacher ||
                                    course.isStudent ||
                                    course.isAssistant
                            )
                            .map((course, index) => (
                                <CourseListItem
                                    key={index}
                                    title={course.title}
                                    courseId={course.courseId}
                                    color={course.color}
                                    isTeacher={course.isTeacher}
                                    isStudent={course.isStudent}
                                    isAssistant={course.isAssistant}
                                />
                            ))}
                    </div>

                    <h3 className={styles["past-title"]}>Past Enrollments</h3>
                    <hr className={styles["course-heading-divider"]} />
                </div>
            )}
        </div>
    );
}

export default CoursePage;
