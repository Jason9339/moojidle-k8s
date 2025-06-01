import api from "@/ApiClient";


// 老師查看作業
export const GetAssignmentSubmissions = async (assignmentId) => {
    return (await api.get(`/submit-assignment/${assignmentId}/submissions`)).data;
};

// 老師改作業
export const GradeAssignment = async (graderId, submissionId, grade) => {
    console.log(grade, graderId)
    return (await api.patch(`/submit-assignment/review/${submissionId}`, {
        score:grade,
        graderId: graderId
    })).data;
}

