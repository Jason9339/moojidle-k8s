import api from "@/services/apiClient.js"

async function GetUserDataById(userId) {
    try {
        const response = await api.get(`/user/get-user-by-id/${userId}`);

        return response.data;
    } catch (err) {
        console.error(err);
    }
}

export {
    GetUserDataById,
}