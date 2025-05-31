import api from "@/ApiClient";

export const GetComingUpList = async (userId) => {
    return (await api.get(`/exams/coming?user_id=${userId}`)).data;
};

export const GetCourseExams = async (courseId) => {
    return (await api.get(`/exams/${courseId}`)).data;
}

export const UploadExam = async (formData) => {
    try {
        const courseId = formData.get('courseId');
        const endpoint = `/exams/course/${courseId}/upload`;
        
        const response = await api.post(endpoint, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (err) {
        console.error("上傳考試失敗", err);
        throw new Error(err.response?.data?.message || "上傳作業發生錯誤");
    }
}

export const DownloadExam = async (pathToFile, filename) => {
    try {
        const response = await api.get(`/exams/download/download`, {
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
        console.error(error);
    }
};

export const DeleteExamFile = async (pathToFile) => {
    try {
        const response = await api.delete('/exams/delete', {
            params: { path: pathToFile }
        });
        return response.data;
    } catch (error) {
        console.error("刪除考試失敗", error);
        throw new Error(error.response?.data?.message || "刪除考試時發生錯誤");
    }
};