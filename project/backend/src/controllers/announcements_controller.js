import { FetchAnnouncements } from '#src/services/announcements_service.js';

export const getAnnouncements = async (req, res) => {
    try {
        const { courseId } = req.params;
        const Annoucements = await FetchAnnouncements(courseId);
        
        res.json(Annoucements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};