import React, { useEffect, useState } from "react";
import CourseCard from "@/components/dashboard/CourseCard/CourseCard";
import ToDoItem from "@/components/dashboard/ToDoItem/ToDoItem";
import ComingUpItem from "@/components/dashboard/ComingUpItem/ComingUpItem";
import AddCourseButton from "@/components/dashboard/AddCourseButton/AddCourseButton";
import AddCourseModal from "@/components/dashboard/AddCourseModal/AddCourseModal";
import JoinCourseButton from "@/components/dashboard/JoinCourseButton/JoinCourseButton";
import JoinCourseModal from "@/components/dashboard/JoinCourseModal/JoinCourseModal";
import LeftBar from "@/components/LeftBar/LeftBar";
import styles from "./Dashboard.module.css";

import {
    getCourses,
    getTodoList,
    getComingUpList,
} from "@/services/dashboard_api/DashboardApi";

function Dashboard() {
    const user = JSON.parse(localStorage.getItem("user"));
    const currentUserId = user?.user_id;

    const [dashboardData, setDashboardData] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);

    const fetchAll = async () => {
        try {
            const [courses, todoList, comingUpList] = await Promise.all([
                getCourses(currentUserId),
                getTodoList(currentUserId),
                getComingUpList(currentUserId),
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

    if (!dashboardData) return <p>Loading...</p>;

    const { courses, todoList, comingUpList } = dashboardData;

    return (
        <div className={styles["app-layout"]}>
            <LeftBar />
            <div className={styles["dashboard-container"]}>
                <div className={styles["dashboard-left"]}>
                    <div className={styles["dashboard-heading-row"]}>
                        <h2 className={styles["dashboard-heading"]}>
                            Dashboard
                        </h2>
                        <div className={styles["dashboard-button-group"]}>
                            <AddCourseButton
                                onClick={() => setShowAddModal(true)}
                            />
                            <JoinCourseButton
                                onClick={() => setShowJoinModal(true)}
                            />
                        </div>
                    </div>
                    <hr className={styles["dashboard-heading-divider"]} />
                    <div className={styles["course-grid"]}>
                        {courses.map((course, index) => (
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
                    <ToDoItem todoList={todoList} />
                    <hr />
                    <h3 className={styles["section-title"]}>Coming Up</h3>
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
