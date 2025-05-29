import api from "@/ApiClient.js"

async function GetnotificationData(userID) {
    try {
        console.log(userID)
        const response = await api.get(`notification/get-notification/${userID}`);
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error("Failed to fetch post content:", error.message);
        throw error;
    }
}

async function DeleteNotification(userID) {
    try {
        // TO DO
    } catch (error) {
        console.error("Failed to fetch post content:", error.message);
        throw error;
    }
}

export { GetnotificationData, DeleteNotification };

