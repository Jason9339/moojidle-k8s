import api from "@/ApiClient";

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