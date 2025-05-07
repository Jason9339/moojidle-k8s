import apiClient from "@/services/apiClient";
import axios from 'axios';


async function getPostContent(postID) {
    try {
        const response = await axios.get(`http://localhost:3000/post/${postID}`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch post content:", error.message);
        throw error;
    }
}

async function getUserName(UserID) {
    try {
        const response = await axios.get(`http://localhost:3000/post-user/${UserID}`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch post content:", error.message);
        throw error;
    }
}

async function getBoardName(BoardID) {
    try {
        const response = await axios.get(`http://localhost:3000/post-board/${BoardID}`);
        return response.data;
    } catch (error) {
        console.error("Failed to fetch post content:", error.message);
        throw error;
    }
}


export { getBoardName, getPostContent, getUserName };
