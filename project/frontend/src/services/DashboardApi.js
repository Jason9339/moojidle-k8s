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

export const getTodoList = async () => {
  return (await tempApiClient.get("/mock/todo.json")).data;
};

export const getComingUpList = async () => {
  return (await tempApiClient.get("/mock/comingup.json")).data;
};

export const getTeachIn = async () => {
  return (await tempApiClient.get("/mock/teach_in.json")).data;
};
