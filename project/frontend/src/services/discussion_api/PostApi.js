import api from "@/services/apiClient.js"

async function GetOverviewPostByBId(inBoardId) {
    try {
        const response = await api.get(`/post/get-overview-posts/${inBoardId}`);

        return response.data;
    } catch (err) {
        console.error(err);
    }
}

export {
    GetOverviewPostByBId,
}