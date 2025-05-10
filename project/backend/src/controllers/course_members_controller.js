import {
    getStudyIn,
    getAssistIn,
    getTeachIn,
    switchStudyAssist
} from '#src/services/course_member_management.js';


async function getCourseMembers(req, res) {
    try {
        const courseId = req.params.courseId;
        
        const students = await getStudyIn(courseId);
        const assistants = await getAssistIn(courseId);
        const teachers = await getTeachIn(courseId);
        
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

async function switchCharacter(req, res) {
    try {
        const userId = req.params.userId;
        const courseId = req.params.courseId;
        
        const result = await switchStudyAssist(userId, courseId);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error switching character:", error);
        res.status(500).json({ error: error.message });
    }
}

export {
    getCourseMembers,
    switchCharacter
}




