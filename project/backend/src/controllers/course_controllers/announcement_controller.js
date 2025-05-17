import {
    GetAnnouncementsByCourseId,
    CreateAnnouncement as CreateAnnouncementService,
    EditAnnouncement as EditAnnouncementService,
} from '#src/services/course_services/announcement_service.js';

// 取得特定課程的公告
async function GetCourseAnnouncements(req, res) {
    try {
        const { courseId } = req.params;
        const announcements = await GetAnnouncementsByCourseId(courseId);
        res.json(announcements);
    } catch (error) {
        console.error("取得課程公告錯誤:", error);
        res.status(500).json({ message: error.message });
    }
}

const CreateAnnouncementController = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { context, userId, announceDate } = req.body;
        const announcement = await CreateAnnouncementService(courseId, context, userId, announceDate);
        res.json(announcement);
    } catch (error) {
        console.error("新增課程公告錯誤:", error);
        res.status(500).json({ message: error.message });
    }
};

const EditAnnouncementController = async (req, res) => {
    try {
        const { announcementId } = req.params;
        const { context, announceDate } = req.body;
        const announcement = await EditAnnouncementService(announcementId, context, announceDate);
        res.json(announcement);
    } catch (error) {
        console.error("更改課程公告錯誤:", error);
        res.status(500).json({ message: error.message });
    }
};

const CanUserEditAnnouncementsController = async (req, res) => {
    const { courseId, userId } = req.params;
    try {
        const enrolled = await CanUserEditAnnouncementsService(courseId, userId);
        res.status(200).json(enrolled);
    } catch (error) {
        console.error("Failed to check user enrollment:", error);
        res.status(500).json({ message: "Failed to check user enrollment" });
    }
};

export {
    GetCourseAnnouncements,
    CreateAnnouncementController as CreateAnnouncement,
    EditAnnouncementController as EditAnnouncement
}; 