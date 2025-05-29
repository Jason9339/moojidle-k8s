import api from "@/ApiClient.js"

async function GetnotificationData(userID) {
    try {
        const response = await api.get(`notification/get-notification/${userID}`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch post content:", error.message);
        throw error;
    }
}

async function DeleteNotification(notifiedData) {
    try {
        const response = await api.delete("notification/delete-notified", { data: notifiedData });
        return response;
    } catch (error) {
        console.error("Failed to fetch post content:", error.message);
        throw error;
    }
}

export { GetnotificationData, DeleteNotification };

