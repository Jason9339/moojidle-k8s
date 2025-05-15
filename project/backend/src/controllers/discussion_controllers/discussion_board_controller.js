import { 
    GetCourseBoardByCourseId,
    AddDiscussionBoardService, 
    DeleteDiscussionBoardService
} from "#src/services/discussion_services/discussion_board_service.js";

import { 
    GetAllUserCourseByUserId
} from "#src/services/discussion_services/course_service.js";

// This function is used to get the discussion board of a course by course id
// Example response:
// { course_id: 1,
//   course_name : "Computer Graphics",
//   boards:  [{
//                board_id: 1,
//                board_name: "作業一討論版"
//             },
//             {
//                board_id: 2,
//                board_name : "期末專題討論版"
//             }]
//  }
//  or
// { course_id: 1,
//   course_name : "Computer Graphics",
//   boards:  []
//  }
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

// This function is used to get all the discussion boards of a course by course id
// Example response:
// [{ course_id: 1, 
//    course_name : "Computer Graphics", 
//    boards:  [{
//                 board_id: 1, 
//                 board_name: "作業一討論版"
//              }, 
//              {
//                 board_id: 2, 
//                 board_name : "期末專題討論版"
//              }]
//  },
//  { course_id: 2, 
//    course_name : "計算機組織", 
//    boards:  []
//   }
// ]
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

// add a discussion board
// Example request body:
// {
//   "course_id": 2,
//   "name": "新的討論版名稱"
// }
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

// delete a discussion board
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