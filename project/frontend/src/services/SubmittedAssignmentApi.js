import api from "@/ApiClient";

// 建立作業繳交（Create）
export const CreateSubAssign = async (assignmentId, data) => {
    try {
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?.user_id;
        const response = await api.post(`/submitted-assignment/${assignmentId}/submissions/${userId}`, data);
        return response.data;
    } catch (err) {
        console.error("建立繳交紀錄失敗", err);
        throw new Error(err.response?.data?.message || "建立紀錄發生錯誤");
    }
};
// 更新作業繳交（Update）
export const UpdateSubAssign = async (assignmentId, data) => {
    try {
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?.user_id;
        const response = await api.put(`/submitted-assignment/${assignmentId}/submissions/${userId}`, data);
        return response.data;
    } catch (err) {
        console.error("更新繳交紀錄失敗", err);
        throw new Error(err.response?.data?.message || "更新紀錄發生錯誤");
    }
};
// 刪除作業繳交（Delete）
export const DeleteSubAssign = async (assignmentId) => {
    try {
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?.user_id;
        const response = await api.delete(`/submitted-assignment/${assignmentId}/submissions/${userId}`);
        return response.data;
    } catch (err) {
        console.error("刪除繳交紀錄失敗", err);
        throw new Error(err.response?.data?.message || "刪除紀錄發生錯誤");
    }
};

// 取得所有該課程作業的使用者繳交紀錄
export const GetCourseSubAssignments = async (assignmentList) => {
    try {
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?.user_id;
        if (!userId) return [];

        // 將 assignmentList 傳給後端來比對（理想情況）
        const response = await api.post("/submitted-assignment/submissions/batch", {
            userId,
            assignmentList,
        });
        return response.data?.submissions || [];
    } catch (err) {
        console.error("取得課程繳交紀錄失敗", err);
        return [];
    }
};

// // 刪除學生提交的檔案
// export const DeleteSubmittedFile = async (assignmentId, fileUrl) => {
//     try {
//         const user = JSON.parse(localStorage.getItem('user'));
//         const userId = user?.user_id;
//         if (!userId) {
//             throw new Error("請先登入");
//         }

//         const endpoint = `/submitted-assignment/${assignmentId}/submit-file`;
//         const response = await api.delete(endpoint, {
//             data: {
//                 submitByUserId: userId,
//                 fileUrl: fileUrl
//             }
//         });
//         return response.data;
//     } catch (err) {
//         console.error("刪除提交檔案失敗", err);
//         throw new Error(err.response?.data?.message || "刪除檔案發生錯誤");
//     }
// };


