import apiClient from "@/services/apiClient";

export const registerUser = async (userData) => {
    const response = await apiClient.post("/register", userData);
    return response.data;
};