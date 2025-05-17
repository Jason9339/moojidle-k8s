import apiClient from "@/services/apiClient";

async function GetBoardsGroupByCourseByUserID(userID) {

    try {

        const response = await apiClient.get(`/discussion-board/user-course-boards/${userID}`);
        console.log("api:", response)
        return response.data;
    } catch (err) {
        console.error("Fail to get board(group by course) data");
    }

}

async function GetAllUserCourses(userId) {
    try {
        const response = await apiClient.get(`/course/${userId}`);
        return response.data;
    } catch (err) {
        console.error("Failed to fetch user courses:", err);
        return [];
    }
}


async function CreateDiscussionBoard(course_id, name) {
    try {
        const response = await apiClient.post("/discussion-board/course-boards", {
            course_id: course_id,
            name: name
        });
        return { board_id: response.data.board_id, board_name: response.data.name };
    } catch (err) {
        console.error("新增討論版失敗", err);
        throw err;
    }
}


async function DeleteDiscussionBoard(boardID) {
    const response = await apiClient.delete(`discussion-board/course-boards/${boardID}`);

    return response.data;
}

export {
    GetBoardsGroupByCourseByUserID,
    GetAllUserCourses,
    CreateDiscussionBoard,
    DeleteDiscussionBoard
}
