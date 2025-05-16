// 1. `getStudyIn`: Retrieves all students enrolled in a specific course
// 2. `getAssistIn`: Retrieves all teaching assistants for a specific course
// 3. `getTeachIn`: Retrieves all teachers for a specific course
// 4. `switchStudyAssist`: Toggles a student's role as a teaching assistant
//    - If the student is already an assistant, removes them
//    - If the student is not an assistant, adds them (after verifying they are enrolled)

import mongoose from "mongoose";

async function getStudyIn(courseId) {
    try {
        const parsedCourseId = parseInt(courseId);
        const client = mongoose.connection.client;
        const db = client.db("moojidle");
        const studyInCollection = db.collection("study_in");
        const userCollection = db.collection("user");

        const students = await studyInCollection.find({ course_id: parsedCourseId }).toArray();
        
        // Fetch user details for each student
        const studentsWithDetails = await Promise.all(students.map(async (student) => {
            const user = await userCollection.findOne(
                { user_id: student.user_id },
                { projection: { _id: 0, pw: 0, create_date: 0, path_to_profile_pic: 0 } }
            );
            return {
                ...user,
                student_id: student.student_id
            };
        }));
        
        return studentsWithDetails;
    } catch (error) {
        console.error("Error in getStudyIn:", error);
        throw error;
    }
}

async function getAssistIn(courseId) {
    try {
        const parsedCourseId = parseInt(courseId);
        const client = mongoose.connection.client;
        const db = client.db("moojidle");
        const assistInCollection = db.collection("assist_in");
        const userCollection = db.collection("user");

        const assistants = await assistInCollection.find({ course_id: parsedCourseId }).toArray();
        
        // Fetch user details for each assistant
        const assistantsWithDetails = await Promise.all(assistants.map(async (assistant) => {
            const user = await userCollection.findOne(
                { user_id: assistant.user_id },
                { projection: {  _id: 0, pw: 0, create_date: 0, path_to_profile_pic: 0 } }
            );
            return user;
        }));
        
        return assistantsWithDetails;
    } catch (error) {
        console.error("Error in getAssistIn:", error);
        throw error;
    }
}

async function getTeachIn(courseId) {
    try {
        const parsedCourseId = parseInt(courseId);
        const client = mongoose.connection.client;
        const db = client.db("moojidle");
        const teachInCollection = db.collection("teach_in");
        const userCollection = db.collection("user");

        const teachers = await teachInCollection.find({ course_id: parsedCourseId }).toArray();
        
        // Fetch user details for each teacher
        const teachersWithDetails = await Promise.all(teachers.map(async (teacher) => {
            const user = await userCollection.findOne(
                { user_id: teacher.user_id },
                { projection: {  _id: 0, pw: 0, create_date: 0, path_to_profile_pic: 0  } }
            );
            return user;
        }));
        
        return teachersWithDetails;
    } catch (error) {
        console.error("Error in getTeachIn:", error);
        throw error;
    }
}

async function switchStudyAssist(userId, courseId) {
    try {
        const parsedUserId = parseInt(userId);
        const parsedCourseId = parseInt(courseId);
        const client = mongoose.connection.client;
        const db = client.db("moojidle");
        const assistInCollection = db.collection("assist_in");

        // Check if the user is already an assistant in the course
        const existingAssistant = await assistInCollection.findOne({
            user_id: parsedUserId,
            course_id: parsedCourseId
        });

        if (existingAssistant) {
            // If the user is already an assistant, remove them
            await assistInCollection.deleteOne({
                user_id: parsedUserId,
                course_id: parsedCourseId
            });
            return { message: "User removed from assistants" };
        } else {
            // If the user is not an assistant yet, add them
            // First check if they are a student in the course
            console.log("Checking if user is a student... user", parsedUserId, "course", parsedCourseId);
            const studyInCollection = db.collection("study_in");
            const isStudent = await studyInCollection.findOne({
                user_id: parsedUserId,
                course_id: parsedCourseId
            });

            if (!isStudent) {
                throw new Error("User is not enrolled as a student in this course");
            }

            // Add them as an assistant
            await assistInCollection.insertOne({
                user_id: parsedUserId,
                course_id: parsedCourseId
            });
            return { message: "User added as an assistant" };
        }
    } catch (error) {
        console.error("Error in switchStudyAssist:", error);
        throw error;
    }
}

async function addStudent(userId, studentId, courseId) {
    try {
        // Parse the parameters to ensure they are integers
        const parsedUserId = parseInt(userId);
        const parsedStudentId = parseInt(studentId);
        const parsedCourseId = parseInt(courseId);

        console.log(parsedUserId, parsedStudentId, parsedCourseId);
        
        const client = mongoose.connection.client;
        const db = client.db("moojidle");
        const studyInCollection = db.collection("study_in");
        const userCollection = db.collection("user");
        
        // Check if the user exists
        const userExists = await userCollection.findOne({ user_id: parsedUserId });
        if (!userExists) {
            throw new Error("User does not exist");
        }
        
        // Check if the student is already enrolled in this course
        const existingEnrollment = await studyInCollection.findOne({
            user_id: parsedUserId,
            course_id: parsedCourseId
        });
        
        if (existingEnrollment) {
            throw new Error("Student is already enrolled in this course");
        }
        
        // Add the student to the study_in collection
        await studyInCollection.insertOne({
            user_id: parsedUserId,
            course_id: parsedCourseId,
            student_id: parsedStudentId
        });
        
        return { message: "Student successfully enrolled in the course" };
    } catch (error) {
        console.error("Error in inviteStudent:", error);
        throw error;
    }
}

async function inviteStudentByCode(code, userId) {
    const parsedUserId = parseInt(userId); 
    const courseId = await mongoose.connection.db.collection('course').findOne({ invite_link: code }, { projection:{course_id : 1} }) //WARN: link / code
    const tempStudentId = 6969696969;
    return await addStudent(parsedUserId, tempStudentId, courseId.course_id);
}

async function findInviteCodeId(code) {
    console.log(code); 
    return await mongoose.connection.db.collection('course').findOne({ invite_link: code }, { projection:{course_id : 1} });
}

export {
    getStudyIn,
    getAssistIn,
    getTeachIn,
    switchStudyAssist,
    addStudent,
    inviteStudentByCode,
    findInviteCodeId
}

