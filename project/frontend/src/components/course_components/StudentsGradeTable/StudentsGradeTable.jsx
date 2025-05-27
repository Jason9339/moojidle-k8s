import { useState } from "react";

// css style
import styles from "./StudentsGradeTable.module.css";

function StudentsGradeTable({ studentGrades }) {
    if (studentGrades.length == 0) {
        return (
            <div>
                No Data yet...
            </div>
        );
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
    //                 "graded_by_user_id": 14,
    //             },
    //          ..........   
    // ]
    // ......

    console.error(studentGrades);

    // let assignExamNames = [null];
    // let content = [];
    // for (let i = 0; i < simpleGrades.length; i++) {
    //     // for each row, we want student's grade
    //     assignExamNames.push(simpleGrades[i].ass_name || simpleGrades[i].exam_name);
    //     maxScores.push(simpleGrades[i].max_score);
    //     percentages.push(simpleGrades[i].percentage);
    // }

    // // get summary
    // let maxGrade = 0;
    // for (let i = 1; i < percentages.length; i ++){
    //     // start from the 2nd element since the first one is the title on the left of that row
    //     maxGrade += percentages[i];
    // }

    return (
        <div>
            
        </div>
    );
}

export default StudentsGradeTable;
