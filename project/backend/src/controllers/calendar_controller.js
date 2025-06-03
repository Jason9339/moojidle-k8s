import { FindCourseById } from "#src/services/course_service.js";
import { FindStudyInByUserId, FindAssistInByUserId, FindTeachInByUserId } from "#src/services/course_member_service.js";
import { FindOneUserById } from "#src/services/user_service.js";
import { FindExamsByCourseId } from "#src/services/exam_service.js";
import { FindAssignmentsByCourseId } from "#src/services/assignment_service.js";

async function GetCalendarEvents(req, res) {
    if (!req.params.userId) {

        res.status(400).send({ message: "userId is required" });
        return;
    }

    try {

        const user_id = parseInt(req.params.userId);


        if (!await FindOneUserById(user_id)) {
            res.status(404).send({ message: "User not found" });
            return;
        }
        const [study_in, teach_in, assist_in] = await Promise.all([
            FindStudyInByUserId(user_id),
            FindTeachInByUserId(user_id),
            FindAssistInByUserId(user_id),
        ]);

        if (study_in.length + teach_in.length + assist_in.length == 0) {
            res.status(404).send({ message: "No event found" });
        }

        const courseIds = [study_in, teach_in, assist_in]
            .flat()
            .map(obj => obj.course_id);

        const result = [];
        for (const id of courseIds) {
            const { name, course_id, color } = await FindCourseById(id);

            const assData = await FindAssignmentsByCourseId(id);
            const assEvents = assData.map(ass => ({

                course: {
                    id: course_id,
                    name: name,
                    color: color
                },

                title: ass.ass_name,
                type: "assignment",
                start: ass.start_date,
                end: ass.end_date,
                child: {
                }
            }));

            const examData = await FindExamsByCourseId(id);
            const examEvents = examData.map(exam => ({
                course: {
                    id: course_id,
                    name: name,
                    color: color
                },

                title: exam.exam_name,
                type: "exam",
                start: exam.start_date,
                end: exam.end_date,
                child: {
                }
            }));

            if (assEvents.length !== 0 && examEvents.length !== 0) {


                result.push(...assEvents, ...examEvents);
            }
        }

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
