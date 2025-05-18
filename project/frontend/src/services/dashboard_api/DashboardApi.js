import axios from "@/services/apiClient";

// const tempApiClient = axios.create({
//     baseURL: 'http://localhost:5173',
//     timeout: 5000,
//     headers: {
//         'Content-Type': 'application/json',
//     },
// });

export const getCourses = async (userId) => {
    return (await axios.get(`/course/read/${userId}`)).data;
};

export const getTodoList = async (userId) => {
    return (await axios.get(`/assignment/todo?user_id=${userId}`)).data;
};

export const getComingUpList = async (userId) => {
    return (await axios.get(`/exams/coming?user_id=${userId}`)).data;
};

export const getTeachIn = async (userId) => {
    return (await axios.get(`/course/read/teach_in?user_id=${userId}`)).data;
};

export const addCourse = async (coursePayload) => {
    try {
        const response = await axios.post("/course/create", coursePayload);
        console.log("Added course:", response.data);
        return response.data;
    } catch (error) {
        console.error(
            "Error adding course:",
            error.response?.data || error.message
        );
        throw error;
    }
};

export const deleteCourse = async (courseId) => {
    try {
        const response = await axios.delete(`/course/delete/${courseId}`);
        console.log("Deleted course:", response.data);
        return response.data;
    } catch (error) {
        console.error(
            "Error deleting course:",
            error.response?.data || error.message
        );
        throw error;
    }
};

// 邀請碼
export const fetchCourseIdByCode = async (code) => {
    try {
        const response = await axios.get(`/course/invite/${code}`);
        return response.data;
    } catch (error) {
        console.error(
            "Error finding courseId by invite code :",
            error.response?.data || error.message
        );
        throw error;
    }
};

export const inviteStudent = async (courseId, userId, studentId) => {
    return (
        await axios.post(`/course/member/add/${courseId}`, {
            userId,
            studentId,
        })
    ).data;
};
