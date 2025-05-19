import api from "@/ApiClient";

export const GetCourseAssignments = async (courseId) => {
    return (await api.get(`/assignment/course/${courseId}`)).data;
};

export const GetTodoList = async (userId) => {
    return (await api.get(`/assignment/todo?user_id=${userId}`)).data;
};