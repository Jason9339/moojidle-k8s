// 學生作業列表元件
import React, { useState } from "react";
import { FaCalendarAlt, FaPaperclip, FaUpload } from "react-icons/fa";
import styles from "./AssignmentsStudentsTab.module.css";
import SubmittedAssUploadModal from "@/components/course_components/SubmittedAssUploadModal/SubmittedAssUploadModal";

export default function AssignmentsStudentsTab({ 
    courseId,
    assignments,
    loading,
    error,
    submissionMap,
    onAssignmentDownload,
    onSubmittedFileDownload,
    onUploadSuccess
}) {
    const [expanded, setExpanded] = useState({});
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [currentAssignment, setCurrentAssignment] = useState(null);

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

    // 判斷繳交狀態
    const getSubmissionStatus = (assignment) => {
        const submission = submissionMap[assignment.id];
        const now = new Date();
        const dueDate = new Date(assignment.dueDate);
        
        if (!submission) {
            // 未繳交
            if (now > dueDate) {
                return { status: 'overdue', label: '遲交', color: '#ff4d4f', bgColor: '#fff2f0' };
            } else {
                return { status: 'pending', label: '未繳交', color: '#faad14', bgColor: '#fffbe6' };
            }
        } else {
            // 已繳交
            const submitDate = new Date(submission.submit_date);
            if (submitDate > dueDate) {
                return { status: 'late', label: '遲交', color: '#ff4d4f', bgColor: '#fff2f0' };
            } else {
                return { status: 'submitted', label: '已繳交', color: '#52c41a', bgColor: '#f6ffed' };
            }
        }
    };

    // 處理上傳成功
    const handleUploadSuccessInternal = async () => {
        if (onUploadSuccess) {
            await onUploadSuccess();
        }
        setShowUploadModal(false);
    };

    if (loading) return <div>載入中...</div>;
    if (error) return <div style={{color:'red'}}>{error}</div>;

    return (
        <div className={styles["assignments-container"]}>
            {showUploadModal && currentAssignment && (                
                <SubmittedAssUploadModal
                    onClose={() => setShowUploadModal(false)}
                    courseId={courseId}
                    assignmentId={currentAssignment.id}
                    onSuccess={async () => {
                        await refreshAssignments();
                        setShowUploadModal(false);
                    }}
                />
            )}
            {sortedWeeks.length === 0 ? (
                <div className={styles["empty-assignments-card"]}>
                    <p>此課程目前沒有作業</p>
                </div>
            ) : (
                sortedWeeks.map(week => (
                    <div key={week} className={styles["week-section"]} style={{marginBottom: '8px'}}>
                        <div className={styles["assignments-list"]} style={{gap: '4px'}}>
                            {groupedAssignments[week].map(assignment => {
                                const submissionStatus = getSubmissionStatus(assignment);
                                return (
                                    <div key={assignment.id} className={styles["assignment-card"]} style={{width: '100%', maxWidth: '100%', minHeight: '36px', margin: '0 0 4px 0', fontSize: 'clamp(13px, 1vw, 16px)', boxSizing: 'border-box', padding: '10px 14px'}}>
                                        <div className={styles["assignment-header"]} style={{display:'flex',alignItems:'center',cursor:'pointer', minHeight: '24px'}} onClick={() => toggleExpand(assignment.id)}>
                                            <span style={{fontSize:'1.1em',color:'#1890ff',marginRight:8}}>{expanded[assignment.id] ? '▲' : '▼'}</span>
                                            <h3 className={styles["assignment-title"]} style={{fontSize: 'clamp(15px, 1.2vw, 18px)', flex:1, margin:0}}>{assignment.name}</h3>
                                            {(() => {
                                                const statusInfo = getSubmissionStatus(assignment);
                                                return (
                                                    <span 
                                                        className={styles["status-badge"]}
                                                        style={{
                                                            color: statusInfo.color,
                                                            backgroundColor: statusInfo.bgColor,
                                                            padding: '2px 8px',
                                                            borderRadius: '12px',
                                                            fontSize: '12px',
                                                            fontWeight: '500',
                                                            border: `1px solid ${statusInfo.color}`,
                                                            marginLeft: '8px'
                                                        }}
                                                    >
                                                        {statusInfo.label}
                                                    </span>
                                                );
                                            })()}
                                        </div>
                                        {expanded[assignment.id] && (
                                            <>
                                                <div className={styles["assignment-meta"]}>
                                                    <div className={`${styles["tag"]} ${styles["tag-orange"]}`}>
                                                        <FaCalendarAlt className={styles["tag-icon"]} />
                                                        截止日期: {formatDate(assignment.dueDate)}
                                                    </div>
                                                    <div className={`${styles["tag"]} ${styles["tag-green"]}`}>
                                                        作業 ID: {assignment.id}
                                                    </div>
                                                </div>
                                                <div className={styles["assignment-description"]}>
                                                    <p className={styles["description-label"]}>作業說明：</p>
                                                    <p>{assignment.description || '無說明'}</p>
                                                </div>
                                                {/* 附件下載按鈕 */}
                                                {assignment.attachments && assignment.attachments.length > 0 && (
                                                    <div className={styles["assignment-attachments"]}>
                                                        <p className={styles["attachments-label"]}>附件：</p>
                                                        <ul className={styles["attachments-list"]}>
                                                            {assignment.attachments.map((attachment, idx) => (
                                                                <li key={idx} className={styles["attachment-item"]}>
                                                                    <span
                                                                        className={styles["attachment-link"]}
                                                                        onClick={() => onAssignmentDownload && onAssignmentDownload(attachment)}
                                                                        style={{ cursor: 'pointer', color: '#1890ff', textDecoration: 'underline' }}
                                                                    >
                                                                        <FaPaperclip className={styles["file-icon"]} />
                                                                        {attachment.filename}
                                                                    </span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                                <div className={styles["assignment-actions"]}>
                                                    {submissionMap[assignment.id] ? (
                                                        <button 
                                                            className={`${styles["submit-button"]} submitted`} 
                                                            onClick={() => { setCurrentAssignment(assignment); setShowUploadModal(true); }}
                                                        >
                                                            <FaUpload className={styles["button-icon"]} />
                                                            修改作業
                                                        </button>
                                                    ) : (
                                                        <button 
                                                            className={styles["submit-button"]} 
                                                            onClick={() => { setCurrentAssignment(assignment); setShowUploadModal(true); }}
                                                        >
                                                            <FaUpload className={styles["button-icon"]} />
                                                            提交作業
                                                        </button>
                                                    )}
                                                </div>
                                                {/* 顯示繳交紀錄 */}
                                                {(() => {
                                                    const statusInfo = getSubmissionStatus(assignment);
                                                    const submission = submissionMap[assignment.id];
                                                    
                                                    if (submission) {
                                                        // 已繳交的情況
                                                        return (
                                                            <div 
                                                                className={styles["assignment-submission-info"]} 
                                                                style={{
                                                                    marginTop:'8px',
                                                                    padding:'8px',
                                                                    background: statusInfo.bgColor,
                                                                    border: `1px solid ${statusInfo.color}`,
                                                                    borderRadius:'4px'
                                                                }}
                                                            >
                                                                <div style={{color: statusInfo.color, fontWeight: '500'}}>
                                                                    {statusInfo.label}
                                                                    {statusInfo.status === 'late' && ' (超過截止時間)'}
                                                                </div>
                                                                <div>繳交時間：{submission.submit_date ? new Date(submission.submit_date).toLocaleString('zh-TW') : '無'}</div>
                                                                <div>截止時間：{formatDate(assignment.dueDate)}</div>
                                                                {/* 學生繳交檔案下載按鈕 */}
                                                                {submission.attachments && submission.attachments.length > 0 && (
                                                                    <div style={{marginTop: '8px'}}>檔案：
                                                                        <ul style={{margin:0,paddingLeft:'1em'}}>
                                                                            {submission.attachments.map((att, idx) => (
                                                                                <li key={idx}>
                                                                                    <span
                                                                                        onClick={() => onSubmittedFileDownload && onSubmittedFileDownload(att)}
                                                                                        style={{ cursor: 'pointer', color: '#1890ff', textDecoration: 'underline' }}
                                                                                    >
                                                                                        {att.filename}
                                                                                    </span>
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                )}
                                                                {/* 學生提交的描述 */}
                                                                {submission.description && (
                                                                    <div style={{marginTop: '8px'}}>
                                                                        <div style={{fontWeight: '500', marginBottom: '4px'}}>提交說明：</div>
                                                                        <div style={{
                                                                            backgroundColor: '#f8f9fa',
                                                                            border: '1px solid #e9ecef',
                                                                            borderRadius: '4px',
                                                                            padding: '8px',
                                                                            fontSize: '14px',
                                                                            lineHeight: '1.4',
                                                                            whiteSpace: 'pre-wrap',
                                                                            wordBreak: 'break-word'
                                                                        }}>
                                                                            {submission.description}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    } else if (statusInfo.status === 'overdue') {
                                                        // 未繳交且已過期的情況
                                                        return (
                                                            <div 
                                                                className={styles["assignment-submission-info"]} 
                                                                style={{
                                                                    marginTop:'8px',
                                                                    padding:'8px',
                                                                    background: statusInfo.bgColor,
                                                                    border: `1px solid ${statusInfo.color}`,
                                                                    borderRadius:'4px'
                                                                }}
                                                            >
                                                                <div style={{color: statusInfo.color, fontWeight: '500'}}>
                                                                    ⚠️ {statusInfo.label} - 已超過截止時間
                                                                </div>
                                                                <div>截止時間：{formatDate(assignment.dueDate)}</div>
                                                                <div style={{color: '#666', fontSize: '12px', marginTop: '4px'}}>
                                                                    請盡快提交作業
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                })()}
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
