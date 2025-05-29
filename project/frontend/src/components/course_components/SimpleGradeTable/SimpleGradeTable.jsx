import { useState, useEffect } from "react";

// css style
import styles from "./SimpleGradeTable.module.css";

function SimpleGradeTable({ simpleGrades, canEdit, SaveNewAssign, SaveNewExam }) {
    const [isEditing, setIsEditing] = useState(false);
    const [tableData, setTableData] = useState(null);

    if (simpleGrades.length == 0) {
        return (
            <div>
                No assignments and test yet...
            </div>
        );
    }

    // initialize tableData when component loads
    useEffect(() => {
        // deep copy of the data
        setTableData(simpleGrades.map(item => ({ ...item })));
    }, [simpleGrades]);

    if (!tableData) {
        return (
            <></>
        )
    }

    function ToggleEdit() {
        setIsEditing(prev => !prev);
    }

    function Cancel() {
        setIsEditing(prev => !prev);
        // revert back
        setTableData(simpleGrades.map(item => ({ ...item })));
    }

    function Done() {
        setIsEditing(prev => !prev);
        let updatedAssigns = [];
        let updatedExams = [];
        // save changes by calling cb from parent page
        // find the changed cells
        for (let i = 0; i < simpleGrades.length; i++) {
            if (simpleGrades[i].max_score != tableData[i].max_score || simpleGrades[i].percentage != tableData[i].percentage) {
                if (simpleGrades[i].ass_id != undefined) {
                    // get ready to update this assignment's max_score and percentage
                    updatedAssigns.push({
                        assId: tableData[i].ass_id,
                        newMaxScore: tableData[i].max_score,
                        newPercentage: tableData[i].percentage
                    });
                } else {
                    // get ready to update this exam's max_score and percentage
                    updatedExams.push({
                        examId: tableData[i].exam_id,
                        newMaxScore: tableData[i].max_score,
                        newPercentage: tableData[i].percentage
                    });
                }
            }
        }

        // Call both updates if needed
        if (updatedAssigns.length > 0) {
            SaveNewAssign(updatedAssigns);
        }
        if (updatedExams.length > 0) {
            SaveNewExam(updatedExams);
        }
    }

    const HandleInputChange = (rowIndex, colIndex, value) => {
        // deep copy of the data
        let newData = tableData.map(item => ({ ...item }));
        // minus 1 b/c the 1st column is header
        colIndex = colIndex - 1;

        if (rowIndex === 0) {
            newData[colIndex].max_score = Number(value);
        } else if (rowIndex === 1) {
            newData[colIndex].percentage = Number(value);
        }
        setTableData(newData);
    };

    // simpleGrades is:
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
    for (let i = 0; i < tableData.length; i++) {
        names.push(tableData[i].ass_name || tableData[i].exam_name);
        maxScores.push(tableData[i].max_score);
        percentages.push(tableData[i].percentage);
    }
    let content = [maxScores, percentages];

    // calculate  summary
    let maxGrade = 0;
    for (let i = 1; i < percentages.length; i++) {
        // start from the 2nd element since the first one is the title on the left of that row
        maxGrade += percentages[i];
    }

    return (
        <div className={styles["simple-grade-container"]}>
            {canEdit && isEditing ? (
                <>
                    <button className={styles["edit-button"]} onClick={Done}>
                        完成
                    </button>
                    <button className={styles["cancel-button"]} onClick={Cancel}>
                        取消
                    </button>
                </>
            ) : canEdit ? (
                <button className={styles["edit-button"]} onClick={ToggleEdit}>
                    <img src="/icons/pencil.png" className={styles["edit-icon"]} alt="Edit" />
                    編輯
                </button>
            ) : null}

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
                                            {isEditing ? (
                                                <input
                                                    className={styles["input-field"]}
                                                    type="number"
                                                    value={cell}
                                                    onChange={(e) =>
                                                        HandleInputChange(rowIndex, colIndex, e.target.value)
                                                    }
                                                />
                                            ) : (
                                                cell
                                            )}
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
                    課程總站比: {maxGrade.toFixed(2)}
                </div>
                <div className={styles["summary"]}>
                    課程最高分數: {(maxGrade * 100).toFixed(2)}
                </div>
            </div>

            <hr className={styles["separate-line"]} />
        </div>
    );
}

export default SimpleGradeTable;
