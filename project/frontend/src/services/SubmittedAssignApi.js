import api from "@/ApiClient";

export const GetSimpleSubAssInCourse = async (courseId) => {
    try {
        const response = await api.get(`/submitted-assignment/in-course/${courseId}`);

        return response.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export const GetAssignmentSubmissions = async (assignmentId) => {
    return (await api.get(`/submitted-assignment/${assignmentId}/submissions`)).data;
};

export const GetOneStudentSimpleSubAssInCourse = async (courseId, userId) => {
    try {
        const response = await api.get(`/submitted-assignment/in-course/${courseId}/user/${userId}`);

        return response.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export const GetTheAssignSubAssForOneStuednt = async (assignmentId, userId) => {
    try {
        return (await api.get(`/submitted-assignment/assignment/${assignmentId}/user/${userId}`)).data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const DownloadSubmissions = async (pathToFile, filename) => {
    try {
        const response = await api.get(`/assignment/download`, {
            params: { path: pathToFile },
            responseType: 'blob',
        });

        const contentDisposition = response.headers['content-disposition'];
        let fileName = filename;
        if (contentDisposition) {
            // Fixed: More precise regex that only captures content within quotes
            const fileNameMatch = contentDisposition.match(/filename="([^"]+)"/);

            if (fileNameMatch && fileNameMatch[1]) {
                fileName = fileNameMatch[1];
            }
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

export const CreateSubAssign = async (assignmentId, submitByUserId, formData) => {
    try {
        const endpoint = `/submitted-assignment/submit-to/${assignmentId}/user/${submitByUserId}`;

        const response = await api.post(endpoint, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const UpdateSubAssign = async (subAssId, formData) => {
    try {
        const endpoint = `/submitted-assignment/sub-assign-id/${subAssId}`;

        const response = await api.put(endpoint, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export const GradeAssignment = async (graderId, submissionId, grade) => {
    console.log("Grade", grade, "graderId", graderId)
    return (await api.patch(`/submitted-assignment/review/${submissionId}`, {
        score: grade,
        graderId: graderId
    })).data;
}

export const DeleteSubAss = async (subAssId) => {
    try {
        return (await api.delete(`/submitted-assignment/sub-assign-id/${subAssId}`)).data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};