import api from "@/ApiClient.js"
import { data } from "react-router-dom";

async function GetPostContent(postID) {
    try {
        const response = await api.get(`post/content/${postID}`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch post content:", error.message);
        throw error;
    }
}

async function LeaveCommend(commendData) {
    try {
        const response = await api.post("post/commend", commendData);

        return response.data;
    } catch (error) {
        console.error(error);
    }

};

async function DeleteCommend(commendData) {
    try {
        const response = await api.post("post/deletecommend", commendData);

        return response.data;
    } catch (error) {
        console.error(error);
    }

};

async function DeletePost(postID) {
    try {
        const response = await api.delete(`post/delete/${postID}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }

};

async function GetOverviewPostByBId(inBoardId) {
    try {
        const response = await api.get(`/post/get-overview-posts/${inBoardId}`);

        return response.data;
    } catch (err) {
        console.error(err);
    }
}

async function CreatePost(postData) {
        try {
        const response = await api.post("/post/create-post", postData);

        return response.data;
    } catch (err) {
        console.error(err);
    }
}
export { GetPostContent, LeaveCommend, DeleteCommend, DeletePost, GetOverviewPostByBId, CreatePost };

