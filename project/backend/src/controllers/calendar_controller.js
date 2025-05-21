import {
    FindStudyInCourseIdsByUserId,
    FindTeachInCourseIdsByUserId,
    FindAssistInCourseIdsByUserId,
} from "#src/services/course_service.js";

import { FindExamsByCourseId } from "#src/services/exam_service.js";
import { FindAssignmentsByCourseId } from "#src/services/assignment_service.js";

async function GetCalendarEvents(req, res) {

    try {
        const user_id = parseInt(req.params.userId);
        const study_in = await FindStudyInCourseIdsByUserId(user_id);
        const teach_in = await FindTeachInCourseIdsByUserId(user_id);
        const assist_in = await FindAssistInCourseIdsByUserId(user_id);

        const courseIds = [study_in, teach_in, assist_in]
            .flat()
            .map(obj => obj.course_id);


        let assignments = await Promise.all(courseIds.map(async (id) => {
            const data = await FindAssignmentsByCourseId(id);
            return data.map((ass) => (
                { title: ass.ass_name, start: ass.start_date, end: ass.end_date }
            ))

        }));

        let exams = await Promise.all(courseIds.map(async (id) => {
            const data = await FindExamsByCourseId(id);
            return data.map((exam) => (

                // FIX exam_date should be end_date.
                { title: exam.exam_name, start: exam.start_date, end: exam.exam_date }
            ))

        }));

        exams = exams.flat();
        assignments = assignments.flat();

        const result = [...exams, ...assignments];

        res.status(200).send(result);

    }
    catch (e) {
        console.error(e);
        res.status(500).send({ message: "獲取Event失敗", error: e.message });
    }

}

export {

    GetCalendarEvents
}
