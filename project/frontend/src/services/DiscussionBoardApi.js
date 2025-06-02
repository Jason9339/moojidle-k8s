import api from "@/ApiClient";

async function GetBoardsGroupByCourseByUserID(userID) {

    try {

        const response = await api.get(`/discussion-board/user-course-boards/${userID}`);
        return response.data;
    } catch (err) {
        console.error("Fail to get board(group by course) data");
    }

}

async function CreateDiscussionBoard(course_id, name) {
    try {
        const response = await api.post("/discussion-board/course-boards", {
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
    const response = await api.delete(`/discussion-board/course-boards/${boardID}`);
    //console.log("DeleteDiscussionBoard response", response.data);
    return response.data;
}

async function EditDiscussionBoard(boardID, boardName) {
    try {
        const response = await api.patch(`/discussion-board/course-boards/${boardID}`, {
            board_name: boardName
        });
        //console.log("EditDiscussionBoard response", response.data.boardID);
        return response.data;
    } catch (err) {
        console.error("編輯討論版失敗", err);
        throw err;
    }
}


export {
    GetBoardsGroupByCourseByUserID,
    CreateDiscussionBoard,
    DeleteDiscussionBoard,
    EditDiscussionBoard
}
