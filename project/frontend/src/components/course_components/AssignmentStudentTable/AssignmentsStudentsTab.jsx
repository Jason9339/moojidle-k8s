// 學生作業列表元件
import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaPaperclip, FaUpload } from "react-icons/fa";
import { GetCourseAssignments } from "@/services/AssignmentApi";
import "./AssignmentsStudentsTab.css";

export default function AssignmentsStudentsTab({ courseId }) {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!courseId) return;
        setLoading(true);
        GetCourseAssignments(courseId)
            .then(setAssignments)
            .catch(() => setError("無法取得作業列表"))
            .finally(() => setLoading(false));
    }, [courseId]);

    // 依照週次分組作業
    const groupedAssignments = assignments.reduce((acc, assignment) => {
        const week = assignment.week || 'Unassigned';
        if (!acc[week]) {
            acc[week] = [];
        }
        acc[week].push(assignment);
        return acc;
    }, {});

    // 轉換為數組並排序
    const sortedWeeks = Object.keys(groupedAssignments)
        .sort((a, b) => a === 'Unassigned' ? 1 : b === 'Unassigned' ? -1 : parseInt(a) - parseInt(b));

    const formatDate = (dateString) => {
        if (!dateString) return '無截止日期';
        const date = new Date(dateString);
        return date.toLocaleString('zh-TW', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) return <div>載入中...</div>;
    if (error) return <div style={{color:'red'}}>{error}</div>;

    return (
        <div className="assignments-container">
            <h2 className="assignments-title">作業列表</h2>
            {sortedWeeks.length === 0 ? (
                <div className="empty-assignments-card">
                    <p>此課程目前沒有作業</p>
                </div>
            ) : (
                sortedWeeks.map(week => (
                    <div key={week} className="week-section">
                        <div className="week-divider">
                            <span className="week-tag">第 {week} 週</span>
                        </div>
                        <div className="assignments-list">
                            {groupedAssignments[week].map(assignment => (
                                <div key={assignment.id} className="assignment-card">
                                    <div className="assignment-header">
                                        <h3 className="assignment-title">{assignment.name}</h3>
                                    </div>
                                    <div className="assignment-meta">
                                        <div className="tag tag-orange">
                                            <FaCalendarAlt className="tag-icon" />
                                            截止日期: {formatDate(assignment.dueDate)}
                                        </div>
                                        <div className="tag tag-green">
                                            作業 ID: {assignment.id}
                                        </div>
                                    </div>
                                    <div className="assignment-description">
                                        <p className="description-label">作業說明：</p>
                                        <p>{assignment.description || '無說明'}</p>
                                    </div>
                                    {assignment.attachments && assignment.attachments.length > 0 && (
                                        <div className="assignment-attachments">
                                            <p className="attachments-label">附件：</p>
                                            <ul className="attachments-list">
                                                {assignment.attachments.map((attachment, idx) => (
                                                    <li key={idx} className="attachment-item">
                                                        <a 
                                                            className="attachment-link" 
                                                            href={attachment.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            <FaPaperclip className="file-icon" />
                                                            {attachment.filename}
                                                        </a>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    <div className="assignment-actions">
                                        <button className="submit-button">
                                            <FaUpload className="button-icon" />
                                            提交作業
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
