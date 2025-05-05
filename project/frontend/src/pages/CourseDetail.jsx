import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "@/styles/CourseDetail.css";
// 修改導入來源
import { getCourseDetails, getCourseAssignments, getCourseMaterials } from "@/services/CoursepageApi";

function CourseDetail() {
    const { courseId } = useParams();
    const [course, setCourse] = useState(null);
    const [materials, setMaterials] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("課程");

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                setLoading(true);
                const [courseData, materialsData, assignmentsData] = await Promise.all([
                    getCourseDetails(courseId),
                    getCourseMaterials(courseId),
                    getCourseAssignments(courseId)
                ]);
                
                setCourse(courseData);
                setMaterials(materialsData);
                setAssignments(assignmentsData);
            } catch (error) {
                console.error("獲取課程數據失敗:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourseData();
    }, [courseId]);

    if (loading) {
        return <div className="loading">載入中...</div>;
    }

    if (!course) {
        return <div className="error">無法載入課程資料</div>;
    }


    return (
        <div className="course-detail-container">
            {/* 課程標題列 */}
            <div className="course-header">
                <span>{course.title}</span>
                <span>{courseId}</span>
            </div>

            {/* Tab 選單列 */}
            <div className="tab-menu">
                {["課程", "成績", "討論", "作業", "公告"].map((tab) => (
                    <button
                        key={tab}
                        className={activeTab === tab ? "active" : ""}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* 中段：新增教材 + 身份欄 */}
            <div className="material-bar">
                <button className="material-button">新增教材</button>
                <button className="material-button">助教與學生管理</button>
            </div>

            {/* 移除週次選擇器 */}
            {/* <div className="week-selector"> ... </div> */}

            {/* 教材表格 + To Do 區塊 - 修改為顯示所有週次 */}
            <div className="material-table-section">
                <table className="material-table">
                    <thead>
                        <tr>
                            <th>Week</th>
                            <th>Lecture</th>
                            <th>Assignments/Exams</th>
                            <th>Reference</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* 循環渲染 1 到 16 週 */}
                        {Array.from({ length: 16 }, (_, i) => {
                            const currentWeek = i + 1;
                            // 過濾出當前週次的教材 - 假設教材有 week 屬性
                            const weekMaterials = materials.filter(m => m.week === currentWeek || (!m.week && currentWeek === 1)); 
                            // 過濾出當前週次的作業 - 假設作業有 week 屬性
                            const weekAssignments = assignments.filter(a => a.week === currentWeek || (!a.week && currentWeek === 1)); 

                            return (
                                <tr key={currentWeek}>
                                    <td>{currentWeek}</td>
                                    <td>
                                        {weekMaterials.length > 0 ? (
                                            weekMaterials.map((material, idx) => (
                                                <div key={idx}>
                                                    {material.name} <a href={material.url} target="_blank" rel="noopener noreferrer">[slide]</a>
                                                </div>
                                            ))
                                        ) : (
                                            <span>Week {currentWeek} Topic</span> // 預設顯示
                                        )}
                                    </td>
                                    <td>
                                        {weekAssignments.length > 0 ? (
                                            weekAssignments.map((assignment, idx) => (
                                                <div key={idx}>
                                                    <a href={`/course/${courseId}/assignment/${assignment.id}`}>
                                                        {assignment.name}
                                                    </a>
                                                </div>
                                            ))
                                        ) : (
                                            <span>-</span> // 無作業時顯示
                                        )}
                                    </td>
                                    <td>
                                        {/* 這裡可以根據需要顯示參考資料 */}
                                        <a href="#">Ref {currentWeek}</a>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {/* To Do 區塊維持不變 */}
                 <div className="todo-panel">
                    <h4>To Do</h4>
                    {assignments.length > 0 ? (
                        assignments.slice(0, 3).map((assignment, idx) => (
                            <div key={idx} className="todo-item">
                                <strong>{assignment.name}</strong>
                                <span>{course.title}</span>
                                <span>
                                    {assignment.points || "N/A"} pts • 
                                    {new Date(assignment.dueDate).toLocaleDateString()} at 
                                    {new Date(assignment.dueDate).toLocaleTimeString()}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="todo-item">
                            <span>目前沒有待辦事項</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CourseDetail;
