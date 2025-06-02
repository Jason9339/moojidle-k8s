import api from "@/ApiClient";

// 建立作業繳交（Create）
export const CreateSubAssign = async (assignmentId, data) => {
    try {
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?.user_id;
        
        const url = `/submitted-assignment/submit-to/${assignmentId}/user/${userId}`;
        
        // 後端路由: /submit-to/:assignmentId/user/:userId
        const response = await api.post(url, data);
        
        return response.data;
    } catch (err) {
        console.error("建立繳交紀錄失敗", err);
        console.error("錯誤詳情:", err.response?.data);
        console.error("錯誤狀態:", err.response?.status);
        throw new Error(err.response?.data?.message || "建立紀錄發生錯誤");
    }
};
// 更新作業繳交（Update）
// 後端路由: /sub-assign-id/:subAssId
export const UpdateSubAssign = async (subAssId, data) => { // 參數改為 subAssId
    try {
        const response = await api.put(`/submitted-assignment/sub-assign-id/${subAssId}`, data);
        return response.data;
    } catch (err) {
        console.error("更新繳交紀錄失敗", err);
        throw new Error(err.response?.data?.message || "更新紀錄發生錯誤");
    }
};
// 刪除作業繳交（Delete）
// 後端路由: /sub-assign-id/:subAssId
export const DeleteSubAssign = async (subAssId) => { // 參數改為 subAssId
    try {
        const url = `/submitted-assignment/sub-assign-id/${subAssId}`;
        
        const response = await api.delete(url);
        
        return response.data;
    } catch (err) {
        console.error("刪除繳交紀錄失敗", err);
        console.error("錯誤詳情:", err.response?.data);
        console.error("錯誤狀態:", err.response?.status);
        throw new Error(err.response?.data?.message || "刪除紀錄發生錯誤");
    }
};

// 取得特定作業的特定用戶繳交紀錄
// 後端路由: /submitted-assignment/assignment/:assignmentId/user/:userId
export const GetSubAssign = async (assignmentId, userId) => {
    try {
        const response = await api.get(`/submitted-assignment/assignment/${assignmentId}/user/${userId}`);
        return response.data;
    } catch (err) {
        console.error("取得單一繳交紀錄失敗", err);
        if (err.response && err.response.status === 404) {
            return null; 
        }
        throw new Error(err.response?.data?.message || "取得紀錄發生錯誤");
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


