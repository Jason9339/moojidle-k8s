import {
    FindAnnouncementByCourseId,
    InsertAnnouncement,
    UpdateAnnouncement
} from '#src/services/announcement_service.js';

// 取得特定課程的公告
async function GetCourseAnnouncements(req, res) {
    try {
        const { courseId } = req.params;
        const announcements = await FindAnnouncementByCourseId(courseId);
        res.json(announcements);
    } catch (error) {
        console.error("取得課程公告錯誤:", error);
        res.status(500).json({ message: error.message });
    }
}

const CreateAnnouncement = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { context, userId, announceDate } = req.body;
        const announcement = await InsertAnnouncement(courseId, context, userId, announceDate);
        res.json(announcement);
    } catch (error) {
        console.error("新增課程公告錯誤:", error);
        res.status(500).json({ message: error.message });
    }
};

const EditAnnouncement = async (req, res) => {
    try {
        const { announcementId } = req.params;
        const { context, announceDate } = req.body;
        const announcement = await UpdateAnnouncement(announcementId, context, announceDate);
        res.json(announcement);
    } catch (error) {
        console.error("更改課程公告錯誤:", error);
        res.status(500).json({ message: error.message });
    }
};

export {
    GetCourseAnnouncements,
    CreateAnnouncement,
    EditAnnouncement
}; 