import axios from "./apiClient";

// 從 DashboardApi.js 移動過來的課程專頁相關 API

export const getCourseDetails = async (courseId) => {
  return (await axios.get(`/course/${courseId}`)).data;
};

export const getCourseMaterials = async (courseId) => {
  // 注意：後端路由是 /files，但前端之前可能用了 /materials，這裡統一用 /files
  return (await axios.get(`/course/${courseId}/files`)).data;
};

export const getCourseAssignments = async (courseId) => {
  return (await axios.get(`/course/${courseId}/assignments`)).data;
};

export const getCourseAnnouncements = async (courseId) => {
  return (await axios.get(`/course/${courseId}/announcements`)).data;
};

export const getCourseSyllabus = async (courseId) => {
  return (await axios.get(`/course/${courseId}/syllabus`)).data;
};

// 如果後端有 /course/:courseId/link 和 /course/:courseId/weeks API，也可以加在這裡
export const getCourseLink = async (courseId) => {
  try {
      const response = await axios.get(`/course/${courseId}/link`);
      return response.data;
  } catch (error) {
      console.error(`獲取課程 ${courseId} 連結失敗:`, error);
      // 根據需要返回預設值或拋出錯誤
      return { link: "" }; // 返回空連結或提示信息
  }
};



// 成員相關
export const getCourseMembers = async (courseId) => {

    return (await axios.get(`/course/member/${courseId}`)).data;
}

export const manualAddStudent = async (courseId, userId, studentId) => {
  console.log(courseId, studentId, userId);
  return (await axios.post(`/course/member/add/${courseId}`, { userId, studentId })).data;
}

export const switchCharacter = async (userId, courseId) => {
  return (await axios.post(`/course/member/switch/${userId}/${courseId}`)).data;
}





