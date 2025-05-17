import {
    getStudyIn,
    getAssistIn,
    getTeachIn,
    switchStudyAssist,
    addStudent, 
    inviteStudentByCode,
    findInviteCodeId
} from '#src/services/course_services/course_member_management.js';



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

async function inviteStudent(req, res) {
    try {
        const userId = req.body.userId;
        const studentId = req.body.studentId;
        const courseId = req.params.courseId;
        
        if (!userId || !studentId || !courseId) {
            return res.status(400).json({ error: "Missing required parameters" });
        }
        console.log("user:",userId, "student:",studentId,"course:", courseId);
        
        const result = await addStudent(userId, studentId, courseId);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error inviting student:", error);
        res.status(409).json({ message: error.message });
    }
}



async function getIdViaInviteCode(req, res) {
   try {
        const code = req.params.code;
        const courseId = await findInviteCodeId(code);
        if (courseId) {
            res.status(200).json({ courseId: courseId.course_id });
        }  
        else {
            res.status(404).json({ message: "Course not found" });
        }
        
    } 
    catch (error) {
        console.error("Error getting course ID via invite code:", error);
        res.status(500).json({ error: error.message });
    }
}



export {
    getCourseMembers,
    switchCharacter,
    inviteStudent,
    getIdViaInviteCode
}




