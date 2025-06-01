import api from "@/ApiClient";

// 學生繳交作業
export const SubmitAssignment = async (assignmentId, formData) => {
    try {
        const endpoint = `/submitted-assignment/${assignmentId}/submit`;
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
        const res = await api.get(`/submitted-assignment/${assignmentId}/submission`, { params: { user_id: userId } });
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

        const endpoint = `/submitted-assignment/${assignmentId}/submit-file`;
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

        const endpoint = `/submitted-assignment/${assignmentId}/submission`;
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

// 取得作業提交時間
export const GetAssignmentSubmissionTime = async (assignmentId, userId) => {
    try {
        const res = await api.get(`/submitted-assignment/${assignmentId}/submission-time`, { 
            params: { userId } 
        });
        return res.data?.submitTime || null;
    } catch (error) {
        console.error("取得作業提交時間失敗:", error);
        return null;
    }
};
