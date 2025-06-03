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
        const response = await api.put(`/user/update-user-data/${userId}`, data);
        console.log("User data updated successfully:", response.data);
        return response.data;
    } catch (err) {
        console.error(err);
        return { message: "An error occurred while updating the user data." };
    }
}

async function UpdateUserTags(userId, tags) {
    try {
        // 直接傳送標籤陣列
        const response = await api.put(`/user/update-user-tags/${userId}`, {
            tags: tags  // 確保這裡傳送的是字串陣列
        });
        
        console.log("標籤更新回應:", response.data);
        return response.data;
    } catch (err) {
        console.error('更新標籤錯誤:', err);
        throw new Error(err.response?.data?.message || "更新標籤時發生錯誤");
    }
}

export {
    GetUserDataById,
    UpdateUserPassword,
    GetUserTagsById,
    UpdateUserData,
    UpdateUserTags
}
