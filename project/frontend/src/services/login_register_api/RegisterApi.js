import api from "@/services/apiClient";
import { c } from "vite/dist/node/moduleRunnerTransport.d-DJ_mE5sf";

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