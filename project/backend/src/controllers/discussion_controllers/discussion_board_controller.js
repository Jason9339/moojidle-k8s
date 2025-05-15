import { 
    GetCourseBoardByCourseId,
    AddDiscussionBoardService, 
    DeleteDiscussionBoardService
} from "#src/services/discussion_services/discussion_board_service.js";

import { 
    GetAllUserCourseByUserId
} from "#src/services/course_services/course_service.js";


async function GetCourseDiscussionBoard(req, res) {
    const courseId = parseInt(req.params.courseId, 10);
    if (isNaN(courseId)) {
        return res.status(400).send({ error: "Invalid courseId" });
    }
    const result = await GetCourseBoardByCourseId(courseId);
    if (!result) {
        return res.status(404).send({ error: "Course not found" });
    }
    res.status(200).send(result);
}

async function GetAllCourseDiscussionBoard(req, res) {
    const userId = parseInt(req.params.userId, 10);

    if (isNaN(userId)) {
        return res.status(400).send({ error: "Invalid userId" });
    }

    // Get all the courses of the user
    const userCourses = await GetAllUserCourseByUserId(userId);
    if (userCourses === null) {
        return res.status(404).send({ error: "no user" });
    }
    if (userCourses.length === 0) {
        return res.status(200).send([]);
    }

    // Get all the discussion boards of the courses
    const boardsList = await Promise.all(
        userCourses.map(async (course) => {
            const courseBoard = await GetCourseBoardByCourseId(course.course_id);
            return courseBoard;
        })
    );

    res.status(200).send(boardsList);
}

async function AddDiscussionBoard(req, res) {
    const courseId = parseInt(req.body.course_id, 10);
    const courseName = req.body.name;

    if (isNaN(courseId)) {
        return res.status(400).send({ error: "Invalid course_id" });
    }
    if (!courseId || !courseName) {
        return res.status(400).send({ error: "course_id and the name of discussion board are required" });
    }
    const result = await AddDiscussionBoardService(courseId, courseName);
    if (!result) {
        return res.status(404).send({ error: "Course not found" });
    }
    res.status(201).send(result);
}


async function DeleteDiscussionBoard(req, res) {
    const board_id = parseInt(req.params.boardId, 10);
    if (isNaN(board_id)) {
        return res.status(400).send({ error: "Invalid board_id" });
    }
    const success = await DeleteDiscussionBoardService(board_id);
    if (!success) {
        return res.status(404).send({ error: "Board not found" });
    }
    res.status(200).send({ message: "Board deleted" });
}

export {
    GetCourseDiscussionBoard,
    GetAllCourseDiscussionBoard,
    AddDiscussionBoard,
    DeleteDiscussionBoard
}