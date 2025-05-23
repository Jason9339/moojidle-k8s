import {
    FindStudyInCourseIdsByUserId,
    FindTeachInCourseIdsByUserId,
    FindAssistInCourseIdsByUserId,
    FindCourseById,
} from "#src/services/course_service.js";

import { FindExamsByCourseId } from "#src/services/exam_service.js";
import { FindAssignmentsByCourseId } from "#src/services/assignment_service.js";

async function GetCalendarEvents(req, res) {

    try {
        const user_id = parseInt(req.params.userId);
        const [study_in, teach_in, assist_in] = await Promise.all([
            FindStudyInCourseIdsByUserId(user_id),
            FindTeachInCourseIdsByUserId(user_id),
            FindAssistInCourseIdsByUserId(user_id),
        ]);

        const courseIds = [study_in, teach_in, assist_in]
            .flat()
            .map(obj => obj.course_id);

        const result = [];
        for (const id of courseIds) {
            const { name, course_id, color } = await FindCourseById(id);
            const assData = await FindAssignmentsByCourseId(id);
            const assEvents = assData.map(ass => ({
                title: ass.ass_name,
                start: ass.start_date,
                end: ass.end_date,
            }));
            const examData = await FindExamsByCourseId(id);
            const examEvents = examData.map(exam => ({
                title: exam.exam_name,
                start: exam.start_date,
                end: exam.exam_date,   // FIX: will be end_date after DB fix 
            }));
            result.push({
                name,
                course_id,
                color,
                events: [...assEvents, ...examEvents],
            });
        }
        console.log("result:", result);

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
