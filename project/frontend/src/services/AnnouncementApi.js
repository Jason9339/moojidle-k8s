import axios from "@/ApiClient";

export const GetAnnouncements = async (courseId) => {
  return (await axios.get(`/announcement/course/${courseId}`)).data;
};

export const CreateAnnouncement = async (courseId, context, userId, announceDate) => {
  return (await axios.post(`/announcement/course/${courseId}`, { context, userId, announceDate })).data;
};

export const EditAnnouncement = async (announcementId, context, announceDate) => {
  return (await axios.post(`/announcement/${announcementId}/edit`, { context, announceDate })).data;
};

export const CanUserEditAnnouncements = async (userId, courseId) => {
  return (await axios.get(`/course/member/can_edit/${userId}/${courseId}`)).data;
};
