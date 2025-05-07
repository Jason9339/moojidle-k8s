import api from "@/services/apiClient";

async function RegisterUser(userData) {
    try{
        const response = await api.post("user/register", userData);

        return response.data;
    }catch (error) {
        console.error(error);
    }

};

export{
    RegisterUser
}