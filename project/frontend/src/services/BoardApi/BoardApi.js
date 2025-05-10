import apiClient from "@/services/apiClient";

async function GetBoardsGroupByCourseByUserID(userID) {
    const response = await apiClient.get(`api/boards-group-by-course/${userID}`);

    return response.data;
}

export {
    GetBoardsGroupByCourseByUserID
}
