import mongoose from 'mongoose';
import { GetNextSequenceValue } from '#src/services/course_services/course_service.js';

// 查詢課程公告
async function GetAnnouncementsByCourseId(courseId) {
    try {
        const now = new Date();
        return await mongoose.connection.db.collection('announcement')
            .find({
                course_id: parseInt(courseId),
                announce_date: { $lte: now } // Only return announcements where announce_date is less than or equal to now
            })
            .sort({ create_date: -1 }) // 依日期降序排列
            .toArray();
    } catch (error) {
        console.error(`[getAnnouncementsByCourseId] Error fetching announcements for course ID ${courseId}:`, error);
        throw new Error(`Failed to retrieve course announcements: ${error.message}`);
    }
}

// 建立課程公告
async function CreateAnnouncement(courseId, context, user_id, announce_date) {
    try {
        const a_id = await GetNextSequenceValue('announcement');
        const now = new Date();
        const announcement = {
            a_id,
            course_id: parseInt(courseId),
            context,
            user_id: parseInt(user_id),
            create_date: now,
            announce_date: new Date(announce_date) // Use the provided announce_date
        };

        await mongoose.connection.db.collection('announcement').insertOne(announcement);

        return announcement;
    } catch (error) {
        console.error(`[createAnnouncement] Error creating announcement for course ID ${courseId}:`, error);
        throw new Error(`Failed to create announcement: ${error.message}`);
    }
}

// 編輯課程公告
async function EditAnnouncement(announcementId, context, announce_date) {
    try {
        const result = await mongoose.connection.db.collection('announcement').updateOne(
            { a_id: parseInt(announcementId) },
            { $set: { context, announce_date: new Date(announce_date) } }
        );

        if (result.modifiedCount === 0) {
            throw new Error('Announcement not found or no changes made');
        }

        // Return the updated announcement
        const updated = await mongoose.connection.db.collection('announcement').findOne({ a_id: parseInt(announcementId) });
        return updated;
    } catch (error) {
        console.error(`[editAnnouncement] Error editing announcement ID ${announcementId}:`, error);
        throw new Error(`Failed to edit announcement: ${error.message}`);
    }
}

export {
    GetAnnouncementsByCourseId,
    CreateAnnouncement,
    EditAnnouncement
}; 