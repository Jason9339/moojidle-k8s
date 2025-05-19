import api from "@/ApiClient";

export const GetAnnouncements = async (courseId) => {
  return (await api.get(`/announcement/course/${courseId}`)).data;
};

export const CreateAnnouncement = async (courseId, context, userId, announceDate) => {
  return (await api.post(`/announcement/course/${courseId}`, { context, userId, announceDate })).data;
};

export const EditAnnouncement = async (announcementId, context, announceDate) => {
  return (await api.post(`/announcement/${announcementId}/edit`, { context, announceDate })).data;
};
