
import React, { useState, useEffect } from 'react';
import styles from './teacherassignmentreview.module.css';

const TeacherAssignmentReview = ({ assignmentId, submissions }) => {
  const [reviewData, setReviewData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate fetching data
    if (submissions) {
      // Transform submissions data to include additional fields if needed
      const enhancedSubmissions = submissions.map(sub => ({
        ...sub,
        status: sub.status || "Submitted",
        grade: sub.grade || "-",
        description: sub.description || "-"
      }));
      setReviewData(enhancedSubmissions);
      setLoading(false);
    }
  }, [submissions]);

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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviewData.map((submission, index) => (
                  <tr key={index} className={`${styles["submission-row"]}`}>
                    <td>{submission.studentName}</td>
                    <td>{submission.submissionDate}</td>
                    <td>{submission.status}</td>
                    <td>{submission.grade}</td>
                    <td>{submission.description}</td>
                    <td className={`${styles["action-buttons"]}`}>
                      <button className={`${styles["download-button"]}`}>Download</button>
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

