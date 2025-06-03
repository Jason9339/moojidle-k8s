import api from "@/ApiClient";


// 老師查看作業
export const GetAssignmentSubmissions = async (assignmentId) => {
    return (await api.get(`/submitted-assignment/${assignmentId}/submissions`)).data;
};

// 老師改作業
export const GradeAssignment = async (graderId, submissionId, grade) => {
    console.log("Grade", grade,"graderId", graderId)
    return (await api.patch(`/submitted-assignment/review/${submissionId}`, {
        score:grade,
        graderId: graderId
    })).data;
}

export const DownloadSubmissions = async (pathToFile, filename) => {
    try {
        const response = await api.get(`/assignment/download`, {
            params: { path: pathToFile },
            responseType: 'blob',
        });

        const contentDisposition = response.headers['content-disposition'];
        let fileName = filename;
        if (contentDisposition) {
            const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
            if (fileNameMatch && fileNameMatch.length === 2) fileName = fileNameMatch[1];
        }

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
    } catch (error) {
        console.error("下載作業錯誤:", error);
    }
};
