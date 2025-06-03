import React from 'react';
import styles from './TeacherAssignmentReview.module.css';

const NonSubmittedTab = ({nonSubmittingStudents}) => {
    return (
        nonSubmittingStudents.length > 0 ? (
            <table className={styles["submissions-table"]}>
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
                        <tr key={index} className={styles["submission-row"]}>
                            <td>{student.name}</td>
                            <td>{student.email}</td>
                            <td>{student.student_id}</td>
                            <td>
                                <button className={styles["reminder-button"]}>Send Reminder</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        ) : <p>All students have submitted this assignment.</p>
    );
};

export default NonSubmittedTab;