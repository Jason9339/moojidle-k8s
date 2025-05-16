import axios from "./apiClient";

export const getAnnouncements = async (courseId) => {
  return (await axios.get(`/course/${courseId}/announcements/read`)).data;
};

export const createAnnouncement = async (courseId, context, userId, announceDate) => {
  return (await axios.post(`/course/${courseId}/announcements/create`, { context, userId, announceDate })).data;
};

export const editAnnouncement = async (announcementId, context, announceDate) => {
  return (await axios.post(`/course/${announcementId}/announcements/edit`, { context, announceDate })).data;
};

export const canUserEditAnnouncements = async (userId, courseId) => {
    return (await axios.get(`/course/can_edit_announcements/${userId}/${courseId}`)).data;
};