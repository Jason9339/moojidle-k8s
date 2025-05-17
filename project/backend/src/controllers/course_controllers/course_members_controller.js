import {
    GetStudyIn,
    GetAssistIn,
    GetTeachersByCourseId,
    SwitchStudyAssist,
    AddStudent, 
    InviteStudentByCode,
    FindInviteCodeId
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



async function GetIdViaInviteCode(req, res) {
   try {
        const code = req.params.code;
        const courseId = await FindInviteCodeId(code);
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
    GetCourseMembers,
    SwitchCharacter,
    InviteStudent,
    GetIdViaInviteCode
}




