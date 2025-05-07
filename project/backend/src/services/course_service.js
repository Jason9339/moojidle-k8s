import Course from '#src/models/course.js';
import Announcement from '#src/models/Announcement.js';
import Material from '#src/models/Material.js';
import Assignment from '#src/models/Assignment.js';

// 查詢課程基本資訊
export const getCourseById = async (courseId) => {
    return await Course.findOne({ course_id: parseInt(courseId) });
};

// 查詢課程公告
export const getAnnouncementsByCourseId = async (courseId) => {
    return await Announcement.find({ course_id: parseInt(courseId) });
};

// 查詢課程教材
export const getMaterialsByCourseId = async (courseId) => {
    return await Material.find({ in_course_id: parseInt(courseId) });
};

// 查詢課程作業
export const getAssignmentsByCourseId = async (courseId) => {
    return await Assignment.find({ in_course_id: parseInt(courseId) });
};