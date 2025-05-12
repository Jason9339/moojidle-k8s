import apiClient from "@/services/apiClient";

async function GetBoardsGroupByCourseByUserID(userID) {
    const response = await apiClient.get(`discussion-board/user-course-boards/${userID}`);

    return response.data;
}

export {
    GetBoardsGroupByCourseByUserID
}
