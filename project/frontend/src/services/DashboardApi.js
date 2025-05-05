import axios from "./apiClient";

const tempApiClient = axios.create({
    baseURL: 'http://localhost:5173',
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json',
    },
  });
export const getCourses = async () => {
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

export const addCourse = async (coursePayload) => {
  try {
    // Use the main axios instance to POST to the backend
    const response = await axios.post("/course/create", coursePayload); // Axios handles JSON stringify
    console.log("Added course:", response.data); // Optional logging
    return response.data; // Axios automatically returns response.data for success
  } catch (error) {
    console.error("Error adding course:", error.response?.data || error.message); // Log backend error message if available
    throw error; // Re-throw error for the component to handle
  }
};
