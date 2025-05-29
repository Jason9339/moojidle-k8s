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

export const GetOneStudentSubAssInCourse = async (courseId, userId) => {
    try {
        const response = await api.get(`/submitted-ass/in-course/${courseId}/user/${userId}`);

        return response.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}