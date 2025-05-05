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

export const getTeachIn = async () => {
  // 暫時使用模擬數據，稍後需要在後端實現此API
  // return (await tempApiClient.get("/mock/teach_in.json")).data;
  
  // 由於目前後端沒有專門的教師課程API，暫時透過課程列表和使用者ID過濾
  const courses = await getCourses();
  // 假設當前用戶ID為1，實際應用中應從登入系統獲取
  const currentUserId = 1;
  
  try {
    // 嘗試從後端獲取教師課程數據，如果後端已經實現了相關API
    const response = await axios.get(`/course/teaching?userId=${currentUserId}`);
    return response.data;
  } catch (error) {
    console.warn("教師課程API尚未實現，使用前端過濾方法", error);
    // 備用方案：前端篩選 (實際使用時應在後端實現)
    return courses.filter(course => course.isTeacher === true);
  }
};
