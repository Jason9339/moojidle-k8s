import api from "@/ApiClient";

async function LoginUser(userData) {
    try {
        // Send email and pw to the backend for authentication
        const response = await api.post("user/login", userData); 
        return response.data; 
    } catch (error) {
        console.error("Login API Error:", error);
        return { message: "An error occurred while logging in." };
    }
}

export {
    LoginUser
};