import api from "@/services/apiClient";

async function Register(userData) {
    try{
        const response = await api.post("/register", userData);

        return response.data;
    }catch (error) {
        console.error(error);
    }

};

export{
    Register
}