import api from "@/ApiClient";

export const GetComingUpList = async (userId) => {
    return (await api.get(`/exams/coming?user_id=${userId}`)).data;
};
