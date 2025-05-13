import apiClient from "@/services/apiClient";

async function GetBoardsGroupByCourseByUserID(userID) {
    const response = await apiClient.get(`discussion-board/user-course-boards/${userID}`);

    return response.data;
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


async function CreateDiscussionBoard({course_id, name}) {
    try {
      const response = await apiClient.post("/discussion-board/course-boards", {
        course_id,
        name,
      });
      return response.data;
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
