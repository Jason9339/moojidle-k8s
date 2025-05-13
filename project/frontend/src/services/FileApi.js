import axios from "./apiClient";

export const uploadFile = async (formData) => {
    try {
        const response = await axios.post("/file/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (err) {
        console.error("上傳失敗", err);
        throw new Error(err.response?.data?.message || "上傳發生錯誤");
    }
};