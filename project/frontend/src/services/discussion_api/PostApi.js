import api from "@/services/apiClient.js"
import { data } from "react-router-dom";

async function GetOverviewPostByBId(inBoardId) {
    try {
        const response = await api.get(`/post/get-overview-posts/${inBoardId}`);

        return response.data;
    } catch (err) {
        console.error(err);
    }
}

async function CreatePost(postData) {
    console.log("postData=", postData)
    try {
        const response = await api.post("/post/create-post", postData);

        return response.data;
    } catch (err) {
        console.error(err);
    }
}
export {
    GetOverviewPostByBId,
    CreatePost,
}
