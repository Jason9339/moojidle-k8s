import {
    FindStudyInJoinUserByCourseId,
    FindAssistInJoinUserByCourseId,
    FindTeachInJoinUserByCourseId,
    InsertStudyIn,
    InsertAssistIn,
    DeleteStudyIn,
    // DeleteAssistIn,
} from '#src/services/course_member_service.js';

import { 
    FindOneUserById
} from '#src/services/user_service.js';

import {
    SendNotify
} from '#src/services/notification_service.js'

import { 
    FindCourseById 
} from '#src/services/course_service.js';

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

        const students = await FindStudyInJoinUserByCourseId(courseId);

        // check if is student
        for (let i = 0; i < students.length; i++) {
            if (userId == students[i].user_id) {
                await DeleteStudyIn(userId, courseId);
                await InsertAssistIn(userId, courseId);
                res.status(200).json({ message: "User added as an assistant" });
                return;
            }
        }

        // is assistant
        await DeleteAssistIn(userId, courseId);
        // TODO: right now, inserting a constant student_id
        await InsertStudyIn(userId, 1, courseId);
        res.status(200).json({ message: "User removed from assistants" });
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
        const course = await FindCourseById(courseId);
        const notification = {
            event_id: course.course_id,
            event_category: "course",
            context: `您被加入了新課程 ${course.name}`,
            notified_users:[{
                user_id: userExists.user_id
            }]
        }
        const notificationres = await SendNotify(notification);
        result.notificationres = notificationres;
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