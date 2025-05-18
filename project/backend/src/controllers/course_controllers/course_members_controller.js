import {
    FindStudyInJoinUserByCourseId,
    FindAssistInJoinUserByCourseId,
    FindTeachInJoinUserByCourseId,
    SwitchStudyAssist,
    InsertStudyIn,
} from '#src/services/course_services/course_member_service.js';

import { 
    FindOneUserById 
} from '#src/services/user_services/user_service.js';

async function GetCourseMembers(req, res) {
    try {
        const courseId = req.params.courseId;

        const students = await FindStudyInJoinUserByCourseId(courseId);
        const assistants = await FindAssistInJoinUserByCourseId(courseId);
        const teachers = await FindTeachInJoinUserByCourseId(courseId);

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
        const userId = parseInt(req.params.userId);
        const courseId = parseInt(req.params.courseId);

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

        // Check if the user exists
        const userExists = await FindOneUserById(userId);
        if (!userExists.user_id) {
            throw new Error("User does not exist");
        }

        const result = await InsertStudyIn(userId, studentId, courseId);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error inviting student:", error);
        res.status(409).json({ message: error.message });
    }
}

const IsAssistantOrTeacher = async (req, res) => {
    let { courseId, userId } = req.params;
    courseId = parseInt(courseId);
    userId = parseInt(userId);

    try {
        const assistants = await FindAssistInJoinUserByCourseId(courseId);
        const teachers = await FindTeachInJoinUserByCourseId(courseId);

        // check if is teacher
        for (let i = 0; i < teachers.length; i++) {
            if (userId == teachers[i].user_id) {
                res.status(200).json(true);
                return;
            }
        }

        // check if is assistant
        for (let i = 0; i < assistants.length; i++) {
            if (userId == assistants[i].user_id) {
                res.status(200).json(true);
                return;
            }
        }

        res.status(200).json(false);
        return;
    } catch (error) {
        console.error("Failed to check user enrollment:", error);
        res.status(500).json({ message: "Failed to check user enrollment" });
    }
};

export {
    GetCourseMembers,
    SwitchCharacter,
    InviteStudent,
    IsAssistantOrTeacher
}