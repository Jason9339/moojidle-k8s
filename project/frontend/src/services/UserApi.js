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
        return response.data;
    } catch (err) {
        console.error(err);
        return { message: "An error occurred while updating the user data." };
    }
}

async function UpdateUserTags(userId, _id, data) {
    try {
        const response = await api.put(`/user/update-user-tags/${userId}`, data);
        return response.data;
    } catch (err) {
        console.error(err);
        return { message: "An error occurred while updating the user tags." };
    }
}

export {
    GetUserDataById,
    UpdateUserPassword,
    GetUserTagsById,
    UpdateUserData,
    UpdateUserTags
}
