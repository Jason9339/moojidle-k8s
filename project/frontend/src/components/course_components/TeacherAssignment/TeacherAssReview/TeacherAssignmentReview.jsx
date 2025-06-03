import React, { useState, useEffect } from 'react';
import styles from './TeacherAssignmentReview.module.css';
import { GetAssignmentSubmissions } from '@/services/SubmitAssignmentApi.js';
import SubmittedTab from './SubmittedTab';
import NonSubmittedTab from './NonSubmittedTab';

const TeacherAssignmentReview = ({ assignmentId, assignmentMaxScore }) => {
    const userId = JSON.parse(localStorage.getItem("user"))?.user_id;
    const [reviewData, setReviewData] = useState([]);
    const [nonSubmittingStudents, setNonSubmittingStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('submitted');
    const [reviewingSubmission, setReviewingSubmission] = useState(null);

    const fetchSubmissions = async () => {
        try {
            setLoading(true);
            const response = await GetAssignmentSubmissions(assignmentId);

            if (response && response.submissions) {
                const enhancedSubmissions = response.submissions.map(sub => ({
                    studentName: sub.student_name || "Unknown",
                    submissionDate: new Date(sub.submit_date).toLocaleString(),
                    status: sub.status || "Submitted",
                    grade: sub.score || "-",
                    description: sub.description || "-",
                    attachments: sub.attachments || [],
                    submissionId: sub.s_ass_id
                }));
                setReviewData(enhancedSubmissions);
            } else {
                setReviewData([]);
            }

            if (response && response.nonSubmittingStudents) {
                setNonSubmittingStudents(response.nonSubmittingStudents);
            } else {
                setNonSubmittingStudents([]);
            }
        } catch (error) {
            console.error("Error fetching submissions:", error);
            setReviewData([]);
            setNonSubmittingStudents([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (assignmentId) {
            fetchSubmissions();
        }
    }, [assignmentId]);

    return (
        <div className={styles["teacher-assignment-review"]}>
            <h2>Assignment Review</h2>
            <div className={styles["tab-controls"]}>
                <button
                    className={`${styles["tab-button"]} ${activeTab === 'submitted' ? styles["active"] : ""}`}
                    onClick={() => setActiveTab('submitted')}
                >
                    Submitted ({reviewData.length})
                </button>
                <button
                    className={`${styles["tab-button"]} ${activeTab === 'non-submitted' ? styles["active"] : ""}`}
                    onClick={() => setActiveTab('non-submitted')}
                >
                    Not Submitted ({nonSubmittingStudents.length})
                </button>
            </div>
            {loading ? (
                <p>Loading submissions...</p>
            ) : (
                <div className={styles["table-container"]}>
                    {activeTab === 'submitted' ? (
                        <SubmittedTab
                            userId={userId}
                            reviewData={reviewData}
                            setReviewData={setReviewData}
                            reviewingSubmission={reviewingSubmission}
                            setReviewingSubmission={setReviewingSubmission}
                            assignmentMaxScore={assignmentMaxScore}
                        />
                    ) : (
                        <NonSubmittedTab nonSubmittingStudents={nonSubmittingStudents} />
                    )}
                </div>
            )}
        </div>
    );
};

export default TeacherAssignmentReview;