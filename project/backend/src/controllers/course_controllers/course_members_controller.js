import {
    GetStudyIn,
    GetAssistIn,
    GetTeachersByCourseId,
    SwitchStudyAssist,
    AddStudent, 
    CanUserEditAnnouncements as CanUserEditAnnouncementsService
} from '#src/services/course_services/course_member_service.js';



async function GetCourseMembers(req, res) {
    try {
        const courseId = req.params.courseId;
        
        const students = await GetStudyIn(courseId);
        const assistants = await GetAssistIn(courseId);
        const teachers = await GetTeachersByCourseId(courseId);
        
        res.status(200).json({
            students,
            assistants,
            teachers
        });
    } catch (error) {
        console.error("Error getting course members:", error);
        res.status(500).json({ error: error.message });
    }
}

async function SwitchCharacter(req, res) {
    try {
        const userId = req.params.userId;
        const courseId = req.params.courseId;
        
        const result = await SwitchStudyAssist(userId, courseId);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error switching character:", error);
        res.status(500).json({ error: error.message });
    }
}

async function InviteStudent(req, res) {
    try {
        const userId = req.body.userId;
        const studentId = req.body.studentId;
        const courseId = req.params.courseId;
        
        if (!userId || !studentId || !courseId) {
            return res.status(400).json({ error: "Missing required parameters" });
        }
        console.log("user:",userId, "student:",studentId,"course:", courseId);
        
        const result = await AddStudent(userId, studentId, courseId);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error inviting student:", error);
        res.status(409).json({ message: error.message });
    }
}

const CanUserEditAnnouncements = async (req, res) => {
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
    GetCourseMembers,
    SwitchCharacter,
    InviteStudent,
    CanUserEditAnnouncements
}