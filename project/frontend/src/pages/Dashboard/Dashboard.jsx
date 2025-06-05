import React, { useEffect, useState } from "react";
import CourseCard from "@/components/dashboard_components/CourseCard/CourseCard";
import ToDoItem from "@/components/dashboard_components/ToDoItem/ToDoItem";
import ComingUpItem from "@/components/dashboard_components/ComingUpItem/ComingUpItem";
import AddCourseButton from "@/components/dashboard_components/AddCourseButton/AddCourseButton";
import AddCourseModal from "@/components/dashboard_components/AddCourseModal/AddCourseModal";
import JoinCourseButton from "@/components/dashboard_components/JoinCourseButton/JoinCourseButton";
import JoinCourseModal from "@/components/dashboard_components/JoinCourseModal/JoinCourseModal";
import LeftBar from "@/components/LeftBar/LeftBar";
import styles from "./Dashboard.module.css";

import { GetComingUpList } from "@/services/ExamApi";
import { GetCourses } from "@/services/CourseApi";
import { GetTodoAssignList } from "@/services/AssignmentApi";

function Dashboard() {
    const user = JSON.parse(localStorage.getItem("user"));
    const currentUserId = user?.user_id;

    const [dashboardData, setDashboardData] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);

    const fetchAll = async () => {
        try {
            const [courses, todoList, comingUpList] = await Promise.all([
                GetCourses(currentUserId),
                GetTodoAssignList(currentUserId),
                GetComingUpList(currentUserId),
            ]);

            setDashboardData({
                courses,
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

    const handleJoinCourse = async () => {
        await fetchAll();
    };

    const handleDeleteCourse = async (courseId) => {
        try {
            await fetchAll();
        } catch (error) {
            console.error("刪除課程後重新抓取資料失敗：", error);
        }
    };

    return (
        <div className={styles["app-layout"]}>
            <LeftBar />
            {!dashboardData ? (
                <div
                    className={styles["dashboard-container"]}
                    style={{ backgroundColor: "#eff2f5", flex: 1 }}
                />
            ) : (
                <div className={styles["dashboard-container"]}>
                    <div className={styles["dashboard-left"]}>
                        <div className={styles["dashboard-heading-row"]}>
                            <h2 className={styles["dashboard-heading"]}>Dashboard</h2>
                            <div className={styles["dashboard-button-group"]}>
                                <AddCourseButton onClick={() => setShowAddModal(true)} />
                                <JoinCourseButton onClick={() => setShowJoinModal(true)} />
                            </div>
                        </div>
                        <hr className={styles["dashboard-heading-divider"]} />
                        <div className={styles["course-grid"]}>
                            {dashboardData.courses.map((course, index) => (
                                <CourseCard
                                    key={index}
                                    {...course}
                                    onDeleteCourse={handleDeleteCourse}
                                />
                            ))}
                        </div>
                    </div>

                    <div className={styles["dashboard-right"]}>
                        <h3 className={styles["section-title"]}>To Do</h3>
                        <ToDoItem todoList={dashboardData.todoList} />
                        <hr />
                        <h3 className={styles["section-title"]}>Coming Up</h3>
                        <ComingUpItem comingUpList={dashboardData.comingUpList} />
                    </div>
                </div>
            )}

            {showAddModal && (
                <AddCourseModal
                    onClose={() => setShowAddModal(false)}
                    onAddCourse={handleAddCourse}
                    currentUserId={currentUserId}
                />
            )}

            {showJoinModal && (
                <JoinCourseModal
                    onClose={() => setShowJoinModal(false)}
                    onJoinCourse={handleJoinCourse}
                    currentUserId={currentUserId}
                />
            )}
        </div>
    );
}

export default Dashboard;
