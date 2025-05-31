import api from "@/ApiClient";

export const GetCourseAssignments = async (courseId) => {
    return (await api.get(`/assignment/course/${courseId}`)).data;
};

export const GetTodoList = async (userId) => {
    return (await api.get(`/assignment/todo?user_id=${userId}`)).data;
};

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
export const DeleteAssignmentFile = async (pathToFile) => {
    try {
        const response = await api.delete('/assignment/delete', {
            params: { path: pathToFile }
        });
        return response.data;
    } catch (error) {
        console.error("刪除作業失敗", error);
        throw new Error(error.response?.data?.message || "刪除作業時發生錯誤");
    }
};

// 學生繳交作業
export const SubmitAssignment = async (assignmentId, formData) => {
    try {
        const endpoint = `/assignment/${assignmentId}/submit`;
        const response = await api.post(endpoint, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (err) {
        console.error("繳交作業失敗", err);
        throw new Error(err.response?.data?.message || "繳交作業發生錯誤");
    }
};

// 取得單一作業的繳交紀錄（學生）
export const GetAssignmentSubmission = async (assignmentId) => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user?.user_id;
        if (!userId) return null;
        const res = await api.get(`/assignment/${assignmentId}/submission`, { params: { user_id: userId } });
        return res.data?.data || null;
    } catch (error) {
        console.error("取得作業繳交紀錄失敗:", error);
        return null;
    }
};

// 刪除學生提交的檔案
export const DeleteSubmittedFile = async (assignmentId, fileUrl) => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user?.user_id;
        if (!userId) {
            throw new Error("請先登入");
        }

        const endpoint = `/assignment/${assignmentId}/submit-file`;
        const response = await api.delete(endpoint, {
            data: {
                submitByUserId: userId,
                fileUrl: fileUrl
            }
        });
        return response.data;
    } catch (err) {
        console.error("刪除提交檔案失敗", err);
        throw new Error(err.response?.data?.message || "刪除檔案發生錯誤");
    }
};

// 完全刪除學生的作業提交記錄
export const DeleteSubmissionRecord = async (assignmentId) => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user?.user_id;
        if (!userId) {
            throw new Error("請先登入");
        }

        const endpoint = `/assignment/${assignmentId}/submission`;
        const response = await api.delete(endpoint, {
            data: {
                submitByUserId: userId
            }
        });
        return response.data;
    } catch (err) {
        console.error("刪除作業提交記錄失敗", err);
        throw new Error(err.response?.data?.message || "刪除提交記錄發生錯誤");
    }
};