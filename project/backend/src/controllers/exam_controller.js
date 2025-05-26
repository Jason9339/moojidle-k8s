import {
    FindFromExamJoinStudyInJoinCourseByUserId,
    FindExamsByCourseId
} from '#src/services/exam_service.js';

import {
    FindCourseById
} from '#src/services/course_service.js';

async function GetUpcomingExamsByUserId(req, res) {
    try {
        const upcomingExams = await FindFromExamJoinStudyInJoinCourseByUserId(req.query.user_id);
        res.status(200).json(upcomingExams); // Send the fetched data as a JSON response
    } catch (error) {
        console.error("Error in GetUpcomingExams:", error);
        res.status(500).send("Failed to fetch upcoming exams");
    }
}

async function GetExamsByCourseId(req, res) {
    try {
        const courseId = parseInt(req.params.courseId);

        // check if course exist
        if((await FindCourseById(courseId)) == null){
            res.status(404).send("course not found");
            return;
        }

        // get the exmas in the course
        let exams = await FindExamsByCourseId(courseId);

        // can only be [] or [.....]
        if(exams === undefined){
            res.status(500).send("error on finding exams in the course");
        }

        res.status(200).send(exams);

    } catch (err) {
        res.status(500).send(err);
    }
}

export {
    GetUpcomingExamsByUserId,
    GetExamsByCourseId
}