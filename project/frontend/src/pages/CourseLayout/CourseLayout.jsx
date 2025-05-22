// CourseLayout.jsx
import { useParams, Outlet, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import LeftBar from "@/components/LeftBar/LeftBar";
import { GetCourses } from "@/services/CourseApi";
import styles from "./CourseLayout.module.css";

export default function CourseLayout() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const user = JSON.parse(localStorage.getItem("user"));

      try {
        const allCourses = await GetCourses(user.user_id);
        const currentCourse = allCourses.find(
          (c) => String(c.courseId) === String(courseId)
        );

        if (!currentCourse) {
          throw new Error("找不到課程");
        }

        setCourse(currentCourse);
        setRole({
          isTeacher: currentCourse.isTeacher,
          isAssistant: currentCourse.isAssistant,
          isStudent: currentCourse.isStudent,
        });
      } catch (err) {
        console.error("載入課程/角色失敗", err);
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  if (loading) return <div>載入中...</div>;

  return (
    <div className={styles["app-layout"]}>
      <LeftBar />
      <div className={styles["course-detail-container"]}>
        <div className={styles["course-header"]}>
          <span className={styles["course-title"]} title={course.course_name}>
            {course.course_name}
          </span>
          <span>{courseId}</span>
        </div>

        <div className={styles["tab-menu"]}>
          <Link to="">課程</Link>
          <Link to="grade">成績</Link>
          <Link to="discussion">討論</Link>
          <Link to="assignment">作業</Link>
          <Link to="announcement">公告</Link>
          <Link to="members">成員</Link>
        </div>

        {/* 將角色與課程資訊傳給子頁，課程資訊如果不需要之後可以刪掉(TODO) */}
        <Outlet context={{ role, course }} />
      </div>
    </div>
  );
}
