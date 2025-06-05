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

export const GetOneStudentTakenExamsInCourse = async (courseId, userId) => {
    try {
        const response = await api.get(`/taken-exam/in-course/${courseId}/user/${userId}`);

        return response.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export const GetTakenExamInExam = async (examId) => {
    try {
        const response = await api.get(`/taken-exam/${examId}/taken`);

        return response.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export const GradeExam = async (score, graderId, beGradedUserId, takenExamId, examId) => {
    try {
        const response = await api.post(`/taken-exam/${examId}/grade/${beGradedUserId}`, 
        {
            score: score,
            graderId: graderId,
            takenExamId: takenExamId
        })

        return response.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}
