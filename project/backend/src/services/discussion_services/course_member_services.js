import mongoose from "mongoose";

async function FindTeacherByCourseID(course_id) {
    try {
        const teachers = await mongoose.connection.db.collection('teach_in').find(
            { course_id: parseInt(course_id) }
        ).toArray();

        return teachers;
    } catch (err) {

    }
}

async function FindAssistantByCourseID(course_id) {
    try {
        const assistant = await mongoose.connection.db.collection('assist_in').find(
            { course_id: parseInt(course_id) }
        ).toArray();

        return assistant;
    } catch (err) {

    }
}

export { 
    FindTeacherByCourseID,
    FindAssistantByCourseID
}
