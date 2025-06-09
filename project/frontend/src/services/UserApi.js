import api from "@/ApiClient.js"

async function GetUserDataById(userId) {
    try {
        const response = await api.get(`/user/get-user-by-id/${userId}`);

        return response.data;
    } catch (err) {
        console.error(err);
    }
}

async function GetUserTagsById(userId) {
    try {
        const respone = await api.get(`/user/get-user-tags-by-id/${userId}`);

        return respone.data;
    } catch (err) {
        console.error(err);
    }

}

async function UpdateUserPassword(userId, data) {
    try {
        const response = await api.put(`/user/update-password/${userId}`, data);
        return response.data;
    } catch (err) {
        console.error(err);
        return { message: "An error occurred while updating the password." };
    }
}

async function UpdateUserData(userId, data) {
    try {
        const response = await api.put(`/user/update-profile/${userId}`, data);
        return response.data;
    } catch (err) {
        console.error(err);
        return { message: "個人資料更新失敗" };
    }
}

// 新增專門處理個人資料更新的函數（支援檔案上傳）
async function UpdateUserProfile(userId, formData) {
    try {
        const response = await api.put(`/user/update-profile/${userId}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (err) {
        console.error("Profile update error:", err);
        return { message: "更新個人資料時發生錯誤" }
    }
}

async function UpdateUserTags(userId, tags) {
    try {
        // 直接傳送標籤陣列
        const response = await api.put(`/user/update-user-tags/${userId}`, {
            tags: tags  // 確保這裡傳送的是字串陣列
        });
        return response.data;
    } catch (err) {
        console.error('更新標籤錯誤:', err);
        return {
            message: "更新標籤時發生錯誤"
        }
    }
}

// 獲取頭像並回傳 Blob URL
async function GetAvatarUrl(pathToProfilePic) {
    try {
        const response = await api.get('/user/avatar', {
            params: { path: pathToProfilePic },
            responseType: 'blob',
        });
        return URL.createObjectURL(response.data);
    } catch (err) {
        console.error('獲取頭像錯誤:', err);
        // 直接回傳預設頭像路徑，不再嘗試後端
        return '/user_pfp/default.png';
    }
}

export {
    GetUserDataById,
    UpdateUserPassword,
    GetUserTagsById,
    UpdateUserData,
    UpdateUserProfile,
    UpdateUserTags,
    GetAvatarUrl
}
