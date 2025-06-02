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

async function EditUserData(userId, data) {
    try {
        const response = await api.put(`/user/update-user-data/${userId}`, data);
        console.log("User data updated successfully:", response.data);
        return response.data;
    } catch (err) {
        console.error(err);
        return { message: "An error occurred while updating the user data." };
    }
}

async function EditUserTags(userId, tags) {
    try {
        const response = await api.put(`/user/update-user-tags/${userId}`, { user_tags: tags });
        console.log("User tags updated successfully:", response.data);
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
    EditUserData,
    EditUserTags
}
