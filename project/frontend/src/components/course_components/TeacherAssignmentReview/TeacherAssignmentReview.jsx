
import React, { useState, useEffect } from 'react';
import styles from './teacherassignmentreview.module.css';
import {GetAssignmentSubmissions, GradeAssignment} from '@/services/SubmitAssignmentApi.js';

const TeacherAssignmentReview = ({ assignmentId }) => {
    const userId = JSON.parse(localStorage.getItem("user"))?.user_id;
  const [reviewData, setReviewData] = useState([]);
  const [nonSubmittingStudents, setNonSubmittingStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('submitted'); // 'submitted' or 'non-submitted'
  const [expandedSubmissionId, setExpandedSubmissionId] = useState(null);
  const [reviewingSubmission, setReviewingSubmission] = useState(null);
  const [reviewScore, setReviewScore] = useState('');

    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const response = await GetAssignmentSubmissions(assignmentId);
        
        if (response && response.submissions) {
          // Transform API response data for submissions
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
  useEffect(() => {
    if (assignmentId) {
      fetchSubmissions();
    }
  }, [assignmentId]);

  const handleReviewClick = (submission) => {
    setReviewingSubmission(submission);
    setReviewScore(submission.grade !== '-' ? submission.grade : '');
    setReviewComment('');
  };

  const handleSubmitReview = async (e)   => {
    e.preventDefault();
    // console.log('Submitting review for:', reviewingSubmission.submissionId);
    // console.log('Score:', reviewScore);
    // console.log('Comment:', reviewComment);

    const response = await GradeAssignment(userId, reviewingSubmission.submissionId, reviewScore);
    console.log('Grade response:', response);
    
    if (response.updated) {
      // Update the local data with the new score
      const updatedReviewData = reviewData.map(submission => {
        if (submission.submissionId === reviewingSubmission.submissionId) {
          return {
            ...submission,
            grade: reviewScore,
            status: "已評分"  // Update status to "Graded"
          };
        }
        return submission;
      });
      
      setReviewData(updatedReviewData);
    } 

    
    // Here you would typically call an API to update the grade
    // For now, we'll just close the review form
    setReviewingSubmission(null);
  };

  const handleCancelReview = () => {
    setReviewingSubmission(null);
  };


  const handleAttachmentClick = (file, event) => {
    event.stopPropagation();
    console.log(`Attachment link clicked: ${file.filename}, URL: ${file.url}`);
    // Future download/preview logic can be added here
  };


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
                      <th>Grade (0-100)</th>
                      <th>Submissions</th>
                      <th>Status</th>
                      <th>Actions</th>
                      <th>Review Form</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviewData.map((submission, index) => {
                      const isExpanded = expandedSubmissionId === (submission.submissionId || index);
                      
                      return (
                        <tr key={submission.submissionId || index} className={`${styles["submission-row"]}`}>
                          <td>{submission.studentName}</td>
                          <td>{submission.submissionDate}</td>
                          <td>{submission.grade}</td>
                          <td 
                            className={`${styles["submission-content"]} ${isExpanded ? styles["expanded"] : ""}`}
                            onClick={() => setExpandedSubmissionId(isExpanded ? null : (submission.submissionId || index))}
                          >
                            <div className={`${styles["content-container"]}`}>
                              <div className={`${styles["description-section"]}`}>
                                {submission.description}
                              </div>
                              {submission.attachments && submission.attachments.length > 0 && (
                                <div className={`${styles["attachment-section"]}`}>
                                  <div className={`${styles["attachment-list"]}`}>
                                    {submission.attachments.map((file, fileIndex) => (
                                      <div key={fileIndex} className={`${styles["attachment-item"]}`}>
                                        <a 
                                          // href={file.url} 
                                          download={file.filename}
                                          className={`${styles["attachment-link"]}`}
                                          // target="_blank"
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
                            <div className={`${styles["expand-indicator"]}`}>
                              {isExpanded ? "▲ 收起" : "▼ 展開"}
                            </div>
                          </td>
                          <td>{submission.status}</td>
                          <td className={`${styles["action-buttons"]}`}>
                            <button 
                              className={`${styles["review-button"]}`} 
                              onClick={() => handleReviewClick(submission)}
                            >
                              Review
                            </button>
                          </td>
                          <td>
                            {reviewingSubmission && reviewingSubmission.submissionId === submission.submissionId && (
                              <form onSubmit={handleSubmitReview} className={`${styles["review-form"]}`}>
                                <div className={`${styles["form-group"]}`}>
                                  <label>Score:</label>
                                  <input 
                                    type="number" 
                                    value={reviewScore} 
                                    onChange={(e) => setReviewScore(e.target.value)}
                                    min="0"
                                    max="100"
                                    className={`${styles["score-input"]}`}
                                  />
                                </div>
                                <div className={`${styles["form-group"]}`}>
                                </div>
                                <div className={`${styles["form-actions"]}`}>
                                  <button type="submit" className={`${styles["submit-button"]}`}>Submit</button>
                                  <button type="button" onClick={handleCancelReview} className={`${styles["cancel-button"]}`}>Cancel</button>
                                </div>
                              </form>
                            )}
                          </td>
                        </tr>
                      );
                    })}
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

