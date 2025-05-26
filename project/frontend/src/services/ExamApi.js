import api from "@/ApiClient";

export const GetComingUpList = async (userId) => {
    return (await api.get(`/exams/coming?user_id=${userId}`)).data;
};

export const GetSimpleExams = async (courseId) => {
    try {
        const response = await api.get(`/exams/in-course/${courseId}`);

        return response.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}