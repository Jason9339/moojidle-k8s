import api from "@/ApiClient";

export const GetCoursesForUser = async (userId) => {
    return (await api.get(`/course/read/${userId}`)).data;
};

export const GetCourseDetails = async (courseId) => {
    return (await api.get(`/course/${courseId}`)).data;
};

// 成員相關（維持不變）
export const GetCourseMembers = async (courseId) => {
    return (await api.get(`/course/member/${courseId}`)).data;
};

export const ManualAddStudent = async (courseId, userId, studentId) => {
    return (
        await api.post(`/course/member/add/${courseId}`, {
            userId,
            studentId,
        })
    ).data;
};

export const SwitchCharacter = async (userId, courseId) => {
    return (await api.post(`/course/member/switch/${userId}/${courseId}`))
        .data;
};

export const GetInviteCode = async (courseId) => {
    // return (await api.get(`/course/${courseId}/inviteCode`)).data;
    return (await api.get(`/course/${courseId}`)).data.inviteLink;
};

export const CanUserEditAnnouncements = async (userId, courseId) => {
    return (await api.get(`/course/member/can_edit/${userId}/${courseId}`)).data;
};

export const GetTeachIn = async (userId) => {
    return (await api.get(`/course/read/teach_in?user_id=${userId}`)).data;
};

export const AddCourse = async (coursePayload) => {
    try {
        const response = await api.post("/course/create", coursePayload);
        return response.data;
    } catch (error) {
        console.error(
            "Error adding course:",
            error.response?.data || error.message
        );
        throw error;
    }
};

export const DeleteCourse = async (courseId) => {
    try {
        const response = await api.delete(`/course/delete/${courseId}`);
        return response.data;
    } catch (error) {
        console.error(
            "Error deleting course:",
            error.response?.data || error.message
        );
        throw error;
    }
};

export const FetchCourseIdByCode = async (code) => {
    try {
        const response = await api.get(`/course/invite/${code}`);
        return response.data;
    } catch (error) {
        console.error(
            "Error finding courseId by invite code :",
            error.response?.data || error.message
        );
        throw error;
    }
};

export const InviteStudent = async (courseId, userId, studentId) => {
    return (
        await api.post(`/course/member/add/${courseId}`, {
            userId,
            studentId,
        })
    ).data;
};

export const EditCourseName = async (courseId, newCourseName) => {
    try {
        const response = await api.put(`/course/edit/${courseId}`, { name: newCourseName });
        return response.data;
    } catch (error) {
        console.error(
            "Error edit course :",
            error.response?.data || error.message
        );
        throw error;
    }
};
