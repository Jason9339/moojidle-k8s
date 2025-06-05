import { FindCourseById } from "#src/services/course_service.js";
import { FindStudyInJoinUserByCourseId } from "#src/services/course_member_service.js";
import { FindProjectedExamsByCourseId, FindCourseIdByExamId } from "#src/services/exam_service.js";
import { FindProjectTakenExamByUserIdAssId, FindAllTakenExamsByExamId, CreateTakenExam, UpdateTakenExam } from "#src/services/taken_exams_services.js";



async function GetAllStudentsProjectedTakenExam(req, res) {
    try {
        const courseId = parseInt(req.params.courseId);

        // check valid course
        if ((await FindCourseById(courseId)) == null) {
            res.status(404).send("course not found while finding taken exams");
            return;
        }

        // get students, FindStudyInJoinUserByCourseId gets:
        // [
        //     {
        //         "user_id": 1,
        //         "name": "User 1",
        //         "contact_ways": [
        //             {
        //                 "approach": "social_media",
        //                 "details": "@user65"
        //             },
        //             {
        //                 "approach": "phone",
        //                 "details": "555-9868"
        //             }
        //         ],
        //         "email": "user1@example.com",
        //         "student_id": 3099
        //     },
        //    ....................
        // ]
        let studentsGrades = await FindStudyInJoinUserByCourseId(courseId);

        // no studentsin this course
        if (studentsGrades == null || studentsGrades.length == 0) {
            res.status(200).send([]);
        }

        studentsGrades.forEach((student) => {
            // remove redundant property
            delete student.contact_ways;
            delete student.email;

            // prepare the property to fill with grade
            student.taken_exams = [];
        });

        let exams = await FindProjectedExamsByCourseId(courseId);

        // no exam yet in the course
        if (exams == null || exams.length == 0) {
            res.status(200).send(studentsGrades);
            return;
        } else {
            // for each exam
            for (const exam of exams) {
                for (const student of studentsGrades) {
                    let takenExam = await FindProjectTakenExamByUserIdAssId(student.user_id, exam.exam_id);

                    // push the last grade into the array
                    if (takenExam.at(-1) == undefined) {
                        student.taken_exams.push({ exam_name: exam.exam_name, percentage: exam.percentage });
                    } else {
                        let finalTakenExam = takenExam.at(-1);
                        finalTakenExam.exam_name = exam.exam_name;
                        finalTakenExam.max_score = exam.max_score;
                        finalTakenExam.percentage = exam.percentage;
                        student.taken_exams.push(finalTakenExam);
                    }
                }
            }
        }

        res.status(200).send(studentsGrades);
    } catch (err) {
        throw err;
    }
}

async function GetStudentProjectedTakenExam(req, res) {
    try {
        const courseId = parseInt(req.params.courseId);
        const userId = parseInt(req.params.userId);

        // check valid course
        if ((await FindCourseById(courseId)) == null) {
            res.status(404).send("course not found while finding taken exams for the student");
            return;
        }

        // get students, FindStudyInJoinUserByCourseId gets:
        // [
        //     {
        //         "user_id": 1,
        //         "name": "User 1",
        //         "contact_ways": [
        //             {
        //                 "approach": "social_media",
        //                 "details": "@user65"
        //             },
        //             {
        //                 "approach": "phone",
        //                 "details": "555-9868"
        //             }
        //         ],
        //         "email": "user1@example.com",
        //         "student_id": 3099
        //     },
        //    ....................
        // ]
        const students = await FindStudyInJoinUserByCourseId(courseId);

        // check if student is in that course
        let isStudent = false;
        let studentGrade;
        for (let i = 0; i < students.length; i++) {
            if (students[i].user_id == userId) {
                isStudent = true;
                studentGrade = students[i];

                // remove redundant property
                delete studentGrade.contact_ways;
                delete studentGrade.email;
            }
        }
        if (!isStudent) {
            res.status(404).send("can't find this student in the course");
            return;
        }

        // prepare the property to fill with grade
        studentGrade.taken_exams = [];
        let exams = await FindProjectedExamsByCourseId(courseId);

        // no exam yet in the course
        if (exams == null || exams.length == 0) {
            res.status(200).send(studentGrade);
            return;
        } else {
            // for each exam
            for (const exam of exams) {
                let takenExam = await FindProjectTakenExamByUserIdAssId(userId, exam.exam_id);

                // push the last grade into the array
                if (takenExam.at(-1) == undefined) {
                    studentGrade.taken_exams.push({ exam_name: exam.exam_name, percentage: exam.percentage });
                } else {
                    let finalTakenExam = takenExam.at(-1);
                    finalTakenExam.exam_name = exam.exam_name;
                    finalTakenExam.max_score = exam.max_score;
                    finalTakenExam.percentage = exam.percentage;
                    studentGrade.taken_exams.push(finalTakenExam);
                }
            }
        }

        res.status(200).send(studentGrade);

    } catch (error) {
        throw error;
    }
}


async function GetTakenExamsByExamId(req, res) {
    try {
        const examId = parseInt(req.params.examId);

        if (isNaN(examId)) {
            res.status(400).send("Invalid exam ID");
            return;
        }
    
        const courseId = await FindCourseIdByExamId(examId);
        
        if (courseId == null) {
            res.status(404).send("Exam not found");
            return;
        }

        const allStudents =  await FindStudyInJoinUserByCourseId(courseId);
        const takenExams = await FindAllTakenExamsByExamId(examId);

        // console.log(allStudents);

        // no taken exams yet
        if (takenExams == null || takenExams.length == 0) {
            res.status(200).send([]);
            return;
        }

        const data = {
            "takenExams": takenExams,
            "students": allStudents
        }

        res.status(200).send(data);
    } catch (error) {
        throw error;
    }

}

async function GradeExam(req, res) {
    try {

        const examId = parseInt(req.params.examId);
        const beGradedUserId = parseInt(req.params.beGradedUserId);
        let { score, graderId, takenExamId } = req.body;
        score = parseFloat(score);
        graderId = parseInt(graderId);
        console.log("Taken Exam ID:", takenExamId);

        if (takenExamId !== undefined) {
            takenExamId = parseInt(takenExamId);
            console.log("Grading existing taken exam with ID:", takenExamId);
            const IsUpdatedTakenExam = await UpdateTakenExam(takenExamId, score, graderId, beGradedUserId, examId);
            if (!IsUpdatedTakenExam) {
                res.status(404).send({
                    updated: false,
                    message:"Taken exam not found or update failed"
                });
                return;
            }
            res.status(200).send({
                updated: true,
                message:"Taken exam updated successfully"
            });
        }
        else {
            console.log("Creating new taken exam for user:", beGradedUserId);
            const newTakenExam = await CreateTakenExam(score, graderId, beGradedUserId, examId);
            res.status(201).send(newTakenExam);
        }
    } catch (error) {
        res.status(400).send(`Error grading exam : ${error.message}`);
        throw error;

    }

}


export {
    GetAllStudentsProjectedTakenExam,
    GetStudentProjectedTakenExam,
    GetTakenExamsByExamId,
    GradeExam
}
