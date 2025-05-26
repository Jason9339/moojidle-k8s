import api from "@/ApiClient";

export const GetSubAssInCourse = async (courseId) => {
    try {
        const response = await api.get(`/submitted-ass/in-course/${courseId}`);

        return response.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}