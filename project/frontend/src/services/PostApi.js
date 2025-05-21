import api from "@/ApiClient.js"

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

async function EditPost(postID, postData) {
    try {
        const response = await api.put(`post/${postID}`, postData);
        return response.data;
    } catch (error) {
        console.error("EditPost API error:", error);
        // 丟出錯誤給呼叫者處理
        throw new Error(error.response?.data?.error || error.response?.data?.message || "伺服器錯誤");
    }
}
export { GetPostContent, LeaveCommend, DeleteCommend, DeletePost, GetOverviewPostByBId, CreatePost, EditPost };

