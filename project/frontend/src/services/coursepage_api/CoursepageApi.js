import axios from "@/services/apiClient";

// 從 DashboardApi.js 移動過來的課程專頁相關 API

export const getCourseDetails = async (courseId) => {
    return (await axios.get(`/course/${courseId}`)).data;
};

export const getCourseMaterials = async (courseId) => {
    return (await axios.get(`/material/course/${courseId}/materials`)).data;
};

export const getCourseAssignments = async (courseId) => {
    return (await axios.get(`/assignment/course/${courseId}`)).data;
};

export const getCourseAnnouncements = async (courseId) => {
    return (await axios.get(`/announcement/course/${courseId}`)).data;
};

export const updateCourseMaterials = async (courseId, materials) => {
    try {
        const response = await axios.post(
            `/material/course/${courseId}/materials`,
            materials
        );
        return response.data;
    } catch (error) {
        console.error(`更新課程 ${courseId} 教材失敗:`, error);
        throw error;
    }
};

export const deleteCourseMaterial = async (courseId, materialId) => {
    try {
        const response = await axios.delete(
            `/material/course/${courseId}/materials/${materialId}`
        );
        return response.data;
    } catch (error) {
        console.error(`刪除課程 ${courseId} 教材 ${materialId} 失敗:`, error);
        throw error;
    }
};

// 成員相關（維持不變）
export const getCourseMembers = async (courseId) => {
    return (await axios.get(`/course/member/${courseId}`)).data;
};

export const manualAddStudent = async (courseId, userId, studentId) => {
    console.log(courseId, studentId, userId);
    return (
        await axios.post(`/course/member/add/${courseId}`, {
            userId,
            studentId,
        })
    ).data;
};

export const switchCharacter = async (userId, courseId) => {
    return (await axios.post(`/course/member/switch/${userId}/${courseId}`))
        .data;
};

export const getInviteCode = async (courseId) => {
    // return (await axios.get(`/course/${courseId}/inviteCode`)).data;
    return (await axios.get(`/course/${courseId}`)).data.inviteLink;
};
