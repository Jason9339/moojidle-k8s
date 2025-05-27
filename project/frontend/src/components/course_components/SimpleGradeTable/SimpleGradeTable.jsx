import { useState } from "react";

// css style
import styles from "./SimpleGradeTable.module.css";

function SimpleGradeTable({ simpleGrades }) {
    if (simpleGrades.length == 0) {
        return (
            <div>
                No Data yet...
            </div>
        );
    }

    // getting:
    // [
    //     {
    //         "ass_id": 5,
    //         "in_course_id": 2,
    //         "create_by_user_id": 15,
    //         "ass_name": "Assignment 5 for Course 2",
    //         "create_date": "2025-01-08T00:00:00.000Z",
    //         "start_date": "2025-01-08T00:00:00.000Z",
    //         "end_date": "2025-01-15T00:00:00.000Z",
    //         "max_score": 100,
    //         "percentage": 0.1
    //     },
    //     {
    //         "exam_id": 4,
    //         "in_course_id": 2,
    //         "create_by_user_id": 2,
    //         "exam_name": "Exam 4 for Course 2",
    //         "start_date": "2025-01-15T00:00:00.000Z",
    //         "end_date": "2025-01-15T03:00:00.000Z",
    //         "create_date": "2025-01-01T00:00:00.000Z",
    //         "max_score": 100,
    //         "percentage": 0.1
    //     }
    // ......

    let names = [null];
    let maxScores = ["Max Score"];
    let percentages = ["Percentage"];
    for (let i = 0; i < simpleGrades.length; i++) {
        names.push(simpleGrades[i].ass_name || simpleGrades[i].exam_name);
        maxScores.push(simpleGrades[i].max_score);
        percentages.push(simpleGrades[i].percentage);
    }
    let content = [maxScores, percentages];

    // get summary
    let maxGrade = 0;
    for (let i = 1; i < percentages.length; i ++){
        // start from the 2nd element since the first one is the title on the left of that row
        maxGrade += percentages[i];
    }

    return (
        <div className={styles["simple-grade-container"]}>
            <div className={styles["table-wrapper"]}>
                <table className={styles["grade-table"]}>
                    <thead>
                        <tr>
                            {names.map((name, index) => (
                                <th key={index} className={styles["header-row"]}>
                                    {name}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {content.map((row, rowIndex) => (
                            <tr key={rowIndex} className={styles["content-row"]}>
                                {row.map((cell, colIndex) =>
                                    colIndex === 0 ? (
                                        <th key={colIndex} className={styles["header-row"]}>
                                            {cell}
                                        </th>
                                    ) : (
                                        <td key={colIndex} className={styles["value"]}>
                                            {cell}
                                        </td>
                                    )
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className={styles["summary-box"]}>
                <div className={styles["summary"]}>
                    課程總站比: {maxGrade} 
                </div>
                <div className={styles["summary"]}>
                    課程最高分數: {maxGrade * 100}
                </div>
            </div>
        </div>
    );
}

export default SimpleGradeTable;
