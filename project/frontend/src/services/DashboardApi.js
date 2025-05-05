import apiClient, { mockApiClient } from "./apiClient";

export const getCourses = async () => {
  return (await mockApiClient.get("/mock/courses.json")).data;
};

export const getTodoList = async () => {
  return (await mockApiClient.get("/mock/todo.json")).data;
};

export const getComingUpList = async () => {
  return (await mockApiClient.get("/mock/comingup.json")).data;
};

export const getTeachIn = async () => {
  return (await mockApiClient.get("/mock/teach_in.json")).data;
};
