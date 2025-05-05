import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "@/styles/CourseDetail.css";

function CourseDetail() {
    const { courseId } = useParams();
    const courseTitle = "微積分甲";

    const [activeTab, setActiveTab] = useState("課程");

    return (
        <div className="course-detail-container">
            {/* 課程標題列 */}
            <div className="course-header">
                <span>{courseTitle}</span>
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

            {/* 教材表格 + To Do 區塊 */}
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
                        {Array.from({ length: 16 }, (_, i) => (
                            <tr key={i}>
                                <td>{i + 1}</td>
                                <td>
                                    Week {i + 1} Topic <a href="#">[slide]</a>
                                </td>
                                <td>
                                    <a href="#">HW {i}</a>
                                </td>
                                <td>
                                    <a href="#">Ref {i + 1}</a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="todo-panel">
                    <h4>To Do</h4>
                    <div className="todo-item">
                        <strong>Turn in Homework</strong>
                        <span>Biology 102</span>
                        <span>100 pts • Nov 21 at 11:59pm</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CourseDetail;
