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

export const UpdateExamScore = async (examId, payload) => {
    try {
        const response = await api.put(`/exams/update-score/${examId}`, payload);
        return response.data;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
};