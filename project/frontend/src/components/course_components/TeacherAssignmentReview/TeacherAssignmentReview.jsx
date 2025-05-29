
import React, { useState, useEffect } from 'react';
import styles from './teacherassignmentreview.module.css';
import {GetAssignmentSubmissions} from '@/services/AssignmentApi.js';

const TeacherAssignmentReview = ({ assignmentId }) => {
  const [reviewData, setReviewData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const response = await GetAssignmentSubmissions(assignmentId);
        if (response && response.submissions) {
          // Transform API response data if needed
          const enhancedSubmissions = response.submissions.map(sub => ({
            studentName: sub.student_name || "Unknown",
            submissionDate: new Date(sub.submit_date).toLocaleDateString(),
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
      } catch (error) {
        console.error("Error fetching submissions:", error);
        setReviewData([]);
      } finally {
        setLoading(false);
      }
    };

    if (assignmentId) {
      fetchSubmissions();
    }
  }, [assignmentId]);

  return (
    <div className={`${styles["teacher-assignment-review"]}`}>
      <h2>Assignment Review</h2>
      {loading ? (
        <p>Loading submissions...</p>
      ) : (
          <div className={`${styles["table-container"]}`}>
            {reviewData.length > 0 ? (
              <table className={`${styles["submissions-table"]}`}>
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Submission Date</th>
                    <th>Status</th>
                    <th>Grade (0-100)</th>
                    <th>Description</th>
                    <th>Attachments</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reviewData.map((submission, index) => (
                    <tr key={submission.submissionId || index} className={`${styles["submission-row"]}`}>
                      <td>{submission.studentName}</td>
                      <td>{submission.submissionDate}</td>
                      <td>{submission.status}</td>
                      <td>{submission.grade}</td>
                      <td>{submission.description}</td>
                    <td>
                      {submission.attachments && submission.attachments.length > 0 ? (
                        <div className={`${styles["attachment-list"]}`}>
                          {submission.attachments.map((file, fileIndex) => (
                            <div key={fileIndex} className={`${styles["attachment-item"]}`}>
                              <a 
                                href={file.url} 
                                download={file.filename}
                                className={`${styles["attachment-link"]}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {file.filename}
                              </a>
                            </div>
                          ))}
                        </div>
                      ) : (
                          "No files"
                        )}
                    </td>
                      <td className={`${styles["action-buttons"]}`}>
                        {submission.attachments && submission.attachments.length > 0 && (
                          <button className={`${styles["download-button"]}`}>Download</button>
                        )}
                        <button className={`${styles["review-button"]}`}>Review</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <p>No submissions available for this assignment.</p>}
          </div>
        )}
    </div>
  );
};

export default TeacherAssignmentReview;

