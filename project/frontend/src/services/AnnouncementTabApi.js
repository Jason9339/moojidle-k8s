import axios from "./apiClient";

export const getAnnouncements = async (courseId) => {
  return (await axios.get(`/announcements/${courseId}`)).data;
};