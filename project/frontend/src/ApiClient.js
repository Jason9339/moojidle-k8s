import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 5000,
    // 移除固定的 Content-Type，讓 axios 自動根據資料類型設置
    // 對於 FormData 會自動設置為 multipart/form-data 並包含 boundary
    // 對於普通物件會自動設置為 application/json
});

export default apiClient;
