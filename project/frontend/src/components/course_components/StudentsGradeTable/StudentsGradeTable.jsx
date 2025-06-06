import { useState, useEffect } from "react";

// css style
import styles from "./StudentsGradeTable.module.css";

function StudentsGradeTable({ studentGrades }) {
    if (studentGrades.length == 0) {
        return (
            <div>
                No Students yet...
            </div>
        );
    }

    const [tableData, setTableData] = useState(null);

    // 截斷文字函數，可自由調整允許字數
    const truncateText = (text, maxLength = 45) => {
        if (!text) return text;
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    // initialize tableData when component loads
    useEffect(() => {
        // deep copy of the data
        setTableData(structuredClone(studentGrades));
    }, [studentGrades]);

    if (!tableData) {
        return (
            <></>
        )
    }

    // getting:
    // [
    //     {
    //         "user_id": 3,
    //         "name": "User 3",
    //         "student_id": 4839,
    //         "sub_ass": [
    //             {
    //                 "s_ass_id": 18,
    //                 "ass_id": 6,
    //                 "ass_name": "Assignment 12 for Course 3"
    //                 "submit_by_user_id": 3,
    //                 "submit_user_course_tag": "StudentTag_3",
    //                 "submit_date": "2025-01-22T00:00:00.000Z",
    //                 "score": 43,
    //                 "percentage": 0.1,
    //                 "graded_by_user_id": 2
    //             },
    //         .........
    //         "taken_exams": [
    //             {
    //                 "t_exam_id": 1,
    //                 "exam_id": 1,
    //                 "exam_name": "Exam 6 for Course 3"
    //                 "taken_by_user_id": 2,
    //                 "taken_user_course_tag": 'StudentTag_2',
    //                 "score": 100,        
    //                 "percentage": 0.1,
    //                 "graded_by_user_id": 14,
    //             },
    //          .......... 
    //      }  
    // ......
    // ]

    function calcTotalScore(tableData) {
        let sum = 0;
        // start from student's assign score
        for(let i = 0; i < tableData.sub_ass.length; i ++){
            sum += ((tableData.sub_ass[i].score || 0) / tableData.sub_ass[i].max_score * tableData.sub_ass[i].percentage)
        }

        // next is student's exam score
        for(let i = 0; i < tableData.taken_exams.length; i ++){
            sum += ((tableData.taken_exams[i].score || 0) / tableData.taken_exams[i].max_score * tableData.taken_exams[i].percentage)
        }

        return sum.toFixed(2);
    }

    let assignExamNames = [null];
    // add assignment names
    for (let i = 0; i < tableData[0].sub_ass.length; i++) {
        assignExamNames.push(truncateText(tableData[0].sub_ass[i].ass_name));
    }
    // add exam names
    for (let i = 0; i < tableData[0].taken_exams.length; i++) {
        assignExamNames.push(truncateText(tableData[0].taken_exams[i].exam_name));
    }
    assignExamNames.push("Total");

    return (
        <div className={styles["simple-grade-container"]}>
            <div className={styles["table-wrapper"]}>
                <table className={styles["grade-table"]}>
                    <thead>
                        <tr>
                            {assignExamNames.map((name, index) => (
                                <th 
                                    key={index} 
                                    className={styles["header-row"]}
                                >
                                    {name}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((row, rowIndex) => (
                            <tr key={rowIndex} className={styles["content-row"]}>
                                <th className={styles["header-row"]}>
                                    {truncateText(row.name)}
                                </th>
                                {row.sub_ass.map((cell, colIndex) =>
                                    <td key={colIndex} className={styles["value"]}>
                                        {cell.score || 0}
                                    </td>
                                )}
                                {row.taken_exams.map((cell, colIndex) =>
                                    <td key={colIndex} className={styles["value"]}>
                                        {cell.score || 0}
                                    </td>
                                )}
                                <td className={styles["value"]}>
                                    {calcTotalScore(row)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default StudentsGradeTable;
