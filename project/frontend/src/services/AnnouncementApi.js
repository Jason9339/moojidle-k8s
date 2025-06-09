import api from "@/ApiClient";

export const GetAnnouncements = async (courseId, showFuture = false) => {
  return (await api.get(`/announcement/course/${courseId}?showFuture=${showFuture}`)).data;
};

export const CreateAnnouncement = async (courseId, context, userId, announceDate) => {
  return (await api.post(`/announcement/course/${courseId}`, { context, userId, announceDate })).data;
};

export const EditAnnouncement = async (announcementId, context, announceDate) => {
  return (await api.post(`/announcement/${announcementId}/edit`, { context, announceDate })).data;
};

export const DeleteAnnouncement = async (announcementId) => {
  return (await api.delete(`/announcement/${announcementId}/delete`)).data;
};
