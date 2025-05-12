import apiClient from "../apiClient";

async function GetPostContent(postID) {
    try {
        const response = await apiClient.get(`http://localhost:3000/post/content/${postID}`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch post content:", error.message);
        throw error;
    }
}





export { GetPostContent };

