import api from "@/ApiClient";

export const GetCourseAssignments = async (courseId) => {
    return (await api.get(`/assignment/course/${courseId}`)).data;
};

export const GetTodoAssignList = async (userId) => {
    return (await api.get(`/assignment/todo?user_id=${userId}`)).data;
};

export const GetSimpleCourseAssignments = async (courseId) => {
    try {
        const response = await api.get(`/assignment/simple-assigns/in-course/${courseId}`);

        return response.data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export const UpdateAssignmentScore = async (assId, payload) => {
    try {
        const response = await api.put(`/assignment/update-score/${assId}`, payload);
        return response.data;
    } catch (error) {
        console.error(error.message);
        throw error;
    }
}

export const DownloadAssignmentSubmissionFile = async (submissionId, filename) => {

    try {
        const response = await api.get(`/assignment/download`, {
            params: { path: pathToFile },
            responseType: 'blob',
        });

        const contentDisposition = response.headers['content-disposition'];
        let fileName = filename;
        if (contentDisposition) {
            const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
            if (fileNameMatch.length === 2) fileName = fileNameMatch[1];
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
}

// 上傳作業
export const UploadAssignment = async (formData) => {
    try {
        const courseId = formData.get('courseId');
        const endpoint = `/assignment/course/${courseId}/upload`;
        
        const response = await api.post(endpoint, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (err) {
        console.error("上傳作業失敗", err);
        throw new Error(err.response?.data?.message || "上傳作業發生錯誤");
    }
};

// 下載作業檔案
export const DownloadAssignment = async (pathToFile, filename) => {
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

// 刪除作業檔案
// export const DeleteAssignmentFile = async (pathToFile) => {
//     try {
//         const response = await api.delete('/assignment/delete', {
//             params: { path: pathToFile }
//         });
//         return response.data;
//     } catch (error) {
//         console.error("刪除作業失敗", error);
//         throw new Error(error.response?.data?.message || "刪除作業時發生錯誤");
//     }
// };
