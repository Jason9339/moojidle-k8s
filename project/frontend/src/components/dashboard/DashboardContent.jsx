import React, { useEffect, useState } from "react";
import CourseCard from "./CourseCard";
import ToDoItem from "./ToDoItem";
import ComingUpItem from "./ComingUpItem";
import "@/styles/Dashboard.css";
import {
  getCourses,
  getTodoList,
  getComingUpList,
} from "@/services/DashboardApi";

function DashboardContent() {
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [courses, todoList, comingUpList] = await Promise.all([
          getCourses(),
          getTodoList(),
          getComingUpList(),
        ]);
        setDashboardData({ courses, todoList, comingUpList });
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      }
    };
    fetchAll();
  }, []);

  if (!dashboardData) return <p>Loading...</p>;

  const { courses, todoList, comingUpList } = dashboardData;

  return (
    <div className="dashboard-container">
      <div className="dashboard-left">
        <h2 className="dashboard-heading">Dashboard</h2>
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
    </div>
  );
}

export default DashboardContent;
