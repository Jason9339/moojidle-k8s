import React, { useState, useEffect } from 'react';
import styles from './TeacherExamReview.module.css';

import { GetTakenExamInExam, GradeExam } from '@/services/TakenExamApi.js';

const GradeForm = ({examData, setExamData, isGrading, setIsGrading, examMaxScore, beGradedUserId, takenExamId, examId}) => {
    const graderId = JSON.parse(localStorage.getItem("user"))?.user_id;
    const [GradeScore, setReviewScore] = useState('');

    const handleSubmitGrading = async (e) => {
        e.preventDefault();

        // Validate that a score has been entered
        if (!GradeScore || GradeScore.trim() === '') {
            console.error('Grading score is required.');
            alert('Please enter a score before submitting.');
            return;
        }
        console.log("Submitting grading for user:", beGradedUserId);
        console.log("Grading score:", GradeScore);
        console.log("Taken exam ID:", takenExamId);
        const response = await GradeExam(GradeScore, graderId, beGradedUserId, takenExamId, examId);
        console.log("Grading response:", response);
        if (response.updated) {
            // Create a copy of the examData
            const updatedExamData = { ...examData };

            // Update the specific taken exam in the takenExams array
            updatedExamData.takenExams = examData.takenExams.map(takenExam => 
                takenExam.t_exam_id === takenExamId && takenExam.taken_by_user_id === beGradedUserId
                    ? { 
                        ...takenExam, 
                        score: parseFloat(GradeScore),
                        graded_by_user_id: graderId // Update the grader ID as well
                    }
                    : takenExam
            );

            setExamData(updatedExamData);
        } 
        else if (response?.t_exam_id !== undefined) {
            // A new taken exam was created - append it to the existing data
            const updatedExamData = { ...examData };

            // Add the new taken exam to the takenExams array
            updatedExamData.takenExams = [
                ...examData.takenExams,
                response // The newly created taken exam object
            ];

            // Update the state with the new data
            setExamData(updatedExamData);
            // Close any form or modal that might be open
            setIsGrading(null);
        }
        setIsGrading(null);
    };

    const handleCancelGrading = () => setIsGrading(null);

    // Only show the form if isGrading equals the current student's ID
    const showForm = isGrading === beGradedUserId;

    return (
        <td>
            {showForm && (
                <form onSubmit={handleSubmitGrading} className={styles["review-form"]}>
                    <div className={styles["form-group"]}>
                        <label>Score:</label>
                        <input
                            type="number"
                            value={GradeScore}
                            onChange={(e) => {
                                const value = e.target.value;
                                setReviewScore(value);
                            }}
                            min="0"
                            max={examMaxScore}
                            className={styles["score-input"]}
                            step="0.01"
                        />
                    </div>
                    <div className={styles["form-actions"]}>
                        <button type="submit" className={styles["submit-button"]}>Submit</button>
                        <button type="button" onClick={handleCancelGrading} className={styles["cancel-button"]}>Cancel</button>
                    </div>
                </form>
            )}
        </td>
    );
};

const fetchTakenExams = async (examId, setLoading, setError) => {

    try {
        setLoading(true);
        const data = await GetTakenExamInExam(examId);
        console.log("Fetched data:", data);

        return data

    } catch (error) {
        console.error("Error fetching submissions:", error);
        setError("Failed to fetch exam data. Please try again later.");
    } finally {
        setLoading(false);
    }
}

const TeacherExamReview = ({ examId, examMaxScore }) => {
    const [examData, setExamData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [gradeFormVisible, setGradeFormVisible] = useState(false);

    useEffect(() => {
        const loadExamData = async () => {
            const data = await fetchTakenExams(examId, setLoading, setError);
            if (data) {
                setExamData(data);
            }
        };
        loadExamData();
    }, [examId]);




    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;


    return (
        <div className={styles["exam-review-container"]}>
                <table className={styles["submissions-table"]}>
                    <colgroup>
                        <col style={{ width: "12%" }} />
                        <col style={{ width: "12%" }} />
                        <col style={{ width: "12%" }} />
                        <col style={{ width: "12%" }} />
                        <col style={{ width: "12%" }} />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>Student Name</th>
                            {/* <th>Student ID</th> */}
                            {/* <th>Email</th> */}
                            {/* <th>Submissions</th> */}
                            <th>Grade (0-{examMaxScore})</th>
                            <th>Status</th>
                            <th>Actions</th>
                            <th>GradeForm</th>
                        </tr>
                    </thead>
                    <tbody>
                        {examData.students && examData.students.map((student, index) => {
                            // Find if student has taken this exam
                            const takenExam = examData.takenExams?.find(t => t.taken_by_user_id === student.user_id);
                            const hasTakenExam = !!takenExam;

                            return (
                                <tr key={student.user_id || index} className={styles["submission-row"]}>
                                    <td>{student.name || 'Unknown Student'}</td>
                                    <td>
                                        {hasTakenExam 
                                            ? (takenExam.score !== null ? takenExam.score : 'Not graded') 
                                            : '0'}
                                    </td>
                                    <td>
                                        {!hasTakenExam ? (
                                            <span className={styles["status-pending"]}>待評分</span>
                                        ) : (
                                                <span className={styles["status-graded"]}>已評分</span>
                                            )}
                                    </td>
                                    <td>
                                        <button
                                            className={styles["review-button"]}
                                            onClick={() => {
                                                // Set the specific student ID as the current grading target
                                                setGradeFormVisible(student.user_id);
                                            }}
                                        >
                                            Grade
                                        </button>

                                    </td>


                                    <GradeForm 
                                        examData={examData}
                                        setExamData={setExamData}
                                        isGrading={gradeFormVisible}
                                        setIsGrading={setGradeFormVisible}
                                        examMaxScore={examMaxScore}
                                        beGradedUserId={student.user_id}
                                        takenExamId={takenExam?.t_exam_id}
                                        examId={examId}

                                    />

                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            
        
        </div>
    );




}

export default TeacherExamReview;
