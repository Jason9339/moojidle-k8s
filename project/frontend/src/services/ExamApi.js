import api from "@/ApiClient";

export const GetComingUpList = async (userId) => {
    return (await api.get(`/exams/coming?user_id=${userId}`)).data;
};

export const GetCourseExams = async (courseId) => {
    return (await api.get(`/exams/course/${courseId}`)).data;
}