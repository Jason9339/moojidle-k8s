import {
    FindFromExamJoinStudyInJoinCourseByUserId,
    FindProjectedExamsByCourseId,

    UpdateOneExamScoreById
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

async function GetProjectedExamsByCourseId(req, res) {
    try {
        const courseId = parseInt(req.params.courseId);

        // check if course exist
        if((await FindCourseById(courseId)) == null){
            res.status(404).send("course not found while finding simplified exams");
            return;
        }

        // get the exmas in the course
        let exams = await FindProjectedExamsByCourseId(courseId);

        // can only be [] or [.....]
        if(exams === undefined){
            res.status(500).send("error on finding exams in the course");
        }

        res.status(200).send(exams);

    } catch (err) {
        res.status(500).send(err);
    }
}

async function UpdateExamScore(req, res) {
    try {
        const examId = parseInt(req.params.examId);
        const payload = req.body;

        if (!payload || !payload.max_score || !payload.percentage ||
            typeof payload.max_score != "number" || typeof payload.percentage != "number"
        ) {
            return res.status(400).send("invalid exam Data");
        }

        // get the exmas in the course
        let result = await UpdateOneExamScoreById(examId, payload.max_score, payload.percentage);

        if(result == null){
            res.status(404).send("exam not found");
        }

        res.status(200).send("Update successful!");
    } catch (err) {
        res.status(500).send(err);
    }
}

export {
    GetUpcomingExamsByUserId,
    GetProjectedExamsByCourseId,

    UpdateExamScore
}