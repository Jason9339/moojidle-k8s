import axios from "./apiClient";

const tempApiClient = axios.create({
    baseURL: 'http://localhost:5173',
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getCourses = async () => {
    console.log((await axios.get("/course/read")).data);
    return (await axios.get("/course/read")).data;
};

export const getTodoList = async (userId) => {
    // return (await tempApiClient.get("/mock/todo.json")).data;
    return (await axios.get(`/assignments/todo?user_id=${userId}`)).data;
};

export const getComingUpList = async (userId) => {
    // return (await apiClient.get("/mock/comingup.json")).data;
    return (await axios.get(`/exams/coming?user_id=${userId}`)).data;
};

export const getTeachIn = async () => {
    return (await tempApiClient.get("/mock/teach_in.json")).data;
};
