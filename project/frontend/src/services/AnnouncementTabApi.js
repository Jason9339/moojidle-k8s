import axios from "./apiClient";

export const getAnnouncements = async (courseId) => {
  return (await axios.get(`/announcement/course/${courseId}`)).data;
};

export const createAnnouncement = async (courseId, context, userId, announceDate) => {
  return (await axios.post(`/announcement/course/${courseId}`, { context, userId, announceDate })).data;
};

export const editAnnouncement = async (announcementId, context, announceDate) => {
  return (await axios.post(`/announcement/${announcementId}/edit`, { context, announceDate })).data;
};

export const canUserEditAnnouncements = async (userId, courseId) => {
  return (await axios.get(`/course/member/can_edit/${userId}/${courseId}`)).data;
};
