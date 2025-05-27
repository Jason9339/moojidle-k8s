import { FindCourseById } from "#src/services/course_service.js";
import { FindStudyInJoinUserByCourseId } from "#src/services/course_member_service.js";
import { FindProjectedExamsByCourseId } from "#src/services/exam_service.js";
import { FindProjectTakenExamByUserIdAssId } from "#src/services/taken_exams_services.js";

async function GetAllStudentsProjectedTakenExam(req, res) {
    try {
        const courseId = parseInt(req.params.courseId);

        // check valid course
        if ((await FindCourseById(courseId)) == null) {
            res.status(404).send("course not found");
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

        // no assign yet in the course
        if (exams == null || exams.length == 0) {
            res.status(200).send(studentsGrades);
        } else {
            // for each assigns
            for (const exam of exams) {
                for (const student of studentsGrades) {
                    let takenExam = await FindProjectTakenExamByUserIdAssId(student.user_id, exam.exam_id);

                    // push the last grade or null into the array
                    student.taken_exams.push(takenExam.at(-1) || null);
                }
            }
        }

        res.status(200).send(studentsGrades);
    } catch (err) {
        throw err;
    }
}

export {
    GetAllStudentsProjectedTakenExam,
}