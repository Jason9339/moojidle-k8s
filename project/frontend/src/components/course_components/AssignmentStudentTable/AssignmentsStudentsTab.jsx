// 學生作業列表元件
import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaPaperclip, FaUpload } from "react-icons/fa";
import { GetCourseAssignments, GetAssignmentSubmission } from "@/services/AssignmentApi";
import UploadModal from "../UploadModal/UploadModal";
import "./AssignmentsStudentsTab.css";

export default function AssignmentsStudentsTab({ courseId }) {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [expanded, setExpanded] = useState({});
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [currentAssignment, setCurrentAssignment] = useState(null);
    const [submissionMap, setSubmissionMap] = useState({});

    useEffect(() => {
        if (!courseId) return;
        setLoading(true);
        GetCourseAssignments(courseId)
            .then(setAssignments)
            .catch(() => setError("無法取得作業列表"))
            .finally(() => setLoading(false));
    }, [courseId]);    useEffect(() => {
        if (!courseId || assignments.length === 0) return;
        // 取得所有作業的繳交紀錄
        refreshSubmissionMapWithAssignments(assignments);
    }, [assignments, courseId]);const refreshAssignments = async () => {
        setLoading(true);
        try {
            const newAssignments = await GetCourseAssignments(courseId);
            setAssignments(newAssignments);
            // 立即用新的作業列表來刷新 submission map
            await refreshSubmissionMapWithAssignments(newAssignments);
        } catch (error) {
            setError("無法取得作業列表");
        } finally {
            setLoading(false);
        }
    };

    const refreshSubmissionMapWithAssignments = async (assignmentsList) => {
        if (!courseId || !assignmentsList || assignmentsList.length === 0) return;
        // 取得所有作業的繳交紀錄
        try {
            const results = await Promise.all(assignmentsList.map(a =>
                GetAssignmentSubmission(a.id)
                    .then(data => ({ assId: a.id, submission: data }))
                    .catch(() => ({ assId: a.id, submission: null }))
            ));
            const map = {};
            results.forEach(({ assId, submission }) => {
                map[assId] = submission;
            });
            setSubmissionMap(map);
        } catch (error) {
            console.error("刷新繳交紀錄失敗:", error);
        }
    };

    const refreshSubmissionMap = () => {
        refreshSubmissionMapWithAssignments(assignments);
    };

    const toggleExpand = (id) => {
        setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
    };

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
            {showUploadModal && currentAssignment && (                <UploadModal
                    onClose={() => setShowUploadModal(false)}
                    courseId={courseId}
                    assignmentId={currentAssignment.id}
                    mode="student-assignment"                    onSuccess={async () => {
                        setShowUploadModal(false);
                        await refreshAssignments();
                    }}
                />
            )}
            {sortedWeeks.length === 0 ? (
                <div className="empty-assignments-card">
                    <p>此課程目前沒有作業</p>
                </div>
            ) : (
                sortedWeeks.map(week => (
                    <div key={week} className="week-section" style={{marginBottom: '8px'}}>
                        <div className="assignments-list" style={{gap: '4px'}}>
                            {groupedAssignments[week].map(assignment => (
                                <div key={assignment.id} className="assignment-card" style={{width: '100%', maxWidth: '100%', minHeight: '36px', margin: '0 0 4px 0', fontSize: 'clamp(13px, 1vw, 16px)', boxSizing: 'border-box', padding: '10px 14px'}}>
                                    <div className="assignment-header" style={{display:'flex',alignItems:'center',cursor:'pointer', minHeight: '24px'}} onClick={() => toggleExpand(assignment.id)}>
                                        <span style={{fontSize:'1.1em',color:'#1890ff',marginRight:8}}>{expanded[assignment.id] ? '▲' : '▼'}</span>
                                        <h3 className="assignment-title" style={{fontSize: 'clamp(15px, 1.2vw, 18px)', flex:1, margin:0}}>{assignment.name}</h3>
                                    </div>
                                    {expanded[assignment.id] && (
                                        <>
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
                                                <button className="submit-button" onClick={() => { setCurrentAssignment(assignment); setShowUploadModal(true); }}>
                                                    <FaUpload className="button-icon" />
                                                    提交作業
                                                </button>
                                            </div>
                                            {/* 顯示繳交紀錄 */}
                                            {submissionMap[assignment.id] && (
                                                <div className="assignment-submission-info" style={{marginTop:'8px',padding:'8px',background:'#f6ffed',border:'1px solid #b7eb8f',borderRadius:'4px'}}>
                                                    <div>已繳交：</div>
                                                    <div>繳交時間：{submissionMap[assignment.id].submit_date ? new Date(submissionMap[assignment.id].submit_date).toLocaleString('zh-TW') : '無'}</div>
                                                    {submissionMap[assignment.id].attachments && submissionMap[assignment.id].attachments.length > 0 && (
                                                        <div>檔案：
                                                            <ul style={{margin:0,paddingLeft:'1em'}}>
                                                                {submissionMap[assignment.id].attachments.map((att, idx) => (
                                                                    <li key={idx}>
                                                                        <a href={att.url} target="_blank" rel="noopener noreferrer">{att.filename}</a>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
