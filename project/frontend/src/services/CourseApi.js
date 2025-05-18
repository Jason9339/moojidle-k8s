import axios from "@/ApiClient";

// 從 DashboardApi.js 移動過來的課程專頁相關 API

export const GetCourseDetails = async (courseId) => {
    return (await axios.get(`/course/${courseId}`)).data;
};

export const GetCourseMaterials = async (courseId) => {
    return (await axios.get(`/material/course/${courseId}/materials`)).data;
};

export const GetCourseAssignments = async (courseId) => {
    return (await axios.get(`/assignment/course/${courseId}`)).data;
};

export const GetCourseAnnouncements = async (courseId) => {
    return (await axios.get(`/announcement/course/${courseId}`)).data;
};

export const UpdateCourseMaterials = async (courseId, materials) => {
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

export const DeleteCourseMaterial = async (courseId, materialId) => {
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
export const GetCourseMembers = async (courseId) => {
    return (await axios.get(`/course/member/${courseId}`)).data;
};

export const ManualAddStudent = async (courseId, userId, studentId) => {
    console.log(courseId, studentId, userId);
    return (
        await axios.post(`/course/member/add/${courseId}`, {
            userId,
            studentId,
        })
    ).data;
};

export const SwitchCharacter = async (userId, courseId) => {
    return (await axios.post(`/course/member/switch/${userId}/${courseId}`))
        .data;
};

export const GetInviteCode = async (courseId) => {
    // return (await axios.get(`/course/${courseId}/inviteCode`)).data;
    return (await axios.get(`/course/${courseId}`)).data.inviteLink;
};
