import React, { useState } from "react";
import { FaCalendarAlt, FaPaperclip, FaUpload } from "react-icons/fa";
import styles from "./AssignmentStudentCard.module.css";

export default function AssignmentStudentCard({ 
    assignment,
    submissionMap,
    expanded,
    onToggleExpand,
    onAssignmentDownload,
    onSubmittedFileDownload,
    onUploadClick
}) {
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
                return { status: 'overdue', label: '遲交', cssClass: 'status-overdue' };
            } else {
                return { status: 'pending', label: '未繳交', cssClass: 'status-pending' };
            }
        } else {
            // 已繳交
            const submitDate = new Date(submission.submit_date);
            if (submitDate > dueDate) {
                return { status: 'late', label: '遲交', cssClass: 'status-late' };
            } else {
                return { status: 'submitted', label: '已繳交', cssClass: 'status-submitted' };
            }
        }
    };

    const submissionStatus = getSubmissionStatus(assignment);

    return (
        <div className={styles["assignment-card"]}>
            <div 
                className={styles["assignment-header"]} 
                onClick={() => onToggleExpand(assignment.id)}
            >
                <span className={styles["expand-arrow"]}>
                    {expanded[assignment.id] ? '▲' : '▼'}
                </span>
                <h3 className={styles["assignment-title"]}>
                    {assignment.name}
                </h3>
                <span 
                    className={`${styles["status-badge"]} ${styles[submissionStatus.cssClass]}`}
                >
                    {submissionStatus.label}
                </span>
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
                                onClick={() => onUploadClick(assignment)}
                            >
                                <FaUpload className={styles["button-icon"]} />
                                修改作業
                            </button>
                        ) : (
                            <button 
                                className={styles["submit-button"]} 
                                onClick={() => onUploadClick(assignment)}
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
                                <div className={`${styles["assignment-submission-info"]} ${styles[statusInfo.cssClass]}`}>
                                    <div>
                                        {statusInfo.label}
                                        {statusInfo.status === 'late' && ' (超過截止時間)'}
                                    </div>
                                    <div>繳交時間：{submission.submit_date ? new Date(submission.submit_date).toLocaleString('zh-TW') : '無'}</div>
                                    <div>截止時間：{formatDate(assignment.dueDate)}</div>
                                    {/* 學生繳交檔案下載按鈕 */}
                                    {submission.attachments && submission.attachments.length > 0 && (
                                        <div>檔案：
                                            <ul className={styles["file-list"]}>
                                                {submission.attachments.map((att, idx) => (
                                                    <li key={idx} className={styles["file-list-item"]}>
                                                        <span
                                                            className={styles["file-download-link"]}
                                                            onClick={() => onSubmittedFileDownload && onSubmittedFileDownload(att)}
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
                                        <div className={styles["submission-description-container"]}>
                                            <div className={styles["submission-description-label"]}>提交說明：</div>
                                            <div className={styles["submission-description-content"]}>
                                                {submission.description}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        } else if (statusInfo.status === 'overdue') {
                            // 未繳交且已過期的情況
                            return (
                                <div className={`${styles["assignment-submission-info"]} ${styles[statusInfo.cssClass]}`}>
                                    <div>
                                        ⚠️ {statusInfo.label} - 已超過截止時間
                                    </div>
                                    <div>截止時間：{formatDate(assignment.dueDate)}</div>
                                    <div className={styles["overdue-reminder"]}>
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
} 