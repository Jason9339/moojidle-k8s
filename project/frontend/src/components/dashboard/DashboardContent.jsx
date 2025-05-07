import React, { useEffect, useState } from "react";
import CourseCard from "./CourseCard";
import ToDoItem from "./ToDoItem";
import ComingUpItem from "./ComingUpItem";
import AddCourseButton from "./AddCourseButton";
import AddCourseModal from "./AddCourseModal";
import "@/styles/Dashboard.css";
import {
  getCourses,
  getTodoList,
  getComingUpList,
  getTeachIn,
} from "@/services/DashboardApi";

// 模擬目前登入的 user_id
const currentUserId = 1;

function DashboardContent() {
  const [dashboardData, setDashboardData] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [courses, todoList, comingUpList, teachInList] =
          await Promise.all([
            getCourses(),
            getTodoList(currentUserId),
            getComingUpList(currentUserId),
            getTeachIn(),
          ]);

        const teacherCourseIds = teachInList
          .filter((entry) => entry.user_id === currentUserId)
          .map((entry) => entry.course_id);

        const coursesWithRole = courses.map((course) => ({
          ...course,
          isTeacher: teacherCourseIds.includes(course.courseId),
        }));

        setDashboardData({ courses: coursesWithRole, todoList, comingUpList });
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      }
    };
    fetchAll();
  }, []);

  const handleAddCourse = (newCourse) => {
    setDashboardData((prev) => ({
      ...prev,
      courses: [...prev.courses, newCourse],
    }));
  };

  if (!dashboardData) return <p>Loading...</p>;

  const { courses, todoList, comingUpList } = dashboardData;

  return (
    <div className="dashboard-container">
      <div className="dashboard-left">
        <div className="dashboard-heading-row">
          <h2 className="dashboard-heading">Dashboard</h2>
          <AddCourseButton onClick={() => setShowAddModal(true)} />
        </div>
        <hr className="dashboard-heading-divider" />

        <div className="course-grid">
          {courses.map((course, index) => (
            <CourseCard key={index} {...course} />
          ))}
        </div>
      </div>

      <div className="dashboard-right">
        <h3>To Do</h3>
        <ToDoItem todoList={todoList} />
        <hr />
        <h3>Coming Up</h3>
        <ComingUpItem comingUpList={comingUpList} />
      </div>

      {showAddModal && (
        <AddCourseModal
          onClose={() => setShowAddModal(false)}
          onAddCourse={handleAddCourse}
        />
      )}
    </div>
  );
}

export default DashboardContent;
