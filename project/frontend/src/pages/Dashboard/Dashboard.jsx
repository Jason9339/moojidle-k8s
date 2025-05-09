// Dashboard.jsx
import React, { useEffect, useState } from "react";
import CourseCard from "@/components/dashboard/CourseCard/CourseCard";
import ToDoItem from "@/components/dashboard/ToDoItem/ToDoItem";
import ComingUpItem from "@/components/dashboard/ComingUpItem/ComingUpItem";
import AddCourseButton from "@/components/dashboard/AddCourseButton/AddCourseButton";
import AddCourseModal from "@/components/dashboard/AddCourseModal/AddCourseModal";
import LeftBar from "@/components/LeftBar/LeftBar";
import "./Dashboard.css";
import {
  getCourses,
  getTodoList,
  getComingUpList,
  getTeachIn,
} from "@/services/DashboardApi";

// 模擬目前登入的 user_id
const currentUserId = 1;

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchAll = async () => {
    try {
      const [courses, todoList, comingUpList, teachInList] =
        await Promise.all([
          getCourses(),
          getTodoList(currentUserId),
          getComingUpList(currentUserId),
          getTeachIn(currentUserId),
        ]);

      const teacherCourseIds = teachInList.map((entry) => entry.courseId);

      const coursesWithRole = courses.map((course) => ({
        ...course,
        isTeacher: teacherCourseIds.includes(course.courseId),
      }));

      setDashboardData({
        courses: coursesWithRole,
        todoList,
        comingUpList,
      });
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleAddCourse = async () => {
    await fetchAll();
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await fetchAll();
    } catch (error) {
      console.error("刪除課程後重新抓取資料失敗：", error);
    }
  };

  if (!dashboardData) return <p>Loading...</p>;

  const { courses, todoList, comingUpList } = dashboardData;

  return (
    <div className="app-layout">
      <LeftBar />
      <div className="dashboard-container">
        <div className="dashboard-left">
          <div className="dashboard-heading-row">
            <h2 className="dashboard-heading">Dashboard</h2>
            <AddCourseButton onClick={() => setShowAddModal(true)} />
          </div>
          <hr className="dashboard-heading-divider" />

          <div className="course-grid">
            {courses.map((course, index) => (
              <CourseCard
                key={index}
                {...course}
                onDeleteCourse={handleDeleteCourse}
              />
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
      </div>

      {showAddModal && (
        <AddCourseModal
          onClose={() => setShowAddModal(false)}
          onAddCourse={handleAddCourse}
          currentUserId={currentUserId}
        />
      )}
    </div>
  );
}

export default Dashboard;
