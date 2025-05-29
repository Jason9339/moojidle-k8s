import { FindCourseById } from "#src/services/course_service.js";
import { FindStudyInJoinUserByCourseId } from "#src/services/course_member_service.js";
import { FindProjectSubAssignByUserIdAssId } from "#src/services/submitted_ass_services.js";
import { FindProjectedAssignmentsByCourseId } from "#src/services/assignment_service.js";

async function GetAllStudentsProjectedSubAssign(req, res) {
    try {
        const courseId = parseInt(req.params.courseId);

        // check valid course
        if ((await FindCourseById(courseId)) == null) {
            res.status(404).send("course not found while finding submitted assignments");
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

        // no students in this course
        if (studentsGrades == null || studentsGrades.length == 0) {
            res.status(200).send([]);
            console.error(studentsGrades);
        }

        studentsGrades.forEach((student) => {
            // remove redundant property
            delete student.contact_ways;
            delete student.email;

            // prepare the property to fill with grade
            student.sub_ass = [];
        });

        let assigns = await FindProjectedAssignmentsByCourseId(courseId);

        // no assign yet in the course
        if (assigns == null || assigns.length == 0) {
            res.status(200).send(studentsGrades);
        } else {
            // for each assigns
            for (const ass of assigns) {
                for (const student of studentsGrades) {
                    let subAss = await FindProjectSubAssignByUserIdAssId(student.user_id, ass.ass_id);

                    // push the last grade into the array
                    if(subAss.at(-1) == undefined){
                        student.sub_ass.push({ ass_name: ass.ass_name, percentage: ass.percentage });
                    }else{
                        let finalSubAss = subAss.at(-1);
                        finalSubAss.ass_name = ass.ass_name;
                        finalSubAss.percentage = ass.percentage;
                        student.sub_ass.push(finalSubAss);
                    }
                }
            }
        }

        res.status(200).send(studentsGrades);
    } catch (err) {
        throw err;
    }
}

async function GetStudentProjectedSubAssign(req, res) {
    try {
        const courseId = parseInt(req.params.courseId);
        const userId = parseInt(req.params.userId);

        // check valid course
        if ((await FindCourseById(courseId)) == null) {
            res.status(404).send("course not found while finding submitted assignments for a student");
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
        studentGrade.sub_ass = [];
        let assigns = await FindProjectedAssignmentsByCourseId(courseId);

        // no assignment yet in the course
        if (assigns == null || assigns.length == 0) {
            res.status(200).send(studentGrade);
        } else {
            // for each assignment
            for (const assign of assigns) {
                let subAss = await FindProjectSubAssignByUserIdAssId(userId, assign.ass_id);

                // push the last grade into the array
                if (subAss.at(-1) == undefined) {
                    studentGrade.sub_ass.push({ ass_name: assign.ass_name, percentage: assign.percentage });
                } else {
                    let finalSubAss = subAss.at(-1);
                    finalSubAss.ass_name = assign.ass_name;
                    finalSubAss.percentage = assign.percentage;
                    studentGrade.sub_ass.push(finalSubAss);
                }
            }
        }

        res.status(200).send(studentGrade);

    } catch (error) {
        throw error;
    }
}

export {
    GetAllStudentsProjectedSubAssign,
    GetStudentProjectedSubAssign,
}