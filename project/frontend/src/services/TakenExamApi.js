import api from "@/ApiClient";

export const GetTakenExamsInCourse = async (courseId) => {
    try {
        const response = await api.get(`/taken-exam/in-course/${courseId}`);

        return response.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}