import React, { useState } from 'react';
import styles from './TeacherAssignmentReview.module.css';
import { DownloadSubmissions, GradeAssignment } from '@/services/SubmittedAssignApi.js';
import { useAlert } from '@/utils/alert/AlertContext';

const ReviewForm = ({ userId, reviewData, setReviewData, reviewingSubmission, setReviewingSubmission, submission, assignmentMaxScore }) => {
    const [reviewScore, setReviewScore] = useState('');
    const { addAlert } = useAlert();
    const handleSubmitReview = async (e) => {
        e.preventDefault();

        // Validate that a score has been entered
        if (!reviewScore || reviewScore.trim() === '') {
            console.error('Review score is required.');
            addAlert('Please enter a score before submitting.');
            return;
        }

        const response = await GradeAssignment(userId, reviewingSubmission.submissionId, reviewScore);
        if (response.updated) {
            const updatedReviewData = reviewData.map(sub =>
                sub.submissionId === reviewingSubmission.submissionId
                    ? { ...sub, grade: reviewScore, status: "已評分" }
                    : sub
            );
            setReviewData(updatedReviewData);
        }
        setReviewingSubmission(null);
    };

    const handleCancelReview = () => setReviewingSubmission(null);

    return (
        <td>
            {reviewingSubmission && reviewingSubmission.submissionId === submission.submissionId && (
                <form onSubmit={handleSubmitReview} className={styles["review-form"]}>
                    <div className={styles["form-group"]}>
                        <label>Score:</label>
                        <input
                            type="number"
                            value={reviewScore}
                            onChange={(e) => {
                                const value = e.target.value;
                                setReviewScore(value);
                            }}
                            min="0"
                            max={assignmentMaxScore}
                            className={styles["score-input"]}
                            step="0.01"
                        />
                    </div>
                    <div className={styles["form-actions"]}>
                        <button type="submit" className={styles["submit-button"]} >Submit</button>
                        <button type="button" onClick={handleCancelReview} className={styles["cancel-button"]}>Cancel</button>
                    </div>
                </form>
            )}
        </td>
    );
};

const SubmittedTab = ({ userId, reviewData, setReviewData, reviewingSubmission, setReviewingSubmission, assignmentMaxScore }) => {
    const [expandedSubmissionId, setExpandedSubmissionId] = useState(null);

    const handleAttachmentClick = (file, event) => {
        event.stopPropagation();
        DownloadSubmissions(file.path_to_file, file.filename);
    };

    const handleReviewClick = (submission) => setReviewingSubmission(submission);

    return (
        reviewData.length > 0 ? (
            <table className={styles["submissions-table"]}>
                <colgroup>
                    <col style={{ width: "10%" }} />
                    <col style={{ width: "14%" }} />
                    <col style={{ width: "24%" }} />
                    <col style={{ width: "12%" }} />
                    <col style={{ width: "12%" }} />
                    <col style={{ width: "12%" }} />
                    <col style={{ width: "16%" }} />
                </colgroup>
                <thead>
                    <tr>
                        <th>Student Name</th>
                        <th>Submission Date</th>
                        <th>Submissions</th>
                        <th>Grade (0-{assignmentMaxScore})</th>
                        <th>Status</th>
                        <th>Actions</th>
                        <th>Review Form</th>
                    </tr>
                </thead>
                <tbody>
                    {reviewData.map((submission, index) => {
                        const isExpanded = expandedSubmissionId === (submission.submissionId || index);
                        return (
                            <tr key={submission.submissionId || index} className={styles["submission-row"]}>
                                <td>{submission.studentName}</td>
                                <td>{submission.submissionDate}</td>
                                <td
                                    className={`${styles["submission-content"]} ${isExpanded ? styles["expanded"] : ""}`}
                                    onClick={() => setExpandedSubmissionId(isExpanded ? null : (submission.submissionId || index))}
                                >
                                    <div className={styles["content-container"]}>
                                        <div className={styles["description-section"]}>
                                            {submission.description}
                                        </div>
                                        {submission.attachments && submission.attachments.length > 0 && (
                                            <div className={styles["attachment-section"]}>
                                                <div className={styles["attachment-list"]}>
                                                    {submission.attachments.map((file, fileIndex) => (
                                                        <div key={fileIndex} className={styles["attachment-item"]}>
                                                            <a
                                                                download={file.filename}
                                                                className={styles["attachment-link"]}
                                                                rel="noopener noreferrer"
                                                                onClick={(e) => handleAttachmentClick(file, e)}
                                                            >
                                                                {file.filename}
                                                            </a>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className={styles["expand-indicator"]}>
                                        {isExpanded ? "▲ 收起" : "▼ 展開"}
                                    </div>
                                </td>
                                <td>{submission.grade}</td>
                                <td>
                                    {submission.status === "已評分" ? (
                                        <span className={styles["status-graded"]}>已評分</span>
                                    ) : (
                                        <span className={styles["status-pending"]}>待評分</span>
                                    )}
                                </td>
                                <td>
                                    <button
                                        className={styles["review-button"]}
                                        onClick={() => handleReviewClick(submission)}
                                    >
                                        Review
                                    </button>
                                </td>
                                <ReviewForm
                                    userId={userId}
                                    reviewData={reviewData}
                                    setReviewData={setReviewData}
                                    reviewingSubmission={reviewingSubmission}
                                    setReviewingSubmission={setReviewingSubmission}
                                    submission={submission}
                                    assignmentMaxScore={assignmentMaxScore}
                                />
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        ) : <p>No submissions available for this assignment.</p>
    );
};

export default SubmittedTab;
