
import React, { useState, useEffect } from 'react';
import styles from './teacherassignmentreview.module.css';
import {GetAssignmentSubmissions} from '@/services/AssignmentApi.js';

const TeacherAssignmentReview = ({ assignmentId }) => {
  const [reviewData, setReviewData] = useState([]);
  const [nonSubmittingStudents, setNonSubmittingStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('submitted'); // 'submitted' or 'non-submitted'

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const response = await GetAssignmentSubmissions(assignmentId);
        
        if (response && response.submissions) {
          // Transform API response data for submissions
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
        
        // Set non-submitting students data
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

    if (assignmentId) {
      fetchSubmissions();
    }
  }, [assignmentId]);

  return (
    <div className={`${styles["teacher-assignment-review"]}`}>
      <h2>Assignment Review</h2>
      
      {/* Tab controls */}
      <div className={`${styles["tab-controls"]}`}>
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
        <div className={`${styles["table-container"]}`}>
          {activeTab === 'submitted' ? (
            reviewData.length > 0 ? (
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
            ) : <p>No submissions available for this assignment.</p>
          ) : (
            nonSubmittingStudents.length > 0 ? (
              <table className={`${styles["submissions-table"]}`}>
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Email</th>
                    <th>Student ID</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {nonSubmittingStudents.map((student, index) => (
                    <tr key={index} className={`${styles["submission-row"]}`}>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      <td>{student.student_id}</td>
                      <td className={`${styles["action-buttons"]}`}>
                        <button className={`${styles["reminder-button"]}`}>Send Reminder</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <p>All students have submitted this assignment.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TeacherAssignmentReview;

