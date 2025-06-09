import {
    FindCourseBoardByCourseId,
    InsertDiscussionBoardService,
    DeleteDiscussionBoardService,
    UpdateDiscussionBoardService,
} from "#src/services/discussion_board_service.js";

import {
    FindCourseInCourseId,
} from "#src/services/course_service.js";

import {
    FindTeachInByCourseID,
    FindAssistInByCourseID,
} from "#src/services/course_member_service.js";

import {
    FindTeachInByUserId,
    FindAssistInByUserId,
    FindStudyInByUserId,
} from "#src/services/course_member_service.js";

import {
    DeletePostById,
    FindProjectedPostsByBId
} from "#src/services/post_services.js"

import CalculateWeek from "#src/utils/calculate_week.js";

async function GetCourseDiscussionBoard(req, res) {
    const courseId = parseInt(req.params.courseId, 10);
    if (isNaN(courseId)) {
        return res.status(400).send({ error: "Invalid courseId" });
    }
    const result = await FindCourseBoardByCourseId(courseId);
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
    let userCourses;

    let teach = await FindTeachInByUserId(userId);
    let assist = await FindAssistInByUserId(userId);
    let study = await FindStudyInByUserId(userId);

    // remove duplicates
    const courseIds = [
        ...teach.map(x => x.course_id),
        ...assist.map(x => x.course_id),
        ...study.map(x => x.course_id),
    ];
    const uniqueCourseIds = [...new Set(courseIds)];

    if (uniqueCourseIds.length === 0) {
        userCourses = [];
    } else {
        // query course information, return course_id, name, week_num, and start_date
        const courses = await FindCourseInCourseId(uniqueCourseIds);

        // change name to course_name and add week_num, start_date, current_week
        userCourses = courses.map(c => {
            const currentWeek = CalculateWeek(c.start_date, new Date(), c.week_num || 16);
            return {
                course_id: c.course_id,
                course_name: c.name,
                week_num: c.week_num || 16,
                start_date: c.start_date,
                current_week: currentWeek
            };
        });
    }

    if (userCourses === null) {
        return res.status(404).send({ error: "no user" });
    }
    if (userCourses.length === 0) {
        return res.status(200).send([]);
    }

    // Get all the discussion boards of the courses
    let boardsList = await Promise.all(
        userCourses.map(async (course) => {
            const courseBoard = await FindCourseBoardByCourseId(course.course_id);
            return {
                ...courseBoard,
                week_num: course.week_num,
                start_date: course.start_date,
                current_week: course.current_week
            };
        })
    );

    // Get all teachers and assistant in the course
    for (let i = 0; i < boardsList.length; i++) {
        const teachers = await FindTeachInByCourseID(boardsList[i].course_id);
        const assistants = await FindAssistInByCourseID(boardsList[i].course_id);

        boardsList[i].teachers = teachers;
        boardsList[i].assistants = assistants;
    }

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
    const result = await InsertDiscussionBoardService(courseId, courseName);
    if (!result) {
        return res.status(404).send({ error: "Course not found" });
    }
    res.status(201).send(result);
}


async function EditDiscussionBoard(req, res) {
    const board_id = parseInt(req.params.boardId, 10);
    const { board_name } = req.body;
    if (isNaN(board_id)) {
        return res.status(400).json({ success: false, message: "無效的 board_id" });
    }

    if (!board_name || board_name.trim() === "") {
        return res.status(400).json({ success: false, message: "請提供新的討論版名稱" });
    }

    try {
        const result = await UpdateDiscussionBoardService(board_id, board_name);
        if (result === 0) {
            return res.status(404).json({ success: false, message: "討論版不存在" });
        }
        res.status(200).json({ success: true, message: "討論版名稱已更新" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

async function DeleteDiscussionBoard(req, res) {
    const board_id = parseInt(req.params.boardId, 10);
    const broadPosts = await FindProjectedPostsByBId(board_id);

    if (broadPosts.length > 0) {
        for (let i = 0; i < broadPosts.length; i++) {
            await DeletePostById(broadPosts[i].post_id);
        }
    }

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
    EditDiscussionBoard,
    DeleteDiscussionBoard
}