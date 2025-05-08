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

  // 取得所有資料（courses、todo、comingUp、teach_in）
  const fetchAll = async () => {
    try {
      const [courses, todoList, comingUpList, teachInList] =
        await Promise.all([
          getCourses(),
          getTodoList(),
          getComingUpList(),
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

  const handleDeleteCourse = async (courseId) => {
    try {
      await fetchAll(); // 重新抓資料，讓畫面刷新
    } catch (error) {
      console.error("刪除課程後重新抓取資料失敗：", error);
    }
  };

  // 初始畫面載入時呼叫
  useEffect(() => {
    fetchAll();
  }, []);

  // 新增課程後重新抓資料
  const handleAddCourse = async () => {
    await fetchAll();
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
            <CourseCard key={index} {...course} onDeleteCourse={handleDeleteCourse} />
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
          onAddCourse={handleAddCourse} // 不再傳入 newCourse，直接重新 fetchAll
          currentUserId={currentUserId}
        />
      )}
    </div>
  );
}

export default DashboardContent;
