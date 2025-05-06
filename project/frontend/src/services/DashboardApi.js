import axios from "./apiClient";

// 移除臨時API客戶端，改用實際後端API
// const tempApiClient = axios.create({
//     baseURL: 'http://localhost:5173',
//     timeout: 5000,
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });

export const getCourses = async () => {
  console.log((await axios.get("/course/read")).data);
  return (await axios.get("/course/read")).data;
};

export const getTodoList = async () => {
  return (await axios.get("/assignment/todo")).data;
};

export const getComingUpList = async () => {
  return (await axios.get("/exam/coming")).data;
};

export const getTeachIn = async (userId) => {
  return (await tempApiClient.get(`/mock/teach_in.json?user_id=${userId}`)).data;
  // ⚠️ 注意：這裡是 mock 資料，真正串接 API 請改為正式 API 路徑
  // return (await axios.get(`/teachin?user_id=${userId}`)).data;

};

