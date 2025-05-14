import api from "@/services/apiClient.js"

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
    try{
        const response = await api.post("post/commend", commendData);

        return response.data;
    }catch (error) {
        console.error(error);
    }

};

async function DeleteCommend(commendData) {
    try{
        const response = await api.post("post/deletecommend", commendData);

        return response.data;
    }catch (error) {
        console.error(error);
    }

};

async function DeletePost(postID) {
    try{
        const response = await api.delete(`post/delete/${postID}`);
        return response.data;
    }catch (error) {
        console.error(error);
    }

};



export { GetPostContent, LeaveCommend, DeleteCommend, DeletePost};

