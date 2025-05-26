import { FindCourseById } from "#src/services/course_service.js";
import { FindStudyInJoinUserByCourseId } from "#src/services/course_member_service.js";
import { FindProjectSubAssignByUserIdAssId } from "#src/services/submitted_ass_services.js";
import { FindProjectedAssignmentsByCourseId } from "#src/services/assignment_service.js";

async function GetAllStudentsProjectedSubAssign(req, res) {
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
        if (studentsGrades == [] || studentsGrades == null) {
            res.status(200).send([]);
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
        if (assigns == [] || assigns == null) {
            res.status(200).send(studentsGrades);
        } else {
            // for each assigns
            for (const ass of assigns) {
                for (const student of studentsGrades) {
                    let subAss = await FindProjectSubAssignByUserIdAssId(student.user_id, ass.ass_id);

                    // push the last grade or null into the array
                    student.sub_ass.push(subAss.at(-1) || null);
                }
            }
        }

        res.status(200).send(studentsGrades);
    } catch (err) {
        throw err;
    }
}

export {
    GetAllStudentsProjectedSubAssign,
}